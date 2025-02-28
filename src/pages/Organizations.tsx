
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FloatingAIAssistant } from "@/components/dashboard/FloatingAIAssistant";
import { CopilotCanvas } from "@/components/copilot/CopilotCanvas";
import { ManagementView } from "@/components/dashboard/organizations/ManagementView";
import { OrganizationsTable } from "@/components/dashboard/organizations/OrganizationsTable";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { NewOrganizationDialog } from "@/components/dashboard/organizations/NewOrganizationDialog";
import { PlusCircle } from "lucide-react";

const Organizations = () => {
  const [isNewOrganizationDialogOpen, setIsNewOrganizationDialogOpen] = useState(false);
  
  const { data: organizations, isLoading, refetch } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*, contacts(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const activeOrganizations = organizations?.filter(
    (org) => org.status === "active"
  );

  const handleOrganizationUpdated = () => {
    refetch();
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Organizations</h1>
        <Button 
          onClick={() => setIsNewOrganizationDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          New Organization
        </Button>
      </div>

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
            <OrganizationsTable 
              organizations={organizations || []} 
              onOrganizationUpdated={handleOrganizationUpdated}
            />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="active">
          <DashboardCard title="Active Organizations" className="mb-6">
            <OrganizationsTable 
              organizations={activeOrganizations || []} 
              onOrganizationUpdated={handleOrganizationUpdated}
            />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="copilot">
          <CopilotCanvas />
        </TabsContent>
      </Tabs>

      <NewOrganizationDialog
        isOpen={isNewOrganizationDialogOpen}
        onClose={() => {
          setIsNewOrganizationDialogOpen(false);
          handleOrganizationUpdated();
        }}
      />

      <FloatingAIAssistant 
        context="Account Management"
        description="Your AI assistant for managing organization relationships and accounts"
      />
    </div>
  );
};

export default Organizations;
