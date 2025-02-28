
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
import { NewActivityDialog } from "./NewActivityDialog";
import { NewNoteDialog } from "./NewNoteDialog";
import { NewTaskDialog } from "./NewTaskDialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

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
  const [isNewActivityDialogOpen, setIsNewActivityDialogOpen] = useState(false);
  const [isNewNoteDialogOpen, setIsNewNoteDialogOpen] = useState(false);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  
  if (!prospect) return null;

  const statusVariant = 
    prospect.status === "pending" ? "outline" : 
    prospect.status === "approved" ? "default" : 
    "destructive";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-2xl font-bold">
                  {prospect.company_name}
                </DialogTitle>
                <Badge variant={statusVariant}>{prospect.status}</Badge>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsNewActivityDialogOpen(true)}
                >
                  Log Activity
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsNewNoteDialogOpen(true)}
                >
                  Add Note
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsNewTaskDialogOpen(true)}
                >
                  Create Task
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="overview" className="flex-1 overflow-hidden">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto">
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
      
      {/* Create dialogs for new activities, notes, and tasks */}
      {prospect && isNewActivityDialogOpen && (
        <NewActivityDialog
          isOpen={isNewActivityDialogOpen}
          onClose={() => setIsNewActivityDialogOpen(false)}
          prospectId={prospect.id}
        />
      )}
      
      {prospect && isNewNoteDialogOpen && (
        <NewNoteDialog
          isOpen={isNewNoteDialogOpen}
          onClose={() => setIsNewNoteDialogOpen(false)}
          prospectId={prospect.id}
        />
      )}
      
      {prospect && isNewTaskDialogOpen && (
        <NewTaskDialog
          isOpen={isNewTaskDialogOpen}
          onClose={() => setIsNewTaskDialogOpen(false)}
          prospectId={prospect.id}
        />
      )}
    </>
  );
};
