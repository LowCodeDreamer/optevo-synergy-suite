import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ContactChartProps {
  contacts: (Tables<"contacts"> & {
    organization: { name: string } | null;
  })[];
}

export const ContactChart = ({ contacts }: ContactChartProps) => {
  // Group contacts by organization
  const organizationStats = contacts.reduce((acc, contact) => {
    const orgName = contact.organization?.name || "Unassigned";
    acc[orgName] = (acc[orgName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(organizationStats)
    .map(([name, count]) => ({
      name: name.length > 20 ? name.substring(0, 20) + "..." : name,
      contacts: count,
    }))
    .sort((a, b) => b.contacts - a.contacts)
    .slice(0, 10);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Contacts by Organization</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="contacts" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};