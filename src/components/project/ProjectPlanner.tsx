import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, BrainCircuit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MessageType = "system" | "user" | "assistant";

interface Message {
  type: MessageType;
  content: string;
}

interface PlanPreview {
  objectives: string[];
  scope: string[];
  constraints: string[];
}

export const ProjectPlanner = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "system",
      content: "Let's plan your project. What are the main objectives you want to achieve?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [planPreview, setPlanPreview] = useState<PlanPreview>({
    objectives: [],
    scope: [],
    constraints: [],
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Simulate AI response for now
      setTimeout(() => {
        const response = processUserInput(userMessage);
        setMessages((prev) => [...prev, { type: "assistant", content: response }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your input. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const processUserInput = (input: string): string => {
    // Simple logic to update plan preview based on current conversation stage
    if (messages.length === 1) {
      setPlanPreview((prev) => ({
        ...prev,
        objectives: [...prev.objectives, input],
      }));
      return "Great! Now, let's define the scope of the project. What are the key deliverables?";
    } else if (messages.length === 3) {
      setPlanPreview((prev) => ({
        ...prev,
        scope: [...prev.scope, input],
      }));
      return "What constraints or limitations should we consider (budget, timeline, resources)?";
    } else {
      setPlanPreview((prev) => ({
        ...prev,
        constraints: [...prev.constraints, input],
      }));
      return "I'll help you refine these details. What other aspects of the project would you like to discuss?";
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
      {/* Chat Interface */}
      <div className="flex flex-col bg-background rounded-lg border shadow-sm">
        <div className="flex items-center gap-2 p-4 border-b">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Project Planning Assistant</h2>
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
                      : message.type === "system"
                      ? "bg-muted"
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
              placeholder="Type your response..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Plan Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Project Plan Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Objectives</h3>
            <ul className="list-disc pl-4 space-y-1">
              {planPreview.objectives.map((objective, index) => (
                <li key={index} className="text-sm">{objective}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Scope</h3>
            <ul className="list-disc pl-4 space-y-1">
              {planPreview.scope.map((item, index) => (
                <li key={index} className="text-sm">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Constraints</h3>
            <ul className="list-disc pl-4 space-y-1">
              {planPreview.constraints.map((constraint, index) => (
                <li key={index} className="text-sm">{constraint}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
