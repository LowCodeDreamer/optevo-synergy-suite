import { ProspectList } from "@/components/dashboard/ProspectList";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { AIAssistant } from "@/components/dashboard/AIAssistant";

const Prospects = () => {
  return (
    <div className="flex-1 p-6 overflow-auto">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Prospects</h1>
      
      <div className="grid gap-6">
        <DashboardCard title="AI Assistant" className="col-span-1">
          <AIAssistant />
        </DashboardCard>

        <DashboardCard title="Prospect Management" className="col-span-1">
          <ProspectList />
        </DashboardCard>
      </div>
    </div>
  );
};

export default Prospects;