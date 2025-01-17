import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Loader2, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloatingAIAssistant } from "@/components/dashboard/FloatingAIAssistant";
import { ProjectsTable } from "@/components/project/ProjectsTable";
import { ActiveProjectsCard } from "@/components/project/ActiveProjectsCard";
import { ProjectsAtRiskCard } from "@/components/project/ProjectsAtRiskCard";
import { CopilotCanvas } from "@/components/copilot/CopilotCanvas";
import { NewProjectViewDialog } from "@/components/project/NewProjectViewDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Projects = () => {
  const [isNewViewDialogOpen, setIsNewViewDialogOpen] = useState(false);
  
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          organizations (name),
          manager:profiles!projects_manager_id_fkey (
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { 
    data: customViews, 
    isLoading: viewsLoading,
    refetch: refetchViews 
  } = useQuery({
    queryKey: ["project_views"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_views")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (projectsLoading || viewsLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (projectsError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {projectsError instanceof Error ? projectsError.message : "Failed to load projects"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const atRiskProjects = projects?.filter(p => 
    p.status === "in_progress" && p.end_date && new Date(p.end_date) < new Date()
  ) || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setIsNewViewDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New View
        </Button>
      </div>

      <Tabs defaultValue="copilot" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="copilot">Co-pilot</TabsTrigger>
          <TabsTrigger value="management">Management View</TabsTrigger>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          {customViews?.map((view) => (
            <TabsTrigger key={view.id} value={view.id}>
              {view.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="copilot">
          <CopilotCanvas />
        </TabsContent>

        <TabsContent value="management">
          <div className="grid gap-6">
            <ProjectsAtRiskCard projects={atRiskProjects} />
          </div>
        </TabsContent>

        <TabsContent value="all">
          <DashboardCard title="All Projects" className="mb-6">
            <ProjectsTable projects={projects || []} />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="active">
          <div className="grid gap-6 md:grid-cols-2">
            <ActiveProjectsCard projects={projects || []} />
          </div>
        </TabsContent>

        {customViews?.map((view) => (
          <TabsContent key={view.id} value={view.id}>
            <DashboardCard title={view.name} className="mb-6">
              <ProjectsTable
                projects={projects || []}
                displayFields={view.display_fields}
                viewId={view.id}
                onViewDeleted={refetchViews}
                isCustomView
              />
            </DashboardCard>
          </TabsContent>
        ))}
      </Tabs>

      <NewProjectViewDialog
        isOpen={isNewViewDialogOpen}
        onClose={() => setIsNewViewDialogOpen(false)}
        onViewCreated={() => {
          refetchViews();
        }}
      />

      <FloatingAIAssistant />
    </div>
  );
};

export default Projects;