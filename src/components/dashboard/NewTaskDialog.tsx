import { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { DialogFooter } from "@/components/forms/DialogFooter";
import { TaskForm } from "./task-dialog/TaskForm";

interface NewTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prospectId: string;
}

export const NewTaskDialog = ({
  isOpen,
  onClose,
  prospectId,
}: NewTaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>("medium");
  const [dueDate, setDueDate] = useState<Date>();
  const [reminderDate, setReminderDate] = useState<Date>();
  const [assignedTo, setAssignedTo] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("username");
      if (error) throw error;
      return data || [];
    },
  });

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("prospect_tasks").insert({
        prospect_id: prospectId,
        title,
        description: description || null,
        priority,
        due_date: dueDate?.toISOString() || null,
        reminder_at: reminderDate?.toISOString() || null,
        assigned_to: assignedTo || currentUser?.id || null,
        created_by: currentUser?.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["prospect-tasks"] });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>

        <TaskForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          priority={priority}
          setPriority={setPriority}
          dueDate={dueDate}
          setDueDate={setDueDate}
          reminderDate={reminderDate}
          setReminderDate={setReminderDate}
          assignedTo={assignedTo}
          setAssignedTo={setAssignedTo}
          users={users || []}
          isLoadingUsers={isLoadingUsers}
          currentUserId={currentUser?.id}
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