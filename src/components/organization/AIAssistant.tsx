import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrainCircuit, Send, Sparkles } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const PRESET_PROMPTS = [
  {
    label: "Summarize Recent Activity",
    prompt: "Give me a summary of recent activities and key updates for this organization",
  },
  {
    label: "Next Steps",
    prompt: "What are the recommended next steps for this account?",
  },
  {
    label: "Risk Analysis",
    prompt: "Analyze potential risks and opportunities for this account",
  },
];

interface AIAssistantProps {
  organization: Tables<"organizations"> & {
    contacts: Tables<"contacts">[];
    opportunities: Tables<"opportunities">[];
    projects: Tables<"projects">[];
  };
}

export const AIAssistant = ({ organization }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your AI assistant for ${organization.name}. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (prompt: string) => {
    if (!prompt.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setInput("");
    setIsLoading(true);

    try {
      // Call the AI function (to be implemented)
      const response = await fetch("/api/organization-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          organizationId: organization.id,
          context: {
            name: organization.name,
            description: organization.description,
            contacts: organization.contacts,
            opportunities: organization.opportunities,
            projects: organization.projects,
          },
        }),
      });

      const data = await response.json();
      
      // Add AI response
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Error calling AI:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-lg border dark:border-slate-800 h-[80vh] flex flex-col">
      <div className="p-4 border-b dark:border-slate-800 flex items-center gap-2">
        <BrainCircuit className="text-primary" size={24} />
        <h2 className="font-semibold text-lg">AI Assistant</h2>
      </div>

      <div className="p-4 flex gap-2 overflow-x-auto border-b dark:border-slate-800">
        {PRESET_PROMPTS.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            className="whitespace-nowrap"
            onClick={() => handleSubmit(preset.prompt)}
            disabled={isLoading}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {preset.label}
          </Button>
        ))}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "assistant"
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(input);
        }}
        className="p-4 border-t dark:border-slate-800"
      >
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about this organization..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};