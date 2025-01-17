import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ManagementView } from "@/components/dashboard/organizations/ManagementView";
import { CopilotCanvas } from "@/components/copilot/CopilotCanvas";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Loader2, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Organizations = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: organizations, isLoading, error } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredOrganizations = organizations?.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeOrganizations = organizations?.filter(
    (org) => org.status === "active"
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load organizations"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const OrganizationsTable = ({ data }: { data: typeof organizations }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search organizations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Website</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((org) => (
            <TableRow key={org.id}>
              <TableCell className="font-medium">{org.name}</TableCell>
              <TableCell>{org.industry || "N/A"}</TableCell>
              <TableCell>{org.status}</TableCell>
              <TableCell>{org.website || "N/A"}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/organizations/${org.id}`)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Organizations</h1>
      </div>

      <Tabs defaultValue="management" className="space-y-4">
        <TabsList>
          <TabsTrigger value="management">Management View</TabsTrigger>
          <TabsTrigger value="all">All Organizations</TabsTrigger>
          <TabsTrigger value="active">Active Organizations</TabsTrigger>
          <TabsTrigger value="copilot">Copilot</TabsTrigger>
        </TabsList>

        <TabsContent value="management">
          <ManagementView />
        </TabsContent>

        <TabsContent value="all">
          <DashboardCard>
            <OrganizationsTable data={filteredOrganizations} />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="active">
          <DashboardCard>
            <OrganizationsTable data={activeOrganizations} />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="copilot">
          <CopilotCanvas />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Organizations;