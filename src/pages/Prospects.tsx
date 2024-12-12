import { ProspectList } from "@/components/dashboard/ProspectList";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

const Prospects = () => {
  return (
    <div className="flex-1 p-6 overflow-auto ml-16">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Prospects</h1>
      
      <div className="grid gap-6">
        <DashboardCard title="Prospect Management" className="col-span-1">
          <ProspectList />
        </DashboardCard>
      </div>
    </div>
  );
};

export default Prospects;