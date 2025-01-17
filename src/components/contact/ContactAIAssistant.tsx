import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactAIAssistantProps {
  contact: Tables<"contacts"> & {
    organization: Tables<"organizations"> | null;
  };
}

export const ContactAIAssistant = ({ contact }: ContactAIAssistantProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">AI Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          AI Assistant functionality coming soon...
        </p>
      </CardContent>
    </Card>
  );
};