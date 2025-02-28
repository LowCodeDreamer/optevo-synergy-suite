
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProspectForm } from "./ProspectForm";

interface NewProspectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProspectDialog = ({
  isOpen,
  onClose,
}: NewProspectDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Prospect</DialogTitle>
        </DialogHeader>
        <ProspectForm onComplete={onClose} mode="create" />
      </DialogContent>
    </Dialog>
  );
};
