// ==============================================================================
// EKA MOTION PRIMITIVE: FadeIn
// ==============================================================================
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, fadeDown, slideInLeft, slideInRight, fadeIn, transitions } from "@/lib/tokens/motion";

interface FadeInProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration,
  className,
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const getVariants = () => {
    switch (direction) {
      case "up":
        return fadeUp;
      case "down":
        return fadeDown;
      case "left":
        return slideInLeft;
      case "right":
        return slideInRight;
      case "none":
      default:
        return fadeIn;
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={getVariants()}
      transition={{
        ...transitions.normal,
        ...(duration ? { duration } : {}),
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
