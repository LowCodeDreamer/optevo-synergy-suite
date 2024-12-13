import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building2, User } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface OrganizationCardProps {
  organization: Tables<"organizations"> & {
    contacts: Tables<"contacts">[];
  };
}

export const OrganizationCard = ({ organization }: OrganizationCardProps) => {
  const primaryContact = organization.contacts.find(contact => contact.is_primary);

  return (
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
  );
};