import { ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { ProspectActions } from "./ProspectActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProspectActivities } from "./ProspectActivities";
import { ProspectNotes } from "./ProspectNotes";
import { ProspectTasks } from "./ProspectTasks";
import { ProspectOverview } from "./prospect-card/ProspectOverview";

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
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
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

        <Tabs defaultValue="overview" className="flex-1 overflow-hidden">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="overview" className="mt-0 h-full">
              <ProspectOverview prospect={prospect} />
            </TabsContent>

            <TabsContent value="activities" className="mt-0 h-full">
              <ProspectActivities prospectId={prospect.id} />
            </TabsContent>

            <TabsContent value="notes" className="mt-0 h-full">
              <ProspectNotes prospectId={prospect.id} />
            </TabsContent>

            <TabsContent value="tasks" className="mt-0 h-full">
              <ProspectTasks prospectId={prospect.id} />
            </TabsContent>
          </div>
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