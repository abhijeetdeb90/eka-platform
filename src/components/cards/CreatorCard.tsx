// ==============================================================================
// EKA CARD PRIMITIVE: CreatorCard
// ==============================================================================
import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Layers, Award, ArrowUpRight, Plus, Check } from "lucide-react";
import { AnimatedCard } from "@/components/motion/AnimatedCard";
import { Pressable } from "@/components/motion/Pressable";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface CreatorCardProps {
  id: string;
  name: string;
  handle?: string;
  avatarUrl?: string;
  tradition: string;
  role: string;
  bio?: string;
  verified?: boolean;
  craftOrLineage?: string;
  worksCount?: number;
  actionTo?: string;
  className?: string;
  onFollow?: () => void;
}

export function CreatorCard({
  id,
  name,
  handle,
  avatarUrl,
  tradition,
  role,
  bio,
  verified = true,
  craftOrLineage,
  worksCount,
  actionTo,
  className,
  onFollow,
}: CreatorCardProps) {
  const [following, setFollowing] = useState(false);

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowing(!following);
    toast.success(following ? `Unfollowed ${name}` : `Following ${name}'s lineage works`);
    if (onFollow) onFollow();
  };

  const content = (
    <div
      className={cn(
        "flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl md:rounded-3xl border border-border/70 bg-card/90 backdrop-blur-md shadow-calm hover:border-saffron/40 transition-colors",
        className
      )}
    >
      <div>
        {/* Creator Identity Row */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="relative size-14 rounded-full overflow-hidden border-2 border-border/60 bg-muted shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-serif text-lg bg-terracotta/15 text-terracotta font-medium">
                {name.charAt(0)}
              </div>
            )}
            {verified && (
              <div className="absolute bottom-0 right-0 size-4 rounded-full bg-saffron text-white flex items-center justify-center">
                <CheckCircle2 className="size-3 stroke-[2.5]" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="font-serif text-lg font-normal leading-tight text-foreground truncate group-hover:text-saffron transition-colors">
              {name}
            </h3>
            {handle && <p className="text-xs font-mono text-muted-foreground truncate">{handle}</p>}
            <p className="text-xs font-mono text-terracotta font-medium mt-0.5 truncate">{tradition}</p>
          </div>
        </div>

        {/* Role & Lineage Badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            {role}
          </span>
          {craftOrLineage && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50">
              {craftOrLineage}
            </span>
          )}
        </div>

        {bio && (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {bio}
          </p>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between gap-3">
        <Pressable
          onClick={handleFollow}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-mono tracking-wider transition-all flex items-center gap-1",
            following
              ? "bg-accent text-accent-foreground border border-border"
              : "bg-saffron hover:bg-saffron-dark text-white shadow-xs font-medium"
          )}
        >
          {following ? (
            <>
              <Check className="size-3" /> Following
            </>
          ) : (
            <>
              <Plus className="size-3" /> Follow Lineage
            </>
          )}
        </Pressable>

        {actionTo && (
          <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground flex items-center gap-0.5">
            Guild Portfolio <ArrowUpRight className="size-3" />
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
