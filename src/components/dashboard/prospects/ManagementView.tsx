import { Tables } from "@/integrations/supabase/types";
import { ProspectMetrics } from "./ProspectMetrics";
import { ProspectChart } from "./ProspectChart";

interface ManagementViewProps {
  prospects: Tables<"prospects">[];
}

export const ManagementView = ({ prospects }: ManagementViewProps) => {
  return (
    <div>
      <ProspectMetrics prospects={prospects} />
      <ProspectChart prospects={prospects} />
    </div>
  );
};