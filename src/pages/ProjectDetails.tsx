import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectThread } from "@/components/project/ProjectThread";
import { ProjectOverview } from "@/components/project/ProjectOverview";
import { ProjectAIAssistant } from "@/components/project/ProjectAIAssistant";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!id) throw new Error("No project ID provided");

      const { data: projects, error } = await supabase
        .from("projects")
        .select(`
          *,
          organization:organizations(id, name),
          primary_contact:contacts(id, first_name, last_name, email),
          manager:profiles(id, username),
          team_members(
            id,
            role,
            profile:profiles(id, username)
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching project:", error);
        throw error;
      }

      return projects;
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
        <div className="lg:col-span-2 space-y-6">
          <ProjectThread project={project} />
        </div>
        <div className="space-y-6">
          <ProjectOverview project={project} />
          <ProjectAIAssistant project={project} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;