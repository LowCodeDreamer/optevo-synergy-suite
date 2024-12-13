import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AIAssistant } from "@/components/organization/AIAssistant";
import { OrganizationOverview } from "@/components/organization/OrganizationOverview";

const OrganizationDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: organization } = useQuery({
    queryKey: ["organization", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select(`
          *,
          contacts (*),
          opportunities (*),
          projects (*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (!organization) {
    return <div>Loading...</div>;
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