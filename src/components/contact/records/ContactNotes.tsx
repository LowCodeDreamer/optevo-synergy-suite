import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NotepadText, Plus } from "lucide-react";
import { NewNoteDialog } from "@/components/dashboard/NewNoteDialog";
import { format } from "date-fns";

interface ContactNotesProps {
  contact: Tables<"contacts"> & {
    organization: Tables<"organizations"> | null;
  };
}

export const ContactNotes = ({ contact }: ContactNotesProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: notes } = useQuery({
    queryKey: ["contact-notes", contact.organization_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prospect_notes")
        .select("*")
        .eq("prospect_id", contact.organization?.prospect_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          <NotepadText className="h-4 w-4" />
          New Note
        </Button>
      </div>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {notes?.map((note) => (
            <div key={note.id} className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {format(new Date(note.created_at), "MMM d, yyyy 'at' h:mm a")}
              </div>
              <p className="text-sm whitespace-pre-line">{note.content}</p>
              <Separator />
            </div>
          ))}
          {notes?.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No notes yet
            </p>
          )}
        </div>
      </ScrollArea>

      <NewNoteDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        prospectId={contact.organization?.prospect_id || ""}
      />
    </div>
  );
};