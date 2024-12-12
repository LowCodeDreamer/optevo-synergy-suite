import { Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProspectContactProps {
  name: string | null;
  email: string | null;
  phone: string | null;
  linkedinUrl?: string | null;
}

export const ProspectContact = ({ name, email, phone, linkedinUrl }: ProspectContactProps) => {
  return (
    <div className="space-y-1">
      <div className="font-medium">{name}</div>
      <div className="text-sm text-muted-foreground">{email}</div>
      <div className="text-sm text-muted-foreground">{phone}</div>
      {linkedinUrl && (
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto"
          asChild
        >
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <Linkedin className="h-4 w-4 mr-1" />
            Profile
          </a>
        </Button>
      )}
    </div>
  );
};