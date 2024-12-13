import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { Building2, Users, Target, FolderGit2 } from "lucide-react";

interface OrganizationOverviewProps {
  organization: Tables<"organizations"> & {
    contacts: Tables<"contacts">[];
    opportunities: Tables<"opportunities">[];
    projects: Tables<"projects">[];
  };
}

export const OrganizationOverview = ({ organization }: OrganizationOverviewProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Organization</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{organization.name}</div>
          {organization.description && (
            <p className="text-xs text-muted-foreground mt-1">
              {organization.description}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contacts</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{organization.contacts.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{organization.opportunities.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projects</CardTitle>
          <FolderGit2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{organization.projects.length}</div>
        </CardContent>
      </Card>
    </div>
  );
};