import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloatingAIAssistant } from "@/components/dashboard/FloatingAIAssistant";
import { ProjectsTable } from "@/components/project/ProjectsTable";
import { ActiveProjectsCard } from "@/components/project/ActiveProjectsCard";
import { ProjectsAtRiskCard } from "@/components/project/ProjectsAtRiskCard";

const Projects = () => {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          organizations (name),
          manager:manager_id (
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load projects"}
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
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          <TabsTrigger value="management">Management View</TabsTrigger>
        </TabsList>

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

        <TabsContent value="management">
          <div className="grid gap-6">
            <ProjectsAtRiskCard projects={atRiskProjects} />
          </div>
        </TabsContent>
      </Tabs>

      <FloatingAIAssistant />
    </div>
  );
};

export default Projects;