
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
import { DollarSign, Percent, Eye, Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface OpportunitiesListProps {
  opportunities: (Tables<"opportunities"> & {
    organization: { name: string } | null;
    owner: { username: string; avatar_url: string | null } | null;
    primary_contact: { first_name: string | null; last_name: string | null; email: string | null } | null;
  })[];
  onEdit?: (opportunity: Tables<"opportunities">) => void;
  onDelete?: (opportunity: Tables<"opportunities">) => void;
}

export const OpportunitiesList = ({ 
  opportunities,
  onEdit,
  onDelete
}: OpportunitiesListProps) => {
  const navigate = useNavigate();

  const handleView = (opportunityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/opportunities/${opportunityId}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[200px]">Name</TableHead>
          <TableHead className="min-w-[200px]">Organization</TableHead>
          <TableHead className="min-w-[120px]">Stage</TableHead>
          <TableHead className="min-w-[120px]">Value</TableHead>
          <TableHead className="min-w-[120px]">Probability</TableHead>
          <TableHead className="min-w-[150px]">Owner</TableHead>
          <TableHead className="min-w-[150px]">Expected Close</TableHead>
          {(onEdit || onDelete) && <TableHead className="text-right">Actions</TableHead>}
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
            {(onEdit || onDelete) && (
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => handleView(opportunity.id, e)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(opportunity);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(opportunity);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
