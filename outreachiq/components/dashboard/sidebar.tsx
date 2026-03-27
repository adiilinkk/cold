"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PenLine,
  History,
  Settings,
  Zap,
} from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/dashboard/compose",
    label: "Compose",
    icon: PenLine,
  },
  {
    href: "/dashboard/history",
    label: "History",
    icon: History,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-[#050d1a] border-r border-[#1a2d4a]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-[#1a2d4a]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2563eb] shadow-[0_0_20px_rgba(37,99,235,0.4)]">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-[#e2e8f0] text-lg tracking-tight">
          OutreachIQ
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[#2563eb]/15 text-[#60a5fa] border border-[#2563eb]/25"
                  : "text-[#475569] hover:text-[#e2e8f0] hover:bg-[#0a1628]"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-[#2563eb]" : ""
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#1a2d4a]">
        <p className="text-xs text-[#1a2d4a] font-medium">OutreachIQ v1.0</p>
      </div>
    </aside>
  );
}
