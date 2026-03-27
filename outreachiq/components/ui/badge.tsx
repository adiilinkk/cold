import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-[#2563eb]/30 bg-[#2563eb]/10 text-[#60a5fa]",
        sent:
          "border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]",
        replied:
          "border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]",
        opened:
          "border-blue-400/30 bg-blue-400/10 text-blue-400",
        bounced:
          "border-red-400/30 bg-red-400/10 text-red-400",
        draft:
          "border-[#475569]/30 bg-[#475569]/10 text-[#475569]",
        outline:
          "border-[#1a2d4a] text-[#e2e8f0] bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
