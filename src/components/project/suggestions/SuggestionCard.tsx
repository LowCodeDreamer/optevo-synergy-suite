import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SuggestionCardProps {
  suggestion: Tables<"project_ai_suggestions">;
  onApprove: () => void;
  onReject: () => void;
}

export const SuggestionCard = ({ suggestion, onApprove, onReject }: SuggestionCardProps) => {
  const { toast } = useToast();

  const handleApprove = async () => {
    try {
      const { error } = await supabase
        .from("project_ai_suggestions")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq("id", suggestion.id);

      if (error) throw error;
      
      toast({
        title: "Suggestion approved",
        description: "The project will be updated with the approved changes."
      });
      
      onApprove();
    } catch (error) {
      console.error("Error approving suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to approve suggestion. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReject = async () => {
    try {
      const { error } = await supabase
        .from("project_ai_suggestions")
        .update({
          status: "rejected",
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq("id", suggestion.id);

      if (error) throw error;
      
      toast({
        title: "Suggestion rejected",
        description: "The suggestion has been dismissed."
      });
      
      onReject();
    } catch (error) {
      console.error("Error rejecting suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to reject suggestion. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Type</h4>
            <p className="text-sm text-muted-foreground capitalize">
              {suggestion.suggestion_type.replace(/_/g, " ")}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium">Context</h4>
            <p className="text-sm text-muted-foreground">{suggestion.context}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Current Value</h4>
            <pre className="text-sm bg-muted p-2 rounded-md overflow-auto">
              {JSON.stringify(suggestion.current_value, null, 2)}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Suggested Value</h4>
            <pre className="text-sm bg-muted p-2 rounded-md overflow-auto">
              {JSON.stringify(suggestion.suggested_value, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleReject}>
          <X className="h-4 w-4 mr-1" />
          Reject
        </Button>
        <Button size="sm" onClick={handleApprove}>
          <Check className="h-4 w-4 mr-1" />
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
};