import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface ContactProjectsProps {
  contact: Tables<"contacts"> & {
    organization: Tables<"organizations"> | null;
  };
}

export const ContactProjects = ({ contact }: ContactProjectsProps) => {
  const navigate = useNavigate();
  const { data: projects } = useQuery({
    queryKey: ["contact-projects", contact.organization_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          manager:profiles!projects_manager_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq("organization_id", contact.organization_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "completed":
        return "default";
      case "in_progress":
        return "secondary";
      case "on_hold":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="grid gap-4">
      {projects?.map((project) => (
        <Card
          key={project.id}
          className="p-4 cursor-pointer hover:bg-muted/50"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{project.name}</span>
              </div>
              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Manager: {project.manager?.username || "Unassigned"}</span>
                {project.end_date && (
                  <span>
                    • Due: {format(new Date(project.end_date), "MMM d, yyyy")}
                  </span>
                )}
              </div>
            </div>
            <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
          </div>
        </Card>
      ))}
      {projects?.length === 0 && (
        <p className="text-center text-muted-foreground py-4">
          No projects yet
        </p>
      )}
    </div>
  );
};