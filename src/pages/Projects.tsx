import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Projects = () => {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          organizations (name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load projects"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
      </div>

      <DashboardCard title="All Projects" className="mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{project.organizations?.name || "N/A"}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>{project.start_date ? new Date(project.start_date).toLocaleDateString() : "N/A"}</TableCell>
                <TableCell>{project.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DashboardCard>
    </div>
  );
};

export default Projects;