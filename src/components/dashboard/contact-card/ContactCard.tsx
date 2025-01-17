import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Linkedin, Building2, User, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ContactCardProps {
  contact: Tables<"contacts"> & {
    organization: { name: string } | null;
  };
  onClose: () => void;
}

export const ContactCard = ({ contact, onClose }: ContactCardProps) => {
  const { toast } = useToast();

  const handleEdit = () => {
    toast({
      title: "Not implemented",
      description: "Edit functionality coming soon",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Not implemented",
      description: "Delete functionality coming soon",
    });
  };

  return (
    <ScrollArea className="h-[80vh] pr-4">
      <div className="space-y-6 py-6">
        {/* Header with actions */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold">
              {contact.first_name} {contact.last_name}
            </h2>
            {contact.is_primary && (
              <Badge variant="secondary" className="mt-1">
                Primary Contact
              </Badge>
            )}
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>

        <Separator />

        {/* Quick actions */}
        <div className="flex gap-2">
          {contact.email && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = `mailto:${contact.email}`}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          )}
          {contact.phone && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = `tel:${contact.phone}`}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
          )}
          {contact.linkedin_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(contact.linkedin_url!, '_blank')}
            >
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
          )}
        </div>

        <Separator />

        {/* Contact details */}
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
      </div>
    </ScrollArea>
  );
};