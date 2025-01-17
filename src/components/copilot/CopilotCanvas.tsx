import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, BrainCircuit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type MessageType = "user" | "assistant" | "component";

interface Message {
  type: MessageType;
  content: string | React.ReactNode;
}

export const CopilotCanvas = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "assistant",
      content: "Hello! I'm your AI configuration co-pilot. I can help you manage your AI providers, prompt templates, and copilot configurations. What would you like to do?",
    },
    {
      type: "assistant",
      content: "Here are some things I can help with:\n\n" +
        "• Set up a new AI provider configuration\n" +
        "• Create or modify prompt templates\n" +
        "• Configure a new copilot\n" +
        "• Manage API keys and settings\n" +
        "• Troubleshoot configuration issues",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // TODO: Implement AI interaction with configuration management
      setTimeout(() => {
        const response = "I understand you want to " + userMessage.toLowerCase() + ". Let me help you with that. What specific details would you like to configure?";
        setMessages((prev) => [
          ...prev,
          {
            type: "assistant",
            content: response,
          },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-background rounded-lg border shadow-sm">
      <div className="flex items-center gap-2 p-4 border-b">
        <BrainCircuit className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">AI Configuration Co-pilot</h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.type === "component"
                    ? "bg-card w-full"
                    : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-4 bg-muted animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about AI configuration..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};