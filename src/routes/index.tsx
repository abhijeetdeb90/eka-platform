// ==============================================================================
// EKA CONSUMER PLATFORM — VISUAL-FIRST HOMEPAGE
// ==============================================================================

import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EKADynamicBanner } from "@/components/home/EKADynamicBanner";
import { LivingWorldVisual } from "@/components/home/LivingWorldVisual";
import { HomeStoriesSection } from "@/components/home/HomeStoriesSection";
import { DiscoveryJourney } from "@/components/home/DiscoveryJourney";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EKA — Understand the world." },
      {
        name: "description",
        content: "Don't just scroll the world. Understand it.",
      },
    ],
  }),
  component: EkaHomePage,
});

function DailyReflection() {
  return (
    <section className="container-eka mt-8">
      <div className="rounded-2xl border border-saffron/40 bg-gradient-to-br from-saffron/10 to-transparent p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="size-4 text-saffron-600 dark:text-saffron-400" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-saffron-700 dark:text-saffron-400 font-semibold">
            Daily Reflection
          </p>
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-normal text-foreground mb-4">
          "What is a tradition you carry that no one else in your life does?"
        </h3>
        <Link to="/feed" className="text-sm font-medium text-terracotta hover:underline">
          Join the conversation →
        </Link>
      </div>
    </section>
  );
}

function RecommendedForYou() {
  const topics = ["Vedic Chanting", "Japanese Tea Ceremony", "Stoicism", "Indigenous Navigation", "Sufi Poetry"];
  return (
    <section className="container-eka mt-12">
      <p className="font-mono text-[10px] uppercase tracking-widest text-terracotta font-semibold mb-2">
        HIGHLIGHTS
      </p>
      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mb-5">Recommended for You</h2>
      <div className="flex flex-wrap gap-3">
        {topics.map(t => (
          <div key={t} className="px-5 py-2.5 rounded-full border border-border/80 bg-card/60 hover:bg-accent cursor-pointer transition-colors text-sm font-medium text-foreground shadow-sm">
            {t}
          </div>
        ))}
      </div>
    </section>
  );
}

function FeedPreview() {
  return (
    <section className="container-eka mt-14 mb-10">
      <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mb-6">From the Community</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2].map(i => (
          <div key={i} className="p-6 rounded-2xl border border-border/60 bg-card/40 hover:border-border/80 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-accent/60" />
              <div>
                <p className="text-sm font-medium">Cultural Steward</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed mb-4">
              Just experienced the most incredible local festival. The colors, the sounds, the history behind it all points to a deep understanding of seasonal cycles. 
            </p>
            <Link to="/feed" className="text-xs font-semibold text-terracotta hover:underline">Read full story</Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function EkaHomePage() {
  const [askQuery, setAskQuery] = useState("");
  const navigate = useNavigate();

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = askQuery.trim();
    track("ask_query_submitted", { source: "homepage_hero", q });
    if (q) {
      navigate({ to: "/ask", search: { q, mode: "canon" } });
    } else {
      navigate({ to: "/ask", search: { q: "", mode: "canon" } });
    }
  };

  const handleChipClick = (query: string) => {
    track("search_submitted", { source: "homepage", q: query });
    navigate({ to: "/ask", search: { q: query, mode: "canon" } });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-terracotta/20">
      <SiteHeader />

      <main id="main-content" className="flex-1 pb-20">

        {/* 1. HERO */}
        <section className="container-eka pt-8 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 flex flex-col justify-center">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Don't just scroll the world.<br/>
                <span className="text-terracotta">Understand it.</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-muted-foreground font-light max-w-lg leading-relaxed">
                A billion stories. One world to understand. Explore places, meet people, and uncover the traditions that shape us.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/discover" className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-8 py-3.5 text-sm font-semibold hover:bg-foreground/90 transition-all shadow-md hover:shadow-lg active:scale-95">
                  Discover
                </Link>
                <Link to="/ask" search={{ q: "", mode: "canon" }} className="inline-flex items-center justify-center rounded-full border border-border bg-card/60 px-8 py-3.5 text-sm font-semibold hover:bg-accent transition-all active:scale-95">
                  Ask EKA
                </Link>
              </div>
            </div>
            <div className="lg:col-span-7 h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <EKADynamicBanner className="h-full w-full object-cover" />
            </div>
          </div>
        </section>

        {/* Daily Reflection */}
        <DailyReflection />

        {/* Highlights / Recommended */}
        <RecommendedForYou />

        {/* Trending Stories */}
        <div className="mt-14">
          <HomeStoriesSection />
        </div>

        {/* Discover Cards (Living World Visual) */}
        <section className="container-eka mt-14">
          <div className="mb-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-terracotta font-semibold">
              DISCOVER
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mt-2">
              The world is full of stories.
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              Explore places. Every point is a living tradition waiting to be understood.
            </p>
          </div>
          <LivingWorldVisual />
        </section>

        {/* Ask EKA Preview */}
        <section className="container-eka mt-16">
          <div className="rounded-3xl border border-border/80 bg-card/60 p-8 shadow-sm">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mb-6">
              Understand something.
            </h2>
            <form onSubmit={handleAskSubmit} className="flex gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/60 pointer-events-none" />
                <Input
                  value={askQuery}
                  onChange={(e) => setAskQuery(e.target.value)}
                  placeholder="Why do people light diyas? What is Bhoota Kola?"
                  className="rounded-full bg-background/95 text-base shadow-sm h-14 pl-12 pr-4 border-border/80 focus-visible:ring-terracotta/30"
                />
              </div>
              <Button
                type="submit"
                className="rounded-full px-8 h-14 bg-foreground text-background hover:bg-foreground/90 shrink-0 text-sm font-semibold"
              >
                Ask EKA
              </Button>
            </form>
            <div className="flex flex-wrap items-center gap-2.5 mt-5">
              {[
                "Why do people light diyas?",
                "Why is Varanasi sacred?",
                "What is Bhoota Kola?",
                "Why do Japanese bow?",
                "Holi vs. Songkran",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="rounded-full bg-accent/50 border border-border/60 hover:border-terracotta/30 px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Feed Preview */}
        <FeedPreview />

        {/* Continue Exploring (Discovery Journey) */}
        <div className="mt-16">
          <div className="container-eka mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">Continue Exploring</h2>
          </div>
          <DiscoveryJourney />
        </div>

      </main>

      <SiteFooter />
    </div>
  );
}
