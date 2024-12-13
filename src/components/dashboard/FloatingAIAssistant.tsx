import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BrainCircuit, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SuggestedPrompts } from "./ai-assistant/SuggestedPrompts";
import { ChatMessages } from "./ai-assistant/ChatMessages";
import { ChatInput } from "./ai-assistant/ChatInput";

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
        <Button
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg"
          size="icon"
          onClick={() => setIsOpen(true)}
        >
          <BrainCircuit className="h-6 w-6" />
        </Button>
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

        <div className="flex-1 flex flex-col space-y-4 p-4">
          <SuggestedPrompts onPromptSelect={handleSuggestedPrompt} />
          <ChatMessages messages={messages} />
        </div>

        <div className="p-4 border-t">
          <ChatInput
            input={input}
            onInputChange={setInput}
            onSubmit={handleSubmit}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};