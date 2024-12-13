import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  onClick: () => void;
  onAdd: (e: React.MouseEvent) => void;
}

export const MetricCard = ({ 
  title, 
  count, 
  icon: Icon,
  onClick,
  onAdd 
}: MetricCardProps) => {
  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={(e) => {
              e.stopPropagation();
              onAdd(e);
            }}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add new {title.toLowerCase()}</span>
          </Button>
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground mt-1">Click to view all {title.toLowerCase()}</p>
      </CardContent>
    </Card>
  );
};