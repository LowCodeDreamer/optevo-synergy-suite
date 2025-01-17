import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListTodo, Plus, Bell } from "lucide-react";
import { NewTaskDialog } from "@/components/dashboard/NewTaskDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface ContactTasksProps {
  contact: Tables<"contacts"> & {
    organization: Tables<"organizations"> | null;
  };
}

export const ContactTasks = ({ contact }: ContactTasksProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: tasks } = useQuery({
    queryKey: ["contact-tasks", contact.organization_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prospect_tasks")
        .select(`
          *,
          assignee:profiles!prospect_tasks_assigned_to_fkey(username)
        `)
        .eq("prospect_id", contact.organization?.prospect_id)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in_progress":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
          <ListTodo className="h-4 w-4" />
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Reminder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks?.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>
                {task.due_date && format(new Date(task.due_date), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {task.priority && (
                  <Badge variant={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(task.status || "pending")}>
                  {task.status || "pending"}
                </Badge>
              </TableCell>
              <TableCell>
                {task.assignee?.username || "Unassigned"}
              </TableCell>
              <TableCell>
                {task.reminder_at && (
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    {format(new Date(task.reminder_at), "MMM d, yyyy")}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <NewTaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        prospectId={contact.organization?.prospect_id || ""}
      />
    </div>
  );
};