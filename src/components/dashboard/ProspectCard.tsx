import { Info, MessageSquare, Phone, Linkedin, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { ProspectActions } from "./ProspectActions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProspectActivities } from "./ProspectActivities";
import { ProspectNotes } from "./ProspectNotes";
import { ProspectTasks } from "./ProspectTasks";

interface ProspectCardProps {
  prospect: Tables<"prospects"> | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export const ProspectCard = ({
  prospect,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: ProspectCardProps) => {
  if (!prospect) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              {prospect.company_name}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1">
            <ScrollArea className="pr-4">
              <div className="space-y-6">
                {/* Company Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Company Information
                  </h3>
                  <div className="grid gap-2">
                    {prospect.website && (
                      <a
                        href={prospect.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {prospect.website}
                      </a>
                    )}
                    {prospect.description && (
                      <p className="text-muted-foreground">
                        {prospect.description}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Contact Information
                  </h3>
                  <div className="grid gap-2">
                    {prospect.contact_name && (
                      <p className="font-medium">{prospect.contact_name}</p>
                    )}
                    <div className="flex items-center gap-4">
                      {prospect.contact_email && (
                        <a
                          href={`mailto:${prospect.contact_email}`}
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          {prospect.contact_email}
                        </a>
                      )}
                      {prospect.contact_phone && (
                        <a
                          href={`tel:${prospect.contact_phone}`}
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <Phone className="h-4 w-4" />
                          {prospect.contact_phone}
                        </a>
                      )}
                      {prospect.linkedin_url && (
                        <a
                          href={prospect.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <Linkedin className="h-4 w-4" />
                          LinkedIn Profile
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* AI Analysis */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Introduction</h4>
                      <p className="text-muted-foreground">{prospect.ai_intro}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Fit Analysis</h4>
                      <p className="text-muted-foreground">
                        {prospect.ai_fit_analysis}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Recommended Next Steps</h4>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {prospect.ai_next_steps}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Additional Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Additional Details
                  </h3>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Fit Score:</span>
                      <span className="font-medium">
                        {prospect.fit_score}/100
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Potential Services:
                      </span>
                      <span className="font-medium">
                        {prospect.potential_services}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium capitalize">
                        {prospect.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="activities" className="mt-0 flex-1">
            <ProspectActivities prospectId={prospect.id} />
          </TabsContent>

          <TabsContent value="notes" className="mt-0 flex-1">
            <ProspectNotes prospectId={prospect.id} />
          </TabsContent>

          <TabsContent value="tasks" className="mt-0 flex-1">
            <ProspectTasks prospectId={prospect.id} />
          </TabsContent>
        </Tabs>

        <div className="pt-6 flex justify-end">
          <ProspectActions
            id={prospect.id}
            status={prospect.status}
            emailSent={prospect.email_sent}
            meetingScheduled={prospect.meeting_scheduled}
            onApprove={onApprove}
            onReject={onReject}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};