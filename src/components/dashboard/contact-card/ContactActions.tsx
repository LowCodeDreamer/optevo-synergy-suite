import { Button } from "@/components/ui/button";
import { Mail, Phone, Linkedin } from "lucide-react";

interface ContactActionsProps {
  email?: string | null;
  phone?: string | null;
  linkedinUrl?: string | null;
}

export const ContactActions = ({ email, phone, linkedinUrl }: ContactActionsProps) => {
  return (
    <div className="flex gap-2">
      {email && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = `mailto:${email}`}
        >
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
      )}
      {phone && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = `tel:${phone}`}
        >
          <Phone className="h-4 w-4 mr-2" />
          Call
        </Button>
      )}
      {linkedinUrl && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(linkedinUrl, '_blank')}
        >
          <Linkedin className="h-4 w-4 mr-2" />
          LinkedIn
        </Button>
      )}
    </div>
  );
};