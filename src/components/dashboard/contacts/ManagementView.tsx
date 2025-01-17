import { Tables } from "@/integrations/supabase/types";
import { ContactMetrics } from "./ContactMetrics";
import { ContactChart } from "./ContactChart";

interface ManagementViewProps {
  contacts: (Tables<"contacts"> & {
    organization: { name: string } | null;
  })[];
}

export const ManagementView = ({ contacts }: ManagementViewProps) => {
  return (
    <div className="space-y-6">
      <ContactMetrics contacts={contacts} />
      <ContactChart contacts={contacts} />
    </div>
  );
};