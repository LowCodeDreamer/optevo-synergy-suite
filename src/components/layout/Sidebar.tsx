
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';
import { menuItems } from './sidebar/SidebarItems';
import { SidebarButton } from './sidebar/SidebarButton';

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={cn(
      "h-screen bg-primary transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex justify-between items-center p-4 mb-8">
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

      <nav className="space-y-2 px-2">
        {menuItems.map((item) => (
          <SidebarButton
            key={item.label}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isCollapsed={isCollapsed}
            onClick={() => navigate(item.href)}
          />
        ))}
      </nav>
    </div>
  );
};
