import { useNavigate } from "react-router-dom";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search, X } from "lucide-react";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  viewId?: string;
  onViewDeleted?: () => void;
  isCustomView?: boolean;
}

export const ProjectsTable = ({ 
  projects, 
  displayFields,
  viewId,
  onViewDeleted,
  isCustomView 
}: ProjectsTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Record<string, string>>({});

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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleFilter = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteView = async () => {
    if (!viewId) return;

    try {
      const { error } = await supabase
        .from("project_views")
        .delete()
        .eq("id", viewId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Custom view deleted successfully",
      });

      onViewDeleted?.();
    } catch (error) {
      console.error("Error deleting view:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete custom view",
      });
    }
  };

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

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    // Apply filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value) {
        result = result.filter(project => {
          const cellValue = getCellValue(project, field);
          return String(cellValue)
            .toLowerCase()
            .includes(value.toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        const aValue = getCellValue(a, sortField);
        const bValue = getCellValue(b, sortField);
        
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [projects, filters, sortField, sortDirection]);

  return (
    <div className="space-y-4">
      {isCustomView && (
        <div className="flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteView}
          >
            <X className="h-4 w-4 mr-2" />
            Delete View
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {fields.map((field) => (
          <div key={field.key} className="flex items-center space-x-2">
            <Input
              placeholder={`Filter ${field.label}...`}
              onChange={(e) => handleFilter(field.key, e.target.value)}
              value={filters[field.key] || ""}
              className="w-full"
            />
          </div>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {fields.map((field) => (
              <TableHead key={field.key}>
                <Button
                  variant="ghost"
                  onClick={() => handleSort(field.key)}
                  className="h-8 px-2 hover:bg-muted"
                >
                  {field.label}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedProjects.map((project) => (
            <TableRow 
              key={project.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              {fields.map((field) => (
                <TableCell 
                  key={field.key} 
                  className={field.key === "name" ? "font-medium" : ""}
                >
                  {getCellValue(project, field.key)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};