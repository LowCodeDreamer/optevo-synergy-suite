import { DialogFooter as BaseDialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogFooterProps {
  isSubmitting: boolean;
  onClose: () => void;
  submitText?: string;
}

export const DialogFooter = ({
  isSubmitting,
  onClose,
  submitText = "Create",
}: DialogFooterProps) => {
  return (
    <BaseDialogFooter>
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : submitText}
      </Button>
    </BaseDialogFooter>
  );
};