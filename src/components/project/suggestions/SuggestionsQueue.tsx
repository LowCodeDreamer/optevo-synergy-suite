import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SuggestionCard } from "./SuggestionCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface SuggestionsQueueProps {
  projectId: string;
}

export const SuggestionsQueue = ({ projectId }: SuggestionsQueueProps) => {
  const queryClient = useQueryClient();

  const { data: suggestions, isLoading, error } = useQuery({
    queryKey: ["project-suggestions", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_ai_suggestions")
        .select("*")
        .eq("project_id", projectId)
        .eq("status", "pending")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleSuggestionUpdate = () => {
    queryClient.invalidateQueries({
      queryKey: ["project-suggestions", projectId],
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load suggestions. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!suggestions?.length) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        No pending suggestions
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 p-4">
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onApprove={handleSuggestionUpdate}
            onReject={handleSuggestionUpdate}
          />
        ))}
      </div>
    </ScrollArea>
  );
};