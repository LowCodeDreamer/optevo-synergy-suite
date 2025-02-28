
import { ProspectList } from "@/components/dashboard/ProspectList";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { FloatingAIAssistant } from "@/components/dashboard/FloatingAIAssistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopilotCanvas } from "@/components/copilot/CopilotCanvas";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ManagementView } from "@/components/dashboard/prospects/ManagementView";

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

  const activeProspects = prospects?.filter(
    (prospect) => prospect.status === "approved" && !prospect.meeting_scheduled
  );

  return (
    <div className="flex-1 p-6 overflow-auto">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Prospects</h1>

      <Tabs defaultValue="management" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="management">Management View</TabsTrigger>
          <TabsTrigger value="all">All Prospects</TabsTrigger>
          <TabsTrigger value="active">Active Prospects</TabsTrigger>
          <TabsTrigger value="copilot">Co-pilot</TabsTrigger>
        </TabsList>

        <TabsContent value="management">
          <ManagementView prospects={prospects || []} />
        </TabsContent>

        <TabsContent value="all">
          <DashboardCard title="All Prospects" className="mb-6">
            <ProspectList />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="active">
          <DashboardCard title="Active Prospects" className="mb-6">
            <ProspectList initialProspects={activeProspects} />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="copilot">
          <CopilotCanvas />
        </TabsContent>
      </Tabs>

      <FloatingAIAssistant 
        context="Prospecting"
        description="Your AI assistant for prospect research and outreach optimization"
      />
    </div>
  );
};

export default Prospects;
