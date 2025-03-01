
import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { ProspectCard } from "./ProspectCard";
import { ProspectsTable } from "./ProspectsTable";
import { useProspects } from "@/hooks/use-prospects";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewProspectDialog } from "./NewProspectDialog";
import { EditProspectDialog } from "./EditProspectDialog";
import { DeleteProspectDialog } from "./DeleteProspectDialog";

interface ProspectListProps {
  initialProspects?: Tables<"prospects">[];
  filterMode?: "all" | "my";
}

export const ProspectList = ({ initialProspects, filterMode = "all" }: ProspectListProps) => {
  const [selectedProspect, setSelectedProspect] = useState<Tables<"prospects"> | null>(null);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [prospectToEdit, setProspectToEdit] = useState<Tables<"prospects"> | null>(null);
  const [prospectToDelete, setProspectToDelete] = useState<Tables<"prospects"> | null>(null);
  
  const { prospects, handleApprove, handleReject, refetchProspects, currentUserId } = useProspects();

  const displayProspects = initialProspects || prospects;

  if (!displayProspects) {
    return <div>Loading prospects...</div>;
  }

  const handleSelectProspect = (prospect: Tables<"prospects">) => {
    setSelectedProspect(prospect);
  };

  const handleEdit = (prospect: Tables<"prospects">) => {
    setProspectToEdit(prospect);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (prospect: Tables<"prospects">) => {
    setProspectToDelete(prospect);
    setIsDeleteDialogOpen(true);
  };

  const handleDialogClosed = () => {
    refetchProspects();
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-muted-foreground text-sm">
          {filterMode === "my" ? "Showing prospects assigned to you" : "Showing all active prospects"}
        </div>
        
        <Button 
          onClick={() => setIsNewDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <PlusIcon className="w-4 h-4" />
          New Prospect
        </Button>
      </div>

      <ProspectsTable
        prospects={displayProspects}
        onSelectProspect={handleSelectProspect}
        onApprove={handleApprove}
        onReject={handleReject}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filterMode={filterMode}
        currentUserId={currentUserId}
      />

      <ProspectCard
        prospect={selectedProspect}
        isOpen={!!selectedProspect}
        onClose={() => setSelectedProspect(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <NewProspectDialog 
        isOpen={isNewDialogOpen} 
        onClose={() => {
          setIsNewDialogOpen(false);
          handleDialogClosed();
        }} 
      />

      {prospectToEdit && (
        <EditProspectDialog 
          isOpen={isEditDialogOpen} 
          onClose={() => {
            setIsEditDialogOpen(false);
            setProspectToEdit(null);
            handleDialogClosed();
          }} 
          prospect={prospectToEdit}
        />
      )}

      {prospectToDelete && (
        <DeleteProspectDialog 
          isOpen={isDeleteDialogOpen} 
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setProspectToDelete(null);
            handleDialogClosed();
          }}
          prospectId={prospectToDelete.id}
          prospectName={prospectToDelete.company_name}
        />
      )}
    </div>
  );
};
