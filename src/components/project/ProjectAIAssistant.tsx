import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BrainCircuit, 
  Send, 
  Sparkles,
  Calendar,
  AlertTriangle,
  TrendingUp,
  FileText
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SUGGESTED_PROMPTS = [
  {
    icon: <Calendar className="h-4 w-4" />,
    text: "Generate status report",
    action: "generate-status"
  },
  {
    icon: <AlertTriangle className="h-4 w-4" />,
    text: "Identify project risks",
    action: "identify-risks"
  },
  {
    icon: <TrendingUp className="h-4 w-4" />,
    text: "Progress analysis",
    action: "analyze-progress"
  },
  {
    icon: <FileText className="h-4 w-4" />,
    text: "Summarize recent updates",
    action: "summarize-updates"
  }
];

interface ProjectAIAssistantProps {
  project: Tables<"projects"> & {
    organization: Tables<"organizations">;
    primary_contact: Tables<"contacts">;
    manager: Tables<"profiles">;
    team_members: (Tables<"team_members"> & {
      profile: Tables<"profiles">;
    })[];
  };
}

export const ProjectAIAssistant = ({ project }: ProjectAIAssistantProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "system",
      content: `Hello! I'm your AI project assistant for ${project.name}. How can I help you today?`
    }
  ]);

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    // In the future, this could automatically trigger the AI action
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: "user", content: input }]);
    
    // TODO: Implement AI interaction
    console.log("AI Query:", input);
    
    // Simulate AI response (replace with actual AI integration)
    setMessages(prev => [...prev, {
      type: "assistant",
      content: "I understand you want to " + input.toLowerCase() + ". I'll help you with that once I'm fully implemented!"
    }]);
    
    setInput("");
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          Project Co-pilot
        </CardTitle>
        <CardDescription>
          Ask me anything about the project
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 px-1">
          <div className="space-y-4">
            {/* Suggested Actions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Quick Actions</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {SUGGESTED_PROMPTS.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start gap-2 h-auto py-3 px-4"
                    onClick={() => handleSuggestedPrompt(prompt.text)}
                  >
                    {prompt.icon}
                    <span className="text-sm">{prompt.text}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground ml-8"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about the project..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};