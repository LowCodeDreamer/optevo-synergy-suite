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

interface ProjectsTableProps {
  projects: Project[];
  displayFields?: string[];
}

export const ProjectsTable = ({ projects, displayFields }: ProjectsTableProps) => {
  const navigate = useNavigate();

  const defaultFields = [
    { key: "name", label: "Name" },
    { key: "organizations.name", label: "Organization" },
    { key: "status", label: "Status" },
    { key: "manager.username", label: "Manager" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
  ];

  const fields = displayFields
    ? defaultFields.filter(field => displayFields.includes(field.key))
    : defaultFields;

  const getCellValue = (project: Project, key: string) => {
    const keys = key.split('.');
    let value: any = project;
    
    for (const k of keys) {
      value = value?.[k];
    }

    if (key.endsWith('_date') && value) {
      return new Date(value).toLocaleDateString();
    }

    return value || "N/A";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {fields.map((field) => (
            <TableHead key={field.key}>{field.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects?.map((project) => (
          <TableRow 
            key={project.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            {fields.map((field) => (
              <TableCell key={field.key} className={field.key === "name" ? "font-medium" : ""}>
                {getCellValue(project, field.key)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};