import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface ContactSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortField: keyof Tables<"contacts">;
  onSortChange: (field: keyof Tables<"contacts">) => void;
  showViewAll?: boolean;
}

export const ContactSearch = ({
  searchTerm,
  onSearchChange,
  sortField,
  onSortChange,
  showViewAll = false,
}: ContactSearchProps) => {
  return (
    <div className="flex justify-between items-center">
      <Input
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
      {showViewAll && (
        <Button variant="outline">View All Contacts</Button>
      )}
    </div>
  );
};