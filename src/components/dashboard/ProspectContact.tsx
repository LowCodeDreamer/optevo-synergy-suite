import { Mail, Phone, Building2, Linkedin, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

interface ContactCardProps {
  contact: Tables<"contacts"> & {
    organization: { name: string } | null;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ContactCard = ({ contact, onEdit, onDelete }: ContactCardProps) => {
  const handleEmail = () => {
    if (contact.email) {
      window.location.href = `mailto:${contact.email}`;
    } else {
      toast.error("No email address available");
    }
  };

  const handleCall = () => {
    if (contact.phone) {
      window.location.href = `tel:${contact.phone}`;
    } else {
      toast.error("No phone number available");
    }
  };

  return (
    <DashboardCard 
      title={`${contact.first_name || ''} ${contact.last_name || ''}`}
      className="w-full"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {contact.position && (
              <div className="text-sm text-muted-foreground">{contact.position}</div>
            )}
            {contact.organization?.name && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Building2 className="mr-1 h-4 w-4" />
                {contact.organization.name}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {contact.email && (
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleEmail}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          )}
          {contact.phone && (
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleCall}
            >
              <Phone className="mr-2 h-4 w-4" />
              Call
            </Button>
          )}
          {contact.linkedin_url && (
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              asChild
            >
              <a
                href={contact.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </a>
            </Button>
          )}
        </div>

        {contact.department && (
          <div className="pt-2">
            <div className="text-sm font-medium">Department</div>
            <div className="text-sm text-muted-foreground">{contact.department}</div>
          </div>
        )}

        {contact.notes && (
          <div className="pt-2">
            <div className="text-sm font-medium">Notes</div>
            <div className="text-sm text-muted-foreground whitespace-pre-line">{contact.notes}</div>
          </div>
        )}

        {contact.is_primary && (
          <div className="pt-2">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
              Primary Contact
            </span>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};