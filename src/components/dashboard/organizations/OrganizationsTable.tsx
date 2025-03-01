
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Pencil, Trash2, Eye } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { EditOrganizationDialog } from "./EditOrganizationDialog";
import { DeleteOrganizationDialog } from "./DeleteOrganizationDialog";

interface OrganizationsTableProps {
  organizations: Tables<"organizations">[];
  onOrganizationUpdated: () => void;
}

export const OrganizationsTable = ({ 
  organizations,
  onOrganizationUpdated
}: OrganizationsTableProps) => {
  const navigate = useNavigate();
  const [editingOrganization, setEditingOrganization] = useState<Tables<"organizations"> | null>(null);
  const [deletingOrganization, setDeletingOrganization] = useState<Tables<"organizations"> | null>(null);

  const handleRowClick = (id: string) => {
    navigate(`/organizations/${id}`);
  };

  const handleView = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/organizations/${id}`);
  };

  const handleEdit = (organization: Tables<"organizations">, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingOrganization(organization);
  };

  const handleDelete = (organization: Tables<"organizations">, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingOrganization(organization);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Primary Contact</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => {
              const contacts = (org as any).contacts;
              const primaryContact = contacts && Array.isArray(contacts) 
                ? contacts.find((c: any) => c.is_primary) 
                : undefined;
              
              return (
                <TableRow
                  key={org.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(org.id)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{org.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {primaryContact ? (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {primaryContact.first_name} {primaryContact.last_name}
                        </span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{org.industry || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{org.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => handleView(org.id, e)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => handleEdit(org, e)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => handleDelete(org, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {editingOrganization && (
        <EditOrganizationDialog
          isOpen={!!editingOrganization}
          onClose={() => setEditingOrganization(null)}
          organization={editingOrganization}
        />
      )}

      {deletingOrganization && (
        <DeleteOrganizationDialog
          isOpen={!!deletingOrganization}
          onClose={() => setDeletingOrganization(null)}
          organizationId={deletingOrganization.id}
          organizationName={deletingOrganization.name}
          onDeleted={onOrganizationUpdated}
        />
      )}
    </>
  );
};
