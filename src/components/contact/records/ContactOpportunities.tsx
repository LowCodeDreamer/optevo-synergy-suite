import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface ContactOpportunitiesProps {
  contact: Tables<"contacts"> & {
    organization: Tables<"organizations"> | null;
  };
}

export const ContactOpportunities = ({ contact }: ContactOpportunitiesProps) => {
  const navigate = useNavigate();
  const { data: opportunities } = useQuery({
    queryKey: ["contact-opportunities", contact.organization_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          owner:profiles!opportunities_owner_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq("organization_id", contact.organization_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "initial_contact":
        return "outline";
      case "meeting_scheduled":
        return "secondary";
      case "proposal_sent":
        return "default";
      case "contract_sent":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="grid gap-4">
      {opportunities?.map((opportunity) => (
        <Card
          key={opportunity.id}
          className="p-4 cursor-pointer hover:bg-muted/50"
          onClick={() => navigate(`/opportunities/${opportunity.id}`)}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{opportunity.name}</span>
              </div>
              {opportunity.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {opportunity.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Owner: {opportunity.owner?.username || "Unassigned"}</span>
                {opportunity.expected_close_date && (
                  <span>
                    • Expected close:{" "}
                    {format(new Date(opportunity.expected_close_date), "MMM d, yyyy")}
                  </span>
                )}
                {opportunity.expected_value && (
                  <span>• Value: ${opportunity.expected_value}</span>
                )}
              </div>
            </div>
            <Badge variant={getStageColor(opportunity.stage)}>
              {opportunity.stage}
            </Badge>
          </div>
        </Card>
      ))}
      {opportunities?.length === 0 && (
        <p className="text-center text-muted-foreground py-4">
          No opportunities yet
        </p>
      )}
    </div>
  );
};