import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ProjectThreadProps {
  project: Tables<"projects"> & {
    organization: Tables<"organizations">;
    primary_contact: Tables<"contacts">;
    manager: Tables<"profiles">;
    team_members: (Tables<"team_members"> & {
      profile: Tables<"profiles">;
    })[];
  };
}

export const ProjectThread = ({ project }: ProjectThreadProps) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["project-messages", project.id],
    queryFn: async () => {
      // TODO: Implement messages table and fetch logic
      return [];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      // TODO: Implement message sending logic
      toast({
        title: "Message sent",
        description: "Your message has been sent to the project team.",
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-lg border dark:border-slate-800 h-[calc(100vh-8rem)]">
      <div className="p-4 border-b dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Project Team Chat</h2>
        </div>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="sm">
              About Team Chat
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Team Communication Channel</h4>
              <p className="text-sm text-muted-foreground">
                This is where your team can discuss project updates, share information, 
                and collaborate together. All team members can see these messages.
              </p>
              <p className="text-sm text-muted-foreground">
                For AI assistance or private inquiries, use the Project Co-pilot 
                button in the bottom right corner.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <ScrollArea className="h-[calc(100%-10rem)] p-4">
        <div className="space-y-4">
          {messages?.map((message, index) => (
            <div key={index} className="flex gap-2">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">Message content here</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t dark:border-slate-800">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message to the project team..."
            className="min-h-[80px]"
          />
          <Button type="submit" size="icon" className="h-auto">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};