import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCircuit, Send } from "lucide-react";

export const AIAssistant = () => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement AI interaction
    console.log("AI Query:", input);
    setInput("");
  };

  return (
    <div className="bg-card dark:bg-slate-800/50 p-4 rounded-lg shadow-lg dark:border dark:border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="text-accent" size={24} />
        <h3 className="font-semibold text-foreground">AI Assistant</h3>
      </div>
      
      <div className="min-h-[200px] bg-background dark:bg-slate-900/50 rounded-lg p-4 mb-4 text-foreground">
        <p className="text-muted-foreground">
          Hello! I'm your AI assistant. How can I help you today?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 dark:bg-slate-900/50 dark:border-slate-700"
        />
        <Button type="submit" className="bg-accent hover:bg-accent/90">
          <Send size={20} />
        </Button>
      </form>
    </div>
  );
};