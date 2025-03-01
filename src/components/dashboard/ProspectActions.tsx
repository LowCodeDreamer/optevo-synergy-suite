
import { Check, X, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

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
  // Render different actions based on status
  if (status === "approved") {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-green-500">Converted</Badge>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={emailSent}
              >
                <Mail className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send Email</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={!emailSent || meetingScheduled}
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Schedule Meeting</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
  
  if (status === "rejected") {
    return <Badge variant="destructive">Rejected</Badge>;
  }
  
  // Default actions for pending prospects
  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="sm"
              onClick={() => onApprove(id)}
              className="bg-green-500 hover:bg-green-600"
            >
              <Check className="h-4 w-4 mr-1" />
              Convert
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Convert to Account/Opportunity</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onReject(id)}
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reject Prospect</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
