import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface Task {
  id: string;
  name: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed";
  due_date: string | null;
  assigned_to: { username: string | null; avatar_url: string | null } | null;
  dependencies: {
    depends_on: {
      id: string;
      name: string;
    };
  }[];
}

interface TaskTableProps {
  tasks: Task[];
}

export const TaskTable = ({ tasks }: TaskTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Dependencies</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>
              <div>
                <div className="font-medium">{task.name}</div>
                {task.description && (
                  <div className="text-sm text-muted-foreground">
                    {task.description}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  task.status === "completed"
                    ? "default"
                    : task.status === "in_progress"
                    ? "secondary"
                    : "outline"
                }
              >
                {task.status}
              </Badge>
            </TableCell>
            <TableCell>
              {task.assigned_to && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.assigned_to.avatar_url || undefined} />
                    <AvatarFallback>
                      {task.assigned_to.username?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{task.assigned_to.username}</span>
                </div>
              )}
            </TableCell>
            <TableCell>
              {task.due_date &&
                format(new Date(task.due_date), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {task.dependencies.map(({ depends_on }) => (
                  <Badge key={depends_on.id} variant="outline">
                    {depends_on.name}
                  </Badge>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};