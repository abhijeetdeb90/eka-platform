import React from "react";
import { cn } from "@/lib/utils";

export type MaturityStatus = "LIVE" | "BETA" | "ROADMAP";

export interface ProductStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: MaturityStatus;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "badge" | "pill" | "subtle" | "ghost";
  showDot?: boolean;
  pulse?: boolean;
}

const statusConfig: Record<
  MaturityStatus,
  {
    label: string;
    description: string;
    dotColor: string;
    badgeStyle: string;
    subtleStyle: string;
    pillStyle: string;
  }
> = {
  LIVE: {
    label: "LIVE",
    description: "Production systems currently operational",
    dotColor: "bg-emerald-500",
    badgeStyle:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    subtleStyle: "text-emerald-700 dark:text-emerald-400 bg-emerald-500/5",
    pillStyle:
      "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-neutral-950 font-bold",
  },
  BETA: {
    label: "BETA",
    description: "Functional products currently being tested or rolled out",
    dotColor: "bg-amber-500",
    badgeStyle:
      "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30",
    subtleStyle: "text-amber-800 dark:text-amber-400 bg-amber-500/5",
    pillStyle:
      "bg-amber-600 text-white dark:bg-amber-400 dark:text-neutral-950 font-bold",
  },
  ROADMAP: {
    label: "ROADMAP",
    description: "Planned capabilities and future expansion",
    dotColor: "bg-purple-500",
    badgeStyle:
      "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
    subtleStyle: "text-purple-700 dark:text-purple-400 bg-purple-500/5",
    pillStyle:
      "bg-purple-600 text-white dark:bg-purple-400 dark:text-neutral-950 font-bold",
  },
};

const sizeClasses = {
  xs: "text-[10px] px-1.5 py-0.5 gap-1 font-mono tracking-wider",
  sm: "text-xs px-2 py-0.5 gap-1.5 font-mono tracking-wider",
  md: "text-xs px-2.5 py-1 gap-2 font-mono tracking-widest",
  lg: "text-sm px-3.5 py-1.5 gap-2.5 font-mono tracking-widest",
};

const dotSizes = {
  xs: "size-1.5",
  sm: "size-2",
  md: "size-2",
  lg: "size-2.5",
};

export function ProductStatus({
  status,
  size = "sm",
  variant = "badge",
  showDot = true,
  pulse = true,
  className,
  ...props
}: ProductStatusProps) {
  const config = statusConfig[status] || statusConfig.LIVE;

  let variantStyle = config.badgeStyle;
  if (variant === "subtle") variantStyle = config.subtleStyle;
  if (variant === "pill") variantStyle = config.pillStyle;
  if (variant === "ghost") variantStyle = "bg-transparent text-foreground border-transparent";

  return (
    <span
      role="status"
      aria-label={`Product maturity status: ${config.label} — ${config.description}`}
      title={`${config.label}: ${config.description}`}
      className={cn(
        "inline-flex items-center font-medium uppercase rounded-full border transition-all duration-200 select-none",
        sizeClasses[size],
        variantStyle,
        className
      )}
      {...props}
    >
      {showDot && (
        <span
          className={cn(
            "rounded-full shrink-0",
            dotSizes[size],
            config.dotColor,
            pulse && status === "LIVE" ? "animate-pulse" : ""
          )}
          aria-hidden="true"
        />
      )}
      <span className="font-semibold">{config.label}</span>
    </span>
  );
}
