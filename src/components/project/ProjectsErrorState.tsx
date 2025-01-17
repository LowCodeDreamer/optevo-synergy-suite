import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProjectsErrorStateProps {
  error: Error | null;
}

export const ProjectsErrorState = ({ error }: ProjectsErrorStateProps) => (
  <div className="container mx-auto p-6">
    <Alert variant="destructive">
      <AlertDescription>
        {error instanceof Error ? error.message : "Failed to load projects"}
      </AlertDescription>
    </Alert>
  </div>
);