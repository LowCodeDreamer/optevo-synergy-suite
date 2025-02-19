
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OpportunityTasks } from "@/components/opportunities/records/OpportunityTasks";
import { OpportunityNotes } from "@/components/opportunities/records/OpportunityNotes";
import { OpportunityActivities } from "@/components/opportunities/records/OpportunityActivities";
import { Card } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

interface OpportunityRecordsProps {
  opportunity: Tables<"opportunities"> & {
    organization: Tables<"organizations"> | null;
  };
}

export const OpportunityRecords = ({ opportunity }: OpportunityRecordsProps) => {
  return (
    <Card className="p-6">
      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-0">
          <OpportunityTasks opportunity={opportunity} />
        </TabsContent>

        <TabsContent value="notes" className="mt-0">
          <OpportunityNotes opportunity={opportunity} />
        </TabsContent>

        <TabsContent value="activities" className="mt-0">
          <OpportunityActivities opportunity={opportunity} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
