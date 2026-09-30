// ==============================================================================
// EKA MOTION PRIMITIVE: StaggerContainer
// ==============================================================================
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { staggerContainer } from "@/lib/tokens/motion";

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.07,
  initialDelay = 0.05,
  className,
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
