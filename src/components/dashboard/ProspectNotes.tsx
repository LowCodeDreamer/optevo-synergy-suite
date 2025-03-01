
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { NewNoteDialog } from "./NewNoteDialog";
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
import { Edit, Trash, MoreHorizontal } from "lucide-react";

interface ProspectNotesProps {
  prospectId: string;
}

export const ProspectNotes = ({ prospectId }: ProspectNotesProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes } = useQuery({
    queryKey: ["prospect-notes", prospectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prospect_notes")
        .select(`
          *,
          creator:profiles!prospect_notes_created_by_fkey(username)
        `)
        .eq("prospect_id", prospectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (note: any) => {
    setSelectedNote(note);
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
        <Button
          onClick={() => {
            setSelectedNote(null);
            setIsDialogOpen(true);
          }}
        >
          New Note
        </Button>
      </div>

      <div className="space-y-4">
        {notes?.map((note) => (
          <div key={note.id} className="bg-card border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-muted-foreground">
                  {note.creator?.username || "Unknown"} - {format(new Date(note.created_at), "MMM d, yyyy h:mm a")}
                </div>
                <div className="mt-2 whitespace-pre-wrap">{note.content}</div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
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
          </div>
        ))}
        {notes?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No notes found. Click "New Note" to create one.
          </div>
        )}
      </div>

      <NewNoteDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedNote(null);
        }}
        prospectId={prospectId}
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
