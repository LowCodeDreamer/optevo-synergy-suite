import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

interface Project {
  id: string;
  name: string;
  status: string;
  end_date: string | null;
}

export const ActiveProjectsCard = ({ projects }: { projects: Project[] }) => {
  const navigate = useNavigate();
  
  return (
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
              <TableRow 
                key={project.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>{project.end_date ? new Date(project.end_date).toLocaleDateString() : "N/A"}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </DashboardCard>
  );
};