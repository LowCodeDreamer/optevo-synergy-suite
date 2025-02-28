
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProspectForm } from "./ProspectForm";
import { Tables } from "@/integrations/supabase/types";

interface EditProspectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: Tables<"prospects">;
}

export const EditProspectDialog = ({
  isOpen,
  onClose,
  prospect,
}: EditProspectDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Prospect</DialogTitle>
        </DialogHeader>
        <ProspectForm 
          onComplete={onClose} 
          initialData={prospect} 
          mode="edit" 
        />
      </DialogContent>
    </Dialog>
  );
};
