
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { OpportunityEditSheet } from "@/components/opportunities/OpportunityEditSheet";
import { OpportunityHeader } from "@/components/opportunities/details/OpportunityHeader";
import { OpportunityOverview } from "@/components/opportunities/details/OpportunityOverview";
import { OpportunitySidebar } from "@/components/opportunities/details/OpportunitySidebar";
import { OpportunityRecords } from "@/components/opportunities/details/OpportunityRecords";
import type { Database } from "@/integrations/supabase/types";
import type { Json } from "@/integrations/supabase/types";

type OpportunityWithRelations = Database["public"]["Tables"]["opportunities"]["Row"] & {
  organization: {
    id: string;
    name: string;
    website: string | null;
    industry: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
    created_by: string | null;
    owner_id: string | null;
    prospect_id: string | null;
    status: Database["public"]["Enums"]["entity_lifecycle_stage"];
  } | null;
  owner: {
    username: string | null;
    avatar_url: string | null;
  } | null;
  primary_contact: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
};

const OpportunityDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const { data: opportunity } = useQuery({
    queryKey: ["opportunity", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          organization:organizations (
            id,
            name,
            website,
            industry,
            description,
            created_at,
            updated_at,
            created_by,
            owner_id,
            prospect_id,
            status
          ),
          owner:profiles!opportunities_owner_id_fkey (
            username,
            avatar_url
          ),
          primary_contact:contacts (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as OpportunityWithRelations;
    },
  });

  if (!opportunity) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Opportunity not found</p>
      </div>
    );
  }

  const handleDelete = async () => {
    toast({
      title: "Not implemented",
      description: "Delete functionality coming soon",
    });
  };

  const aiInsights = (() => {
    if (!opportunity.ai_insights) return [];
    if (typeof opportunity.ai_insights === 'object' && 'key_points' in opportunity.ai_insights) {
      return opportunity.ai_insights.key_points as string[];
    }
    return [];
  })();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <OpportunityHeader
        name={opportunity.name}
        organizationName={opportunity.organization?.name}
        onEdit={() => setIsEditSheetOpen(true)}
        onDelete={handleDelete}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OpportunityOverview
          pipeline_stage={opportunity.pipeline_stage}
          expected_value={opportunity.expected_value}
          probability={opportunity.probability}
          expected_close_date={opportunity.expected_close_date}
          owner={opportunity.owner}
          description={opportunity.description}
          next_steps={opportunity.next_steps}
        />

        <OpportunitySidebar
          organization={opportunity.organization}
          primary_contact={opportunity.primary_contact}
          aiInsights={aiInsights}
        />
      </div>

      <OpportunityRecords opportunity={opportunity} />

      {isEditSheetOpen && (
        <OpportunityEditSheet
          opportunity={opportunity}
          isOpen={isEditSheetOpen}
          onClose={() => setIsEditSheetOpen(false)}
        />
      )}
    </div>
  );
};

export default OpportunityDetails;
