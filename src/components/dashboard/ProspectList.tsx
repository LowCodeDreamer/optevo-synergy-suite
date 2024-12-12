import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Mail, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const ProspectList = () => {
  const { toast } = useToast();
  const [selectedProspect, setSelectedProspect] = useState<string | null>(null);

  const { data: prospects, isLoading } = useQuery({
    queryKey: ["prospects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prospects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from("prospects")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve prospect",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Prospect approved successfully",
      });
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from("prospects")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject prospect",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Prospect rejected successfully",
      });
    }
  };

  if (isLoading) {
    return <div>Loading prospects...</div>;
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Fit Score</TableHead>
            <TableHead>Potential Services</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prospects?.map((prospect) => (
            <TableRow key={prospect.id}>
              <TableCell className="font-medium">
                <div>
                  <div>{prospect.company_name}</div>
                  <div className="text-sm text-muted-foreground">{prospect.website}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{prospect.contact_name}</div>
                  <div className="text-sm text-muted-foreground">{prospect.contact_email}</div>
                  <div className="text-sm text-muted-foreground">{prospect.contact_phone}</div>
                </div>
              </TableCell>
              <TableCell>{prospect.fit_score}/100</TableCell>
              <TableCell>{prospect.potential_services}</TableCell>
              <TableCell>{prospect.status}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleApprove(prospect.id)}
                    disabled={prospect.status !== "pending"}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleReject(prospect.id)}
                    disabled={prospect.status !== "pending"}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={prospect.status !== "approved" || prospect.email_sent}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={!prospect.email_sent || prospect.meeting_scheduled}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};