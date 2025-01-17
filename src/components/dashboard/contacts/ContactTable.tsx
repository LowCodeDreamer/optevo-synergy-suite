import { Tables } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Mail, Phone } from "lucide-react";

interface ContactTableProps {
  contacts: (Tables<"contacts"> & {
    organization: { name: string } | null;
  })[];
  sortField: keyof Tables<"contacts">;
  onSortChange: (field: keyof Tables<"contacts">) => void;
  onContactSelect: (contact: Tables<"contacts"> & {
    organization: { name: string } | null;
  }) => void;
}

export const ContactTable = ({
  contacts,
  sortField,
  onSortChange,
  onContactSelect,
}: ContactTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button
              variant="ghost"
              className="h-8 w-full justify-start"
              onClick={() => onSortChange("first_name")}
            >
              Name <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Organization</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Contact</span>
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Phone</span>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow
            key={contact.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onContactSelect(contact)}
          >
            <TableCell>
              {contact.first_name} {contact.last_name}
            </TableCell>
            <TableCell>{contact.organization?.name}</TableCell>
            <TableCell>{contact.position}</TableCell>
            <TableCell>{contact.email}</TableCell>
            <TableCell>{contact.phone}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};