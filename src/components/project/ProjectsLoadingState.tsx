import { Loader2 } from "lucide-react";

export const ProjectsLoadingState = () => (
  <div className="container mx-auto p-6 flex items-center justify-center min-h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
);