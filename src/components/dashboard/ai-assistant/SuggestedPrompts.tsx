import { Button } from "@/components/ui/button";
import { 
  ListFilter,
  ArrowUpDown,
  Target,
  Users,
} from "lucide-react";
import { Sparkles } from "lucide-react";

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

interface SuggestedPromptsProps {
  onPromptSelect: (prompt: string) => void;
}

export const SuggestedPrompts = ({ onPromptSelect }: SuggestedPromptsProps) => {
  return (
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
            onClick={() => onPromptSelect(prompt.text)}
          >
            {prompt.icon}
            <span className="text-sm">{prompt.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};