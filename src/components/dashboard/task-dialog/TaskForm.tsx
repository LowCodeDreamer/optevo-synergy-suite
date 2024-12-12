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

      <UserSelect
        users={users}
        isLoading={isLoadingUsers}
        value={assignedTo || currentUserId}
        onChange={setAssignedTo}
      />

      <DatePickerField
        value={dueDate}
        onChange={setDueDate}
        placeholder="Select due date"
      />

      <DatePickerField
        value={reminderDate}
        onChange={setReminderDate}
        placeholder="Set reminder (optional)"
      />
    </div>
  );
};