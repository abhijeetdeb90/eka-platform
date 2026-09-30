// ==============================================================================
// EKA MOTION PRIMITIVE: ConnectionOrbit
// ==============================================================================
// Signature visual motif for "ONE WITHIN. ONE WITH ALL."
// Concentric orbital rings with rotating nodes representing interconnected
// lineages, communities, crafts, and ideas.
// ==============================================================================

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface ConnectionOrbitProps {
  size?: number;
  className?: string;
  showNodes?: boolean;
  orbitCount?: number;
}

export function ConnectionOrbit({
  size = 320,
  className,
  showNodes = true,
  orbitCount = 3,
}: ConnectionOrbitProps) {
  const shouldReduceMotion = useReducedMotion();

  const radiusStep = size / (orbitCount * 2 + 1.5);

  return (
    <div
      className={cn("relative flex items-center justify-center select-none pointer-events-none", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Central Radiance (Bindu / Core of One Within) */}
      <motion.div
        animate={
          shouldReduceMotion
            ? { scale: 1, opacity: 0.8 }
            : {
                scale: [1, 1.15, 1],
                opacity: [0.75, 1, 0.75],
              }
        }
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute z-10 size-4 rounded-full bg-gradient-to-tr from-terracotta to-saffron shadow-[0_0_24px_rgba(200,90,50,0.55)] border border-white/40"
      />

      {/* Dynamic Concentric Orbit Rings */}
      {Array.from({ length: orbitCount }).map((_, index) => {
        const ringRadius = (index + 1) * radiusStep;
        const ringDiameter = ringRadius * 2;
        const duration = 24 + index * 12;
        const isClockwise = index % 2 === 0;

        return (
          <div
            key={index}
            className="absolute rounded-full border border-terracotta/20 dark:border-terracotta/15"
            style={{
              width: ringDiameter,
              height: ringDiameter,
            }}
          >
            {/* Rotating Orbital Track with Planetary Nodes */}
            {showNodes && (
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        rotate: isClockwise ? 360 : -360,
                      }
                }
                transition={{
                  duration,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-full h-full relative"
              >
                {/* Node along the perimeter */}
                <div
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 size-3 rounded-full bg-sand-warm dark:bg-amber-100/90 border border-terracotta/60 shadow-xs"
                />

                {/* Sub-node at 180 degrees */}
                <div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rounded-full bg-terracotta/60 border border-saffron/40"
                />
              </motion.div>
            )}
          </div>
        );
      })}

      {/* Subtle Indic Astrological Ray Accent */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15 text-terracotta dark:text-amber-200"
        viewBox={`0 0 ${size} ${size}`}
      >
        <line
          x1={size / 2}
          y1="0"
          x2={size / 2}
          y2={size}
          stroke="currentColor"
          strokeDasharray="4 6"
          strokeWidth="0.75"
        />
        <line
          x1="0"
          y1={size / 2}
          x2={size}
          y2={size / 2}
          stroke="currentColor"
          strokeDasharray="4 6"
          strokeWidth="0.75"
        />
      </svg>
    </div>
  );
}
