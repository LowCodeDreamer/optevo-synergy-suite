import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectsHeaderProps {
  onNewProject: () => void;
  onNewView: () => void;
}

export const ProjectsHeader = ({ onNewProject, onNewView }: ProjectsHeaderProps) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold">Projects</h1>
    <div className="flex gap-2">
      <Button onClick={onNewProject} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        New Project
      </Button>
      <Button onClick={onNewView} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        New View
      </Button>
    </div>
  </div>
);