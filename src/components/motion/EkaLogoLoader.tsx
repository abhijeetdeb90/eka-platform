// ==============================================================================
// EKA MOTION PRIMITIVE: EkaLogoLoader
// ==============================================================================
// Circular contemplative loading indicator inspired by traditional Indic sacred geometry.
// Represents the single unmanifest point (Bindu) expanding into the manifest universe (Mandala).
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
  label = "Gathering wisdom...",
  className,
}: EkaLogoLoaderProps) {
  const shouldReduceMotion = useReducedMotion();

  const dimension = {
    sm: 36,
    md: 56,
    lg: 84,
  }[size];

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 p-4", className)}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: dimension, height: dimension }}
      >
        {/* Outer Arc Ring */}
        <motion.div
          animate={
            shouldReduceMotion
              ? { opacity: 0.6 }
              : {
                  rotate: 360,
                }
          }
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-terracotta border-r-saffron/40"
        />

        {/* Counter-rotating Inner Arc */}
        <motion.div
          animate={
            shouldReduceMotion
              ? { opacity: 0.4 }
              : {
                  rotate: -360,
                }
          }
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-2 rounded-full border-2 border-transparent border-b-forest/80 border-l-amber-500/50"
        />

        {/* Pulsing Central Bindu */}
        <motion.div
          animate={
            shouldReduceMotion
              ? { scale: 1 }
              : {
                  scale: [0.8, 1.25, 0.8],
                  opacity: [0.6, 1, 0.6],
                }
          }
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="size-2.5 rounded-full bg-terracotta shadow-[0_0_12px_rgba(200,90,50,0.6)]"
        />
      </div>

      {label && (
        <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
}
