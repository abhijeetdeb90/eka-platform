// ==============================================================================
// EKA MOTION PRIMITIVE: AnimatedCard
// ==============================================================================
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { easings } from "@/lib/tokens/motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverScale?: number;
  hoverY?: number;
  tapScale?: number;
}

export function AnimatedCard({
  children,
  className,
  onClick,
  hoverScale = 1.015,
  hoverY = -4,
  tapScale = 0.985,
}: AnimatedCardProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div onClick={onClick} className={cn("relative transition-colors", className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      whileHover={{
        scale: hoverScale,
        y: hoverY,
        transition: easings.spring,
      }}
      whileTap={{
        scale: tapScale,
        transition: { duration: 0.1 },
      }}
      className={cn("relative group cursor-pointer will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
