import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { DialogFooter } from "@/components/forms/DialogFooter";
import { DatePickerField } from "@/components/forms/DatePickerField";

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
  const [assignedTo, setAssignedTo] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users for assignment
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username");
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsSubmitting(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("prospect_tasks").insert([
      {
        prospect_id: prospectId,
        title,
        description: description || null,
        priority,
        due_date: dueDate?.toISOString() || null,
        status: "pending",
        created_by: user?.id,
        assigned_to: assignedTo || null,
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Task created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["prospect-tasks", prospectId] });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate(undefined);
      setAssignedTo(undefined);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Select value={assignedTo} onValueChange={setAssignedTo}>
            <SelectTrigger>
              <SelectValue placeholder="Assign to user" />
            </SelectTrigger>
            <SelectContent>
              {users?.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.username || user.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DatePickerField
            value={dueDate}
            onChange={setDueDate}
            placeholder="Pick a due date"
          />
        </div>
        <DialogFooter 
          isSubmitting={isSubmitting} 
          onClose={onClose} 
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};