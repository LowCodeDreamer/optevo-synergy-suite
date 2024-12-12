import { Calendar, Mail, MessageSquare, Phone, CalendarPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export const ProspectActivities = ({ prospectId }: { prospectId: string }) => {
  const { data: activities } = useQuery({
    queryKey: ["prospect-activities", prospectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prospect_activities")
        .select("*")
        .eq("prospect_id", prospectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "call":
        return <Phone className="h-4 w-4" />;
      case "meeting":
        return <Calendar className="h-4 w-4" />;
      case "text":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="gap-2">
          <CalendarPlus className="h-4 w-4" />
          New Activity
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Type</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[150px]">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities?.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="flex items-center gap-2">
                {getActivityIcon(activity.type)}
                <span className="capitalize">{activity.type}</span>
              </TableCell>
              <TableCell>{activity.title}</TableCell>
              <TableCell>{activity.description}</TableCell>
              <TableCell>
                {activity.completed_at
                  ? format(new Date(activity.completed_at), "MMM d, yyyy")
                  : activity.scheduled_at
                  ? format(new Date(activity.scheduled_at), "MMM d, yyyy")
                  : format(new Date(activity.created_at), "MMM d, yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};