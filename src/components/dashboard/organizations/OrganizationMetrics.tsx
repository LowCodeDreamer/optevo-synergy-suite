import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Target, FolderGit2, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const OrganizationMetrics = () => {
  const { data: metrics } = useQuery({
    queryKey: ["organization-metrics"],
    queryFn: async () => {
      const { data: organizations } = await supabase
        .from("organizations")
        .select(`
          *,
          contacts(count),
          opportunities(count),
          projects(count)
        `);

      const active = organizations?.filter(org => org.status === "active").length || 0;
      const total = organizations?.length || 0;
      const atRisk = organizations?.filter(org => org.status === "at_risk").length || 0;
      const leads = organizations?.filter(org => org.status === "lead").length || 0;

      return { active, total, atRisk, leads };
    },
  });

  const cards = [
    {
      title: "Total Organizations",
      value: metrics?.total || 0,
      icon: Building2,
    },
    {
      title: "Active Organizations",
      value: metrics?.active || 0,
      icon: Users,
    },
    {
      title: "At Risk",
      value: metrics?.atRisk || 0,
      icon: Target,
    },
    {
      title: "New Leads",
      value: metrics?.leads || 0,
      icon: FolderGit2,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};