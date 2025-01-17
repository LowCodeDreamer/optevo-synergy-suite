import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AVAILABLE_FIELDS = [
  { id: "name", label: "Project Name" },
  { id: "organizations.name", label: "Organization" },
  { id: "status", label: "Status" },
  { id: "manager.username", label: "Manager" },
  { id: "start_date", label: "Start Date" },
  { id: "end_date", label: "End Date" },
  { id: "budget", label: "Budget" },
];

interface NewProjectViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onViewCreated: () => void;
}

export const NewProjectViewDialog = ({ isOpen, onClose, onViewCreated }: NewProjectViewDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>(["name", "status"]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("project_views")
        .insert({
          name,
          description,
          display_fields: selectedFields,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Custom view created successfully",
      });
      
      onViewCreated();
      onClose();
    } catch (error) {
      console.error("Error creating view:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create custom view",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Custom View</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">View Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom View"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description of this view..."
            />
          </div>
          <div className="space-y-2">
            <Label>Display Fields</Label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_FIELDS.map((field) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedFields([...selectedFields, field.id]);
                      } else {
                        setSelectedFields(selectedFields.filter((f) => f !== field.id));
                      }
                    }}
                  />
                  <Label htmlFor={field.id}>{field.label}</Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create View</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};