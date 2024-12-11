import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { LayoutDashboard, Users, BrainCircuit } from "lucide-react";

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard title="Overview" className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center text-center md:text-left">
              <LayoutDashboard className="w-12 h-12 text-primary" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Welcome to Your Dashboard</h3>
                <p className="text-muted-foreground">
                  This is your command center for managing all aspects of your application.
                </p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Team Members">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-muted-foreground">Active Members</p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="AI Integration">
            <div className="flex items-center gap-4">
              <BrainCircuit className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">Active</p>
                <p className="text-muted-foreground">AI Status</p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="AI Assistant" className="col-span-1 md:col-span-2 lg:col-span-3">
            <AIAssistant />
          </DashboardCard>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;