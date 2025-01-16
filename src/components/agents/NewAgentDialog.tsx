import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const NewAgentDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    backstory: "",
    goal: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Ensure required fields are present
      if (!formData.name || !formData.role) {
        toast({
          title: "Error",
          description: "Name and role are required fields",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("agents")
        .insert({
          name: formData.name,
          role: formData.role,
          description: formData.description || null,
          backstory: formData.backstory || null,
          goal: formData.goal || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Agent created successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create agent",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Agent Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              placeholder="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <Textarea
              placeholder="Backstory"
              value={formData.backstory}
              onChange={(e) => setFormData({ ...formData, backstory: e.target.value })}
            />
          </div>
          <div>
            <Textarea
              placeholder="Goal"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full">Create Agent</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};