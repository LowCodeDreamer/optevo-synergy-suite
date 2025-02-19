
import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface OpportunityActivitiesProps {
  opportunity: Tables<"opportunities">;
}

export const OpportunityActivities = ({ opportunity }: OpportunityActivitiesProps) => {
  const { data: activities, isError } = useQuery({
    queryKey: ["opportunity-activities", opportunity.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organization_activities")
        .select("*")
        .eq("organization_id", opportunity.organization_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load activities. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {activities?.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium">{activity.title}</h4>
              {activity.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {format(new Date(activity.created_at), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
        ))}
        {activities?.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No activities yet
          </p>
        )}
      </div>
    </ScrollArea>
  );
};
