// ==============================================================================
// EKA BRAND LOGO & EMBLEM — PRODUCTION CANONICAL
// ==============================================================================
// "THE WORLD'S TRUSTED CULTURAL INTELLIGENCE LAYER"
// "ONE WITHIN. ONE WITH ALL."
// Ensures universal, authoritative visual branding across all headers, footers,
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
  betaClassName?: string;
  withTagline?: boolean;
  withBeta?: boolean;
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
 * EKA Cultural Meridian Mark ("One Within. One With All.")
 * Represents the global commons of humanity, the cartographic meridian,
 * the documentary aperture of cultural discovery, and the central focal core of consciousness.
 */
export function EkaMark({
  className,
  useVector = true,
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
        src={ekaLogoImg || "/brand/logo-symbol.svg"}
        alt="EKA Cultural Meridian Emblem"
        loading="eager"
        onError={() => setImageError(true)}
        className={cn(
          "rounded-full object-contain shrink-0 drop-shadow-xs select-none transition-transform duration-500 hover:scale-105",
          sizeClass,
          className
        )}
      />
    );
  }

  // Canonical Vector SVG Cultural Meridian
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-label="EKA Cultural Meridian Emblem"
      className={cn("shrink-0 select-none drop-shadow-xs transition-transform duration-500", sizeClass, className)}
    >
      <defs>
        <linearGradient id="ekaVectorCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C25E3E" />
          <stop offset="100%" stopColor="#9E472A" />
        </linearGradient>
        <mask id="ekaVectorMask">
          <rect width="100" height="100" fill="#FFFFFF" />
          <circle cx="50" cy="50" r="15" fill="#000000" />
        </mask>
      </defs>

      {/* Outer Global Boundary Ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="currentColor"
        strokeWidth="4"
        className="text-foreground/85 dark:text-foreground/90"
      />

      {/* Interior Masked Cultural Meridians */}
      <g
        mask="url(#ekaVectorMask)"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="text-foreground/75 dark:text-foreground/80"
      >
        {/* The Shared Human Horizon (Equator) */}
        <line x1="6" y1="50" x2="94" y2="50" />
        {/* Prime Cultural Meridians */}
        <path d="M 50 6 C 68 22, 68 78, 50 94" />
        <path d="M 50 6 C 32 22, 32 78, 50 94" />
      </g>

      {/* Cardinal Meridian Nodes */}
      <circle cx="50" cy="6" r="2.5" fill="#C25E3E" />
      <circle cx="94" cy="50" r="2.5" fill="#C25E3E" />
      <circle cx="50" cy="94" r="2.5" fill="#C25E3E" />
      <circle cx="6" cy="50" r="2.5" fill="#C25E3E" />

      {/* The "One Within" Focal Core: Radiant Terracotta Beacon */}
      <circle cx="50" cy="50" r="9" fill="url(#ekaVectorCoreGrad)" />
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
  betaClassName,
  withTagline = false,
  withBeta = false,
  taglineText = "Cultural Intelligence",
  useVector = true,
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
        <span className="inline-flex items-center gap-2">
          <span
            className={cn(
              "font-display font-bold text-foreground tracking-[0.24em] transition-colors",
              currentSize.text,
              textClassName
            )}
          >
            EKA
          </span>
          {withBeta && (
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8.5px] font-mono font-semibold uppercase tracking-widest border border-border/80 bg-accent/60 text-muted-foreground leading-none shrink-0 select-none",
                betaClassName
              )}
            >
              BETA
            </span>
          )}
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
