import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AIAssistant } from "@/components/organization/AIAssistant";
import { OrganizationOverview } from "@/components/organization/OrganizationOverview";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const OrganizationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: organization, isLoading, error } = useQuery({
    queryKey: ["organization", id],
    queryFn: async () => {
      if (!id) throw new Error("No organization ID provided");

      const { data: organizations, error } = await supabase
        .from("organizations")
        .select(`
          *,
          contacts (*),
          opportunities (*),
          projects (*)
        `)
        .eq("id", id);

      if (error) {
        console.error("Error fetching organization:", error);
        throw error;
      }

      if (!organizations || organizations.length === 0) {
        throw new Error("Organization not found");
      }

      return organizations[0];
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
            {error instanceof Error ? error.message : "Failed to load organization details"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>Organization not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIAssistant organization={organization} />
        </div>
        <div>
          <OrganizationOverview organization={organization} />
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;