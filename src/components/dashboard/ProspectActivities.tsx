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
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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
import { useToast } from "@/components/ui/use-toast";
import { NewActivityDialog } from "./NewActivityDialog";
import { Edit, Trash, MoreHorizontal } from "lucide-react";

interface ProspectActivitiesProps {
  prospectId: string;
}

export const ProspectActivities = ({ prospectId }: ProspectActivitiesProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activities } = useQuery({
    queryKey: ["prospect-activities", prospectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prospect_activities")
        .select(`
          *,
          creator:profiles!prospect_activities_created_by_fkey(username)
        `)
        .eq("prospect_id", prospectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (activity: any) => {
    setSelectedActivity(activity);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedActivity) return;
    
    try {
      const { error } = await supabase
        .from("prospect_activities")
        .delete()
        .eq("id", selectedActivity.id);
        
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["prospect-activities"] });
      toast({
        title: "Activity deleted",
        description: "The activity has been deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedActivity(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the activity",
        variant: "destructive",
      });
    }
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="22" height="16" x="1" y="4" rx="2" ry="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
      case "phone":
        return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.08 2h3a2 2 0 0 1 2 2 16 16 0 0 0 2 8 16 16 0 0 0 8 2a2 2 0 0 1 2 2z"/></svg>;
      case "meeting":
        return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-check"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m8.5 14.5 2 3 3.5-3.5"/></svg>;
      default:
        return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSelectedActivity(null);
            setIsDialogOpen(true);
          }}
        >
          New Activity
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>By</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities?.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>
                {format(new Date(activity.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="flex items-center gap-2">
                {getActivityTypeIcon(activity.type)}
                {activity.type}
              </TableCell>
              <TableCell>{activity.title}</TableCell>
              <TableCell>{activity.creator?.username || "Unknown"}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(activity)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedActivity(activity);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {activities?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No activities found. Click "New Activity" to create one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <NewActivityDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedActivity(null);
        }}
        prospectId={prospectId}
        activityToEdit={selectedActivity}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Activity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this activity? This action cannot be undone.
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
