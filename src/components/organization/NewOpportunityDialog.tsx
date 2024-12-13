import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { DialogFooter } from "@/components/forms/DialogFooter";
import { DatePickerField } from "@/components/forms/DatePickerField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewOpportunityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
}

export const NewOpportunityDialog = ({
  isOpen,
  onClose,
  organizationId,
}: NewOpportunityDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("prospecting");
  const [stage, setStage] = useState("initial_contact");
  const [expectedValue, setExpectedValue] = useState("");
  const [probability, setProbability] = useState("");
  const [expectedCloseDate, setExpectedCloseDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setIsSubmitting(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("opportunities").insert([
      {
        organization_id: organizationId,
        name,
        description: description || null,
        status,
        stage,
        expected_value: expectedValue ? parseFloat(expectedValue) : null,
        probability: probability ? parseInt(probability, 10) : null,
        expected_close_date: expectedCloseDate?.toISOString() || null,
        created_by: user?.id,
        owner_id: user?.id,
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create opportunity",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Opportunity created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["organization", organizationId] });
      setName("");
      setDescription("");
      setStatus("prospecting");
      setStage("initial_contact");
      setExpectedValue("");
      setProbability("");
      setExpectedCloseDate(undefined);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Opportunity</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Opportunity name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prospecting">Prospecting</SelectItem>
              <SelectItem value="qualifying">Qualifying</SelectItem>
              <SelectItem value="negotiating">Negotiating</SelectItem>
              <SelectItem value="closed_won">Closed Won</SelectItem>
              <SelectItem value="closed_lost">Closed Lost</SelectItem>
            </SelectContent>
          </Select>
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger>
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="initial_contact">Initial Contact</SelectItem>
              <SelectItem value="meeting_scheduled">Meeting Scheduled</SelectItem>
              <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
              <SelectItem value="contract_sent">Contract Sent</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Expected value"
            value={expectedValue}
            onChange={(e) => setExpectedValue(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Probability (%)"
            min="0"
            max="100"
            value={probability}
            onChange={(e) => setProbability(e.target.value)}
          />
          <DatePickerField
            value={expectedCloseDate}
            onChange={setExpectedCloseDate}
            placeholder="Expected close date"
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