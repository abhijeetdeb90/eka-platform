// ==============================================================================
// EKA MOTION PRIMITIVE: Pressable
// ==============================================================================
import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { buttonPress } from "@/lib/tokens/motion";
import { cn } from "@/lib/utils";

interface PressableProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
  scaleDown?: number;
  scaleUp?: number;
  as?: "button" | "div" | "span";
  role?: string;
  "aria-label"?: string;
}

export function Pressable({
  children,
  onClick,
  className,
  disabled = false,
  scaleDown = 0.95,
  scaleUp = 1.02,
  as = "button",
  role,
  "aria-label": ariaLabel,
}: PressableProps) {
  const shouldReduceMotion = useReducedMotion();

  const customPressVariants = {
    rest: { scale: 1 },
    hover: shouldReduceMotion ? { scale: 1 } : { scale: scaleUp },
    tap: shouldReduceMotion ? { scale: 1 } : { scale: scaleDown },
  };

  const Component = as === "div" ? motion.div : as === "span" ? motion.span : motion.button;

  return (
    <Component
      variants={customPressVariants}
      initial="rest"
      whileHover={disabled ? "rest" : "hover"}
      whileTap={disabled ? "rest" : "tap"}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      role={role}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center select-none outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      {children}
    </Component>
  );
}
