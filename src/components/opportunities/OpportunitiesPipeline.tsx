import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Percent, Info, Building2, User, Edit, ArrowRight } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { OpportunityEditSheet } from "./OpportunityEditSheet";
import { Button } from "@/components/ui/button";

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
  "lost"
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

const OpportunitiesPipeline = ({ opportunities }: OpportunitiesPipelineProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedOpportunity, setSelectedOpportunity] = useState<typeof opportunities[0] | null>(null);
  
  const opportunitiesByStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage] = opportunities.filter((opp) => opp.pipeline_stage === stage);
    return acc;
  }, {} as Record<typeof PIPELINE_STAGES[number], typeof opportunities>);

  const handleDragStart = (e: React.DragEvent, opportunity: typeof opportunities[0]) => {
    e.dataTransfer.setData("opportunity_id", opportunity.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStage: typeof PIPELINE_STAGES[number]) => {
    e.preventDefault();
    const opportunityId = e.dataTransfer.getData("opportunity_id");
    
    try {
      const { error } = await supabase
        .from("opportunities")
        .update({ pipeline_stage: newStage })
        .eq("id", opportunityId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      toast.success(`Opportunity moved to ${newStage}`);
    } catch (error) {
      console.error("Error updating opportunity stage:", error);
      toast.error("Failed to update opportunity stage");
    }
  };

  const handleEditClick = (e: React.MouseEvent, opportunity: typeof opportunities[0]) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedOpportunity(opportunity);
  };

  const handleCardClick = (opportunity: typeof opportunities[0]) => {
    navigate(`/opportunities/${opportunity.id}`);
  };

  return (
    <>
      <div className="grid grid-cols-7 gap-4">
        {PIPELINE_STAGES.map((stage) => (
          <div 
            key={stage} 
            className="min-w-[250px] flex flex-col gap-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold capitalize">{stage}</h3>
              <Badge variant="outline">{opportunitiesByStage[stage].length}</Badge>
            </div>
            <div className="space-y-4">
              {opportunitiesByStage[stage].map((opportunity) => (
                <Card 
                  key={opportunity.id} 
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  draggable
                  onDragStart={(e) => handleDragStart(e, opportunity)}
                  onClick={() => handleCardClick(opportunity)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{opportunity.organization?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => handleEditClick(e, opportunity)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleCardClick(opportunity)}
                          className="h-8 w-8"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
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

      {selectedOpportunity && (
        <OpportunityEditSheet
          opportunity={selectedOpportunity}
          isOpen={!!selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
        />
      )}
    </>
  );
};

export default OpportunitiesPipeline;
