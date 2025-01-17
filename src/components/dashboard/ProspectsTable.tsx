import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProspectCompany } from "./ProspectCompany";
import { ProspectContact } from "./ProspectContact";
import { ProspectActions } from "./ProspectActions";
import { Tables } from "@/integrations/supabase/types";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface ProspectsTableProps {
  prospects: Tables<"prospects">[];
  onSelectProspect: (prospect: Tables<"prospects">) => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export const ProspectsTable = ({
  prospects,
  onSelectProspect,
  onApprove,
  onReject,
}: ProspectsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Tables<"prospects">>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof Tables<"prospects">) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedProspects = prospects
    .filter((prospect) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        prospect.company_name.toLowerCase().includes(searchLower) ||
        prospect.contact_name?.toLowerCase().includes(searchLower) ||
        prospect.contact_email?.toLowerCase().includes(searchLower) ||
        prospect.status?.toLowerCase().includes(searchLower)
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
      <Input
        placeholder="Search prospects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-full justify-start">
                    Company <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleSort("company_name")}>
                    Sort by name
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("created_at")}>
                    Sort by date
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="h-8 w-full justify-start"
                onClick={() => handleSort("fit_score")}
              >
                Fit Score <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Potential Services</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="h-8 w-full justify-start"
                onClick={() => handleSort("status")}
              >
                Status <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedProspects.map((prospect) => (
            <TableRow
              key={prospect.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSelectProspect(prospect)}
            >
              <TableCell>
                <ProspectCompany
                  name={prospect.company_name}
                  website={prospect.website}
                />
              </TableCell>
              <TableCell>
                <ProspectContact
                  name={prospect.contact_name}
                  email={prospect.contact_email}
                  phone={prospect.contact_phone}
                  linkedinUrl={prospect.linkedin_url}
                />
              </TableCell>
              <TableCell>{prospect.fit_score}/100</TableCell>
              <TableCell>{prospect.potential_services}</TableCell>
              <TableCell>{prospect.status}</TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <ProspectActions
                  id={prospect.id}
                  status={prospect.status}
                  emailSent={prospect.email_sent}
                  meetingScheduled={prospect.meeting_scheduled}
                  onApprove={onApprove}
                  onReject={onReject}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};