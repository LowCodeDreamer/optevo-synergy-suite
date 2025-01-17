import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { FloatingAIAssistant } from "@/components/dashboard/FloatingAIAssistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OpportunitiesPipeline } from "@/components/opportunities/OpportunitiesPipeline";
import { OpportunitiesList } from "@/components/opportunities/OpportunitiesList";
import { OpportunitiesAnalytics } from "@/components/opportunities/OpportunitiesAnalytics";

const Opportunities = () => {
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          organization:organizations(name),
          owner:profiles!opportunities_owner_id_fkey(
            username,
            avatar_url
          ),
          primary_contact:contacts(
            first_name,
            last_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading opportunities...</div>;
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Sales Pipeline</h1>

      <Tabs defaultValue="pipeline" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline">
          <DashboardCard title="Pipeline" className="mb-6">
            <OpportunitiesPipeline opportunities={opportunities || []} />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="list">
          <DashboardCard title="All Opportunities" className="mb-6">
            <OpportunitiesList opportunities={opportunities || []} />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="analytics">
          <OpportunitiesAnalytics opportunities={opportunities || []} />
        </TabsContent>
      </Tabs>

      <FloatingAIAssistant 
        context="Sales Pipeline"
        description="Your AI assistant for sales pipeline management and opportunity insights"
      />
    </div>
  );
};

export default Opportunities;