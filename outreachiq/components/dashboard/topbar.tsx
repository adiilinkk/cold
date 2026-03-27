"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, Zap, Menu } from "lucide-react";
import Link from "next/link";

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="h-16 border-b border-[#1a2d4a] bg-[#050d1a]/80 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-6">
      {/* Mobile Logo */}
      <div className="flex items-center gap-3">
        <div className="flex md:hidden items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#2563eb]">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold text-[#e2e8f0] text-base">OutreachIQ</span>
        </div>
        {title && (
          <h1 className="hidden md:block text-base font-semibold text-[#e2e8f0]">
            {title}
          </h1>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 hover:bg-[#0a1628] transition-colors border border-transparent hover:border-[#1a2d4a]">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white text-xs font-bold shrink-0">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-[#e2e8f0] leading-none">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-[#475569] mt-0.5">
                  {user?.email}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52 bg-[#0a1628] border border-[#1a2d4a] text-[#e2e8f0]"
          >
            <div className="px-3 py-2 border-b border-[#1a2d4a]">
              <p className="text-sm font-medium text-[#e2e8f0]">
                {user?.name}
              </p>
              <p className="text-xs text-[#475569] mt-0.5">{user?.email}</p>
            </div>
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-[#1a2d4a] focus:bg-[#1a2d4a] mt-1">
              <Link href="/dashboard/settings" className="flex items-center gap-2 text-sm">
                <Settings className="h-3.5 w-3.5 text-[#475569]" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#1a2d4a]" />
            <DropdownMenuItem
              className="cursor-pointer hover:bg-[#1a2d4a] focus:bg-[#1a2d4a] text-red-400 hover:text-red-300 focus:text-red-300"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-3.5 w-3.5 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
