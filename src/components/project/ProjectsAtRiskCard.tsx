import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

interface Project {
  id: string;
  name: string;
  organizations: {
    name: string | null;
  } | null;
  manager: {
    username: string | null;
  } | null;
  end_date: string | null;
}

export const ProjectsAtRiskCard = ({ projects }: { projects: Project[] }) => {
  const navigate = useNavigate();

  return (
    <DashboardCard title="Projects at Risk" className="col-span-1">
      {projects.length > 0 ? (
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
            {projects.map((project) => {
              const daysOverdue = Math.ceil(
                (new Date().getTime() - new Date(project.end_date!).getTime()) / (1000 * 60 * 60 * 24)
              );
              return (
                <TableRow 
                  key={project.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
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
  );
};