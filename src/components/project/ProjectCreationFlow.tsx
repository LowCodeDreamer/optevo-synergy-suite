import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProjectPlanner } from "./ProjectPlanner";
import { MilestonePlanner } from "./MilestonePlanner";
import { TaskList } from "./tasks/TaskList";
import { ChevronLeft, ChevronRight, Circle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ProjectStep = "objectives" | "planning" | "tasks";

interface StepIndicatorProps {
  currentStep: ProjectStep;
  step: ProjectStep;
  label: string;
}

const StepIndicator = ({ currentStep, step, label }: StepIndicatorProps) => {
  const isCompleted = getStepIndex(currentStep) > getStepIndex(step);
  const isCurrent = currentStep === step;

  return (
    <div className="flex items-center gap-2">
      {isCompleted ? (
        <CheckCircle2 className="h-6 w-6 text-primary" />
      ) : (
        <Circle className={`h-6 w-6 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} />
      )}
      <span className={isCurrent ? "font-medium" : "text-muted-foreground"}>
        {label}
      </span>
    </div>
  );
};

const getStepIndex = (step: ProjectStep): number => {
  const steps: ProjectStep[] = ["objectives", "planning", "tasks"];
  return steps.indexOf(step);
};

export const ProjectCreationFlow = () => {
  const [currentStep, setCurrentStep] = useState<ProjectStep>("objectives");
  const [objectives, setObjectives] = useState<string[]>([]);
  const { toast } = useToast();

  const progress = ((getStepIndex(currentStep) + 1) / 3) * 100;

  const handleNext = () => {
    const steps: ProjectStep[] = ["objectives", "planning", "tasks"];
    const currentIndex = steps.indexOf(currentStep);
    
    // Validate current step before proceeding
    if (currentStep === "objectives" && objectives.length === 0) {
      toast({
        title: "Missing Objectives",
        description: "Please define at least one project objective before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const steps: ProjectStep[] = ["objectives", "planning", "tasks"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleObjectivesChange = (newObjectives: string[]) => {
    setObjectives(newObjectives);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "objectives":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Project Objectives & Scope</h2>
            <ProjectPlanner onObjectivesChange={handleObjectivesChange} />
          </div>
        );
      case "planning":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Project Planning</h2>
            <p className="text-muted-foreground">
              Based on the objectives, let's create a detailed project plan with milestones and dependencies.
            </p>
            <MilestonePlanner />
          </div>
        );
      case "tasks":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Task Creation & Assignment</h2>
            <p className="text-muted-foreground">
              Let's break down the milestones into specific tasks and assign them to team members.
            </p>
            <TaskList projectId="" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between">
            <StepIndicator
              currentStep={currentStep}
              step="objectives"
              label="Objectives & Scope"
            />
            <div className="h-px w-24 bg-border self-center" />
            <StepIndicator
              currentStep={currentStep}
              step="planning"
              label="Project Planning"
            />
            <div className="h-px w-24 bg-border self-center" />
            <StepIndicator
              currentStep={currentStep}
              step="tasks"
              label="Tasks & Assignment"
            />
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </Card>

      <div className="min-h-[600px]">
        {renderStep()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === "objectives"}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentStep === "tasks"}
        >
          {currentStep === "tasks" ? "Complete" : "Next"}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};