// ==============================================================================
// EKA FEEDBACK PRIMITIVE: EmptyState
// ==============================================================================
import React from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Compass, RefreshCw } from "lucide-react";
import { Pressable } from "@/components/motion/Pressable";
import { ConnectionOrbit } from "@/components/motion/ConnectionOrbit";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  showOrbit?: boolean;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel = "Explore Discovery Feed",
  actionTo = "/observe",
  onAction,
  icon: Icon = Compass,
  showOrbit = true,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl border border-dashed border-border/80 bg-card/40 backdrop-blur-xs overflow-hidden my-6",
        className
      )}
    >
      {/* Background Sacred Orbit Motif */}
      {showOrbit && (
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <ConnectionOrbit size={260} orbitCount={2} />
        </div>
      )}

      {/* Central Icon */}
      <div className="relative z-10 size-16 rounded-full bg-sand-warm dark:bg-stone-800/80 border border-terracotta/30 flex items-center justify-center text-terracotta mb-4 shadow-calm">
        <Icon className="size-7 stroke-[1.8]" />
      </div>

      <h3 className="relative z-10 font-serif text-xl sm:text-2xl font-normal text-foreground">
        {title}
      </h3>

      <p className="relative z-10 mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Primary Action Button */}
      {(actionLabel && (actionTo || onAction)) && (
        <div className="relative z-10 mt-6">
          {actionTo ? (
            <Link to={actionTo}>
              <Pressable className="px-5 py-2.5 rounded-full bg-terracotta hover:bg-terracotta-dark text-white font-mono text-xs uppercase tracking-wider shadow-calm flex items-center gap-2">
                <Sparkles className="size-3.5" />
                {actionLabel}
              </Pressable>
            </Link>
          ) : (
            <Pressable
              onClick={onAction}
              className="px-5 py-2.5 rounded-full bg-terracotta hover:bg-terracotta-dark text-white font-mono text-xs uppercase tracking-wider shadow-calm flex items-center gap-2"
            >
              <RefreshCw className="size-3.5" />
              {actionLabel}
            </Pressable>
          )}
        </div>
      )}
    </div>
  );
}
