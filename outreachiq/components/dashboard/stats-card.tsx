import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  trendUp?: boolean;
  loading?: boolean;
  accentColor?: "blue" | "green" | "purple";
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendUp,
  loading,
  accentColor = "blue",
}: StatsCardProps) {
  const colors = {
    blue: {
      icon: "text-[#2563eb]",
      bg: "bg-[#2563eb]/10",
      border: "hover:border-[#2563eb]/40 hover:shadow-glow-blue",
    },
    green: {
      icon: "text-[#22c55e]",
      bg: "bg-[#22c55e]/10",
      border: "hover:border-[#22c55e]/40 hover:shadow-glow-green",
    },
    purple: {
      icon: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "hover:border-purple-400/40",
    },
  };

  const c = colors[accentColor];

  if (loading) {
    return (
      <Card className="border-[#1a2d4a]">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "border-[#1a2d4a] transition-all duration-200 cursor-default",
        c.border
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-[#475569] font-medium">{title}</p>
            <p className="text-3xl font-bold text-[#e2e8f0] tracking-tight">
              {value}
            </p>
            {description && (
              <p className="text-xs text-[#475569]">{description}</p>
            )}
            {trend && (
              <p
                className={cn(
                  "text-xs font-medium",
                  trendUp ? "text-[#22c55e]" : "text-red-400"
                )}
              >
                {trendUp ? "↑" : "↓"} {trend}
              </p>
            )}
          </div>
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl",
              c.bg
            )}
          >
            <Icon className={cn("h-5 w-5", c.icon)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
