// ==============================================================================
// EKA QUESTION CARD & SHORT EDITORIAL CARD COMPONENT
// ==============================================================================
// Specification: Sections 6, 8
// Designed for Ask EKA & editorial curiosity exploration.
// Zero-pill compliant, crisp typography, Fraunces serif question, instant tap-to-ask.
// ==============================================================================

import React from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight, HelpCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuestionCardProps {
  id: string;
  question: string;
  category: string;
  regionOrCulture?: string;
  shortHook?: string;
  bgVariant?: "parchment" | "sand" | "card" | "terracotta-soft";
  actionTo?: string;
  onClick?: () => void;
  className?: string;
}

export function QuestionCard({
  id,
  question,
  category,
  regionOrCulture,
  shortHook,
  bgVariant = "card",
  actionTo,
  onClick,
  className,
}: QuestionCardProps) {
  const bgClasses = {
    card: "bg-card border-border/80 hover:border-primary/50",
    parchment: "bg-parchment/60 border-border/70 hover:border-terracotta/50",
    sand: "bg-sand/40 border-border/70 hover:border-saffron/60",
    "terracotta-soft": "bg-primary-soft/30 border-primary/20 hover:border-primary/60",
  }[bgVariant];

  const content = (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border p-5 shadow-calm transition-all duration-300 hover:shadow-lift cursor-pointer select-none",
        bgClasses,
        className,
      )}
    >
      <div>
        {/* Category & Region Metadata (Unboxed text with bullet separator) */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2.5 font-medium">
          <span className="text-terracotta">{category}</span>
          {regionOrCulture && (
            <>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span className="truncate">{regionOrCulture}</span>
            </>
          )}
        </div>

        {/* Question Title in Serif */}
        <h4 className="font-display text-base sm:text-lg font-medium text-foreground leading-snug group-hover:text-primary transition-colors tracking-tight">
          {question}
        </h4>

        {/* Short Curiosity Hook */}
        {shortHook && (
          <p className="mt-2 text-xs text-muted-foreground font-light leading-relaxed line-clamp-2">
            {shortHook}
          </p>
        )}
      </div>

      {/* CTA Footer */}
      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
        <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
          <Sparkles className="size-3 text-saffron" />
          <span>Ask EKA</span>
        </span>

        <span className="inline-flex items-center gap-1 text-terracotta font-medium group-hover:translate-x-0.5 transition-transform">
          <span>Explore</span>
          <ArrowRight className="size-3.5" />
        </span>
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
