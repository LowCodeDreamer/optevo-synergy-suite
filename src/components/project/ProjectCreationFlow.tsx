import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProjectPlanner } from "./ProjectPlanner";
import { ChevronLeft, ChevronRight, Circle, CheckCircle2 } from "lucide-react";

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
  const [projectData, setProjectData] = useState({
    objectives: [],
    scope: [],
    constraints: [],
    team: [],
    budget: null,
  });

  const handleNext = () => {
    const steps: ProjectStep[] = ["objectives", "planning", "tasks"];
    const currentIndex = steps.indexOf(currentStep);
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

  const renderStep = () => {
    switch (currentStep) {
      case "objectives":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Project Objectives & Scope</h2>
            <ProjectPlanner />
          </div>
        );
      case "planning":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Project Planning</h2>
            <p className="text-muted-foreground">
              Based on the objectives, let's create a detailed project plan with milestones and dependencies.
            </p>
            {/* Milestone planning component will go here */}
          </div>
        );
      case "tasks":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Task Creation & Assignment</h2>
            <p className="text-muted-foreground">
              Let's break down the milestones into specific tasks and assign them to team members.
            </p>
            {/* Task creation component will go here */}
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <Card className="p-6">
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
      </Card>

      {/* Content */}
      <div className="min-h-[600px]">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
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