// ==============================================================================
// EKA CONSUMER PLATFORM — LIVING GATEWAY TO THE WORLD'S CULTURES
// ==============================================================================
// Primary positioning:
// "EKA: One World. A Billion Stories"
// "1 billion people. 1 billion stories. One living cultural archive for the world."
// "From family traditions and ancient rituals to languages, local histories, food,
//  crafts, festivals and everyday ways of life — EKA is building a living archive of human culture."
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Compass,
  Film,
  BookOpen,
  HelpCircle,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
  Send,
} from "lucide-react";
import { track } from "@/lib/analytics";
import { MetaTags, createWebApplicationSchema } from "@/components/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EKA — The World's Trusted Cultural Intelligence Layer" },
      {
        name: "description",
        content:
          "One Within. One With All. Don't just scroll the world. Understand it. Discover traditions, sacred places, living crafts, and festivals across the world through real human stories.",
      },
      { property: "og:title", content: "EKA — The World's Trusted Cultural Intelligence Layer" },
      {
        property: "og:description",
        content:
          "One Within. One With All. The world's trusted cultural intelligence layer connecting communities, traditions, and living knowledge.",
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
    if (askQuery.trim()) {
      navigate({ to: "/ask", search: { q: askQuery.trim() } as any });
    } else {
      navigate({ to: "/ask" });
    }
  };

  const handleChipClick = (query: string) => {
    navigate({ to: "/ask", search: { q: query } as any });
  };

  const handleScrollToWorld = () => {
    const el = document.getElementById("living-world");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-sand/20 dark:bg-stone-950 text-foreground flex flex-col selection:bg-terracotta/20">
      <MetaTags
        title="EKA — The World's Trusted Cultural Intelligence Layer"
        description="One Within. One With All. Don't just scroll the world. Understand it. Discover traditions, sacred places, living crafts, and festivals across the world through real human stories."
        ogTitle="EKA — The World's Trusted Cultural Intelligence Layer"
        ogDescription="One Within. One With All. The world's trusted cultural intelligence layer connecting communities, traditions, and living knowledge."
        ogImage="/brand/eka-banner.jpg"
        canonicalUrl="/"
        twitterCard="summary_large_image"
        twitterTitle="EKA — The World's Trusted Cultural Intelligence Layer"
        twitterDescription="One Within. One With All. Don't just scroll the world. Understand it."
        keywords={["cultural intelligence", "living traditions", "sacred geography", "indigenous knowledge", "rituals", "festivals"]}
        structuredData={createWebApplicationSchema()}
      />
      {/* 1. Primary Unified Navigation Header */}
      <SiteHeader />

      <main id="main-content" className="flex-1 space-y-12 sm:space-y-20 pb-20">
        {/* ==================================================================== */}
        {/* 1. HERO — DYNAMIC EDITORIAL CANVAS & PERSISTENT LOGIN PANEL */}
        {/* ==================================================================== */}
        <section className="container-eka pt-4 sm:pt-6">
          {/* Canonical Brand Context Ribbon */}
          <div className="mb-4 sm:mb-6 rounded-2xl border border-border/70 bg-card/60 p-4 sm:p-5 shadow-xs backdrop-blur-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="size-2 rounded-full bg-terracotta animate-pulse" />
                  <span className="font-display font-semibold text-xs tracking-wider uppercase text-terracotta">
                    The World's Trusted Cultural Intelligence Layer
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border border-terracotta/30 bg-terracotta/10 text-terracotta">
                    PRE-LAUNCH · EARLY ACCESS
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
                  <span className="text-xs text-muted-foreground italic hidden sm:inline">
                    One within. One with all.
                  </span>
                </div>
                <h1 className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-foreground">
                  Don't just scroll the world. Understand it.
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed max-w-4xl">
                  <strong>A living cultural archive of human heritage.</strong>{" "}
                  From master crafts and ancestral foodways to sacred geography, oral epics, classical languages, and living traditions — EKA transforms passive digital consumption into deep cultural comprehension and verified human context.
                </p>
              </div>

              {/* Quick Pillar Jump Links */}
              <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1">
                <Button asChild size="sm" variant="ghost" className="rounded-xl text-xs h-8">
                  <Link to="/discover">
                    <Compass className="size-3.5 mr-1 text-primary" />
                    <span>Discover</span>
                  </Link>
                </Button>
                <Button asChild size="sm" variant="ghost" className="rounded-xl text-xs h-8">
                  <Link to="/stories">
                    <Film className="size-3.5 mr-1 text-terracotta" />
                    <span>Stories</span>
                  </Link>
                </Button>
                <Button asChild size="sm" variant="ghost" className="rounded-xl text-xs h-8">
                  <Link to="/learn">
                    <BookOpen className="size-3.5 mr-1 text-saffron" />
                    <span>Learn</span>
                  </Link>
                </Button>
                <Button asChild size="sm" variant="ghost" className="rounded-xl text-xs h-8">
                  <Link to="/ask">
                    <HelpCircle className="size-3.5 mr-1 text-emerald-600" />
                    <span>Ask EKA</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left / Main Area: Living Editorial Dynamic Banner */}
            <div className="lg:col-span-8 flex">
              <EKADynamicBanner
                onExploreWorld={handleScrollToWorld}
                className="h-full"
              />
            </div>

            {/* Right Area: Persistent, Calm Login Panel */}
            <div className="lg:col-span-4 flex">
              <EKAHomeAuthPanel className="w-full h-full" />
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 1.5 ASK EKA — PRIMARY CULTURAL INTELLIGENCE INTERACTION */}
        {/* ==================================================================== */}
        <section className="container-eka">
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-sand/30 via-sand/20 to-sand/40 p-6 sm:p-8 shadow-calm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-saffron" />
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold text-terracotta">
                    Ask EKA · Living Cultural Intelligence
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                  Ask EKA anything about culture.
                </h2>
              </div>
              <Badge variant="outline" className="text-xs font-mono text-muted-foreground self-start sm:self-auto">
                Grounding in EKA Verified Canon
              </Badge>
            </div>

            <form onSubmit={handleAskSubmit} className="flex gap-2">
              <Input
                value={askQuery}
                onChange={(e) => setAskQuery(e.target.value)}
                placeholder="Why do people light diyas? What is Bhoota Kola? Why do Japanese bow?..."
                className="rounded-full bg-background/95 text-sm shadow-xs h-11 px-5"
              />
              <Button
                type="submit"
                className="rounded-full px-6 h-11 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 gap-1.5"
              >
                <Sparkles className="size-4 text-saffron" />
                <span className="hidden sm:inline">Ask EKA</span>
                <Send className="size-4 sm:hidden" />
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground font-medium">Curious minds ask:</span>
              {[
                "Why do people light diyas?",
                "Why is Varanasi sacred?",
                "What is Bhoota Kola?",
                "Why do Japanese bow?",
                "Inside a Bengali Wedding",
                "Diwali vs. Lunar New Year",
                "Holi vs. Songkran",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="rounded-full bg-background/80 border border-border/80 hover:border-primary/60 px-3 py-1 text-xs text-foreground hover:text-primary transition-all text-left shadow-2xs"
                >
                  › {chip}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 2. STORIES FROM THE WORLD — 9:16 VERTICAL REELS PREVIEW (MANDATORY) */}
        {/* ==================================================================== */}
        <HomeStoriesSection />

        {/* ==================================================================== */}
        {/* 3. SIX PILLARS ACTION STRIP — THE CONTINUOUS EKA LOOP */}
        {/* ==================================================================== */}
        <section className="container-eka">
          <div className="rounded-3xl border border-border/80 bg-card/70 p-6 sm:p-8 shadow-calm">
            <div className="text-center max-w-3xl mx-auto space-y-2.5 mb-8">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-terracotta font-semibold">
                The Core Cultural Intelligence Loop
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                From Passive Scrolling to Living Understanding
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                <span className="font-medium text-foreground">DISCOVER</span> → <span className="font-medium text-foreground">UNDERSTAND</span> → <span className="font-medium text-foreground">ASK</span> → <span className="font-medium text-foreground">EXPLORE DEEPER</span> → <span className="font-medium text-foreground">CONNECT</span> → <span className="font-medium text-foreground">SAVE / FOLLOW</span> → <span className="font-medium text-foreground">RETURN</span> → <span className="font-medium text-foreground">CONTRIBUTE</span>
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {[
                {
                  to: "/discover",
                  icon: Compass,
                  color: "text-blue-500",
                  title: "Discover",
                  action: "Find the world",
                  desc: "Interactive map of sacred places & local life",
                },
                {
                  to: "/stories",
                  icon: Film,
                  color: "text-terracotta",
                  title: "Stories",
                  action: "Experience the world",
                  desc: "9:16 vertical reels from living lineages",
                },
                {
                  to: "/learn",
                  icon: BookOpen,
                  color: "text-saffron",
                  title: "Learn",
                  action: "Understand the world",
                  desc: "Guides, cultural explainers & histories",
                },
                {
                  to: "/ask",
                  icon: HelpCircle,
                  color: "text-emerald-500",
                  title: "Ask EKA",
                  action: "Ask anything",
                  desc: "Universal cultural knowledge search",
                },
                {
                  to: "/community",
                  icon: Users,
                  color: "text-purple-500",
                  title: "Community",
                  action: "Connect with people",
                  desc: "Join Sanghas, discussions & elders",
                },
                {
                  to: "/create",
                  icon: Plus,
                  color: "text-orange-500",
                  title: "Create",
                  action: "Contribute to archive",
                  desc: "Preserve family memories & practices",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    to={item.to}
                    onClick={() => track("navigation_clicked", { to: item.to, label: item.title })}
                    className="group flex flex-col justify-between p-4 rounded-2xl border border-border/70 bg-background/80 hover:bg-accent/40 hover:border-primary/40 hover:shadow-xs transition-all"
                  >
                    <div className="space-y-2">
                      <div className="size-9 rounded-xl bg-accent/60 flex items-center justify-center">
                        <Icon className={`size-4.5 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[11px] font-mono text-primary font-medium">
                          {item.action}
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug mt-2 line-clamp-2">
                      {item.desc}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 4. LIVING WORLD VISUAL — INTERACTIVE MAP & CURIOSITY LOOP */}
        {/* ==================================================================== */}
        <section className="container-eka">
          <LivingWorldVisual />
        </section>

        {/* ==================================================================== */}
        {/* 5. SCROLL EXPERIENCE & DISCOVERY JOURNEY */}
        {/* ==================================================================== */}
        <DiscoveryJourney />
      </main>

      {/* 6. Global Site Footer */}
      <SiteFooter />
    </div>
  );
}
