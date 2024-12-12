import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export const ProspectNotes = ({ prospectId }: { prospectId: string }) => {
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

  return (
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
      </div>
    </ScrollArea>
  );
};