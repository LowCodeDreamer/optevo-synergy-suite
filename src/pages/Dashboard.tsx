import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ProspectList } from "@/components/dashboard/ProspectList";
import { ProspectingForm } from "@/components/dashboard/ProspectingForm";
import { LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
      }
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Dashboard</h1>
        
        <div className="grid gap-6">
          <DashboardCard title="AI Prospecting" className="col-span-1">
            <ProspectingForm />
          </DashboardCard>

          <DashboardCard title="Prospects" className="col-span-1">
            <ProspectList />
          </DashboardCard>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;