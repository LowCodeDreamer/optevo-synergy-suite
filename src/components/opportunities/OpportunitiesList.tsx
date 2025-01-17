import { Tables } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DollarSign, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OpportunitiesListProps {
  opportunities: (Tables<"opportunities"> & {
    organization: { name: string } | null;
    owner: { username: string; avatar_url: string | null } | null;
    primary_contact: { first_name: string | null; last_name: string | null; email: string | null } | null;
  })[];
}

export const OpportunitiesList = ({ opportunities }: OpportunitiesListProps) => {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Organization</TableHead>
          <TableHead>Stage</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Probability</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Expected Close</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {opportunities.map((opportunity) => (
          <TableRow 
            key={opportunity.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => navigate(`/opportunities/${opportunity.id}`)}
          >
            <TableCell className="font-medium">{opportunity.name}</TableCell>
            <TableCell>{opportunity.organization?.name}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {opportunity.pipeline_stage}
              </Badge>
            </TableCell>
            <TableCell>
              {opportunity.expected_value && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {opportunity.expected_value.toLocaleString()}
                </div>
              )}
            </TableCell>
            <TableCell>
              {opportunity.probability && (
                <div className="flex items-center gap-1">
                  <Percent className="h-4 w-4" />
                  {opportunity.probability}%
                </div>
              )}
            </TableCell>
            <TableCell>{opportunity.owner?.username || "Unassigned"}</TableCell>
            <TableCell>
              {opportunity.expected_close_date &&
                format(new Date(opportunity.expected_close_date), "MMM d, yyyy")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};