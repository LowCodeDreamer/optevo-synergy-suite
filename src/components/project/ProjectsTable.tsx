import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

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
  } | null;
}

export const ProjectsTable = ({ projects }: { projects: Project[] }) => {
  const navigate = useNavigate();

  return (
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
          <TableRow 
            key={project.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
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
  );
};