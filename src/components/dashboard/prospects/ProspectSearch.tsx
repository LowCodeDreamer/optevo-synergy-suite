
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface ProspectSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortField: keyof Tables<"prospects">;
  sortDirection: "asc" | "desc";
  onSortChange: (field: keyof Tables<"prospects">) => void;
  onSortDirectionChange: () => void;
}

export const ProspectSearch = ({
  searchTerm,
  onSearchChange,
  sortField,
  sortDirection,
  onSortChange,
  onSortDirectionChange,
}: ProspectSearchProps) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search prospects..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
};
