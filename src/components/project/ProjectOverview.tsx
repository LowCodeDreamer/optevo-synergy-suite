import { Tables } from "@/integrations/supabase/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface ProjectOverviewProps {
  project: Tables<"projects"> & {
    organization: Tables<"organizations">;
    primary_contact: Tables<"contacts">;
    manager: Tables<"profiles">;
    team_members: (Tables<"team_members"> & {
      profile: Tables<"profiles">;
    })[];
  };
}

export const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.organization.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Status</h3>
          <Badge variant={project.status === "completed" ? "default" : "secondary"}>
            {project.status}
          </Badge>
        </div>

        {project.budget && (
          <div>
            <h3 className="text-sm font-medium mb-2">Budget</h3>
            <p className="text-2xl font-semibold">
              ${project.budget.toLocaleString()}
            </p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium mb-2">Timeline</h3>
          <div className="space-y-1 text-sm">
            {project.start_date && (
              <p>
                Start: {format(new Date(project.start_date), "MMM d, yyyy")}
              </p>
            )}
            {project.end_date && (
              <p>
                End: {format(new Date(project.end_date), "MMM d, yyyy")}
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Project Manager</h3>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {project.manager?.username?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{project.manager?.username}</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Team Members</h3>
          <div className="flex flex-wrap gap-2">
            {project.team_members.map((member) => (
              <Avatar key={member.id} className="h-8 w-8">
                <AvatarFallback>
                  {member.profile?.username?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};