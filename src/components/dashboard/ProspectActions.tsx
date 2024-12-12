import { Check, X, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProspectActionsProps {
  id: string;
  status: string | null;
  emailSent: boolean | null;
  meetingScheduled: boolean | null;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export const ProspectActions = ({
  id,
  status,
  emailSent,
  meetingScheduled,
  onApprove,
  onReject,
}: ProspectActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onApprove(id)}
        disabled={status !== "pending"}
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onReject(id)}
        disabled={status !== "pending"}
      >
        <X className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={status !== "approved" || emailSent}
      >
        <Mail className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={!emailSent || meetingScheduled}
      >
        <Calendar className="h-4 w-4" />
      </Button>
    </div>
  );
};