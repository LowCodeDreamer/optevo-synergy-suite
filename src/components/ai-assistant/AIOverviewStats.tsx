import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, FileCode, Settings } from "lucide-react";

interface AIStatsProps {
  stats: {
    providers: number;
    templates: number;
    copilots: number;
  };
  onTabChange: (tab: string) => void;
}

export const AIOverviewStats = ({ stats, onTabChange }: AIStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            {stats?.providers || 0}
          </CardTitle>
          <CardDescription>AI Providers</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => onTabChange("providers")}
          >
            <span className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Manage Providers
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            {stats?.templates || 0}
          </CardTitle>
          <CardDescription>Prompt Templates</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => onTabChange("templates")}
          >
            <span className="flex items-center">
              <FileCode className="mr-2 h-4 w-4" />
              Manage Templates
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            {stats?.copilots || 0}
          </CardTitle>
          <CardDescription>Active Copilots</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => onTabChange("copilots")}
          >
            <span className="flex items-center">
              <Bot className="mr-2 h-4 w-4" />
              Manage Copilots
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};