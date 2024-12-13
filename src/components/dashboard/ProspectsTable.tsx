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
  return (
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
        {prospects.map((prospect) => (
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
  );
};