// ==============================================================================
// EKA DESIGN SYSTEM: MOTION TOKENS & ANIMATION VARIANTS
// ==============================================================================
// Powered exclusively by Motion for React (`motion/react`)
// Philosophy: "ONE WITHIN. ONE WITH ALL."
// Calm, intentional, editorial choreography reflecting contemplative Indic aesthetics.
// Respects `prefers-reduced-motion` across all components.
// ==============================================================================

import type { Variants, Transition } from "motion/react";

/**
 * Standard duration tokens (in seconds)
 */
export const durations = {
  instant: 0.08,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  deliberate: 0.8,
  contemplative: 1.4,
} as const;

/**
 * Custom Bezier curves and Spring dynamics
 */
export const easings = {
  // Editorial smooth entry/exit
  standard: [0.2, 0.0, 0.0, 1.0] as [number, number, number, number],
  // Responsive tactile feel with deceleration
  emphasized: [0.05, 0.7, 0.1, 1.0] as [number, number, number, number],
  // Gentle exit
  anticipate: [0.38, 0.005, 0.215, 1.0] as [number, number, number, number],
  // Spring configurations for tactile controls
  spring: {
    type: "spring",
    stiffness: 380,
    damping: 26,
    mass: 0.8,
  } as Transition,
  gentle: {
    type: "spring",
    stiffness: 140,
    damping: 18,
    mass: 1.0,
  } as Transition,
  bouncy: {
    type: "spring",
    stiffness: 420,
    damping: 14,
  } as Transition,
  sacredOrbit: {
    ease: "linear",
    repeat: Infinity,
    duration: 36,
  } as Transition,
} as const;

/**
 * Common Transitions
 */
export const transitions = {
  fast: {
    duration: durations.fast,
    ease: easings.standard,
  } as Transition,
  normal: {
    duration: durations.normal,
    ease: easings.standard,
  } as Transition,
  slow: {
    duration: durations.slow,
    ease: easings.emphasized,
  } as Transition,
  spring: easings.spring,
  gentle: easings.gentle,
};

/**
 * Reusable Animation Variants
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.fast,
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: transitions.fast,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: easings.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: transitions.fast,
  },
};

export const scaleOut: Variants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: easings.gentle,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.fast,
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: easings.spring,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: transitions.fast,
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: easings.spring,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: transitions.fast,
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    transition: transitions.normal,
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: easings.spring,
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: { duration: durations.fast },
  },
};

export const buttonPress = {
  rest: { scale: 1 },
  hover: { scale: 1.03 },
  tap: { scale: 0.96 },
};

export const pillSelect = {
  unselected: {
    scale: 1,
    opacity: 0.85,
  },
  selected: {
    scale: 1.04,
    opacity: 1,
    transition: easings.spring,
  },
};

export const progressiveAccordion: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
    transition: {
      height: { duration: durations.normal, ease: easings.standard },
      opacity: { duration: durations.fast },
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    overflow: "visible",
    transition: {
      height: { duration: durations.slow, ease: easings.emphasized },
      opacity: { duration: durations.normal, delay: 0.06 },
    },
  },
};

export const deepstashAccordion: Variants = progressiveAccordion;
