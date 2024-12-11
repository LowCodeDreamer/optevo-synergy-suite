import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { BarChart, Users, BrainCircuit, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const stats = [
    { title: "Active Projects", value: "12", icon: TrendingUp, color: "text-blue-500" },
    { title: "Team Members", value: "8", icon: Users, color: "text-green-500" },
    { title: "AI Interactions", value: "156", icon: BrainCircuit, color: "text-purple-500" },
    { title: "Analytics", value: "+24%", icon: BarChart, color: "text-orange-500" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8">Welcome to Optevo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <DashboardCard key={stat.title} title={stat.title}>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stat.value}</span>
                <stat.icon className={cn("h-8 w-8", stat.color)} />
              </div>
            </DashboardCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardCard title="Recent Activity">
              <div className="h-[400px] flex items-center justify-center text-gray-500">
                Activity timeline will be displayed here
              </div>
            </DashboardCard>
          </div>
          
          <div className="lg:col-span-1">
            <AIAssistant />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;