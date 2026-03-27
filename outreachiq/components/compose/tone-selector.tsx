"use client";

import { cn } from "@/lib/utils";
import {
  Zap,
  Heart,
  Laugh,
  Crown,
  Lightbulb,
  Flame,
} from "lucide-react";

const TONES = [
  {
    id: "Direct",
    label: "Direct",
    description: "No fluff, straight to value",
    icon: Zap,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    borderHover: "hover:border-blue-400/50",
    activeClass: "border-blue-400/60 bg-blue-400/10",
  },
  {
    id: "Warm",
    label: "Warm",
    description: "Friendly and genuine",
    icon: Heart,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    borderHover: "hover:border-pink-400/50",
    activeClass: "border-pink-400/60 bg-pink-400/10",
  },
  {
    id: "Witty",
    label: "Witty",
    description: "Clever and memorable",
    icon: Laugh,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    borderHover: "hover:border-yellow-400/50",
    activeClass: "border-yellow-400/60 bg-yellow-400/10",
  },
  {
    id: "Executive",
    label: "Executive",
    description: "Polished peer-to-peer",
    icon: Crown,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    borderHover: "hover:border-purple-400/50",
    activeClass: "border-purple-400/60 bg-purple-400/10",
  },
  {
    id: "Consultative",
    label: "Consultative",
    description: "Insights-driven, advisory",
    icon: Lightbulb,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    borderHover: "hover:border-cyan-400/50",
    activeClass: "border-cyan-400/60 bg-cyan-400/10",
  },
  {
    id: "Bold",
    label: "Bold",
    description: "Confident, pattern-interrupting",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    borderHover: "hover:border-orange-400/50",
    activeClass: "border-orange-400/60 bg-orange-400/10",
  },
];

interface ToneSelectorProps {
  value: string;
  onChange: (tone: string) => void;
}

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {TONES.map((tone) => {
        const Icon = tone.icon;
        const isActive = value === tone.id;

        return (
          <button
            key={tone.id}
            type="button"
            onClick={() => onChange(tone.id)}
            className={cn(
              "flex flex-col items-start gap-2 p-4 rounded-xl border border-[#1a2d4a] transition-all duration-150 text-left",
              tone.borderHover,
              isActive ? tone.activeClass : "bg-[#0a1628] hover:bg-[#0d1e38]"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg",
                tone.bg
              )}
            >
              <Icon className={cn("h-4 w-4", tone.color)} />
            </div>
            <div>
              <p
                className={cn(
                  "text-sm font-semibold",
                  isActive ? "text-[#e2e8f0]" : "text-[#94a3b8]"
                )}
              >
                {tone.label}
              </p>
              <p className="text-xs text-[#475569] mt-0.5">{tone.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
