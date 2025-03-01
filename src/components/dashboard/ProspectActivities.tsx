import { useState } from "react";
import { Calendar, Mail, MessageSquare, Phone, CalendarPlus, Edit, Trash } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { NewActivityDialog } from "./NewActivityDialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const ProspectActivities = ({ prospectId }: { prospectId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: activities } = useQuery({
    queryKey: ["prospect-activities", prospectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prospect_activities")
        .select("*")
        .eq("prospect_id", prospectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (activity: any) => {
    setSelectedActivity(activity);
    setIsEditMode(true);
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "call":
        return <Phone className="h-4 w-4" />;
      case "meeting":
        return <Calendar className="h-4 w-4" />;
      case "text":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="gap-2" onClick={() => {
          setIsEditMode(false);
          setSelectedActivity(null);
          setIsDialogOpen(true);
        }}>
          <CalendarPlus className="h-4 w-4" />
          New Activity
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Type</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[150px]">Date</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities?.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="flex items-center gap-2">
                {getActivityIcon(activity.type)}
                <span className="capitalize">{activity.type}</span>
              </TableCell>
              <TableCell>{activity.title}</TableCell>
              <TableCell>{activity.description}</TableCell>
              <TableCell>
                {activity.completed_at
                  ? format(new Date(activity.completed_at), "MMM d, yyyy")
                  : activity.scheduled_at
                  ? format(new Date(activity.scheduled_at), "MMM d, yyyy")
                  : format(new Date(activity.created_at), "MMM d, yyyy")}
              </TableCell>
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
        </TableBody>
      </Table>

      <NewActivityDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setIsEditMode(false);
          setSelectedActivity(null);
        }}
        prospectId={prospectId}
        editMode={isEditMode}
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
