
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { NewNoteDialog } from "./NewNoteDialog";
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
import { Eye, Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProspectNotesProps {
  prospectId: string;
}

export const ProspectNotes = ({ prospectId }: ProspectNotesProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
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

  const handleView = (note: any) => {
    setSelectedNote(note);
    setIsViewDialogOpen(true);
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
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(note)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(note)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:text-destructive" 
                  onClick={() => {
                    setSelectedNote(note);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
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

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Note Details</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="text-sm text-muted-foreground mb-2">
              {selectedNote?.creator?.username || "Unknown"} - {selectedNote && format(new Date(selectedNote.created_at), "MMM d, yyyy h:mm a")}
            </div>
            <div className="whitespace-pre-wrap mt-2 text-foreground">
              {selectedNote?.content}
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              handleEdit(selectedNote);
            }}>Edit</Button>
          </div>
        </DialogContent>
      </Dialog>

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
