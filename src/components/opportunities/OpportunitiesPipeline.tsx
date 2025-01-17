import { Tables } from "@/integrations/supabase/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Percent, Info, Building2, User } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { format } from "date-fns";

interface OpportunitiesPipelineProps {
  opportunities: (Tables<"opportunities"> & {
    organization: { name: string } | null;
    owner: { username: string; avatar_url: string | null } | null;
    primary_contact: { first_name: string | null; last_name: string | null; email: string | null } | null;
  })[];
}

const PIPELINE_STAGES = [
  "qualification",
  "discovery",
  "proposal",
  "negotiation",
  "closing",
  "won",
  "lost",
] as const;

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
      return "secondary";
    case "won":
      return "default";
    case "lost":
      return "destructive";
    default:
      return "default";
  }
};

const getConfidenceColor = (score: number | null) => {
  if (!score) return "default";
  if (score >= 80) return "default";
  if (score >= 60) return "secondary";
  return "destructive";
};

export const OpportunitiesPipeline = ({ opportunities }: OpportunitiesPipelineProps) => {
  const opportunitiesByStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage] = opportunities.filter((opp) => opp.pipeline_stage === stage);
    return acc;
  }, {} as Record<typeof PIPELINE_STAGES[number], typeof opportunities>);

  return (
    <div className="grid grid-cols-7 gap-4">
      {PIPELINE_STAGES.map((stage) => (
        <div key={stage} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold capitalize">{stage}</h3>
            <Badge variant="outline">{opportunitiesByStage[stage].length}</Badge>
          </div>
          <div className="space-y-4">
            {opportunitiesByStage[stage].map((opportunity) => (
              <Card key={opportunity.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{opportunity.organization?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{opportunity.owner?.username || "Unassigned"}</span>
                  </div>
                  {opportunity.expected_close_date && (
                    <div className="text-sm text-muted-foreground">
                      Closing: {format(new Date(opportunity.expected_close_date), "MMM d, yyyy")}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
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
                        AI: {opportunity.confidence_score}%
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
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};