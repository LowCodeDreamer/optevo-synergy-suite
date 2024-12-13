import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerField } from "@/components/forms/DatePickerField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProcessStatus } from "@/types/process";

interface ProjectFormProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  status: ProcessStatus;
  setStatus: (status: ProcessStatus) => void;
  budget: string;
  setBudget: (budget: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
}

export const ProjectForm = ({
  name,
  setName,
  description,
  setDescription,
  status,
  setStatus,
  budget,
  setBudget,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: ProjectFormProps) => {
  return (
    <div className="space-y-4 py-4">
      <Input
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Select value={status} onValueChange={(value: ProcessStatus) => setStatus(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="on_hold">On Hold</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="number"
        placeholder="Budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />
      <DatePickerField
        value={startDate}
        onChange={setStartDate}
        placeholder="Start date"
      />
      <DatePickerField
        value={endDate}
        onChange={setEndDate}
        placeholder="End date"
      />
    </div>
  );
};