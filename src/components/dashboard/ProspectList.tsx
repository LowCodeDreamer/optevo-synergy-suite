import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ProspectCompany } from "./ProspectCompany";
import { ProspectContact } from "./ProspectContact";
import { ProspectActions } from "./ProspectActions";
import { ProspectCard } from "./ProspectCard";
import { Tables } from "@/integrations/supabase/types";

export const ProspectList = () => {
  const { toast } = useToast();
  const [selectedProspect, setSelectedProspect] = useState<Tables<"prospects"> | null>(null);

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
            <TableRow
              key={prospect.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setSelectedProspect(prospect)}
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
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ProspectCard
        prospect={selectedProspect}
        isOpen={!!selectedProspect}
        onClose={() => setSelectedProspect(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};