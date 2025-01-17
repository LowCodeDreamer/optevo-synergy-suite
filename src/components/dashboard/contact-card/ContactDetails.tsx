import { Tables } from "@/integrations/supabase/types";
import { Building2, Briefcase, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ContactDetailsProps {
  contact: Tables<"contacts"> & {
    organization: { name: string } | null;
  };
}

export const ContactDetails = ({ contact }: ContactDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <Building2 className="h-5 w-5 mt-0.5 text-muted-foreground" />
        <div>
          <p className="font-medium">Organization</p>
          <p className="text-muted-foreground">{contact.organization?.name || 'Not specified'}</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Briefcase className="h-5 w-5 mt-0.5 text-muted-foreground" />
        <div>
          <p className="font-medium">Position</p>
          <p className="text-muted-foreground">{contact.position || 'Not specified'}</p>
          {contact.department && (
            <p className="text-sm text-muted-foreground">Department: {contact.department}</p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
        <div>
          <p className="font-medium">Contact Information</p>
          {contact.email && <p className="text-muted-foreground">{contact.email}</p>}
          {contact.phone && <p className="text-muted-foreground">{contact.phone}</p>}
        </div>
      </div>

      {contact.notes && (
        <>
          <Separator />
          <div>
            <p className="font-medium mb-2">Notes</p>
            <p className="text-muted-foreground whitespace-pre-line">{contact.notes}</p>
          </div>
        </>
      )}
    </div>
  );
};