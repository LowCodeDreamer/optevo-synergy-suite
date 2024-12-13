import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BrainCircuit, 
  Send, 
  Sparkles,
  Filter,
  ListFilter,
  Mail,
  Calendar,
  ArrowUpDown,
  Building2,
  Users,
  Target
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const SUGGESTED_PROMPTS = [
  {
    icon: <ListFilter className="h-4 w-4" />,
    text: "Analyze project timeline",
    action: "analyze-timeline"
  },
  {
    icon: <ArrowUpDown className="h-4 w-4" />,
    text: "Review project risks",
    action: "review-risks"
  },
  {
    icon: <Target className="h-4 w-4" />,
    text: "Suggest next actions",
    action: "suggest-actions"
  },
  {
    icon: <Users className="h-4 w-4" />,
    text: "Team performance insights",
    action: "team-insights"
  }
];

export const FloatingAIAssistant = () => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "system",
      content: "Hello! I'm your AI project assistant. How can I help you today?"
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg"
              size="icon"
            >
              <BrainCircuit className="h-6 w-6" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80" side="left" align="end">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Project Co-pilot</h4>
              <p className="text-sm text-muted-foreground">
                Your personal AI assistant for project insights, analysis, and recommendations. 
                Chat privately with the co-pilot to get help with your project tasks.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              Project Co-pilot
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Your personal AI assistant for project-specific insights and tasks
          </p>
        </SheetHeader>

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
      </SheetContent>
    </Sheet>
  );
};
