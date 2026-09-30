// ==============================================================================
// EKA FEEDBACK PRIMITIVE: CardSkeleton
// ==============================================================================
import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  aspectRatio?: "vertical" | "portrait" | "landscape" | "square" | "card";
  count?: number;
  className?: string;
}

export function CardSkeleton({
  aspectRatio = "portrait",
  count = 1,
  className,
}: CardSkeletonProps) {
  const aspectClass = {
    vertical: "aspect-[9/16]",
    portrait: "aspect-[4/5]",
    landscape: "aspect-[16/10]",
    square: "aspect-square",
    card: "h-64",
  }[aspectRatio];

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "relative overflow-hidden rounded-2xl md:rounded-3xl border border-border/40 bg-muted/30 p-5 flex flex-col justify-between animate-pulse",
            aspectClass,
            className
          )}
          aria-hidden="true"
        >
          {/* Top Pill / Badge Skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-5 w-24 rounded-full bg-muted/60" />
            <div className="h-6 w-6 rounded-full bg-muted/60" />
          </div>

          {/* Bottom Title & Subtitle Skeletons */}
          <div className="space-y-2.5">
            <div className="h-3 w-1/3 rounded-sm bg-muted/50" />
            <div className="h-5 w-4/5 rounded-sm bg-muted/70" />
            <div className="h-3 w-full rounded-sm bg-muted/50" />
            <div className="pt-3 border-t border-border/30 flex items-center justify-between">
              <div className="h-4 w-20 rounded-full bg-muted/50" />
              <div className="h-4 w-12 rounded-full bg-muted/50" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
