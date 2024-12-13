import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarButtonProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isCollapsed: boolean;
  onClick: () => void;
}

export const SidebarButton = ({
  icon: Icon,
  label,
  isCollapsed,
  onClick,
}: SidebarButtonProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "flex items-center w-full space-x-2 text-white/80 hover:text-white hover:bg-primary-foreground/10 rounded-lg p-3 transition-colors justify-start",
        isCollapsed && "justify-center px-0"
      )}
      onClick={onClick}
    >
      <Icon size={24} />
      {!isCollapsed && <span>{label}</span>}
    </Button>
  );
};