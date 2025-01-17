import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, BrainCircuit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ProjectPlanVisualizer } from "./planner/ProjectPlanVisualizer";

type PlanningPhase = "high-level" | "planning" | "detailed";

interface Message {
  type: "system" | "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    type: "system",
    content: "Welcome! I'll help you create your project plan. Let's start with the high-level details. What's the main objective of this project?",
  },
];

export const ProjectCreationFlow = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [currentPhase, setCurrentPhase] = useState<PlanningPhase>("high-level");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [projectPlan, setProjectPlan] = useState({
    objectives: [],
    team: [],
    milestones: [],
    tasks: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // TODO: Implement AI interaction
      // For now, we'll simulate a response
      setTimeout(() => {
        let response = "";
        
        if (currentPhase === "high-level") {
          response = "Great objective! Now, let's identify the key stakeholders and team members for this project. Who will be involved?";
        } else if (currentPhase === "planning") {
          response = "Excellent! Based on that, I suggest breaking this down into the following milestones. Does this timeline look right to you?";
        } else {
          response = "Perfect! I'll help you break down these milestones into specific tasks. Let's start with the first milestone.";
        }

        setMessages((prev) => [
          ...prev,
          { type: "assistant", content: response },
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
    <div className="flex h-[calc(100vh-6rem)] gap-6 p-6">
      {/* Chat Interface */}
      <Card className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Project Co-pilot</h2>
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
                      : "bg-card border"
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
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Card>

      {/* Project Plan Visualization */}
      <Card className="w-1/2">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Project Plan</h2>
        </div>
        <div className="p-4">
          <ProjectPlanVisualizer plan={projectPlan} phase={currentPhase} />
        </div>
      </Card>
    </div>
  );
};

export default ProjectCreationFlow;