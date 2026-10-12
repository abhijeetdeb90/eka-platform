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
        alt="EKA Cultural Meridian Emblem"
        loading="eager"
        onError={() => setImageError(true)}
        className={cn(
          "rounded-full object-contain shrink-0 select-none transition-transform duration-500 hover:scale-105",
          sizeClass,
          className
        )}
      />
    );
  }

  // Canonical EKA logo: interlinked cultural orbits and a human focal mark
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-label="EKA cultural connection logo"
      className={cn("shrink-0 select-none transition-transform duration-500", sizeClass, className)}
    >
      <g stroke="#C25E3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="50" r="46" />
        <ellipse cx="50" cy="50" rx="20" ry="46" />
        <ellipse cx="50" cy="50" rx="20" ry="46" transform="rotate(45 50 50)" />
        <ellipse cx="50" cy="50" rx="20" ry="46" transform="rotate(90 50 50)" />
        <ellipse cx="50" cy="50" rx="20" ry="46" transform="rotate(135 50 50)" />
        <circle cx="50" cy="50" r="27" />
        <circle cx="50" cy="50" r="22" />
        <circle cx="50" cy="50" r="17" />
      </g>
      <g stroke="#C25E3E" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="45" r="3.6" fill="#C25E3E" />
        <path d="M43 50 Q50 47 57 50 L53 55 L55 64 Q55 68 50 69 Q45 68 45 64 L47 55 Z" fill="#C25E3E" />
        <path d="M42 51 Q50 55 58 51" />
      </g>
      <g fill="#C25E3E">
        <circle cx="50" cy="4" r="2.5" />
        <circle cx="96" cy="50" r="2.5" />
        <circle cx="50" cy="96" r="2.5" />
        <circle cx="4" cy="50" r="2.5" />
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
  betaClassName,
  withTagline = false,
  withBeta = false,
  taglineText = "Cultural Intelligence",
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
