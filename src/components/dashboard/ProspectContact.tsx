import { Mail, Phone, Linkedin } from "lucide-react";

interface ProspectContactProps {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedinUrl?: string | null;
}

export const ProspectContact = ({ name, email, phone, linkedinUrl }: ProspectContactProps) => {
  return (
    <div className="space-y-1">
      {name && <div className="font-medium">{name}</div>}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {email && (
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            <span>{email}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            <span>{phone}</span>
          </div>
        )}
        {linkedinUrl && (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary"
          >
            <Linkedin className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
};