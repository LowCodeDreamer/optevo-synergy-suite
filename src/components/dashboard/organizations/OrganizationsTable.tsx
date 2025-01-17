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
import { Building2, User } from "lucide-react";

export const OrganizationsTable = ({ organizations }) => {
  const navigate = useNavigate();

  const handleRowClick = (id: string) => {
    navigate(`/organizations/${id}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization</TableHead>
            <TableHead>Primary Contact</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((org) => {
            const primaryContact = org.contacts?.find((c) => c.is_primary);
            
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};