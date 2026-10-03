// ==============================================================================
// EKA FEEDBACK PRIMITIVE: SanctuaryEmptyState
// ==============================================================================
import { Link } from "@tanstack/react-router";
import { Bookmark, Sparkles, Compass } from "lucide-react";
import { Pressable } from "@/components/motion/Pressable";
import { ConnectionOrbit } from "@/components/motion/ConnectionOrbit";
import { cn } from "@/lib/utils";

interface SanctuaryEmptyStateProps {
  className?: string;
}

export function SanctuaryEmptyState({ className }: SanctuaryEmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center text-center p-8 sm:p-14 rounded-3xl border border-dashed border-terracotta/30 bg-sand-warm/30 dark:bg-stone-900/30 backdrop-blur-xs overflow-hidden my-6",
        className
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
        <ConnectionOrbit size={280} orbitCount={3} />
      </div>

      <div className="relative z-10 size-16 rounded-full bg-sand-warm dark:bg-stone-800 border border-saffron/40 flex items-center justify-center text-saffron mb-4 shadow-calm">
        <Bookmark className="size-7 stroke-[1.8]" />
      </div>

      <h3 className="relative z-10 font-serif text-2xl font-normal text-foreground">
        Your Sanctuary is Quiet
      </h3>

      <p className="relative z-10 mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
        You haven't saved any cultural reflections, ancient manuscripts, or sacred places yet.
        As you explore EKA, tap the bookmark icon on any story or wisdom card to gather them here.
      </p>

      <div className="relative z-10 mt-6 flex items-center gap-3">
        <Link to="/observe">
          <Pressable className="px-5 py-2.5 rounded-full bg-terracotta hover:bg-terracotta-dark text-white font-mono text-xs uppercase tracking-wider shadow-calm flex items-center gap-2">
            <Compass className="size-3.5" />
            Discover Living Heritage
          </Pressable>
        </Link>
        <Link to="/stories">
          <Pressable className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent/80 text-foreground font-mono text-xs uppercase tracking-wider border border-border/60 flex items-center gap-2">
            <Sparkles className="size-3.5 text-saffron" />
            1 Billion Stories
          </Pressable>
        </Link>
      </div>
    </div>
  );
}
