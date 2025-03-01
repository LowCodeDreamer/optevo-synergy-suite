
import { useState, useMemo } from "react";
import { Tables } from "@/integrations/supabase/types";
import { ProspectCard } from "./ProspectCard";
import { ProspectsTable } from "./ProspectsTable";
import { useProspects } from "@/hooks/use-prospects";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewProspectDialog } from "./NewProspectDialog";
import { EditProspectDialog } from "./EditProspectDialog";
import { DeleteProspectDialog } from "./DeleteProspectDialog";
import { ProspectSearch } from "./prospects/ProspectSearch";

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
  
  // Add state for search and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Tables<"prospects">>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const { prospects, handleApprove, handleReject, refetchProspects, currentUserId } = useProspects();

  const displayProspects = initialProspects || prospects;

  // Filter and sort prospects based on search and sort settings
  const filteredAndSortedProspects = useMemo(() => {
    if (!displayProspects) return [];
    
    return [...displayProspects]
      .filter(prospect => {
        if (searchTerm === "") return true;
        
        const searchLower = searchTerm.toLowerCase();
        return (
          prospect.company_name?.toLowerCase().includes(searchLower) ||
          prospect.contact_name?.toLowerCase().includes(searchLower) ||
          prospect.contact_email?.toLowerCase().includes(searchLower) ||
          prospect.description?.toLowerCase().includes(searchLower) ||
          prospect.assigned_to_name?.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue === null || aValue === undefined) return sortDirection === "asc" ? -1 : 1;
        if (bValue === null || bValue === undefined) return sortDirection === "asc" ? 1 : -1;
        
        // For string comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === "asc" 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        // For date comparison
        if (sortField === 'created_at' || sortField === 'updated_at' || sortField === 'reviewed_at') {
          const aDate = aValue ? new Date(aValue as string).getTime() : 0;
          const bDate = bValue ? new Date(bValue as string).getTime() : 0;
          return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
        }
        
        // For general comparison
        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return sortDirection === "asc" ? comparison : -comparison;
      });
  }, [displayProspects, searchTerm, sortField, sortDirection]);

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

  const handleSortChange = (field: keyof Tables<"prospects">) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (!displayProspects) {
    return <div>Loading prospects...</div>;
  }

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

      {/* Add the search component */}
      <ProspectSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onSortDirectionChange={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
      />

      <ProspectsTable
        prospects={filteredAndSortedProspects}
        onSelectProspect={handleSelectProspect}
        onApprove={handleApprove}
        onReject={handleReject}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filterMode={filterMode}
        currentUserId={currentUserId}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
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
