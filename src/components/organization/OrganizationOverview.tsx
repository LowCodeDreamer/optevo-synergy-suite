import { Tables } from "@/integrations/supabase/types";
import { Users, Target, FolderGit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { NewContactDialog } from "./NewContactDialog";
import { NewOpportunityDialog } from "./NewOpportunityDialog";
import { NewProjectDialog } from "./NewProjectDialog";
import { OrganizationCard } from "./overview/OrganizationCard";
import { MetricCard } from "./overview/MetricCard";

interface OrganizationOverviewProps {
  organization: Tables<"organizations"> & {
    contacts: Tables<"contacts">[];
    opportunities: Tables<"opportunities">[];
    projects: Tables<"projects">[];
  };
}

export const OrganizationOverview = ({ organization }: OrganizationOverviewProps) => {
  const navigate = useNavigate();
  const [isNewContactOpen, setIsNewContactOpen] = useState(false);
  const [isNewOpportunityOpen, setIsNewOpportunityOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  const handleContactsClick = () => {
    if (organization.contacts.length === 1) {
      // Navigate to single contact view when implemented
      return;
    }
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
      <OrganizationCard organization={organization} />

      <MetricCard
        title="Contacts"
        count={organization.contacts.length}
        icon={Users}
        onClick={handleContactsClick}
        onAdd={() => setIsNewContactOpen(true)}
      />

      <MetricCard
        title="Opportunities"
        count={organization.opportunities.length}
        icon={Target}
        onClick={handleOpportunitiesClick}
        onAdd={() => setIsNewOpportunityOpen(true)}
      />

      <MetricCard
        title="Projects"
        count={organization.projects.length}
        icon={FolderGit2}
        onClick={handleProjectsClick}
        onAdd={() => setIsNewProjectOpen(true)}
      />

      <NewContactDialog
        isOpen={isNewContactOpen}
        onClose={() => setIsNewContactOpen(false)}
        organizationId={organization.id}
      />
      <NewOpportunityDialog
        isOpen={isNewOpportunityOpen}
        onClose={() => setIsNewOpportunityOpen(false)}
        organizationId={organization.id}
      />
      <NewProjectDialog
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        organizationId={organization.id}
      />
    </div>
  );
};
