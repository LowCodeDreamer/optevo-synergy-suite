
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProspectsTableProps {
  prospects: Tables<"prospects">[];
  onSelectProspect: (prospect: Tables<"prospects">) => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onEdit: (prospect: Tables<"prospects">) => void;
  onDelete: (prospect: Tables<"prospects">) => void;
  filterMode?: "all" | "my"; // New filter mode prop
  currentUserId?: string; // New current user ID prop
}

export const ProspectsTable = ({
  prospects,
  onSelectProspect,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  filterMode = "all",
  currentUserId,
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

  // Filter prospects based on the filterMode
  const filteredProspects = prospects.filter(prospect => {
    // Filter out converted/rejected prospects for all views
    if (prospect.status === "approved" || prospect.status === "rejected") {
      return false;
    }

    // Only return prospects assigned to current user for "my" view
    if (filterMode === "my" && currentUserId) {
      return prospect.assigned_to === currentUserId;
    }

    return true;
  });

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProspects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No prospects found.
              </TableCell>
            </TableRow>
          ) : (
            filteredProspects.map((prospect) => (
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
                      prospect.status === "new"
                        ? "secondary"
                        : prospect.status === "in_progress"
                        ? "default"
                        : "outline"
                    }
                  >
                    {prospect.status === "pending" ? "new" : prospect.status?.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {prospect.assigned_to ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {prospect.assigned_to_name?.substring(0, 2) || "UN"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{prospect.assigned_to_name || "Assigned"}</span>
                    </div>
                  ) : (
                    <Badge variant="outline">Unassigned</Badge>
                  )}
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
                      assigned_to={prospect.assigned_to}
                      currentUserId={currentUserId}
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
                    
                    {/* Edit/delete buttons */}
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
