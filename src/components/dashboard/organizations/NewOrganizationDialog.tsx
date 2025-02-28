
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { OrganizationForm } from "./OrganizationForm";

interface NewOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewOrganizationDialog = ({
  isOpen,
  onClose,
}: NewOrganizationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to track your business relationships.
          </DialogDescription>
        </DialogHeader>
        <OrganizationForm onComplete={onClose} mode="create" />
      </DialogContent>
    </Dialog>
  );
};
