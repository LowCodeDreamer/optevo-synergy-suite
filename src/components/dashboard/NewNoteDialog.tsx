import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface NewNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prospectId: string;
}

export const NewNoteDialog = ({
  isOpen,
  onClose,
  prospectId,
}: NewNoteDialogProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from("prospect_notes")
      .insert([{ prospect_id: prospectId, content }]);

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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Enter your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};