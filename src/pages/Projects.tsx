import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloatingAIAssistant } from "@/components/dashboard/FloatingAIAssistant";
import { ProjectsTable } from "@/components/project/ProjectsTable";
import { ProjectsAtRiskCard } from "@/components/project/ProjectsAtRiskCard";
import { CopilotCanvas } from "@/components/copilot/CopilotCanvas";
import { NewProjectViewDialog } from "@/components/project/NewProjectViewDialog";
import { ProjectCreationFlow } from "@/components/project/ProjectCreationFlow";
import { ProjectsLoadingState } from "@/components/project/ProjectsLoadingState";
import { ProjectsErrorState } from "@/components/project/ProjectsErrorState";
import { ProjectsHeader } from "@/components/project/ProjectsHeader";
import { Button } from "@/components/ui/button";

export const Projects = () => {
  const [isNewViewDialogOpen, setIsNewViewDialogOpen] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  
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

  // Filter projects at risk (those past due date)
  const atRiskProjects = projects?.filter(project => 
    project.end_date && new Date(project.end_date) < new Date()
  ) || [];

  if (projectsLoading) {
    return <ProjectsLoadingState />;
  }

  if (projectsError) {
    return <ProjectsErrorState error={projectsError as Error} />;
  }

  if (isCreatingProject) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setIsCreatingProject(false)}
          >
            Back to Projects
          </Button>
        </div>
        <ProjectCreationFlow />
      </div>
    );
  }

  return (
    <div className="p-6">
      <ProjectsHeader 
        onNewProject={() => setIsCreatingProject(true)}
        onNewView={() => setIsNewViewDialogOpen(true)}
      />

      <Tabs defaultValue="management" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="management">Management View</TabsTrigger>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="copilot">Co-pilot</TabsTrigger>
        </TabsList>

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

        <TabsContent value="copilot">
          <CopilotCanvas />
        </TabsContent>
      </Tabs>

      <NewProjectViewDialog
        isOpen={isNewViewDialogOpen}
        onClose={() => setIsNewViewDialogOpen(false)}
        onViewCreated={() => {
          setIsNewViewDialogOpen(false);
        }}
      />

      <FloatingAIAssistant />
    </div>
  );
};

export default Projects;