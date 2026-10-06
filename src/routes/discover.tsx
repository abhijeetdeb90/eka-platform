import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  Compass,
  ArrowRight,
  Sparkles,
  Globe,
  BookOpen,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AskEkaHero } from "@/components/discovery/AskEkaHero";
import {
  DiscoverArchitectureNav,
  type DiscoverNavSelection,
} from "@/components/discovery/DiscoverArchitectureNav";
import { GlobalCulturalMap } from "@/components/discovery/GlobalCulturalMap";
import { VisualDiscoverFeed } from "@/components/discovery/VisualDiscoverFeed";
import { CompareCulturesSection } from "@/components/discovery/CompareCulturesSection";
import {
  ContextualAskEkaModal,
  type ContextualAskEkaTarget,
} from "@/components/discovery/ContextualAskEkaModal";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover — Global Culture Intelligence on EKA" },
      {
        name: "description",
        content:
          "Explore living traditions, sacred places, and global cultural intelligence across unbroken lineages on EKA. Don't just scroll the world. Understand it.",
      },
      { property: "og:title", content: "Discover on EKA — Global Culture Intelligence" },
      {
        property: "og:description",
        content:
          "See → Wonder → Ask → Understand. Explore the world's cultures, communities, and sacred stories.",
      },
    ],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  const [activePillar, setActivePillar] = useState<string>("world");
  const [activeSubcategory, setActiveSubcategory] = useState<string>("India");
  const [activeView, setActiveView] = useState<"map" | "feed">("map");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<ContextualAskEkaTarget | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleOpenAskEka = (target?: ContextualAskEkaTarget) => {
    setModalTarget(target ?? null);
    setModalOpen(true);
  };

  const handleNavSelect = (sel: DiscoverNavSelection) => {
    setActivePillar(sel.pillar);
    if (sel.subCategory) {
      setActiveSubcategory(sel.subCategory);
    }
    if (sel.pillar === "ai") {
      handleOpenAskEka({
        title: "Global Culture",
        initialQuestion: "What are you curious about?",
      });
    }
  };

  return (
    <div
      data-testid="eka-discover-page"
      data-hydrated={isHydrated ? "true" : "false"}
      className="min-h-screen bg-background text-foreground flex flex-col font-sans"
    >
      <SiteHeader />

      <main id="main-content" className="flex-1 container-eka py-8 sm:py-14 space-y-12 sm:space-y-16">
        {/* 1. Hero: Ask EKA Entry Point (Not a chatbot clone; cultural guide) */}
        <AskEkaHero onAskEka={handleOpenAskEka} />

        {/* 2. Discover Architecture Navigation (5 Pillars & Categories) */}
        <DiscoverArchitectureNav
          activePillar={activePillar}
          activeSubcategory={activeSubcategory}
          onSelect={handleNavSelect}
        />

        {/* View Switcher: Map View vs Feed / List View */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="space-y-0.5">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
              {activeView === "map" ? "Geographic Cultural Map" : "Visual Cultural Feed"}
            </h2>
            <p className="text-xs text-muted-foreground font-light">
              {activeView === "map"
                ? "Explore by territory, sacred confluences, and cultural hotspots on earth"
                : "Curated stories, traditions, foodways, and artisan lineages across the archive"}
            </p>
          </div>

          <div className="flex items-center rounded-2xl border border-border/80 bg-card p-1 shadow-xs">
            <button
              onClick={() => setActiveView("map")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeView === "map"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Compass className="size-3.5" />
              <span>Map View</span>
            </button>
            <button
              onClick={() => setActiveView("feed")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeView === "feed"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="size-3.5" />
              <span>Feed / List View</span>
            </button>
          </div>
        </div>

        {/* 3. Global Cultural Intelligence Map (Interactive Map View) */}
        {activeView === "map" && (
          <section id="cultural-map" className="space-y-4 animate-fadeIn">
            <GlobalCulturalMap onAskEka={handleOpenAskEka} />
          </section>
        )}

        {/* 4. Visual Discover Feed (List / Feed View) */}
        {activeView === "feed" && (
          <section id="visual-feed" className="space-y-6 animate-fadeIn">
            <VisualDiscoverFeed onAskEka={handleOpenAskEka} />
          </section>
        )}

        {/* 5. Compare Cultures Viral Feature ("ONE WITH ALL") */}
        <section id="compare-cultures" className="space-y-6">
          <CompareCulturesSection onAskEka={handleOpenAskEka} />
        </section>

        {/* 6. Strategic Loop & EKA Consumer Promise Callout */}
        <section className="rounded-3xl border border-terracotta/20 bg-sand/15 p-8 sm:p-12 text-center space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-terracotta font-semibold">
            The EKA Consumer Promise
          </span>
          <h3 className="font-serif text-2xl sm:text-4xl font-normal text-foreground">
            Don't just scroll the world. Understand it.
          </h3>
          <p className="font-serif text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            See → Wonder → Ask → Understand → Discover → Connect → Contribute → Preserve.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link to="/stories">
              <Button variant="outline" className="rounded-full text-xs gap-1.5">
                <BookOpen className="size-3.5 text-terracotta" />
                <span>Explore Stories Archive</span>
                <ArrowRight className="size-3" />
              </Button>
            </Link>
            <Link to="/learn">
              <Button className="rounded-full text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                <Globe className="size-3.5" />
                <span>Learn with the Cultural Map</span>
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Contextual Ask EKA Modal */}
        <ContextualAskEkaModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          target={modalTarget}
        />

        {/* 7. Persistent Floating "Ask EKA" Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={() => handleOpenAskEka()}
            className="rounded-full shadow-lift gap-2 bg-foreground text-background hover:bg-foreground/90 font-medium px-5 py-2.5 text-xs border border-border"
            data-testid="floating-ask-eka-btn"
          >
            <Sparkles className="size-3.5 text-saffron" />
            <span>Ask EKA</span>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
