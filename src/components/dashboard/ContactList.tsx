import { Tables } from "@/integrations/supabase/types";
import { useState } from "react";
import { ContactSearch } from "./contacts/ContactSearch";
import { ContactTable } from "./contacts/ContactTable";

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
      <ContactSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortField={sortField}
        onSortChange={handleSort}
        showViewAll={showViewAll}
      />

      <ContactTable
        contacts={filteredAndSortedContacts}
        sortField={sortField}
        onSortChange={handleSort}
      />
    </div>
  );
};