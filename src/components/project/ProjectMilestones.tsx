import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DatePickerField } from "@/components/forms/DatePickerField";
import { DialogFooter } from "@/components/forms/DialogFooter";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Milestone, Flag, CheckCircle2 } from "lucide-react";

interface ProjectMilestonesProps {
  project: Tables<"projects"> & {
    organization: Tables<"organizations">;
    primary_contact: Tables<"contacts">;
    manager: Tables<"profiles">;
  };
}

export const ProjectMilestones = ({ project }: ProjectMilestonesProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [status, setStatus] = useState<string>("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: milestones, refetch } = useQuery({
    queryKey: ["project-milestones", project.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_milestones")
        .select("*")
        .eq("project_id", project.id)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async () => {
    if (!title.trim() || !dueDate) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("project_milestones").insert({
        project_id: project.id,
        title,
        description,
        due_date: dueDate.toISOString(),
        status,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Milestone created successfully",
      });

      setIsDialogOpen(false);
      setTitle("");
      setDescription("");
      setDueDate(undefined);
      setStatus("pending");
      refetch();
    } catch (error) {
      console.error("Error creating milestone:", error);
      toast({
        title: "Error",
        description: "Failed to create milestone",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (milestoneId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("project_milestones")
        .update({ status: newStatus })
        .eq("id", milestoneId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Milestone status updated",
      });

      refetch();
    } catch (error) {
      console.error("Error updating milestone status:", error);
      toast({
        title: "Error",
        description: "Failed to update milestone status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Milestones</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Milestone className="mr-2 h-4 w-4" />
          Add Milestone
        </Button>
      </div>

      <div className="grid gap-4">
        {milestones?.map((milestone) => (
          <Card key={milestone.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">{milestone.title}</h3>
                {milestone.description && (
                  <p className="text-sm text-muted-foreground">
                    {milestone.description}
                  </p>
                )}
                <p className="text-sm">
                  Due: {new Date(milestone.due_date!).toLocaleDateString()}
                </p>
              </div>
              <Select
                value={milestone.status || "pending"}
                onValueChange={(value) => handleStatusChange(milestone.id, value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        ))}

        {milestones?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No milestones created yet
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Milestone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Milestone title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <DatePickerField
                value={dueDate}
                onChange={setDueDate}
                placeholder="Select due date"
              />
            </div>
            <div className="space-y-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter
            isSubmitting={isSubmitting}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};