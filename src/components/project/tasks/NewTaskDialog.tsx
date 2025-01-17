import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { DatePickerField } from "@/components/forms/DatePickerField";
import { DialogFooter } from "@/components/forms/DialogFooter";
import { useToast } from "@/components/ui/use-toast";

interface NewTaskDialogProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

type TaskStatus = "pending" | "in_progress" | "completed";

export const NewTaskDialog = ({
  projectId,
  isOpen,
  onClose,
  onTaskCreated,
}: NewTaskDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pending");
  const [dueDate, setDueDate] = useState<Date>();
  const [assignedTo, setAssignedTo] = useState<string>();
  const [dependsOn, setDependsOn] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: teamMembers } = useQuery({
    queryKey: ["project-team", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select(`
          profile:profiles(
            id,
            username,
            avatar_url
          )
        `)
        .eq("project_id", projectId);

      if (error) throw error;
      return data?.map((member) => member.profile) || [];
    },
  });

  const { data: existingTasks } = useQuery({
    queryKey: ["project-tasks-simple", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, name")
        .eq("project_id", projectId);

      if (error) throw error;
      return data || [];
    },
  });

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      // Insert the task
      const { data: task, error: taskError } = await supabase
        .from("tasks")
        .insert({
          project_id: projectId,
          name,
          description: description || null,
          status,
          due_date: dueDate?.toISOString() || null,
          assigned_to: assignedTo || currentUser?.id || null,
          created_by: currentUser?.id,
        })
        .select()
        .single();

      if (taskError) throw taskError;

      // Insert dependencies if any
      if (dependsOn.length > 0) {
        const { error: depsError } = await supabase
          .from("task_dependencies")
          .insert(
            dependsOn.map((depId) => ({
              task_id: task.id,
              depends_on_task_id: depId,
            }))
          );

        if (depsError) throw depsError;
      }

      toast({
        title: "Success",
        description: "Task created successfully",
      });

      onTaskCreated();
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

        <div className="space-y-4">
          <Input
            placeholder="Task name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <Select
            value={status}
            onValueChange={(value: TaskStatus) => setStatus(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assignedTo} onValueChange={setAssignedTo}>
            <SelectTrigger>
              <SelectValue placeholder="Assign to" />
            </SelectTrigger>
            <SelectContent>
              {teamMembers?.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DatePickerField
            value={dueDate}
            onChange={setDueDate}
            placeholder="Due date"
          />

          <Select
            value={dependsOn[0]}
            onValueChange={(value) => setDependsOn([value])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Depends on" />
            </SelectTrigger>
            <SelectContent>
              {existingTasks?.map((task) => (
                <SelectItem key={task.id} value={task.id}>
                  {task.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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