
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListPlus, Bell, Edit, Trash, MoreHorizontal, Check, Eye } from "lucide-react";
import { NewTaskDialog } from "./NewTaskDialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

export const ProspectTasks = ({ prospectId }: { prospectId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: tasks } = useQuery({
    queryKey: ["prospect-tasks", prospectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prospect_tasks")
        .select(`
          *,
          assignee:profiles!prospect_tasks_assigned_to_fkey(username),
          creator:profiles!prospect_tasks_created_by_fkey(username)
        `)
        .eq("prospect_id", prospectId)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (task: any) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleView = (task: any) => {
    setSelectedTask(task);
    setIsViewDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTask) return;
    
    try {
      const { error } = await supabase
        .from("prospect_tasks")
        .delete()
        .eq("id", selectedTask.id);
        
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["prospect-tasks"] });
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedTask(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the task",
        variant: "destructive",
      });
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("prospect_tasks")
        .update({
          status: "completed",
          completed_at: new Date().toISOString()
        })
        .eq("id", taskId);
        
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["prospect-tasks"] });
      toast({
        title: "Task completed",
        description: "The task has been marked as completed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the task status",
        variant: "destructive",
      });
    }
  };

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
        <Button className="gap-2" onClick={() => {
          setSelectedTask(null);
          setIsDialogOpen(true);
        }}>
          <ListPlus className="h-4 w-4" />
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
            <TableHead className="w-[130px]">Actions</TableHead>
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
              <TableCell>
                <div className="flex items-center gap-1">
                  {task.status !== "completed" && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
                      onClick={() => handleCompleteTask(task.id)}
                      title="Mark as completed"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(task)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(task)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedTask(task);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Task Edit Dialog */}
      <NewTaskDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedTask(null);
        }}
        prospectId={prospectId}
        taskToEdit={selectedTask}
      />

      {/* Task View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedTask.title}</h3>
                {selectedTask.description && (
                  <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{selectedTask.description}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={getStatusColor(selectedTask.status || "pending")} className="mt-1">
                    {selectedTask.status || "pending"}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Priority</p>
                  <Badge variant={getPriorityColor(selectedTask.priority || "medium")} className="mt-1">
                    {selectedTask.priority || "medium"}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Due Date</p>
                  <p className="text-sm">{selectedTask.due_date ? format(new Date(selectedTask.due_date), "MMM d, yyyy") : "None"}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Reminder</p>
                  <p className="text-sm">{selectedTask.reminder_at ? format(new Date(selectedTask.reminder_at), "MMM d, yyyy") : "None"}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Assigned To</p>
                  <p className="text-sm">{selectedTask.assignee?.username || "Unassigned"}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Created By</p>
                  <p className="text-sm">{selectedTask.creator?.username || "Unknown"}</p>
                </div>
                
                {selectedTask.completed_at && (
                  <div>
                    <p className="text-sm font-medium">Completed At</p>
                    <p className="text-sm">{format(new Date(selectedTask.completed_at), "MMM d, yyyy h:mm a")}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                {selectedTask.status !== "completed" && (
                  <Button 
                    onClick={() => {
                      handleCompleteTask(selectedTask.id);
                      setIsViewDialogOpen(false);
                    }}
                    className="gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Mark Complete
                  </Button>
                )}
                <Button 
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleEdit(selectedTask);
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
