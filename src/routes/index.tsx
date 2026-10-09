// ==============================================================================
// EKA CONSUMER PLATFORM — VISUAL-FIRST HOMEPAGE
// ==============================================================================
// Hero statement: A BILLION STORIES. ONE WORLD TO UNDERSTAND.
// Structure:
//   1. Full visual hero banner (existing EKADynamicBanner component)
//   2. Single-line brand statement + sub-hook
//   3. Ask EKA persistent entry
//   4. Stories preview (swipeable)
//   5. 5-pillar entry strip (no redundant copy)
//   6. Living World visual map
// ==============================================================================

import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EKADynamicBanner } from "@/components/home/EKADynamicBanner";
import { EKAHomeAuthPanel } from "@/components/home/EKAHomeAuthPanel";
import { LivingWorldVisual } from "@/components/home/LivingWorldVisual";
import { HomeStoriesSection } from "@/components/home/HomeStoriesSection";
import { DiscoveryJourney } from "@/components/home/DiscoveryJourney";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Compass,
  Film,
  BookOpen,
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/")(  {
  head: () => ({
    meta: [
      { title: "EKA — Understand the world." },
      {
        name: "description",
        content:
          "A billion stories. One world to understand. Explore places, meet people, understand traditions. Don't just scroll the world. Understand it.",
      },
      { property: "og:title", content: "EKA — A billion stories. One world to understand." },
      {
        property: "og:description",
        content: "Don't just scroll the world. Understand it.",
      },
      { property: "og:image", content: "/brand/eka-banner.jpg" },
    ],
  }),
  component: EkaHomePage,
});

function EkaHomePage() {
  const [askQuery, setAskQuery] = useState("");
  const navigate = useNavigate();

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = askQuery.trim();
    track("ask_eka_submitted" as any, { source: "homepage_hero", q });
    if (q) {
      navigate({ to: "/ask", search: { q } as any });
    } else {
      navigate({ to: "/ask", search: { q: "" } as any });
    }
  };

  const handleChipClick = (query: string) => {
    track("ask_eka_chip_clicked" as any, { source: "homepage", q: query });
    navigate({ to: "/ask", search: { q: query } as any });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-terracotta/20">
      <SiteHeader />

      <main id="main-content" className="flex-1 pb-20">

        {/* ==================================================================== */}
        {/* 1. HERO — FULL VISUAL BANNER + BRAND STATEMENT + AUTH PANEL          */}
        {/* ==================================================================== */}
        <section className="container-eka pt-4 sm:pt-6">
          {/* Brand statement — short, editorial, powerful */}
          <div className="mb-5 text-center sm:text-left">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-terracotta font-semibold mb-2">
              PRE-LAUNCH · EARLY ACCESS
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
              A BILLION STORIES.
              <br />
              <span className="text-muted-foreground font-light">ONE WORLD TO UNDERSTAND.</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground font-light">
              Don't just scroll the world.{" "}
              <span className="text-foreground font-medium">Understand it.</span>
            </p>
          </div>

          {/* Main hero grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-8 flex">
              <EKADynamicBanner className="h-full" />
            </div>
            <div className="lg:col-span-4 flex">
              <EKAHomeAuthPanel className="w-full h-full" />
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 2. ASK EKA — PRIMARY UNDERSTANDING INTERFACE                          */}
        {/* ==================================================================== */}
        <section className="container-eka mt-8">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-5 sm:p-6 shadow-xs">
            {/* Clean, direct headline */}
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-foreground mb-4">
              Understand something.
            </h2>

            <form onSubmit={handleAskSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
                <Input
                  value={askQuery}
                  onChange={(e) => setAskQuery(e.target.value)}
                  placeholder="Why do people light diyas? What is Bhoota Kola? Why do Japanese bow?"
                  className="rounded-full bg-background/95 text-sm shadow-xs h-11 pl-10 pr-4"
                />
              </div>
              <Button
                type="submit"
                className="rounded-full px-5 h-11 bg-foreground text-background hover:bg-foreground/90 shrink-0 text-sm font-medium"
              >
                Ask EKA
              </Button>
            </form>

            {/* Question chips — short, human */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {[
                "Why do people light diyas?",
                "Why is Varanasi sacred?",
                "What is Bhoota Kola?",
                "Why do Japanese bow?",
                "Diwali vs. Lunar New Year",
                "Holi vs. Songkran",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="rounded-full bg-accent/60 border border-border/60 hover:border-primary/50 px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 3. STORIES — VERTICAL REELS PREVIEW                                  */}
        {/* ==================================================================== */}
        <HomeStoriesSection />

        {/* ==================================================================== */}
        {/* 4. 5-PILLAR ENTRY STRIP — MINIMAL LABELS, NO MARKETING COPY          */}
        {/* ==================================================================== */}
        <section className="container-eka mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              {
                to: "/discover",
                icon: Compass,
                title: "Discover",
                sub: "Explore places",
              },
              {
                to: "/stories",
                icon: Film,
                title: "Stories",
                sub: "Watch & understand",
              },
              {
                to: "/learn",
                icon: BookOpen,
                title: "Learn",
                sub: "Go deeper",
              },
              {
                to: "/community",
                icon: Users,
                title: "Community",
                sub: "Meet people",
              },
              {
                to: "/create",
                icon: Plus,
                title: "Create",
                sub: "Contribute",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => track("navigation_clicked", { to: item.to, label: item.title, source: "homepage_strip" })}
                  className="group flex items-center gap-3 p-3.5 rounded-2xl border border-border/60 bg-card/60 hover:bg-accent/40 hover:border-border/80 transition-all"
                >
                  <div className="size-8 rounded-xl bg-accent/60 flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                    <Icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{item.sub}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 5. LIVING WORLD VISUAL — INTERACTIVE MAP                              */}
        {/* ==================================================================== */}
        <section className="container-eka mt-10 sm:mt-14">
          <div className="mb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta font-semibold">
              DISCOVER
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mt-1">
              The world is full of stories.
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Explore places. Every point is a living tradition.
            </p>
          </div>
          <LivingWorldVisual />
        </section>

        {/* ==================================================================== */}
        {/* 6. TRUST — VISUAL TRUST SIGNAL (SHORT)                               */}
        {/* ==================================================================== */}
        <section className="container-eka mt-10 sm:mt-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl border border-border/60 bg-card/40">
            <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Verified by communities, not algorithms.
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Every knowledge object shows its source, community, and contributor.
                No synthetic cultures. No invented traditions.
              </p>
            </div>
            <Link
              to="/standards"
              className="shrink-0 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              How EKA verifies <ArrowRight className="size-3" />
            </Link>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 7. DISCOVERY JOURNEY SCROLL                                           */}
        {/* ==================================================================== */}
        <DiscoveryJourney />

      </main>

      <SiteFooter />
    </div>
  );
}
