import { useState } from "react";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddTeamMemberDialog } from "./team/AddTeamMemberDialog";
import { Tables } from "@/integrations/supabase/types";

interface TeamManagementProps {
  project: Tables<"projects"> & {
    organization: Tables<"organizations">;
    team_members: (Tables<"team_members"> & {
      profile: Tables<"profiles">;
    })[];
  };
}

export const TeamManagement = ({ project }: TeamManagementProps) => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const { data: availableProfiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("username");
      
      if (error) throw error;
      return data;
    },
  });

  const currentTeamIds = new Set(project.team_members.map(member => member.profile_id));
  const availableUsers = availableProfiles?.filter(
    profile => !currentTeamIds.has(profile.id)
  ) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team Members</CardTitle>
          <Button onClick={() => setIsAddMemberOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {project.team_members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {member.profile?.username?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{member.profile?.username}</span>
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    {new Date(member.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddTeamMemberDialog
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        projectId={project.id}
        availableUsers={availableUsers}
      />
    </div>
  );
};