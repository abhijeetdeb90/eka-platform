// ==============================================================================
// EKA BRAND LOGO & EMBLEM — PRODUCTION CANONICAL
// ==============================================================================
// "THE WORLD'S TRUSTED CULTURAL INTELLIGENCE LAYER"
// "ONE WITHIN. ONE WITH ALL."
// Incorporates the official brand emblem and lockup assets directly.
// ==============================================================================

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import ekaEmblemPng from "@/assets/brand/eka-emblem.png";
import ekaLogoFullPng from "@/assets/brand/eka-official-logo.png";

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
  variant?: "standard" | "symbol" | "stacked" | "full";
  width?: number | string;
  height?: number | string;
  href?: string | boolean;
  alt?: string;
}

const SIZE_PRESETS = {
  xs: { mark: "h-6 w-6", text: "text-base tracking-[0.2em]", tag: "text-[8px]", height: 24 },
  sm: { mark: "h-7 w-7", text: "text-lg tracking-[0.22em]", tag: "text-[8.5px]", height: 28 },
  md: { mark: "h-8 w-8 sm:h-9 sm:w-9", text: "text-xl sm:text-2xl tracking-[0.24em]", tag: "text-[9px]", height: 36 },
  lg: { mark: "h-11 w-11 sm:h-12 sm:w-12", text: "text-2xl sm:text-3xl tracking-[0.25em]", tag: "text-[10px]", height: 48 },
  xl: { mark: "h-14 w-14 sm:h-16 sm:w-16", text: "text-3xl sm:text-4xl tracking-[0.26em]", tag: "text-xs", height: 64 },
};

/**
 * EKA Official Cultural Meridian Emblem ("One Within. One With All.")
 */
export function EkaMark({
  className,
  size = "md",
  width,
  height,
  alt = "EKA Cultural Meridian Emblem",
}: {
  className?: string;
  useVector?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  width?: number | string;
  height?: number | string;
  alt?: string;
}) {
  const [imageError, setImageError] = useState(false);
  const sizeClass = SIZE_PRESETS[size].mark;
  const dimension = SIZE_PRESETS[size].height;

  return (
    <img
      src={!imageError ? (ekaEmblemPng || "/brand/eka-emblem.png") : "/brand/eka-emblem.png"}
      alt={alt}
      width={width || dimension}
      height={height || dimension}
      loading="eager"
      decoding="async"
      onError={() => setImageError(true)}
      className={cn(
        "object-contain shrink-0 select-none transition-transform duration-500 hover:scale-105",
        !width && !height && sizeClass,
        className
      )}
    />
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
  taglineText = "A Billion Stories — One Within. One With All.",
  useVector = true,
  size = "md",
  variant = "standard",
  width,
  height,
  href,
  alt = "EKA — The World's Trusted Cultural Intelligence Layer",
}: EkaLogoProps) {
  const currentSize = SIZE_PRESETS[size];

  // Full lockup variant: Primary official lockup
  if (variant === "full") {
    const fullImg = (
      <img
        src={ekaLogoFullPng || "/brand/eka-official-logo.png"}
        alt={alt}
        width={width || currentSize.height * 2.2}
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

  // Symbol only variant
  if (variant === "symbol") {
    const symbolImg = (
      <EkaMark
        size={size}
        width={width}
        height={height}
        alt={alt}
        useVector={useVector}
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

  const standardContent = (
    <span
      className={cn(
        "group inline-flex items-center gap-2.5 sm:gap-3 select-none",
        className
      )}
    >
      <EkaMark
        useVector={useVector}
        size={size}
        width={width}
        height={height}
        alt={alt}
        className={cn(
          "transition-transform duration-700 ease-out group-hover:scale-105",
          markClassName
        )}
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
