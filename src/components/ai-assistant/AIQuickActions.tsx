import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, FileCode, MessageSquare, Settings } from "lucide-react";

interface AIQuickActionsProps {
  onTabChange: (tab: string) => void;
}

export const AIQuickActions = ({ onTabChange }: AIQuickActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks and configurations
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Button
          variant="outline"
          className="justify-start"
          onClick={() => onTabChange("providers")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Add New AI Provider
        </Button>
        <Button
          variant="outline"
          className="justify-start"
          onClick={() => onTabChange("templates")}
        >
          <FileCode className="mr-2 h-4 w-4" />
          Create Prompt Template
        </Button>
        <Button
          variant="outline"
          className="justify-start"
          onClick={() => onTabChange("copilots")}
        >
          <Bot className="mr-2 h-4 w-4" />
          Configure New Copilot
        </Button>
        <Button
          variant="outline"
          className="justify-start"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Test Copilot Chat
        </Button>
      </CardContent>
    </Card>
  );
};