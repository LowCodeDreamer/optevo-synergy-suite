
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ProspectActions } from "./ProspectActions";

interface ProspectsTableProps {
  prospects: Tables<"prospects">[];
  onSelectProspect: (prospect: Tables<"prospects">) => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onEdit: (prospect: Tables<"prospects">) => void;
  onDelete: (prospect: Tables<"prospects">) => void;
}

export const ProspectsTable = ({
  prospects,
  onSelectProspect,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: ProspectsTableProps) => {
  // Helper function to get the last activity date
  const getLastActivityDate = (prospect: Tables<"prospects">) => {
    // Use the most recent date among: reviewed_at, created_at
    const dates = [
      prospect.reviewed_at ? new Date(prospect.reviewed_at) : null,
      prospect.created_at ? new Date(prospect.created_at) : null,
    ].filter(Boolean) as Date[];
    
    return dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : null;
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prospects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No prospects found.
              </TableCell>
            </TableRow>
          ) : (
            prospects.map((prospect) => (
              <TableRow key={prospect.id}>
                <TableCell
                  className="font-medium cursor-pointer hover:underline"
                  onClick={() => onSelectProspect(prospect)}
                >
                  {prospect.company_name}
                </TableCell>
                <TableCell>
                  {prospect.contact_name ? (
                    <div>
                      <div>{prospect.contact_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {prospect.contact_email}
                      </div>
                    </div>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      prospect.status === "approved"
                        ? "default"
                        : prospect.status === "rejected"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {prospect.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {prospect.created_at
                    ? formatDistanceToNow(new Date(prospect.created_at), {
                        addSuffix: true,
                      })
                    : "—"}
                </TableCell>
                <TableCell>
                  {/* Display the most recent activity date */}
                  {getLastActivityDate(prospect)
                    ? formatDistanceToNow(getLastActivityDate(prospect) as Date, {
                        addSuffix: true,
                      })
                    : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    {/* Main Prospect Actions based on status */}
                    <ProspectActions 
                      id={prospect.id}
                      status={prospect.status}
                      emailSent={prospect.email_sent}
                      meetingScheduled={prospect.meeting_scheduled}
                      onApprove={onApprove}
                      onReject={onReject}
                    />
                    
                    {/* View button - always visible */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onSelectProspect(prospect)}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {/* Only show edit/delete for non-converted prospects */}
                    {prospect.status !== "approved" && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEdit(prospect)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDelete(prospect)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
