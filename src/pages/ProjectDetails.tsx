import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectThread } from "@/components/project/ProjectThread";
import { ProjectOverview } from "@/components/project/ProjectOverview";
import { ProjectDocuments } from "@/components/project/ProjectDocuments";
import { ProjectMilestones } from "@/components/project/ProjectMilestones";
import { ProjectAIAssistant } from "@/components/project/ProjectAIAssistant";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!id) throw new Error("No project ID provided");

      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          organization:organizations!projects_organization_id_fkey(*),
          primary_contact:contacts!projects_primary_contact_id_fkey(*),
          manager:profiles!projects_manager_id_fkey(*),
          team_members:team_members!team_members_project_id_fkey(
            *,
            profile:profiles!team_members_profile_id_fkey(*)
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Project not found");
      
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
            {error instanceof Error ? error.message : "Failed to load project details"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>Project not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid grid-cols-4 lg:grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="thread">Team Chat</TabsTrigger>
              <TabsTrigger value="ai" className="hidden lg:block">AI Assistant</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ProjectOverview project={project} />
            </TabsContent>

            <TabsContent value="documents">
              <ProjectDocuments project={project} />
            </TabsContent>

            <TabsContent value="milestones">
              <ProjectMilestones project={project} />
            </TabsContent>

            <TabsContent value="thread">
              <ProjectThread project={project} />
            </TabsContent>

            <TabsContent value="ai">
              <ProjectAIAssistant project={project} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="hidden lg:block">
          <ProjectAIAssistant project={project} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;