import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Building2, User } from "lucide-react";
import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

interface OrganizationsTableProps {
  organizations: (Tables<"organizations"> & {
    contacts: Tables<"contacts">[];
  })[];
}

export const OrganizationsTable = ({ organizations }: OrganizationsTableProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Tables<"organizations">>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof Tables<"organizations">) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedOrganizations = organizations
    .filter((org) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        org.name.toLowerCase().includes(searchLower) ||
        org.industry?.toLowerCase().includes(searchLower) ||
        org.status.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const getPrimaryContact = (contacts: Tables<"contacts">[]) => {
    return contacts.find(contact => contact.is_primary);
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search organizations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                className="h-8 w-full justify-start"
                onClick={() => handleSort("name")}
              >
                Organization <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Primary Contact</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="h-8 w-full justify-start"
                onClick={() => handleSort("status")}
              >
                Status <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedOrganizations.map((org) => {
            const primaryContact = getPrimaryContact(org.contacts);
            return (
              <TableRow
                key={org.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/organizations/${org.id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{org.name}</div>
                      {org.website && (
                        <div className="text-sm text-muted-foreground">
                          {org.website}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {primaryContact && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {primaryContact.first_name} {primaryContact.last_name}
                        </div>
                        {primaryContact.position && (
                          <div className="text-sm text-muted-foreground">
                            {primaryContact.position}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell>{org.industry || "N/A"}</TableCell>
                <TableCell>
                  <div className="capitalize">{org.status}</div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
};