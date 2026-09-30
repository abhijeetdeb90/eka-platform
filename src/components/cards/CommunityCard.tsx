// ==============================================================================
// EKA CARD PRIMITIVE: CommunityCard
// ==============================================================================
import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Users, MessageSquare, Orbit, ArrowUpRight, Check } from "lucide-react";
import { AnimatedCard } from "@/components/motion/AnimatedCard";
import { Pressable } from "@/components/motion/Pressable";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface CommunityCardProps {
  id: string;
  name: string;
  focus: string;
  description: string;
  membersCount: number;
  recentTopic?: string;
  coverImage?: string;
  avatars?: string[];
  actionTo?: string;
  className?: string;
  onJoin?: () => void;
}

export function CommunityCard({
  id,
  name,
  focus,
  description,
  membersCount,
  recentTopic,
  coverImage,
  avatars = [],
  actionTo,
  className,
  onJoin,
}: CommunityCardProps) {
  const [joined, setJoined] = useState(false);

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setJoined(!joined);
    toast.success(joined ? `Left ${name}` : `Welcome to the ${name} circle.`);
    if (onJoin) onJoin();
  };

  const content = (
    <div
      className={cn(
        "flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl md:rounded-3xl border border-border/70 bg-card/90 backdrop-blur-md shadow-calm hover:border-forest/40 transition-colors",
        className
      )}
    >
      <div>
        {/* Cover or Accent Bar */}
        {coverImage && (
          <div className="w-full h-28 rounded-xl overflow-hidden mb-4 relative">
            <img src={coverImage} alt={name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-2 left-2 text-[10px] font-mono uppercase tracking-wider text-white bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/20">
              {focus}
            </span>
          </div>
        )}

        {!coverImage && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-forest bg-forest/10 px-2.5 py-1 rounded-full border border-forest/20">
              {focus}
            </span>
            <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
              <Users className="size-3.5 text-forest" />
              <span>{membersCount.toLocaleString()} members</span>
            </div>
          </div>
        )}

        <h3 className="font-serif text-lg sm:text-xl font-normal leading-tight text-foreground group-hover:text-forest transition-colors">
          {name}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>

        {recentTopic && (
          <div className="mt-3.5 p-2.5 rounded-xl bg-muted/50 border border-border/40 text-xs">
            <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-muted-foreground mb-1">
              <MessageSquare className="size-3 text-terracotta" />
              Active Reflection:
            </div>
            <p className="text-foreground/90 font-serif italic line-clamp-1">"{recentTopic}"</p>
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between gap-3">
        <Pressable
          onClick={handleJoin}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5",
            joined
              ? "bg-forest/10 text-forest border border-forest/30 font-medium"
              : "bg-forest hover:bg-forest-light text-white shadow-xs"
          )}
        >
          {joined ? (
            <>
              <Check className="size-3" /> Member
            </>
          ) : (
            <>
              <Orbit className="size-3" /> Join Circle
            </>
          )}
        </Pressable>

        {actionTo && (
          <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground flex items-center gap-0.5">
            Circle Space <ArrowUpRight className="size-3" />
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
