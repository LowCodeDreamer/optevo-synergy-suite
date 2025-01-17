import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContactOverview } from "@/components/contact/ContactOverview";
import { ContactActivityFeed } from "@/components/contact/ContactActivityFeed";
import { ContactAIAssistant } from "@/components/contact/ContactAIAssistant";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ContactDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: contact, isLoading, error } = useQuery({
    queryKey: ["contact", id],
    queryFn: async () => {
      if (!id) throw new Error("No contact ID provided");

      const { data, error } = await supabase
        .from("contacts")
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching contact:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Contact not found");
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load contact details"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>Contact not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="ai">
            <TabsList>
              <TabsTrigger value="ai">AI Assistant</TabsTrigger>
              <TabsTrigger value="activity">Activity Feed</TabsTrigger>
            </TabsList>
            <TabsContent value="ai">
              <ContactAIAssistant contact={contact} />
            </TabsContent>
            <TabsContent value="activity">
              <ContactActivityFeed contact={contact} />
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <ContactOverview contact={contact} />
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;