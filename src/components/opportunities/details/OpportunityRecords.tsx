
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactTasks } from "@/components/contact/records/ContactTasks";
import { ContactNotes } from "@/components/contact/records/ContactNotes";
import { ContactActivityFeed } from "@/components/contact/ContactActivityFeed";
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
          <ContactTasks contact={{ organization: opportunity.organization }} />
        </TabsContent>

        <TabsContent value="notes" className="mt-0">
          <ContactNotes contact={{ organization: opportunity.organization }} />
        </TabsContent>

        <TabsContent value="activities" className="mt-0">
          <ContactActivityFeed contact={{ organization: opportunity.organization }} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
