// ==============================================================================
// EKA MOTION PRIMITIVE: Expandable
// ==============================================================================
import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { deepstashAccordion } from "@/lib/tokens/motion";
import { cn } from "@/lib/utils";

interface ExpandableProps {
  isExpanded: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Expandable({
  isExpanded,
  children,
  className,
  id,
}: ExpandableProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    if (!isExpanded) return null;
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          id={id}
          key="expandable-content"
          variants={deepstashAccordion}
          initial="collapsed"
          animate="expanded"
          exit="collapsed"
          className={cn("overflow-hidden", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
