import { Tables } from "@/integrations/supabase/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ContactHeader } from "./ContactHeader";
import { ContactActions } from "./ContactActions";
import { ContactDetails } from "./ContactDetails";

interface ContactCardProps {
  contact: Tables<"contacts"> & {
    organization: { name: string } | null;
  };
  onClose: () => void;
}

export const ContactCard = ({ contact, onClose }: ContactCardProps) => {
  return (
    <ScrollArea className="h-[80vh] pr-4">
      <div className="space-y-6 py-6">
        <ContactHeader contact={contact} />
        <Separator />
        <ContactActions
          email={contact.email}
          phone={contact.phone}
          linkedinUrl={contact.linkedin_url}
        />
        <Separator />
        <ContactDetails contact={contact} />
      </div>
    </ScrollArea>
  );
};