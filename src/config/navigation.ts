import {
  LayoutDashboard,
  Users,
  Briefcase,
  Shield,
  Gift,
  Coins,
  MapPin,
  Inbox,
  Clock,
  Banknote,
  Building2,
  Calendar,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  isGroupEnd?: boolean;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Attendance Profiles", href: "/attendance-profiles", icon: Users },
  { label: "Employees", href: "/employees", icon: Users },
  { label: "Job Management", href: "/job-management", icon: Briefcase },
  { label: "Role Based", href: "/roles", icon: Shield },
  { label: "Reward Management", href: "/rewards", icon: Gift },
  { label: "Points Management", href: "/points", icon: Coins },
  { label: "Site Management", href: "/sites", icon: MapPin },
  { label: "Request Management", href: "/requests", icon: Inbox },
  { label: "Time & Attendance", href: "/time-attendance", icon: Clock },
  { label: "Payroll", href: "/payroll", icon: Banknote, isGroupEnd: true },
  
  { label: "Business Setting", href: "/business-settings", icon: Building2 },
  { label: "Scheduling", href: "/scheduling", icon: Calendar },
  { label: "Settings", href: "/settings", icon: Settings },
];
