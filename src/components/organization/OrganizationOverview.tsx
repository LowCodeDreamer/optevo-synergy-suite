import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { Building2, Users, Target, FolderGit2, User, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface OrganizationOverviewProps {
  organization: Tables<"organizations"> & {
    contacts: Tables<"contacts">[];
    opportunities: Tables<"opportunities">[];
    projects: Tables<"projects">[];
  };
}

export const OrganizationOverview = ({ organization }: OrganizationOverviewProps) => {
  const navigate = useNavigate();
  
  const primaryContact = organization.contacts.find(contact => contact.is_primary);

  const handleContactsClick = () => {
    if (organization.contacts.length === 1) {
      // Navigate to single contact view when implemented
      return;
    }
    // Navigate to filtered contacts list when implemented
    navigate(`/contacts?organization=${organization.id}`);
  };

  const handleOpportunitiesClick = () => {
    if (organization.opportunities.length === 1) {
      // Navigate to single opportunity view when implemented
      return;
    }
    navigate(`/opportunities?organization=${organization.id}`);
  };

  const handleProjectsClick = () => {
    if (organization.projects.length === 1) {
      navigate(`/projects/${organization.projects[0].id}`);
      return;
    }
    navigate(`/projects?organization=${organization.id}`);
  };

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
          {primaryContact && (
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-2" />
              <span>
                Primary Contact: {primaryContact.first_name} {primaryContact.last_name}
                {primaryContact.position && ` - ${primaryContact.position}`}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleContactsClick}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium">Contacts</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
              e.stopPropagation();
              // TODO: Open new contact dialog
            }}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add new contact</span>
            </Button>
          </div>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{organization.contacts.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Click to view all contacts</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleOpportunitiesClick}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
              e.stopPropagation();
              // TODO: Open new opportunity dialog
            }}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add new opportunity</span>
            </Button>
          </div>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{organization.opportunities.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Click to view all opportunities</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleProjectsClick}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
              e.stopPropagation();
              // TODO: Open new project dialog
            }}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add new project</span>
            </Button>
          </div>
          <FolderGit2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{organization.projects.length}</div>
          <p className="text-xs text-muted-foreground mt-1">Click to view all projects</p>
        </CardContent>
      </Card>
    </div>
  );
};