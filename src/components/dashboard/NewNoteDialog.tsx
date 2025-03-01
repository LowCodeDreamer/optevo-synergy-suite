
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { DialogFooter } from "@/components/forms/DialogFooter";

interface NewNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prospectId: string;
  noteToEdit?: any;
}

export const NewNoteDialog = ({
  isOpen,
  onClose,
  prospectId,
  noteToEdit,
}: NewNoteDialogProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load note data when editing an existing note
  useEffect(() => {
    if (noteToEdit) {
      setContent(noteToEdit.content || "");
    } else {
      setContent("");
    }
  }, [noteToEdit]);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (noteToEdit) {
      // Update existing note
      const { error } = await supabase
        .from("prospect_notes")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", noteToEdit.id);

      setIsSubmitting(false);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update note",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Note updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["prospect-notes", prospectId] });
        setContent("");
        onClose();
      }
    } else {
      // Create new note
      const { error } = await supabase.from("prospect_notes").insert([
        {
          prospect_id: prospectId,
          content,
          created_by: user?.id,
        },
      ]);

      setIsSubmitting(false);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create note",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Note created successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["prospect-notes", prospectId] });
        setContent("");
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{noteToEdit ? "Edit Note" : "New Note"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Enter your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        <DialogFooter 
          isSubmitting={isSubmitting} 
          onClose={onClose} 
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
