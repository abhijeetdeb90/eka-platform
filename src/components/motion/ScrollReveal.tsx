// ==============================================================================
// EKA MOTION PRIMITIVE: ScrollReveal
// ==============================================================================
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, transitions } from "@/lib/tokens/motion";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  threshold = 0.15,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      variants={fadeUp}
      transition={{
        ...transitions.slow,
        delay,
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
