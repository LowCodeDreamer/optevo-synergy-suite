
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Target, Calendar, DollarSign, Percent, User } from "lucide-react";
import { format } from "date-fns";
import { getPipelineStageColor } from "@/utils/pipeline";

interface OpportunityOverviewProps {
  pipeline_stage: string;
  expected_value?: number | null;
  probability?: number | null;
  expected_close_date?: string | null;
  owner?: { username: string } | null;
  description?: string | null;
  next_steps?: string | null;
}

export const OpportunityOverview = ({
  pipeline_stage,
  expected_value,
  probability,
  expected_close_date,
  owner,
  description,
  next_steps,
}: OpportunityOverviewProps) => {
  return (
    <Card className="md:col-span-2 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Deal Overview</span>
        </div>
        <Badge variant={getPipelineStageColor(pipeline_stage)}>
          {pipeline_stage}
        </Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Expected Value</p>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {expected_value?.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Probability</p>
          <div className="flex items-center gap-1">
            <Percent className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{probability}%</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Expected Close</p>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {expected_close_date
                ? format(new Date(expected_close_date), "MMM d, yyyy")
                : "Not set"}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Owner</p>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {owner?.username || "Unassigned"}
            </span>
          </div>
        </div>
      </div>

      {description && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-medium">Description</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </>
      )}

      {next_steps && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-medium">Next Steps</h3>
            <p className="text-muted-foreground">{next_steps}</p>
          </div>
        </>
      )}
    </Card>
  );
};
