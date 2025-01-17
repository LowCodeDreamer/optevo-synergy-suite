import { useState } from "react";
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
import { ProjectCreationFlow } from "@/components/project/ProjectCreationFlow";
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

  if (projectsLoading) {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreatingProject(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
          <Button onClick={() => setIsNewViewDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New View
          </Button>
        </div>
      </div>

      <Tabs defaultValue="management" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="management">Management View</TabsTrigger>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active Projects</TabsTrigger>
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

        <TabsContent value="active">
          <div className="grid gap-6 md:grid-cols-2">
            <ActiveProjectsCard projects={projects || []} />
          </div>
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