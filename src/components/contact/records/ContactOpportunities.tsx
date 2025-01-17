import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, DollarSign, Percent, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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

  const getPipelineStageColor = (stage: string) => {
    switch (stage) {
      case "qualification":
        return "default";
      case "discovery":
        return "secondary";
      case "proposal":
        return "default";
      case "negotiation":
        return "destructive";
      case "closing":
        return "warning";
      case "won":
        return "success";
      case "lost":
        return "destructive";
      default:
        return "default";
    }
  };

  const getConfidenceColor = (score: number | null) => {
    if (!score) return "default";
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "destructive";
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
              </div>
              <div className="flex items-center gap-2 mt-2">
                {opportunity.expected_value && (
                  <Badge variant="outline" className="gap-1">
                    <DollarSign className="h-3 w-3" />
                    {opportunity.expected_value.toLocaleString()}
                  </Badge>
                )}
                {opportunity.probability && (
                  <Badge variant="outline" className="gap-1">
                    <Percent className="h-3 w-3" />
                    {opportunity.probability}%
                  </Badge>
                )}
                {opportunity.confidence_score && (
                  <Badge
                    variant={getConfidenceColor(opportunity.confidence_score)}
                    className="gap-1"
                  >
                    AI Score: {opportunity.confidence_score}%
                  </Badge>
                )}
                {opportunity.ai_insights && (
                  <HoverCard>
                    <HoverCardTrigger>
                      <Badge variant="outline" className="cursor-help">
                        <Info className="h-3 w-3" />
                      </Badge>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">AI Insights</h4>
                        <div className="text-sm text-muted-foreground">
                          {JSON.stringify(opportunity.ai_insights)}
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </div>
            </div>
            <Badge variant={getPipelineStageColor(opportunity.pipeline_stage)}>
              {opportunity.pipeline_stage}
            </Badge>
          </div>
          {opportunity.next_steps && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Next Steps:</span> {opportunity.next_steps}
              </p>
            </div>
          )}
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