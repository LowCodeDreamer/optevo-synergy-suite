import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Mail, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";

interface ActivityItem {
  id: string;
  type: "message" | "email" | "call" | "meeting";
  title: string;
  description?: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
}

// This would be replaced with real data from your backend
const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "message",
    title: "Chat conversation",
    description: "Discussed upcoming project timeline",
    timestamp: new Date("2024-03-10T14:30:00"),
    user: {
      name: "John Doe",
    },
  },
  {
    id: "2",
    type: "email",
    title: "Email sent",
    description: "Proposal document shared",
    timestamp: new Date("2024-03-09T11:20:00"),
    user: {
      name: "Sarah Smith",
    },
  },
  // Add more mock activities as needed
];

const getActivityIcon = (type: ActivityItem["type"]) => {
  switch (type) {
    case "message":
      return MessageSquare;
    case "email":
      return Mail;
    case "call":
      return Phone;
    case "meeting":
      return Calendar;
    default:
      return MessageSquare;
  }
};

interface ActivityFeedProps {
  organization: Tables<"organizations"> & {
    contacts: Tables<"contacts">[];
    opportunities: Tables<"opportunities">[];
    projects: Tables<"projects">[];
  };
}

export const ActivityFeed = ({ organization }: ActivityFeedProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex gap-4">
                <div className="mt-1">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <time className="text-xs text-muted-foreground">
                      {format(activity.timestamp, "MMM d, yyyy 'at' h:mm a")}
                    </time>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  )}
                  {activity.user && (
                    <p className="text-xs text-muted-foreground">
                      by {activity.user.name}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};