import { OrganizationMetrics } from "./OrganizationMetrics";
import { OrganizationChart } from "./OrganizationChart";
import { Tables } from "@/integrations/supabase/types";

interface ManagementViewProps {
  organizations: Tables<"organizations">[];
}

export const ManagementView = ({ organizations }: ManagementViewProps) => {
  return (
    <div className="space-y-4">
      <OrganizationMetrics />
      <OrganizationChart />
    </div>
  );
};