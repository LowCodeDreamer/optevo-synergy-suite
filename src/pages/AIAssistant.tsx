import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AIOverviewStats } from "@/components/ai-assistant/AIOverviewStats";
import { AIQuickActions } from "@/components/ai-assistant/AIQuickActions";
import { CopilotCanvas } from "@/components/copilot/CopilotCanvas";

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: stats } = useQuery({
    queryKey: ['ai-assistant-stats'],
    queryFn: async () => {
      const [providers, templates, copilots] = await Promise.all([
        supabase.from('ai_provider_configs').select('*', { count: 'exact', head: true }),
        supabase.from('prompt_templates').select('*', { count: 'exact', head: true }),
        supabase.from('copilot_configs').select('*', { count: 'exact', head: true })
      ]);
      
      return {
        providers: providers.count || 0,
        templates: templates.count || 0,
        copilots: copilots.count || 0
      };
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">AI Assistant Management</h1>
            <p className="text-muted-foreground mt-2">
              Configure and manage your AI assistants, templates, and providers
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="copilots">Copilots</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <AIOverviewStats stats={stats} onTabChange={setActiveTab} />
              <AIQuickActions onTabChange={setActiveTab} />
            </TabsContent>

            <TabsContent value="providers">
              <Card>
                <CardHeader>
                  <CardTitle>AI Providers</CardTitle>
                  <CardDescription>
                    Manage your AI provider configurations and API keys
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Provider management interface will be implemented here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates">
              <Card>
                <CardHeader>
                  <CardTitle>Prompt Templates</CardTitle>
                  <CardDescription>
                    Create and manage your prompt templates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Template management interface will be implemented here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="copilots">
              <Card>
                <CardHeader>
                  <CardTitle>Copilots</CardTitle>
                  <CardDescription>
                    Configure and manage your AI copilots
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Copilot management interface will be implemented here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Copilot Canvas */}
        <div className="h-full">
          <CopilotCanvas />
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;