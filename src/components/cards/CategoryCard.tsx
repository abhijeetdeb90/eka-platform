// ==============================================================================
// EKA CATEGORY CARD COMPONENT
// ==============================================================================
// Specification: Sections 2, 14
// Visual category card for the merged Discover knowledge exploration environment.
// ==============================================================================

import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryCardProps {
  id: string;
  title: string;
  subtitle?: string;
  itemCount?: number;
  imageUrl: string;
  actionTo?: string;
  onClick?: () => void;
  className?: string;
}

export function CategoryCard({
  id,
  title,
  subtitle,
  itemCount,
  imageUrl,
  actionTo,
  onClick,
  className,
}: CategoryCardProps) {
  const content = (
    <div
      onClick={onClick}
      className={cn(
        "group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-900 shadow-calm transition-all duration-300 hover:shadow-lift hover:scale-[1.01] cursor-pointer select-none",
        className,
      )}
    >
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={title}
        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />

      {/* Cinematic Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

      {/* Item count tag top-right */}
      {itemCount !== undefined && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/10">
          <span>{itemCount}</span> entries
        </div>
      )}

      {/* Bottom Content */}
      <div className="absolute bottom-3 inset-x-3 text-white space-y-1">
        <h4 className="font-display text-base sm:text-lg font-medium text-white leading-tight group-hover:text-amber-200 transition-colors">
          {title}
        </h4>

        {subtitle && (
          <p className="text-xs text-white/80 font-light line-clamp-1">
            {subtitle}
          </p>
        )}

        <div className="pt-1 flex items-center justify-end text-[11px] text-amber-300 font-medium group-hover:translate-x-0.5 transition-transform">
          <span>Explore</span>
          <ArrowRight className="size-3 ml-1" />
        </div>
      </div>
    </div>
  );

  if (actionTo) {
    return (
      <Link to={actionTo} className="block focus:outline-hidden">
        {content}
      </Link>
    );
  }

  return content;
}
