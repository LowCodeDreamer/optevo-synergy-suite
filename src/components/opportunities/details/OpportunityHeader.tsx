
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface OpportunityHeaderProps {
  name: string;
  organizationName?: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const OpportunityHeader = ({ 
  name, 
  organizationName, 
  onEdit, 
  onDelete 
}: OpportunityHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
        {organizationName && (
          <p className="text-muted-foreground">{organizationName}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onDelete}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
