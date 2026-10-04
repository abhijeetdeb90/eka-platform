// ==============================================================================
// EKA BRAND LOGO & EMBLEM — PRODUCTION CANONICAL
// ==============================================================================
// "ONE WITHIN. ONE WITH ALL."
// Ensures prominent, high-fidelity visual branding across all headers, footers,
// cockpit consoles, navigation bars, and cultural portals.
// ==============================================================================

import { useState } from "react";
import { cn } from "@/lib/utils";
import ekaLogoImg from "@/assets/brand/eka-logo.png";

export interface EkaLogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  taglineClassName?: string;
  withTagline?: boolean;
  taglineText?: string;
  useVector?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const SIZE_PRESETS = {
  xs: { mark: "size-6", text: "text-base tracking-[0.2em]", tag: "text-[8px]" },
  sm: { mark: "size-7", text: "text-lg tracking-[0.22em]", tag: "text-[8.5px]" },
  md: { mark: "size-8 sm:size-9", text: "text-xl sm:text-2xl tracking-[0.24em]", tag: "text-[9px]" },
  lg: { mark: "size-11 sm:size-12", text: "text-2xl sm:text-3xl tracking-[0.25em]", tag: "text-[10px]" },
  xl: { mark: "size-14 sm:size-16", text: "text-3xl sm:text-4xl tracking-[0.26em]", tag: "text-xs" },
};

/**
 * EKA Cultural Emblem (Mandala Mark)
 */
export function EkaMark({
  className,
  useVector = false,
  size = "md",
}: {
  className?: string;
  useVector?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const [imageError, setImageError] = useState(false);
  const sizeClass = SIZE_PRESETS[size].mark;

  if (!useVector && !imageError) {
    return (
      <img
        src={ekaLogoImg || "/brand/eka-logo.png"}
        alt="EKA Emblem"
        loading="eager"
        onError={() => setImageError(true)}
        className={cn(
          "rounded-full object-contain shrink-0 drop-shadow-sm select-none transition-transform duration-500 hover:scale-105",
          sizeClass,
          className
        )}
      />
    );
  }

  // High-fidelity fallback SVG mandala
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      role="img"
      aria-label="EKA Mandala Mark"
      className={cn("shrink-0 drop-shadow-sm", sizeClass, className)}
    >
      <circle cx="100" cy="100" r="96" className="fill-terracotta/10 stroke-terracotta/30" strokeWidth="1.5" />
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta">
        {Array.from({ length: 12 }, (_, i) => {
          const a = (2 * Math.PI * i) / 12;
          return (
            <circle
              key={`o${i}`}
              cx={100 + 42 * Math.cos(a)}
              cy={100 + 42 * Math.sin(a)}
              r="38"
              opacity="0.45"
            />
          );
        })}
        <circle cx="100" cy="100" r="78" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (2 * Math.PI * i) / 12;
          return (
            <circle
              key={`n${i}`}
              cx={100 + 78 * Math.cos(a)}
              cy={100 + 78 * Math.sin(a)}
              r="3.5"
              fill="currentColor"
              stroke="none"
            />
          );
        })}
        <circle cx="100" cy="100" r="34" />
        <circle cx="100" cy="100" r="27" />
        <circle cx="100" cy="90" r="5" fill="currentColor" />
        <path d="M86 112c0-8 6.3-14 14-14s14 6 14 14" strokeWidth="2" />
        <path d="M100 100v14" strokeWidth="2" />
      </g>
    </svg>
  );
}

/**
 * Canonical EKA Brand Logotype
 */
export function EkaLogo({
  className,
  markClassName,
  textClassName,
  taglineClassName,
  withTagline = false,
  taglineText = "One Within. One With All.",
  useVector = false,
  size = "md",
}: EkaLogoProps) {
  const currentSize = SIZE_PRESETS[size];

  return (
    <span
      className={cn(
        "group inline-flex items-center gap-2.5 sm:gap-3 select-none",
        className
      )}
    >
      <EkaMark
        useVector={useVector}
        size={size}
        className={cn(
          "transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-6",
          markClassName
        )}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-bold text-foreground tracking-[0.24em] transition-colors",
            currentSize.text,
            textClassName
          )}
        >
          EKA
        </span>
        {withTagline && (
          <span
            className={cn(
              "mt-1 font-mono uppercase tracking-[0.2em] text-muted-foreground/90 font-medium",
              currentSize.tag,
              taglineClassName
            )}
          >
            {taglineText}
          </span>
        )}
      </span>
    </span>
  );
}
