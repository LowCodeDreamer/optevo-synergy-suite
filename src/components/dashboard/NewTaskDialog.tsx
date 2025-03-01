
import { useState, useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { DialogFooter } from "@/components/forms/DialogFooter";
import { TaskForm } from "./task-dialog/TaskForm";

interface NewTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prospectId: string;
  taskToEdit?: any;
}

export const NewTaskDialog = ({
  isOpen,
  onClose,
  prospectId,
  taskToEdit,
}: NewTaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>("medium");
  const [status, setStatus] = useState<string>("pending");
  const [dueDate, setDueDate] = useState<Date>();
  const [reminderDate, setReminderDate] = useState<Date>();
  const [assignedTo, setAssignedTo] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!taskToEdit;

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

  // Load task data if in edit mode
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority || "medium");
      setStatus(taskToEdit.status || "pending");
      setDueDate(taskToEdit.due_date ? new Date(taskToEdit.due_date) : undefined);
      setReminderDate(taskToEdit.reminder_at ? new Date(taskToEdit.reminder_at) : undefined);
      setAssignedTo(taskToEdit.assigned_to || "");
    } else {
      // Reset form on dialog open or when switching from edit to create
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("pending");
      setDueDate(undefined);
      setReminderDate(undefined);
      setAssignedTo(undefined);
    }
  }, [taskToEdit, isOpen]);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        // Update existing task
        const { error } = await supabase
          .from("prospect_tasks")
          .update({
            title,
            description: description || null,
            priority,
            status,
            due_date: dueDate?.toISOString() || null,
            reminder_at: reminderDate?.toISOString() || null,
            assigned_to: assignedTo || currentUser?.id || null,
            completed_at: status === "completed" ? new Date().toISOString() : taskToEdit.completed_at,
          })
          .eq("id", taskToEdit.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      } else {
        // Create new task
        const { error } = await supabase
          .from("prospect_tasks")
          .insert({
            prospect_id: prospectId,
            title,
            description: description || null,
            priority,
            status,
            due_date: dueDate?.toISOString() || null,
            reminder_at: reminderDate?.toISOString() || null,
            assigned_to: assignedTo || currentUser?.id || null,
            created_by: currentUser?.id,
            completed_at: status === "completed" ? new Date().toISOString() : null,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Task created successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["prospect-tasks"] });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: isEditMode ? "Failed to update task" : "Failed to create task",
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
          <DialogTitle>{isEditMode ? "Edit Task" : "New Task"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update task details." : "Create a new task for this prospect."}
          </DialogDescription>
        </DialogHeader>

        <TaskForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          priority={priority}
          setPriority={setPriority}
          status={status}
          setStatus={setStatus}
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
