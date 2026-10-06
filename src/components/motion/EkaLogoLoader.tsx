// ==============================================================================
// EKA MOTION PRIMITIVE: EkaLogoLoader
// ==============================================================================
// Cultural Meridian loading indicator representing universal human connection.
// Choreography: "One Within -> One With All"
// 1. One point (individual consciousness & story)
// 2. Cultural pathways & meridians (human connection & dialogue)
// 3. Expanding global sphere (the world's shared cultural intelligence)
// ==============================================================================

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface EkaLogoLoaderProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function EkaLogoLoader({
  size = "md",
  label = "Connecting cultural intelligence...",
  className,
}: EkaLogoLoaderProps) {
  const shouldReduceMotion = useReducedMotion();

  const dimension = {
    sm: 36,
    md: 56,
    lg: 84,
  }[size];

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 p-4 select-none", className)}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: dimension, height: dimension }}
        role="status"
        aria-label={label || "Loading"}
      >
        {/* 1. Outer Global Meridian Ring: Smooth, authoritative orbital rotation */}
        <motion.div
          animate={
            shouldReduceMotion
              ? { opacity: 0.8 }
              : {
                  rotate: 360,
                }
          }
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 rounded-full border-2 border-border/40 border-t-terracotta border-r-foreground/30"
        />

        {/* 2. Longitudinal Meridian Arc: Intersecting cultural pathway */}
        <motion.div
          animate={
            shouldReduceMotion
              ? { opacity: 0.5 }
              : {
                  rotate: -360,
                  scale: [0.94, 1.04, 0.94],
                }
          }
          transition={{
            rotate: { duration: 3.2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute inset-1.5 rounded-full border border-dashed border-terracotta/40 border-b-foreground/60"
        />

        {/* 3. The "One Within" Focal Nucleus: Radiant, steady human consciousness pulse */}
        <motion.div
          animate={
            shouldReduceMotion
              ? { scale: 1 }
              : {
                  scale: [0.85, 1.2, 0.85],
                  opacity: [0.75, 1, 0.75],
                }
          }
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="size-2.5 rounded-full bg-terracotta shadow-[0_0_10px_rgba(194,94,62,0.5)]"
        />
      </div>

      {label && (
        <p className="text-xs font-mono tracking-wider uppercase text-muted-foreground animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
}
