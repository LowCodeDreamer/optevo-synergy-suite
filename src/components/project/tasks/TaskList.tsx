import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewTaskDialog } from "./NewTaskDialog";
import { TaskTable } from "./TaskTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface Task {
  id: string;
  name: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  due_date: string;
  dependencies: {
    depends_on: {
      id: string;
      name: string;
    };
  }[];
  assigned_to: {
    username: string;
    avatar_url: string;
  };
}

interface TaskListProps {
  projectId: string;
}

export const TaskList = ({ projectId }: TaskListProps) => {
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["project-tasks", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          id,
          name,
          description,
          status,
          due_date,
          dependencies:task_dependencies!task_dependencies_task_id_fkey(
            depends_on:tasks!task_dependencies_depends_on_task_id_fkey(id, name)
          ),
          assigned_to:profiles!tasks_assigned_to_fkey(username, avatar_url)
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Task[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error instanceof Error ? error.message : "Failed to load tasks"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <Button
          onClick={() => setIsNewTaskDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      {tasks && tasks.length > 0 ? (
        <TaskTable tasks={tasks} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No tasks found. Click "New Task" to create one.
        </div>
      )}

      <NewTaskDialog
        projectId={projectId}
        isOpen={isNewTaskDialogOpen}
        onClose={() => setIsNewTaskDialogOpen(false)}
        onTaskCreated={() => {
          queryClient.invalidateQueries({ queryKey: ["project-tasks"] });
        }}
      />
    </div>
  );
};