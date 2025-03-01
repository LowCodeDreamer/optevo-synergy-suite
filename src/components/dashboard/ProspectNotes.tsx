
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { StickyNote, Plus, Edit, Trash, MoreHorizontal } from "lucide-react";
import { NewNoteDialog } from "./NewNoteDialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const ProspectNotes = ({ prospectId }: { prospectId: string }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: notes } = useQuery({
    queryKey: ["prospect-notes", prospectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prospect_notes")
        .select("*")
        .eq("prospect_id", prospectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (note: any) => {
    setSelectedNote(note);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedNote) return;
    
    try {
      const { error } = await supabase
        .from("prospect_notes")
        .delete()
        .eq("id", selectedNote.id);
        
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["prospect-notes"] });
      toast({
        title: "Note deleted",
        description: "The note has been deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedNote(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the note",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="gap-2" onClick={() => {
          setIsEditMode(false);
          setSelectedNote(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="h-4 w-4" />
          <StickyNote className="h-4 w-4" />
          New Note
        </Button>
      </div>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {notes?.map((note) => (
            <div key={note.id} className="space-y-2 group relative">
              <div className="text-sm text-muted-foreground flex items-center justify-between">
                <span>{format(new Date(note.created_at), "MMM d, yyyy 'at' h:mm a")}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(note)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedNote(note);
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
              <p className="text-sm whitespace-pre-line">{note.content}</p>
              <Separator />
            </div>
          ))}
        </div>
      </ScrollArea>

      <NewNoteDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setIsEditMode(false);
          setSelectedNote(null);
        }}
        prospectId={prospectId}
        editMode={isEditMode}
        noteToEdit={selectedNote}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
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
