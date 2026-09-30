// ==============================================================================
// EKA CARD PRIMITIVE: ServiceCard
// ==============================================================================
import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, Clock, CheckCircle2, Flame, ArrowUpRight } from "lucide-react";
import { AnimatedCard } from "@/components/motion/AnimatedCard";
import { Pressable } from "@/components/motion/Pressable";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface ServiceCardProps {
  id: string;
  title: string;
  provider: {
    name: string;
    lineage: string;
    verified?: boolean;
    avatar?: string;
  };
  duration: string;
  category: string;
  description: string;
  offeringType: "GIFT_ECONOMY" | "FIXED_DAKSHINA" | "LINEAGE_RETREAT";
  actionTo?: string;
  className?: string;
  onBook?: () => void;
}

export function ServiceCard({
  id,
  title,
  provider,
  duration,
  category,
  description,
  offeringType = "FIXED_DAKSHINA",
  actionTo,
  className,
  onBook,
}: ServiceCardProps) {
  const [requested, setRequested] = useState(false);

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRequested(true);
    toast.success(`Guidance request initiated with ${provider.name}.`);
    if (onBook) onBook();
  };

  const offeringBadge = {
    GIFT_ECONOMY: "Gift Offering / Dana",
    FIXED_DAKSHINA: "Traditional Dakshina",
    LINEAGE_RETREAT: "Immersive Mentorship",
  }[offeringType];

  const content = (
    <div
      className={cn(
        "flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl md:rounded-3xl border border-border/70 bg-card/90 backdrop-blur-md shadow-calm hover:border-terracotta/40 transition-colors",
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-terracotta bg-terracotta/10 px-2.5 py-1 rounded-full border border-terracotta/20">
            {category}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/40">
            {offeringBadge}
          </span>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-normal leading-tight text-foreground group-hover:text-terracotta transition-colors">
          {title}
        </h3>

        {/* Provider Credential */}
        <div className="flex items-center gap-2 mt-2 mb-3 text-xs">
          <span className="font-medium text-foreground">{provider.name}</span>
          {provider.verified && <CheckCircle2 className="size-3 text-saffron fill-saffron/20" />}
          <span className="text-muted-foreground opacity-60">•</span>
          <span className="text-muted-foreground font-mono">{provider.lineage}</span>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {description}
        </p>

        <div className="mt-3.5 flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
          <Clock className="size-3.5 text-saffron" />
          <span>Session duration: {duration}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between gap-3">
        <Pressable
          onClick={handleBook}
          disabled={requested}
          className="px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase bg-terracotta hover:bg-terracotta-dark text-white shadow-xs font-medium flex items-center gap-1.5 transition-all"
        >
          <Flame className="size-3" />
          {requested ? "Requested" : "Seek Guidance"}
        </Pressable>

        {actionTo && (
          <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground flex items-center gap-0.5">
            Guidance Details <ArrowUpRight className="size-3" />
          </span>
        )}
      </div>
    </div>
  );

  return (
    <AnimatedCard className="h-full">
      {actionTo ? (
        <Link to={actionTo} className="block h-full">
          {content}
        </Link>
      ) : (
        content
      )}
    </AnimatedCard>
  );
}
