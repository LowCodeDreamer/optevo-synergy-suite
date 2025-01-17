import { 
  LayoutDashboard, 
  BrainCircuit,
  Users, 
  BarChart, 
  Settings,
  Briefcase,
  Building2,
  Contact,
  Target
} from "lucide-react";

export const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Prospects", href: "/prospects" },
  { icon: Building2, label: "Organizations", href: "/organizations" },
  { icon: Contact, label: "Contacts", href: "/contacts" },
  { icon: Target, label: "Opportunities", href: "/opportunities" },
  { icon: Briefcase, label: "Projects", href: "/projects" },
  { icon: BrainCircuit, label: "AI Assistant", href: "/assistant" },
  { icon: BarChart, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];