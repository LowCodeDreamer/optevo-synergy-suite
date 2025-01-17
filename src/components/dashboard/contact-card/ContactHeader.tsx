import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ContactHeaderProps {
  contact: Tables<"contacts"> & {
    organization: { name: string } | null;
  };
}

export const ContactHeader = ({ contact }: ContactHeaderProps) => {
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
  );
};