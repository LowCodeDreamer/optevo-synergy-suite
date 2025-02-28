
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { OrganizationForm } from "./OrganizationForm";
import { Tables } from "@/integrations/supabase/types";

interface EditOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  organization: Tables<"organizations">;
}

export const EditOrganizationDialog = ({
  isOpen,
  onClose,
  organization,
}: EditOrganizationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Organization</DialogTitle>
          <DialogDescription>
            Update the organization's information.
          </DialogDescription>
        </DialogHeader>
        <OrganizationForm 
          onComplete={onClose} 
          initialData={organization} 
          mode="edit" 
        />
      </DialogContent>
    </Dialog>
  );
};
