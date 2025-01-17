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
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Mail, Phone } from "lucide-react";

interface ContactListProps {
  contacts: (Tables<"contacts"> & {
    organization: { name: string } | null;
  })[];
  showViewAll?: boolean;
}

export const ContactList = ({ contacts, showViewAll = false }: ContactListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Tables<"contacts">>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof Tables<"contacts">) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedContacts = contacts
    .filter((contact) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        contact.first_name?.toLowerCase().includes(searchLower) ||
        contact.last_name?.toLowerCase().includes(searchLower) ||
        contact.email?.toLowerCase().includes(searchLower) ||
        contact.organization?.name?.toLowerCase().includes(searchLower)
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {showViewAll && (
          <Button variant="outline">View All Contacts</Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                className="h-8 w-full justify-start"
                onClick={() => handleSort("first_name")}
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
          {filteredAndSortedContacts.map((contact) => (
            <TableRow key={contact.id}>
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
    </div>
  );
};