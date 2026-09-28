import React from "react";
import { Link } from "@tanstack/react-router";
import { Globe, ArrowRight, ShieldCheck, Sparkles, Compass } from "lucide-react";
import { FEATURED_CULTURES, EkaDiscoveryCard } from "@/lib/homepage-data";
import { Button } from "@/components/ui/button";

interface FeaturedCulturesSectionProps {
  onInspectCard: (card: EkaDiscoveryCard) => void;
}

export const FeaturedCulturesSection: React.FC<FeaturedCulturesSectionProps> = ({
  onInspectCard,
}) => {
  const heroCulture = FEATURED_CULTURES[0]; // Majuli & Assam
  const subCultures = FEATURED_CULTURES.slice(1); // Kutch, Ladakh, Kerala

  if (!heroCulture) return null;

  return (
    <section aria-labelledby="featured-cultures-title" className="py-20 lg:py-24">
      <div className="container-eka">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-terracotta">
              <Globe className="size-3.5" />
              <span>Living Civilizations</span>
            </div>
            <h2
              id="featured-cultures-title"
              className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl text-foreground"
            >
              Featured Cultures
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground font-light">
            EKA maps cultures not as static history, but as living knowledge ecosystems preserved
            through communities, art, and landscapes.
          </p>
        </div>

        {/* Magazine-style Grid */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Main Showcase Hero Card (7 cols) */}
          <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-calm transition-all duration-300 hover:border-primary/40 hover:shadow-lift lg:col-span-7">
            <div className="relative aspect-16/10 w-full overflow-hidden bg-sand/30 sm:aspect-16/9">
              <img
                src={heroCulture.image}
                alt={heroCulture.title}
                loading="lazy"
                width={1200}
                height={675}
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

              {/* Badges on top */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                <span className="rounded-full border border-border/60 bg-background/85 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-foreground backdrop-blur-md">
                  {heroCulture.categoryBadge}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-forest/30 bg-forest/10 px-2.5 py-1 text-[11px] font-medium text-forest backdrop-blur-md">
                  <ShieldCheck className="size-3" />
                  <span>Verified Knowledge</span>
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {heroCulture.location} · {heroCulture.community}
              </div>
              <h3 className="mt-2 font-display text-2xl sm:text-3xl font-medium leading-snug group-hover:text-primary transition-colors">
                {heroCulture.title}
              </h3>
              <p className="mt-2 font-sans text-base font-light text-foreground/90 leading-relaxed">
                {heroCulture.oneLiner}
              </p>
              <p className="mt-2 text-sm text-muted-foreground font-light line-clamp-2">
                {heroCulture.fullExplanation}
              </p>

              {/* Knowledge Tags */}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {heroCulture.knowledgeTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-border/60 bg-muted/60 px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-auto pt-6 flex flex-wrap items-center gap-3 border-t border-border/50">
                <Button
                  type="button"
                  onClick={() => onInspectCard(heroCulture)}
                  className="rounded-xl px-5 py-2.5 text-xs font-semibold shadow-xs"
                >
                  <Compass className="mr-2 size-4" />
                  <span>Inspect Knowledge Graph</span>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl border-border/80 bg-background/80 px-4 py-2.5 text-xs text-foreground hover:bg-muted"
                >
                  <Link to="/stories">
                    <span>Explore Stories</span>
                    <ArrowRight className="ml-1.5 size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Secondary Stack (5 cols) */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {subCultures.map((cult) => (
              <div
                key={cult.id}
                className="group relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-calm transition-all duration-300 hover:border-primary/40 hover:shadow-lift sm:flex-row sm:items-center sm:gap-5"
              >
                <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-xl bg-sand/30 sm:w-36">
                  <img
                    src={cult.image}
                    alt={cult.title}
                    loading="lazy"
                    width={400}
                    height={300}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2 left-2 rounded-full border border-border/50 bg-background/85 px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase text-foreground backdrop-blur-md">
                    {cult.categoryBadge.split("·")[1]?.trim() || "CULTURE"}
                  </span>
                </div>

                <div className="mt-3 flex flex-1 flex-col justify-between sm:mt-0">
                  <div>
                    <div className="text-[11px] text-muted-foreground uppercase tracking-wide">
                      {cult.location}
                    </div>
                    <h4 className="mt-1 font-display text-lg font-medium leading-snug group-hover:text-primary transition-colors">
                      {cult.title}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground font-light line-clamp-2">
                      {cult.oneLiner}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => onInspectCard(cult)}
                      className="text-xs font-semibold text-terracotta hover:underline inline-flex items-center gap-1 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                    >
                      <Sparkles className="size-3" />
                      <span>View details</span>
                    </button>
                    <span className="text-[11px] text-muted-foreground">
                      {cult.stats?.saves} saves
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
