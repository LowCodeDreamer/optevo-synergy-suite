import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string | null;
  status: string;
  version: number;
  agent_tools: Array<{
    tool_name: string;
    tool_config: any;
  }>;
}

interface AgentListProps {
  agents: Agent[];
}

export const AgentList = ({ agents }: AgentListProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Card key={agent.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                {agent.name}
              </div>
            </CardTitle>
            <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
              v{agent.version}
            </Badge>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-muted-foreground mb-4">
              {agent.role}
            </CardDescription>
            <p className="text-sm mb-4 line-clamp-2">
              {agent.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {agent.agent_tools.map((tool) => (
                  <Badge key={tool.tool_name} variant="outline">
                    {tool.tool_name}
                  </Badge>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/agents/${agent.id}`)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};