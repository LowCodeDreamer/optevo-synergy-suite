import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, MessageSquare, FileCode, Bot, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AIAssistant = () => {
  const navigate = useNavigate();
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Assistant Management</h1>
          <p className="text-muted-foreground mt-2">
            Configure and manage your AI assistants, templates, and providers
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="copilots">Copilots</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
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
                  onClick={() => setActiveTab("providers")}
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
                  onClick={() => setActiveTab("templates")}
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
                  onClick={() => setActiveTab("copilots")}
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
                onClick={() => setActiveTab("providers")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Add New AI Provider
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => setActiveTab("templates")}
              >
                <FileCode className="mr-2 h-4 w-4" />
                Create Prompt Template
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => setActiveTab("copilots")}
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
  );
};

export default AIAssistant;