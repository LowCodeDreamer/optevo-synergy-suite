import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Send, Bot } from "lucide-react";

interface ContactAIAssistantProps {
  contact: Tables<"contacts"> & {
    organization: Tables<"organizations"> | null;
  };
}

const SUGGESTED_PROMPTS = [
  {
    title: "Generate Meeting Summary",
    prompt: "Create a summary of my recent meeting with [Contact Name]",
  },
  {
    title: "Draft Follow-up Email",
    prompt: "Write a professional follow-up email to [Contact Name] about our recent discussion",
  },
  {
    title: "Relationship Analysis",
    prompt: "Analyze my relationship with [Contact Name] and suggest ways to strengthen it",
  },
  {
    title: "Next Steps Strategy",
    prompt: "Based on recent interactions, what should be my next steps with [Contact Name]?",
  },
];

export const ContactAIAssistant = ({ contact }: ContactAIAssistantProps) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant' | 'system', content: string }>>([
    {
      role: 'system',
      content: `Hello! I'm your AI assistant for managing your relationship with ${contact.first_name} ${contact.last_name}. How can I help you today?`
    }
  ]);
  const [input, setInput] = useState("");

  const handlePromptSelect = (prompt: string) => {
    const personalizedPrompt = prompt.replace(
      "[Contact Name]",
      `${contact.first_name} ${contact.last_name}`
    );
    setInput(personalizedPrompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    // Simulate AI response (replace with actual AI integration)
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `I understand you want to know about "${input}". I'll help you with that once I'm fully implemented!`
    }]);
    
    setInput("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {SUGGESTED_PROMPTS.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start gap-2 h-auto py-3 px-4"
              onClick={() => handlePromptSelect(item.prompt)}
            >
              <Bot className="h-4 w-4" />
              <span className="text-sm">{item.title}</span>
            </Button>
          ))}
        </div>

        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ml-8"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about this contact..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};