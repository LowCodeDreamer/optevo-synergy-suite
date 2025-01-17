import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { ProspectCard } from "./ProspectCard";
import { ProspectsTable } from "./ProspectsTable";
import { useProspects } from "@/hooks/use-prospects";

interface ProspectListProps {
  initialProspects?: Tables<"prospects">[];
}

export const ProspectList = ({ initialProspects }: ProspectListProps) => {
  const [selectedProspect, setSelectedProspect] = useState<Tables<"prospects"> | null>(null);
  const { prospects, handleApprove, handleReject } = useProspects();

  const displayProspects = initialProspects || prospects;

  if (!displayProspects) {
    return <div>Loading prospects...</div>;
  }

  return (
    <div className="w-full">
      <ProspectsTable
        prospects={displayProspects}
        onSelectProspect={setSelectedProspect}
        onApprove={handleApprove}
        onReject={handleReject}
      />

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