import { Tables } from "@/integrations/supabase/types";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OpportunitiesAnalyticsProps {
  opportunities: (Tables<"opportunities"> & {
    organization: { name: string } | null;
    owner: { username: string; avatar_url: string | null } | null;
    primary_contact: { first_name: string | null; last_name: string | null; email: string | null } | null;
  })[];
}

export const OpportunitiesAnalytics = ({ opportunities }: OpportunitiesAnalyticsProps) => {
  // Calculate pipeline value by stage
  const pipelineData = opportunities.reduce((acc, opp) => {
    const stage = opp.pipeline_stage;
    const value = opp.expected_value || 0;
    const probability = opp.probability || 0;
    const weightedValue = (value * probability) / 100;

    const existingStage = acc.find((item) => item.stage === stage);
    if (existingStage) {
      existingStage.value += value;
      existingStage.weightedValue += weightedValue;
    } else {
      acc.push({
        stage,
        value,
        weightedValue,
      });
    }
    return acc;
  }, [] as { stage: string; value: number; weightedValue: number }[]);

  return (
    <div className="space-y-6">
      <DashboardCard title="Pipeline Value by Stage">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" name="Total Value" />
              <Bar dataKey="weightedValue" fill="#82ca9d" name="Weighted Value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      <div className="grid grid-cols-3 gap-4">
        <DashboardCard title="Pipeline Value">
          <div className="text-center">
            <p className="text-3xl font-bold mt-2">
              ${opportunities.reduce((sum, opp) => sum + (opp.expected_value || 0), 0).toLocaleString()}
            </p>
          </div>
        </DashboardCard>

        <DashboardCard title="Average Deal Size">
          <div className="text-center">
            <p className="text-3xl font-bold mt-2">
              ${Math.round(
                opportunities.reduce((sum, opp) => sum + (opp.expected_value || 0), 0) /
                  (opportunities.length || 1)
              ).toLocaleString()}
            </p>
          </div>
        </DashboardCard>

        <DashboardCard title="Win Rate">
          <div className="text-center">
            <p className="text-3xl font-bold mt-2">
              {Math.round(
                (opportunities.filter((opp) => opp.pipeline_stage === "won").length /
                  (opportunities.length || 1)) *
                  100
              )}%
            </p>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};