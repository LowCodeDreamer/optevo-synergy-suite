import { Tables } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ContactTableProps {
  contacts: (Tables<"contacts"> & {
    organization: { name: string } | null;
  })[];
  sortField: keyof Tables<"contacts">;
  onSortChange: (field: keyof Tables<"contacts">) => void;
  onContactSelect?: (contact: Tables<"contacts"> & {
    organization: { name: string } | null;
  }) => void;
}

export const ContactTable = ({
  contacts,
  sortField,
  onSortChange,
  onContactSelect,
}: ContactTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (contact: Tables<"contacts"> & {
    organization: { name: string } | null;
  }) => {
    if (onContactSelect) {
      onContactSelect(contact);
    } else {
      navigate(`/contacts/${contact.id}`);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => onSortChange("first_name")}>Name</TableHead>
            <TableHead onClick={() => onSortChange("email")}>Email</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead onClick={() => onSortChange("position")}>Position</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow
              key={contact.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(contact)}
            >
              <TableCell>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {contact.first_name} {contact.last_name}
                  </span>
                </div>
              </TableCell>
              <TableCell>{contact.email || "-"}</TableCell>
              <TableCell>
                {contact.organization ? (
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{contact.organization.name}</span>
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>{contact.position || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};