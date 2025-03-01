
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { DialogFooter } from "@/components/forms/DialogFooter";
import { DatePickerField } from "@/components/forms/DatePickerField";

interface NewActivityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prospectId: string;
  activityToEdit?: any;
}

export const NewActivityDialog = ({
  isOpen,
  onClose,
  prospectId,
  activityToEdit,
}: NewActivityDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<string>("email");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load activity data when editing an existing activity
  useEffect(() => {
    if (activityToEdit) {
      setTitle(activityToEdit.title || "");
      setDescription(activityToEdit.description || "");
      setType(activityToEdit.type || "email");
      
      if (activityToEdit.scheduled_at) {
        setScheduledDate(new Date(activityToEdit.scheduled_at));
      } else {
        setScheduledDate(undefined);
      }
    } else {
      // Reset form for new activity
      setTitle("");
      setDescription("");
      setType("email");
      setScheduledDate(undefined);
    }
  }, [activityToEdit]);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsSubmitting(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (activityToEdit) {
      // Update existing activity
      const { error } = await supabase
        .from("prospect_activities")
        .update({
          title,
          description: description || null,
          type,
          scheduled_at: scheduledDate?.toISOString() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", activityToEdit.id);

      setIsSubmitting(false);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update activity",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Activity updated successfully",
        });
        queryClient.invalidateQueries({
          queryKey: ["prospect-activities", prospectId],
        });
        onClose();
      }
    } else {
      // Create new activity
      const { error } = await supabase.from("prospect_activities").insert([
        {
          prospect_id: prospectId,
          title,
          description: description || null,
          type,
          scheduled_at: scheduledDate?.toISOString() || null,
          created_by: user?.id,
        },
      ]);

      setIsSubmitting(false);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create activity",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Activity created successfully",
        });
        queryClient.invalidateQueries({
          queryKey: ["prospect-activities", prospectId],
        });
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{activityToEdit ? "Edit Activity" : "New Activity"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Activity title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Activity description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select activity type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="text">Text</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerField
            value={scheduledDate}
            onChange={setScheduledDate}
            placeholder="Schedule date"
          />
        </div>
        <DialogFooter 
          isSubmitting={isSubmitting} 
          onClose={onClose} 
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
