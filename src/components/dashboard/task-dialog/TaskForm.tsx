
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerField } from "@/components/forms/DatePickerField";
import { UserSelect } from "./UserSelect";

interface TaskFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  priority: string;
  setPriority: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  dueDate?: Date;
  setDueDate: (date?: Date) => void;
  reminderDate?: Date;
  setReminderDate: (date?: Date) => void;
  assignedTo?: string;
  setAssignedTo: (value: string) => void;
  users: any[];
  isLoadingUsers: boolean;
  currentUserId?: string;
}

export const TaskForm = ({
  title,
  setTitle,
  description,
  setDescription,
  priority,
  setPriority,
  status,
  setStatus,
  dueDate,
  setDueDate,
  reminderDate,
  setReminderDate,
  assignedTo,
  setAssignedTo,
  users,
  isLoadingUsers,
  currentUserId,
}: TaskFormProps) => {
  // Explicit date handling functions with console logging
  const handleDueDateChange = (date?: Date) => {
    console.log("Due date selected:", date);
    setDueDate(date);
  };

  const handleReminderDateChange = (date?: Date) => {
    console.log("Reminder date selected:", date);
    setReminderDate(date);
  };

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
        required
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full"
        rows={3}
      />
      <Select value={priority} onValueChange={setPriority}>
        <SelectTrigger>
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <UserSelect
        users={users}
        isLoading={isLoadingUsers}
        value={assignedTo || currentUserId}
        onChange={setAssignedTo}
      />

      <div className="relative">
        <DatePickerField
          value={dueDate}
          onChange={handleDueDateChange}
          placeholder="Select due date"
        />
      </div>

      <div className="relative">
        <DatePickerField
          value={reminderDate}
          onChange={handleReminderDateChange}
          placeholder="Set reminder (optional)"
        />
      </div>
    </div>
  );
};
