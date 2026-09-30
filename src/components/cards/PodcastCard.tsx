// ==============================================================================
// EKA CARD PRIMITIVE: PodcastCard
// ==============================================================================
import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Play, Pause, Headphones, Clock, Bookmark, ArrowUpRight } from "lucide-react";
import { AnimatedCard } from "@/components/motion/AnimatedCard";
import { Pressable } from "@/components/motion/Pressable";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface PodcastCardProps {
  id: string;
  title: string;
  host: string;
  series: string;
  duration: string;
  description: string;
  coverImage: string;
  audioUrl?: string;
  episodeNumber?: number;
  actionTo?: string;
  className?: string;
}

export function PodcastCard({
  id,
  title,
  host,
  series,
  duration,
  description,
  coverImage,
  audioUrl,
  episodeNumber,
  actionTo,
  className,
}: PodcastCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
    toast.info(isPlaying ? "Audio paused." : `Now playing: "${title}"`);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    toast.success(saved ? "Removed from queue." : "Saved to your listening queue.");
  };

  const content = (
    <div
      className={cn(
        "flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl md:rounded-3xl border border-border/70 bg-card/90 backdrop-blur-md shadow-calm hover:border-forest/40 transition-colors",
        className
      )}
    >
      <div>
        {/* Cover Art with Floating Play Button */}
        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 group/cover">
          <img src={coverImage} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover/cover:scale-105" />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
            <Pressable
              onClick={handleTogglePlay}
              aria-label={isPlaying ? "Pause episode" : "Play episode"}
              className="size-12 rounded-full bg-forest text-white flex items-center justify-center shadow-lg border border-white/20 hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 ml-0.5" />}
            </Pressable>
          </div>

          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/15">
              {series}
            </span>
            {episodeNumber && (
              <span className="text-[10px] font-mono text-white/90 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/15">
                EP #{episodeNumber}
              </span>
            )}
          </div>

          <div className="absolute bottom-2 right-2 text-[10px] font-mono text-white/90 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/15 flex items-center gap-1">
            <Clock className="size-2.5" />
            {duration}
          </div>
        </div>

        <h3 className="font-serif text-lg font-normal leading-tight text-foreground group-hover:text-forest transition-colors">
          {title}
        </h3>

        <p className="text-xs font-mono text-terracotta mt-1">With {host}</p>

        <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between text-xs">
        <Pressable
          onClick={handleSave}
          className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1.5"
        >
          <Bookmark className={cn("size-3.5", saved && "text-terracotta fill-terracotta")} />
          <span>{saved ? "Queued" : "Save Episode"}</span>
        </Pressable>

        {actionTo && (
          <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground flex items-center gap-0.5">
            Full Notes <ArrowUpRight className="size-3" />
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
