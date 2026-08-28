import {
  LayoutDashboard,
  CheckSquare,
  List,
  Clock,
  Inbox,
  CalendarDays,
  ShoppingBag,
  Settings,
  HelpCircle,
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
  { label: "My Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Lists", href: "/lists", icon: List },
  { label: "Attendance", href: "/attendance", icon: Clock },
  { label: "Requests", href: "/requests", icon: Inbox },
  { label: "Shifts", href: "/shifts", icon: CalendarDays },
  { label: "Store", href: "/store", icon: ShoppingBag, isGroupEnd: true },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Support", href: "/support", icon: HelpCircle },
];
