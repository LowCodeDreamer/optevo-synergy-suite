import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Target,
  User,
  Calendar,
  DollarSign,
  Percent,
  Info,
  Edit,
  Trash,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database } from "@/integrations/supabase/types";

type OpportunityWithRelations = Database["public"]["Tables"]["opportunities"]["Row"] & {
  organization: {
    name: string;
    website: string | null;
    industry: string | null;
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

  const { data: opportunity } = useQuery({
    queryKey: ["opportunity", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          organization:organizations (
            name,
            website,
            industry
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

  const handleDelete = async () => {
    // To be implemented
    toast({
      title: "Not implemented",
      description: "Delete functionality coming soon",
    });
  };

  // Parse AI insights if they exist and are in the correct format
  const aiInsights = (() => {
    if (!opportunity.ai_insights) return [];
    if (typeof opportunity.ai_insights === 'object' && 'key_points' in opportunity.ai_insights) {
      return opportunity.ai_insights.key_points as string[];
    }
    return [];
  })();

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {opportunity.name}
          </h1>
          <p className="text-muted-foreground">
            {opportunity.organization?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <Card className="md:col-span-2 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Deal Overview</span>
            </div>
            <Badge variant={getPipelineStageColor(opportunity.pipeline_stage)}>
              {opportunity.pipeline_stage}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Expected Value</p>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {opportunity.expected_value?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Probability</p>
              <div className="flex items-center gap-1">
                <Percent className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{opportunity.probability}%</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Expected Close</p>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {opportunity.expected_close_date
                    ? format(new Date(opportunity.expected_close_date), "MMM d, yyyy")
                    : "Not set"}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Owner</p>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {opportunity.owner?.username || "Unassigned"}
                </span>
              </div>
            </div>
          </div>

          {opportunity.description && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-medium">Description</h3>
                <p className="text-muted-foreground">{opportunity.description}</p>
              </div>
            </>
          )}

          {opportunity.next_steps && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-medium">Next Steps</h3>
                <p className="text-muted-foreground">{opportunity.next_steps}</p>
              </div>
            </>
          )}
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organization Info */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Organization Details</span>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Industry</p>
              <p className="font-medium">{opportunity.organization?.industry}</p>
            </div>
            {opportunity.organization?.website && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Website</p>
                <a
                  href={opportunity.organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {opportunity.organization.website}
                </a>
              </div>
            )}
          </Card>

          {/* Primary Contact */}
          {opportunity.primary_contact && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Primary Contact</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="font-medium">
                  {opportunity.primary_contact.first_name}{" "}
                  {opportunity.primary_contact.last_name}
                </p>
                {opportunity.primary_contact.email && (
                  <p className="text-sm text-muted-foreground">
                    {opportunity.primary_contact.email}
                  </p>
                )}
                {opportunity.primary_contact.phone && (
                  <p className="text-sm text-muted-foreground">
                    {opportunity.primary_contact.phone}
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* AI Insights */}
          {aiInsights.length > 0 && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">AI Insights</span>
              </div>
              <Separator />
              <ScrollArea className="h-[200px] w-full">
                <div className="space-y-2">
                  {aiInsights.map((point, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      • {point}
                    </p>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetails;