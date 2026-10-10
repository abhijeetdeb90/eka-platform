import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, Compass, Users, Sparkles, BookOpen, Globe2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EkaLogo } from "@/components/brand/Logo";
import { MetaTags } from "@/components/seo";
import { ConsumerHeader } from "@/apps/consumer/components/ConsumerHeader";
import { ConsumerFooter } from "@/apps/consumer/components/ConsumerFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About EKA — Understand the World" },
      {
        name: "description",
        content:
          "EKA is a simple, mobile-first social app for real human connections and cultural understanding. Don't just scroll the world. Understand it.",
      },
      { property: "og:title", content: "About EKA — Understand the World" },
      {
        property: "og:description",
        content:
          "Explore living traditions, ask cultural questions, and share everyday life across communities.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <MetaTags
        title="About EKA — Understand the World"
        description="EKA is a simple, mobile-first social app for real human connections and cultural understanding."
        ogTitle="About EKA — Understand the World"
        ogDescription="Explore living traditions, ask cultural questions, and share everyday life across communities."
        canonicalUrl="/about"
      />

      <ConsumerHeader />

      <main className="flex-1 container-eka max-w-4xl py-12 sm:py-16 space-y-12">
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-terracotta font-semibold">
              Our Purpose
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-medium tracking-tight">
            Don't just scroll the world. Understand it.
          </h1>
          <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
            EKA is a social platform built for curiosity, cultural connection, and real human traditions.
            A place to explore ordinary stories, ask deep cultural questions, and learn from living lineages.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-3 shadow-calm">
            <div className="size-10 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
              <Globe2 className="size-5" />
            </div>
            <h3 className="font-display text-lg font-medium text-foreground">
              Real Human Heritage
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Real stories told by real people — from daily family recipes and seasonal festivals to master crafts and ancient philosophical roots.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-3 shadow-calm">
            <div className="size-10 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron">
              <Sparkles className="size-5" />
            </div>
            <h3 className="font-display text-lg font-medium text-foreground">
              Ask EKA
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Curiosity loops that explain the "why" behind what you see. Every ritual, recipe, and greeting connects to verified living context.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-3 shadow-calm">
            <div className="size-10 rounded-xl bg-forest/10 flex items-center justify-center text-forest">
              <Heart className="size-5" />
            </div>
            <h3 className="font-display text-lg font-medium text-foreground">
              Human-First Community
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No synthetic engagement bots, no polarizing algorithms. A respectful sanctuary where curiosity thrives and diversity is celebrated.
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="rounded-2xl border border-primary/20 bg-accent/20 p-8 space-y-4">
          <h2 className="font-display text-2xl font-medium">Why EKA Exists</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Most social feeds compress the world into algorithmic trends, synthetic noise, and reactive outrage.
            We believe that humanity's deepest cultural richness — our songs, festivals, foodways, crafts, and wisdom —
            deserves a sanctuary where anyone can participate, share, and ask why.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Button asChild className="rounded-xl bg-gradient-to-r from-terracotta to-saffron text-white">
              <Link to="/feed">Explore Community Feed</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/standards">Read Community Standards</Link>
            </Button>
          </div>
        </div>
      </main>

      <ConsumerFooter />
    </div>
  );
}
