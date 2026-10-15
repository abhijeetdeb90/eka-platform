// ==============================================================================
// EKA OFFICIAL BRAND LOGO COMPONENT — PRODUCTION CANONICAL
// ==============================================================================
// Official Brand Identity Component for EKA:
// - Incorporates official vector Emblem (eka-emblem.svg) and Primary Lockup (eka-primary-lockup.svg)
// - Supports standard lockup, emblem-only / compact icon, stacked variant
// - Supports configurable dimensions, responsive scaling, and optional link to homepage
// - Preserves intrinsic aspect ratio with zero layout shifts
// ==============================================================================

import React from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import ekaEmblemJpg from "@/assets/brand/eka-emblem.jpg";
import ekaLogoFullJpg from "@/assets/brand/eka-logo-full.jpg";

export type EkaLogoVariant = "standard" | "symbol" | "stacked" | "full";
export type EkaLogoSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface EkaLogoProps {
  /** Logo variant: standard (horizontal lockup), symbol (emblem mark only), stacked (centered), full (primary SVG) */
  variant?: EkaLogoVariant;
  /** Size preset */
  size?: EkaLogoSize;
  /** Custom width in pixels or CSS units */
  width?: number | string;
  /** Custom height in pixels or CSS units */
  height?: number | string;
  /** Additional container classes */
  className?: string;
  /** Custom class for emblem mark */
  markClassName?: string;
  /** Custom class for logotype text */
  textClassName?: string;
  /** Custom class for tagline */
  taglineClassName?: string;
  /** Custom class for beta pill */
  betaClassName?: string;
  /** Whether to render subtitle/tagline */
  withTagline?: boolean;
  /** Tagline text override */
  taglineText?: string;
  /** Whether to render BETA badge */
  withBeta?: boolean;
  /** Whether to wrap the logo in a navigation link to "/" */
  href?: string | boolean;
  /** Accessible alt label */
  alt?: string;
  /** Force vector rendering (default true) */
  useVector?: boolean;
}

const SIZE_PRESETS: Record<EkaLogoSize, { mark: string; text: string; tag: string; height: number }> = {
  xs: { mark: "h-6 w-6", text: "text-base tracking-[0.2em]", tag: "text-[8px]", height: 24 },
  sm: { mark: "h-7 w-7", text: "text-lg tracking-[0.22em]", tag: "text-[8.5px]", height: 28 },
  md: { mark: "h-8 w-8 sm:h-9 sm:w-9", text: "text-xl sm:text-2xl tracking-[0.24em]", tag: "text-[9px]", height: 36 },
  lg: { mark: "h-11 w-11 sm:h-12 sm:w-12", text: "text-2xl sm:text-3xl tracking-[0.25em]", tag: "text-[10px]", height: 48 },
  xl: { mark: "h-14 w-14 sm:h-16 sm:w-16", text: "text-3xl sm:text-4xl tracking-[0.26em]", tag: "text-xs", height: 64 },
};

/**
 * EKA Official Emblem (Network & Cultural Meridian Mark)
 */
export function EkaEmblem({
  className,
  size = "md",
  width,
  height,
  alt = "EKA Cultural Meridian Emblem",
}: {
  className?: string;
  size?: EkaLogoSize;
  width?: number | string;
  height?: number | string;
  alt?: string;
}) {
  const preset = SIZE_PRESETS[size];

  return (
    <img
      src={ekaEmblemJpg || "/brand/eka-emblem.jpg"}
      alt={alt}
      width={width || preset.height}
      height={height || preset.height}
      loading="eager"
      decoding="async"
      className={cn(
        "object-contain shrink-0 select-none transition-transform duration-500 ease-out group-hover:scale-105 rounded-full",
        !width && !height && preset.mark,
        className
      )}
    />
  );
}

/**
 * Canonical EKA Brand Logo Component
 */
export function EkaLogo({
  variant = "standard",
  size = "md",
  width,
  height,
  className,
  markClassName,
  textClassName,
  taglineClassName,
  betaClassName,
  withTagline = false,
  taglineText = "Cultural Intelligence",
  withBeta = false,
  href,
  alt = "EKA — The World's Trusted Cultural Intelligence Layer",
}: EkaLogoProps) {
  const currentSize = SIZE_PRESETS[size];

  // If variant is "full", render the official primary lockup directly
  if (variant === "full") {
    const fullImg = (
      <img
        src={ekaLogoFullJpg || "/brand/eka-logo-full.jpg"}
        alt={alt}
        width={width || (currentSize.height * 2.2)}
        height={height || currentSize.height}
        loading="eager"
        decoding="async"
        className={cn("object-contain select-none", className)}
      />
    );

    if (href) {
      const target = typeof href === "string" ? href : "/";
      return (
        <Link to={target} aria-label={alt} className="inline-flex items-center">
          {fullImg}
        </Link>
      );
    }
    return fullImg;
  }

  // If variant is "symbol", render the emblem mark only
  if (variant === "symbol") {
    const symbolImg = (
      <EkaEmblem
        size={size}
        width={width}
        height={height}
        alt={alt}
        className={cn(markClassName, className)}
      />
    );

    if (href) {
      const target = typeof href === "string" ? href : "/";
      return (
        <Link to={target} aria-label={alt} className="inline-flex items-center">
          {symbolImg}
        </Link>
      );
    }
    return symbolImg;
  }

  // Stacked variant (Emblem above logotype)
  if (variant === "stacked") {
    const stackedContent = (
      <div className={cn("inline-flex flex-col items-center text-center select-none group", className)}>
        <EkaEmblem size={size} width={width} height={height} className={markClassName} alt={alt} />
        <span
          className={cn(
            "mt-2 font-display font-bold text-[#681A1C] tracking-[0.24em] transition-colors leading-none",
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
      </div>
    );

    if (href) {
      const target = typeof href === "string" ? href : "/";
      return (
        <Link to={target} aria-label={alt} className="inline-flex items-center">
          {stackedContent}
        </Link>
      );
    }
    return stackedContent;
  }

  // Standard horizontal lockup: Official emblem + EKA logotype typography
  const standardContent = (
    <span
      className={cn(
        "group inline-flex items-center gap-2.5 sm:gap-3 select-none",
        className
      )}
    >
      <EkaEmblem
        size={size}
        width={width}
        height={height}
        alt={alt}
        className={markClassName}
      />
      <span className="flex flex-col leading-none">
        <span className="inline-flex items-center gap-2">
          <span
            className={cn(
              "font-display font-bold text-[#681A1C] tracking-[0.24em] transition-colors",
              currentSize.text,
              textClassName
            )}
          >
            EKA
          </span>
          {withBeta && (
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded-sm text-[8.5px] font-mono font-semibold uppercase tracking-widest border border-[#E8E2D9] bg-[#F7F6F2] text-[#681A1C]/80 leading-none shrink-0 select-none",
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

  if (href) {
    const target = typeof href === "string" ? href : "/";
    return (
      <Link to={target} aria-label={alt} className="inline-flex items-center">
        {standardContent}
      </Link>
    );
  }

  return standardContent;
}

export default EkaLogo;
