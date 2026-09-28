import { motion, type HTMLMotionProps, type Variants } from "motion/react";
import React, { type ReactNode } from "react";

// Check reduced motion safely for initial/animation settings
const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --- Fade In -------------------------------------------------------------
export interface FadeInProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
  viewportOnce?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.55,
  direction = "up",
  distance = 18,
  className = "",
  viewportOnce = true,
  ...props
}: FadeInProps) {
  const getInitial = () => {
    if (prefersReduced()) return { opacity: 0 };
    switch (direction) {
      case "up":
        return { opacity: 0, y: distance };
      case "down":
        return { opacity: 0, y: -distance };
      case "left":
        return { opacity: 0, x: distance };
      case "right":
        return { opacity: 0, x: -distance };
      case "none":
      default:
        return { opacity: 0 };
    }
  };

  const getTarget = () => {
    if (prefersReduced()) return { opacity: 1 };
    switch (direction) {
      case "up":
      case "down":
        return { opacity: 1, y: 0 };
      case "left":
      case "right":
        return { opacity: 1, x: 0 };
      case "none":
      default:
        return { opacity: 1 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getTarget()}
      viewport={{ once: viewportOnce, margin: "-30px" }}
      transition={{
        duration: prefersReduced() ? 0.01 : duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// --- Stagger Container & Items ------------------------------------------
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: (staggerDelay = 0.07) => ({
    opacity: 1,
    transition: {
      staggerChildren: prefersReduced() ? 0 : staggerDelay,
      delayChildren: 0.05,
    },
  }),
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: prefersReduced() ? 0 : 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: prefersReduced() ? 0.01 : 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function StaggerGroup({
  children,
  staggerDelay = 0.07,
  className = "",
  viewportOnce = true,
  ...props
}: HTMLMotionProps<"div"> & { staggerDelay?: number; viewportOnce?: boolean }) {
  return (
    <motion.div
      variants={containerVariants}
      custom={staggerDelay}
      initial="hidden"
      whileInView="show"
      viewport={{ once: viewportOnce, margin: "-40px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "", ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
}

// --- Hover Lift Card ----------------------------------------------------
export function HoverLiftCard({
  children,
  className = "",
  lift = 4,
  scale = 1.008,
  ...props
}: HTMLMotionProps<"div"> & { lift?: number; scale?: number }) {
  const isReduced = prefersReduced();
  return (
    <motion.div
      {...(!isReduced
        ? {
            whileHover: {
              y: -lift,
              scale,
              transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
            },
            whileTap: { scale: 0.99 },
          }
        : {})}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// --- Tactile Button Micro-Interaction -----------------------------------
export function TactileWrapper({
  children,
  className = "",
  scaleTap = 0.97,
  scaleHover = 1.02,
}: {
  children: ReactNode;
  className?: string;
  scaleTap?: number;
  scaleHover?: number;
}) {
  if (prefersReduced()) {
    return <span className={className}>{children}</span>;
  }
  return (
    <motion.span
      className={`inline-flex items-center justify-center ${className}`}
      whileHover={{ scale: scaleHover }}
      whileTap={{ scale: scaleTap }}
      transition={{ type: "spring", stiffness: 450, damping: 26 }}
    >
      {children}
    </motion.span>
  );
}

// --- Page Transition Wrapper --------------------------------------------
export function PageTransition({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={prefersReduced() ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReduced() ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
