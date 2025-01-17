import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Mail, Phone, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const getActivityIcon = (type: Tables<"organization_activities">["type"]) => {
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

interface ContactActivityFeedProps {
  contact: Tables<"contacts"> & {
    organization: Tables<"organizations"> | null;
  };
}

export const ContactActivityFeed = ({ contact }: ContactActivityFeedProps) => {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ["contact-activities", contact.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organization_activities")
        .select(`
          *,
          created_by (
            id,
            username,
            avatar_url
          )
        `)
        .eq("organization_id", contact.organization_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Set up real-time subscription for new activities
  useEffect(() => {
    const channel = supabase
      .channel("contact-activities")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "organization_activities",
          filter: `organization_id=eq.${contact.organization_id}`,
        },
        (payload) => {
          console.log("New activity:", payload);
          // The useQuery hook will automatically refresh the data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contact.organization_id]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load activities"}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities?.map((activity) => {
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
                      {format(new Date(activity.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </time>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  )}
                  {activity.created_by && (
                    <p className="text-xs text-muted-foreground">
                      by {activity.created_by.username || "Unknown user"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          {activities?.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No activities yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};