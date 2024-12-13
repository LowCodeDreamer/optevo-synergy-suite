import { ScrollArea } from "@/components/ui/scroll-area";

type MessageType = "system" | "user" | "assistant";

interface Message {
  type: MessageType;
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  return (
    <ScrollArea className="flex-1 px-1">
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
    </ScrollArea>
  );
};