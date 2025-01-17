import { OrganizationMetrics } from "./OrganizationMetrics";
import { OrganizationChart } from "./OrganizationChart";

export const ManagementView = () => {
  return (
    <div className="space-y-4">
      <OrganizationMetrics />
      <OrganizationChart />
    </div>
  );
};