import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Tables } from "@/integrations/supabase/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ProspectChartProps {
  prospects: Tables<"prospects">[];
}

export const ProspectChart = ({ prospects }: ProspectChartProps) => {
  const metrics = prospects?.reduce(
    (acc, prospect) => {
      if (prospect.status === "pending") acc.pending++;
      if (prospect.status === "approved") acc.approved++;
      if (prospect.status === "rejected") acc.rejected++;
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0 }
  );

  const chartData = [
    { name: "Pending", value: metrics?.pending || 0 },
    { name: "Approved", value: metrics?.approved || 0 },
    { name: "Rejected", value: metrics?.rejected || 0 },
  ];

  return (
    <DashboardCard title="Prospect Status Distribution" className="mb-6">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};