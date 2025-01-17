import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { FloatingAIAssistant } from "@/components/dashboard/FloatingAIAssistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ManagementView } from "@/components/dashboard/contacts/ManagementView";
import { ContactList } from "@/components/dashboard/ContactList";

const Contacts = () => {
  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select(`
          *,
          organization:organizations(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading contacts...</div>;
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Contacts</h1>

      <Tabs defaultValue="management" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="management">Management View</TabsTrigger>
          <TabsTrigger value="all">All Contacts</TabsTrigger>
          <TabsTrigger value="recent">Recent Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="management">
          <ManagementView contacts={contacts || []} />
        </TabsContent>

        <TabsContent value="all">
          <DashboardCard title="All Contacts" className="mb-6">
            <ContactList contacts={contacts || []} />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="recent">
          <DashboardCard title="Recent Contacts" className="mb-6">
            <ContactList 
              contacts={contacts?.slice(0, 5) || []} 
              showViewAll={true} 
            />
          </DashboardCard>
        </TabsContent>
      </Tabs>

      <FloatingAIAssistant 
        context="Contact Management"
        description="Your AI assistant for contact management and relationship insights"
      />
    </div>
  );
};

export default Contacts;