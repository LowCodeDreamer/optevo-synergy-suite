import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloatingAIAssistant } from "@/components/dashboard/FloatingAIAssistant";
import { CopilotCanvas } from "@/components/copilot/CopilotCanvas";
import { ManagementView } from "@/components/dashboard/organizations/ManagementView";

const Organizations = () => {
  const { data: organizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const activeOrganizations = organizations?.filter(
    (org) => org.status === "active"
  );

  return (
    <div className="flex-1 p-6 overflow-auto">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Organizations</h1>

      <Tabs defaultValue="management" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="management">Management View</TabsTrigger>
          <TabsTrigger value="all">All Organizations</TabsTrigger>
          <TabsTrigger value="active">Active Organizations</TabsTrigger>
          <TabsTrigger value="copilot">Co-pilot</TabsTrigger>
        </TabsList>

        <TabsContent value="management">
          <ManagementView organizations={organizations || []} />
        </TabsContent>

        <TabsContent value="all">
          <DashboardCard title="All Organizations" className="mb-6">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Name</th>
                  <th className="text-left">Industry</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Website</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizations?.map((org) => (
                  <tr key={org.id}>
                    <td className="font-medium">{org.name}</td>
                    <td>{org.industry || "N/A"}</td>
                    <td>{org.status}</td>
                    <td>{org.website || "N/A"}</td>
                    <td className="text-right">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => console.log(`Viewing ${org.name}`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DashboardCard>
        </TabsContent>

        <TabsContent value="active">
          <DashboardCard title="Active Organizations" className="mb-6">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Name</th>
                  <th className="text-left">Industry</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Website</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeOrganizations?.map((org) => (
                  <tr key={org.id}>
                    <td className="font-medium">{org.name}</td>
                    <td>{org.industry || "N/A"}</td>
                    <td>{org.status}</td>
                    <td>{org.website || "N/A"}</td>
                    <td className="text-right">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => console.log(`Viewing ${org.name}`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DashboardCard>
        </TabsContent>

        <TabsContent value="copilot">
          <CopilotCanvas />
        </TabsContent>
      </Tabs>

      <FloatingAIAssistant 
        context="Account Management"
        description="Your AI assistant for managing organization relationships and accounts"
      />
    </div>
  );
};

export default Organizations;
