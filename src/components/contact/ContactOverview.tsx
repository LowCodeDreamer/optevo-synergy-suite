import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, Phone, Briefcase, User, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactOverviewProps {
  contact: Tables<"contacts"> & {
    organization: Tables<"organizations"> | null;
  };
}

export const ContactOverview = ({ contact }: ContactOverviewProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Contact</CardTitle>
        <User className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-2xl font-bold">
            {contact.first_name} {contact.last_name}
          </div>
          {contact.is_primary && (
            <div className="mt-1 text-sm text-muted-foreground">
              Primary Contact
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {contact.organization && (
            <div className="flex items-start gap-2">
              <Building2 className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Organization</p>
                <p className="text-sm text-muted-foreground">
                  {contact.organization.name}
                </p>
              </div>
            </div>
          )}

          {(contact.position || contact.department) && (
            <div className="flex items-start gap-2">
              <Briefcase className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Position</p>
                {contact.position && (
                  <p className="text-sm text-muted-foreground">{contact.position}</p>
                )}
                {contact.department && (
                  <p className="text-sm text-muted-foreground">
                    Department: {contact.department}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            {contact.email && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = `mailto:${contact.email}`}
              >
                <Mail className="h-4 w-4 mr-2" />
                {contact.email}
              </Button>
            )}

            {contact.phone && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = `tel:${contact.phone}`}
              >
                <Phone className="h-4 w-4 mr-2" />
                {contact.phone}
              </Button>
            )}

            {contact.linkedin_url && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(contact.linkedin_url!, '_blank')}
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn Profile
              </Button>
            )}
          </div>

          {contact.notes && (
            <div className="pt-2">
              <p className="font-medium mb-1">Notes</p>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {contact.notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};