
import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";

interface OpportunityTasksProps {
  opportunity: Tables<"opportunities">;
}

export const OpportunityTasks = ({ opportunity }: OpportunityTasksProps) => {
  const { data: tasks, isError } = useQuery({
    queryKey: ["opportunity-tasks", opportunity.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prospect_tasks")
        .select("*")
        .eq("prospect_id", opportunity.organization_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load tasks. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>
      <div className="space-y-4">
        {tasks?.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">{task.title}</h4>
              {task.description && (
                <p className="text-sm text-muted-foreground">{task.description}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Due: {task.due_date ? format(new Date(task.due_date), "MMM d, yyyy") : "No due date"}
              </p>
            </div>
            <Badge variant={task.status === "completed" ? "default" : "outline"}>
              {task.status}
            </Badge>
          </div>
        ))}
        {tasks?.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No tasks yet
          </p>
        )}
      </div>
    </div>
  );
};
