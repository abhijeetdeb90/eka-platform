import { useState } from "react";
import { Quote, Sparkles, MapPin, Share2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FOUNDER_STORIES, type FounderStory } from "@/lib/founder-data";

export function FounderStoriesFeed() {
  const [selectedStory, setSelectedStory] = useState<FounderStory | null>(null);

  const handleShareStory = async (story: FounderStory, e: React.MouseEvent) => {
    e.stopPropagation();
    const url =
      typeof window !== "undefined" ? `${window.location.origin}/founder/ad#story-${story.id}` : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AD on EKA: ${story.title}`,
          text: `"${story.quote}" — AD, Founder of EKA`,
          url,
        });
      } catch {
        // Ignored
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(
        `"${story.quote}" — ${story.title} by AD, Founder of EKA (${url})`,
      );
      toast.success("Story quote copied to clipboard.");
    }
  };

  return (
    <section id="from-the-founder" className="border-b border-border/70 bg-sand/20 py-20 lg:py-28">
      <div className="container-eka">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary-soft/30 text-primary text-xs uppercase tracking-[0.2em]"
          >
            Founder Perspective
          </Badge>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl text-foreground">
            From the Founder
          </h2>
          <p className="mt-3 text-base text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
            Ten visual principles guiding the architecture of EKA. Thought leadership grounded in
            civilizational reverence rather than commercial hype.
          </p>
        </div>

        {/* 10 Visual Stories Grid */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {FOUNDER_STORIES.map((story) => (
            <div
              key={story.id}
              id={`story-${story.id}`}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-calm transition-all duration-500 hover:border-primary/50 hover:shadow-lift"
            >
              {/* Image Frame with Editorial Watermark Stamp */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand/30">
                <img
                  src={story.image}
                  alt={story.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                {/* Top Subtle Watermark: AD x EKA */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium tracking-wider text-white/90 backdrop-blur-md border border-white/10">
                    {story.stamp}
                  </div>
                  {story.location && (
                    <div className="flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur-xs border border-white/10">
                      <MapPin className="size-3 text-saffron" />
                      <span>{story.location}</span>
                    </div>
                  )}
                </div>

                {/* Pull Quote Overlay at base of image */}
                <div className="absolute bottom-4 left-4 right-4">
                  <Quote className="size-5 text-saffron/80 mb-1 opacity-90" />
                  <p className="font-display text-lg sm:text-xl font-normal leading-snug text-white drop-shadow-md">
                    "{story.quote}"
                  </p>
                </div>
              </div>

              {/* Story Editorial Body */}
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-display text-xs uppercase tracking-[0.16em] text-terracotta font-semibold">
                    Principle 0{story.order}
                  </span>
                  <span>{story.date}</span>
                </div>

                <h3 className="mt-2 font-display text-2xl font-medium text-foreground transition-colors group-hover:text-primary">
                  {story.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground font-light">
                  {story.caption}
                </p>

                {/* Bottom Signature Line */}
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-border/60 text-xs">
                  <div className="flex flex-col">
                    <span className="font-display text-xs font-semibold text-foreground">AD</span>
                    <span className="text-[10px] text-muted-foreground">Founder, EKA</span>
                  </div>

                  <button
                    onClick={(e) => handleShareStory(story, e)}
                    aria-label={`Share story: ${story.title}`}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 min-h-[44px] text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Share2 className="size-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
