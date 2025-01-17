import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Flag, Plus, Milestone } from "lucide-react";

interface ProjectMilestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  status: "pending" | "in_progress" | "completed";
  dependencies?: string[];
}

export const MilestonePlanner = () => {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [newMilestone, setNewMilestone] = useState<Partial<ProjectMilestone>>({
    status: "pending",
  });

  const handleAddMilestone = () => {
    if (!newMilestone.title) return;

    setMilestones([
      ...milestones,
      {
        id: crypto.randomUUID(),
        title: newMilestone.title,
        description: newMilestone.description,
        dueDate: newMilestone.dueDate,
        status: "pending",
        dependencies: [],
      },
    ]);

    setNewMilestone({ status: "pending" });
  };

  const handleStatusChange = (id: string, status: ProjectMilestone["status"]) => {
    setMilestones(
      milestones.map((milestone) =>
        milestone.id === id ? { ...milestone, status } : milestone
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {milestones.map((milestone) => (
          <Card key={milestone.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Milestone className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{milestone.title}</h3>
                </div>
                {milestone.description && (
                  <p className="text-sm text-muted-foreground">
                    {milestone.description}
                  </p>
                )}
                {milestone.dueDate && (
                  <p className="text-sm">
                    Due: {milestone.dueDate.toLocaleDateString()}
                  </p>
                )}
              </div>
              <Select
                value={milestone.status}
                onValueChange={(value: ProjectMilestone["status"]) =>
                  handleStatusChange(milestone.id, value)
                }
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
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Add New Milestone</h3>
          </div>
          <Input
            placeholder="Milestone title"
            value={newMilestone.title || ""}
            onChange={(e) =>
              setNewMilestone({ ...newMilestone, title: e.target.value })
            }
          />
          <Textarea
            placeholder="Description (optional)"
            value={newMilestone.description || ""}
            onChange={(e) =>
              setNewMilestone({ ...newMilestone, description: e.target.value })
            }
          />
          <DatePickerField
            value={newMilestone.dueDate}
            onChange={(date) =>
              setNewMilestone({ ...newMilestone, dueDate: date })
            }
            placeholder="Due date (optional)"
          />
          <Button onClick={handleAddMilestone} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </div>
      </Card>
    </div>
  );
};