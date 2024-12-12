import { DialogFooter as BaseDialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogFooterProps {
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitText?: string;
}

export const DialogFooter = ({
  isSubmitting,
  onClose,
  onSubmit,
  submitText = "Create",
}: DialogFooterProps) => {
  return (
    <BaseDialogFooter>
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : submitText}
      </Button>
    </BaseDialogFooter>
  );
};