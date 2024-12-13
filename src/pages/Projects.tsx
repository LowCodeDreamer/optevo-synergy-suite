import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloatingAIAssistant } from "@/components/dashboard/FloatingAIAssistant";

interface Project {
  id: string;
  name: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  organizations: {
    name: string | null;
  } | null;
  manager: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

const Projects = () => {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          organizations (name),
          manager: manager_id (
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Project[];
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

  const atRiskProjects = projects?.filter(p => 
    p.status === "in_progress" && p.end_date && new Date(p.end_date) < new Date()
  ) || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          <TabsTrigger value="management">Management View</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DashboardCard title="All Projects" className="mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Manager</TableHead>
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
                    <TableCell>{project.manager?.username || "Unassigned"}</TableCell>
                    <TableCell>{project.start_date ? new Date(project.start_date).toLocaleDateString() : "N/A"}</TableCell>
                    <TableCell>{project.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DashboardCard>
        </TabsContent>

        <TabsContent value="active">
          <div className="grid gap-6 md:grid-cols-2">
            <DashboardCard title="My Active Projects" className="col-span-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>End Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects?.filter(p => p.status === "in_progress")
                    .map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{project.status}</TableCell>
                        <TableCell>{project.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </DashboardCard>

            <DashboardCard title="Upcoming Deadlines" className="col-span-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Days Left</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects?.filter(p => p.status === "in_progress" && p.end_date)
                    .sort((a, b) => new Date(a.end_date!).getTime() - new Date(b.end_date!).getTime())
                    .slice(0, 5)
                    .map((project) => {
                      const daysLeft = Math.ceil(
                        (new Date(project.end_date!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                      );
                      return (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell>{new Date(project.end_date!).toLocaleDateString()}</TableCell>
                          <TableCell className={daysLeft < 7 ? "text-red-500" : ""}>{daysLeft} days</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </DashboardCard>
          </div>
        </TabsContent>

        <TabsContent value="management">
          <div className="grid gap-6">
            <DashboardCard title="Projects at Risk" className="col-span-1">
              {atRiskProjects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Days Overdue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {atRiskProjects.map((project) => {
                      const daysOverdue = Math.ceil(
                        (new Date().getTime() - new Date(project.end_date!).getTime()) / (1000 * 60 * 60 * 24)
                      );
                      return (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell>{project.organizations?.name}</TableCell>
                          <TableCell>{project.manager?.username || "Unassigned"}</TableCell>
                          <TableCell>{new Date(project.end_date!).toLocaleDateString()}</TableCell>
                          <TableCell className="text-red-500">{daysOverdue} days</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center p-6 text-muted-foreground">
                  No projects currently at risk
                </div>
              )}
            </DashboardCard>
          </div>
        </TabsContent>
      </Tabs>

      <FloatingAIAssistant />
    </div>
  );
};

export default Projects;