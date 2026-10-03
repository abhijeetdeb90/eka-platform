import { createFileRoute } from "@tanstack/react-router";
import { CulturalIntelligenceExplorer } from "@/components/discovery/CulturalIntelligenceExplorer";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Compass, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover — Living Cultural Heritage & Sacred Geography on EKA" },
      {
        name: "description",
        content:
          "Explore living traditions, sacred places, and cultural intelligence across unbroken lineages on EKA.",
      },
      { property: "og:title", content: "Discover on EKA" },
      {
        property: "og:description",
        content: "Living cultural heritage, sacred geography, and community traditions.",
      },
    ],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <SiteHeader />
      <main id="main-content" className="flex-1 container-eka py-10 sm:py-16 space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-accent/30 text-xs font-mono text-terracotta">
            <Compass className="size-3.5" />
            <span className="uppercase tracking-wider">Living Discovery</span>
          </div>
          <h1 className="font-display font-serif text-3xl sm:text-5xl font-normal tracking-tight">
            Discover Cultures, Places & Living Wisdom
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed">
            Inquire into sacred geography, lineage memory, and cultural intelligence curated without noise.
          </p>
        </div>

        <section className="space-y-6">
          <CulturalIntelligenceExplorer />
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          <Link
            to="/stories"
            className="group block p-6 rounded-2xl border border-border/70 bg-card/60 hover:bg-card hover:border-terracotta/40 transition-all shadow-xs"
          >
            <span className="text-xs font-mono uppercase tracking-wider text-terracotta font-semibold">1,000 Stories</span>
            <h3 className="font-serif text-xl font-normal mt-2 group-hover:text-terracotta transition-colors">
              Community Cultural Archive
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-light">
              Voices, rituals, and visual oral histories documented across living communities.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-terracotta gap-1">
              <span>Explore stories</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            to="/learn"
            className="group block p-6 rounded-2xl border border-border/70 bg-card/60 hover:bg-card hover:border-terracotta/40 transition-all shadow-xs"
          >
            <span className="text-xs font-mono uppercase tracking-wider text-terracotta font-semibold">Knowledge Codex</span>
            <h3 className="font-serif text-xl font-normal mt-2 group-hover:text-terracotta transition-colors">
              Living Traditions & Manuscripts
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-light">
              Progressive knowledge unfolding: manuscripts, commentaries, and contemplative practices.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-terracotta gap-1">
              <span>Open codex</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            to="/observe"
            className="group block p-6 rounded-2xl border border-border/70 bg-card/60 hover:bg-card hover:border-terracotta/40 transition-all shadow-xs"
          >
            <span className="text-xs font-mono uppercase tracking-wider text-terracotta font-semibold">Multi-Faith Calendar</span>
            <h3 className="font-serif text-xl font-normal mt-2 group-hover:text-terracotta transition-colors">
              Sacred Calendar 2026
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-light">
              26 observances across 6 living traditions with private fasting tracking.
            </p>
            <div className="mt-4 flex items-center text-xs font-medium text-terracotta gap-1">
              <span>View calendar</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
