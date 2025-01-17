import { Card } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

interface ProspectMetricsProps {
  prospects: Tables<"prospects">[];
}

export const ProspectMetrics = ({ prospects }: ProspectMetricsProps) => {
  const metrics = prospects?.reduce(
    (acc, prospect) => {
      acc.total++;
      if (prospect.status === "pending") acc.pending++;
      if (prospect.status === "approved") acc.approved++;
      if (prospect.status === "rejected") acc.rejected++;
      if (prospect.fit_score) {
        acc.totalFitScore += prospect.fit_score;
      }
      return acc;
    },
    { total: 0, pending: 0, approved: 0, rejected: 0, totalFitScore: 0 }
  );

  const averageFitScore = metrics
    ? Math.round(metrics.totalFitScore / metrics.total) || 0
    : 0;

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Total Prospects
        </h3>
        <p className="text-2xl font-bold">{metrics?.total || 0}</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Pending Review
        </h3>
        <p className="text-2xl font-bold">{metrics?.pending || 0}</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Average Fit Score
        </h3>
        <p className="text-2xl font-bold">{averageFitScore}</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Conversion Rate
        </h3>
        <p className="text-2xl font-bold">
          {metrics
            ? Math.round((metrics.approved / metrics.total) * 100) || 0
            : 0}
          %
        </p>
      </Card>
    </div>
  );
};