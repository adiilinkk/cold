"use client";

import { cn } from "@/lib/utils";
import { Calendar, MessageCircle, BookOpen, Handshake } from "lucide-react";

const GOALS = [
  {
    id: "Book a demo",
    label: "Book a Demo",
    description: "Get them on a 15-min call",
    icon: Calendar,
    color: "text-[#2563eb]",
    bg: "bg-[#2563eb]/10",
    activeClass: "border-[#2563eb]/60 bg-[#2563eb]/10",
    borderHover: "hover:border-[#2563eb]/40",
  },
  {
    id: "Start a conversation",
    label: "Start Conversation",
    description: "Open a dialogue, low friction",
    icon: MessageCircle,
    color: "text-[#22c55e]",
    bg: "bg-[#22c55e]/10",
    activeClass: "border-[#22c55e]/60 bg-[#22c55e]/10",
    borderHover: "hover:border-[#22c55e]/40",
  },
  {
    id: "Share a resource",
    label: "Share Resource",
    description: "Provide value, build trust",
    icon: BookOpen,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    activeClass: "border-amber-400/60 bg-amber-400/10",
    borderHover: "hover:border-amber-400/40",
  },
  {
    id: "Partnership pitch",
    label: "Partnership Pitch",
    description: "Mutual collaboration proposal",
    icon: Handshake,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    activeClass: "border-purple-400/60 bg-purple-400/10",
    borderHover: "hover:border-purple-400/40",
  },
];

interface GoalSelectorProps {
  value: string;
  onChange: (goal: string) => void;
}

export function GoalSelector({ value, onChange }: GoalSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {GOALS.map((goal) => {
        const Icon = goal.icon;
        const isActive = value === goal.id;

        return (
          <button
            key={goal.id}
            type="button"
            onClick={() => onChange(goal.id)}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border border-[#1a2d4a] transition-all duration-150 text-left",
              goal.borderHover,
              isActive ? goal.activeClass : "bg-[#0a1628] hover:bg-[#0d1e38]"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
                goal.bg
              )}
            >
              <Icon className={cn("h-4 w-4", goal.color)} />
            </div>
            <div>
              <p
                className={cn(
                  "text-sm font-semibold",
                  isActive ? "text-[#e2e8f0]" : "text-[#94a3b8]"
                )}
              >
                {goal.label}
              </p>
              <p className="text-xs text-[#475569] mt-0.5">
                {goal.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
