import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AgentList } from "@/components/agents/AgentList";
import { NewAgentDialog } from "@/components/agents/NewAgentDialog";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Agents = () => {
  const [isNewAgentDialogOpen, setIsNewAgentDialogOpen] = useState(false);

  const { data: agents, isLoading, error } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agents")
        .select(`
          *,
          agent_tools (
            tool_name,
            tool_config
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load agents"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Agents</h1>
        <Button onClick={() => setIsNewAgentDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Agent
        </Button>
      </div>

      <AgentList agents={agents || []} />
      
      <NewAgentDialog 
        open={isNewAgentDialogOpen} 
        onOpenChange={setIsNewAgentDialogOpen}
      />
    </div>
  );
};

export default Agents;