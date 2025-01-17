import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface ProjectPlannerProps {
  onObjectivesChange?: (objectives: string[]) => void;
}

export const ProjectPlanner = ({ onObjectivesChange }: ProjectPlannerProps) => {
  const [objectives, setObjectives] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState("");

  useEffect(() => {
    onObjectivesChange?.(objectives);
  }, [objectives, onObjectivesChange]);

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective("");
    }
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddObjective();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter project objective"
          value={newObjective}
          onChange={(e) => setNewObjective(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button onClick={handleAddObjective} type="button">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {objectives.map((objective, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-secondary rounded-lg"
          >
            <span>{objective}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveObjective(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};