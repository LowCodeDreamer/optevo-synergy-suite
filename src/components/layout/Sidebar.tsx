import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BrainCircuit,
  Users, 
  BarChart, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: BrainCircuit, label: "AI Assistant", href: "/assistant" },
    { icon: Users, label: "Team", href: "/team" },
    { icon: BarChart, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className={cn(
      "h-screen bg-primary p-4 transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="flex justify-between items-center mb-8">
        {!isCollapsed && (
          <h1 className="text-white text-xl font-bold">Optevo</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:bg-primary/50"
        >
          {isCollapsed ? <Menu /> : <X />}
        </Button>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center space-x-2 text-white/80 hover:text-white hover:bg-primary-foreground/10 rounded-lg p-3 transition-colors"
          >
            <item.icon size={24} />
            {!isCollapsed && <span>{item.label}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
};