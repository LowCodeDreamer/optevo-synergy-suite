import { useState } from "react";
import { ProspectList } from "@/components/dashboard/ProspectList";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { FloatingAIAssistant } from "@/components/dashboard/FloatingAIAssistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopilotCanvas } from "@/components/copilot/CopilotCanvas";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Prospects = () => {
  const { data: prospects } = useQuery({
    queryKey: ["prospects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prospects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Calculate metrics for the management view
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

  const chartData = [
    { name: "Pending", value: metrics?.pending || 0 },
    { name: "Approved", value: metrics?.approved || 0 },
    { name: "Rejected", value: metrics?.rejected || 0 },
  ];

  return (
    <div className="flex-1 p-6 overflow-auto">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Prospects</h1>

      <Tabs defaultValue="management" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="management">Management View</TabsTrigger>
          <TabsTrigger value="all">All Prospects</TabsTrigger>
          <TabsTrigger value="copilot">Co-pilot</TabsTrigger>
        </TabsList>

        <TabsContent value="management">
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
        </TabsContent>

        <TabsContent value="all">
          <DashboardCard title="All Prospects" className="mb-6">
            <ProspectList />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="copilot">
          <CopilotCanvas />
        </TabsContent>
      </Tabs>

      <FloatingAIAssistant />
    </div>
  );
};

export default Prospects;