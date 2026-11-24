import { LayoutDashboard, History, Bell, Activity, Settings, Info } from "lucide-react";

export const navItems = [
  { href: "/", label: "Overview", short: "Overview", icon: LayoutDashboard },
  { href: "/history", label: "Event History", short: "History", icon: History },
  { href: "/notifications", label: "Notifications", short: "Alerts", icon: Bell },
  { href: "/system", label: "System Status", short: "System", icon: Activity },
  { href: "/settings", label: "Settings", short: "Settings", icon: Settings },
  { href: "/about", label: "About", short: "About", icon: Info },
];

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}