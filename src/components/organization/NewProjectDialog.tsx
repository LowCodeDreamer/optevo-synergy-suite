import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { DialogFooter } from "@/components/forms/DialogFooter";
import { ProjectForm } from "./project/ProjectForm";
import { ProcessStatus } from "@/types/process";

interface NewProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
}

export const NewProjectDialog = ({
  isOpen,
  onClose,
  organizationId,
}: NewProjectDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProcessStatus>("draft");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setIsSubmitting(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("projects").insert({
      organization_id: organizationId,
      name,
      description: description || null,
      status,
      budget: budget ? parseFloat(budget) : null,
      start_date: startDate?.toISOString() || null,
      end_date: endDate?.toISOString() || null,
      created_by: user?.id,
      manager_id: user?.id,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["organization", organizationId] });
      setName("");
      setDescription("");
      setStatus("draft");
      setBudget("");
      setStartDate(undefined);
      setEndDate(undefined);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>
        <ProjectForm
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          status={status}
          setStatus={setStatus}
          budget={budget}
          setBudget={setBudget}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <DialogFooter 
          isSubmitting={isSubmitting} 
          onClose={onClose} 
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};