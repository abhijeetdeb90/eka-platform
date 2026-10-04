// ==============================================================================
// EKA REGIONAL DISCOVERY PROGRESSION — NO REGIONAL SILOS
// ==============================================================================
// "YOUR WORLD: Assam → India → South Asia → Asia → World"
// Users begin with what is intimately familiar, and are progressively exposed
// to the wider cultural tapestry of India and the world.
// ==============================================================================

import React, { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Compass,
  ArrowRight,
  Sparkles,
  MapPin,
  Globe,
  Layers,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocalization } from "@/lib/i18n";
import type { RegionalContext } from "@/lib/i18n/types";
import { getContent } from "@/lib/knowledge/multilingual-content";

interface CulturalProgressionItem {
  slug: string;
  category: string;
  image: string;
  region: string;
}

export function RegionalDiscoveryProgression() {
  const { region, locale, t, localeInfo } = useLocalization();

  // Tier 1: "From your region"
  const regionalItems: CulturalProgressionItem[] = useMemo(() => {
    if (region === "assam" || locale === "as") {
      return [
        {
          slug: "bohag-bihu",
          category: "Living Festival",
          image: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
          region: "Assam",
        },
        {
          slug: "majuli-sattra-culture",
          category: "Riverine Monasticism",
          image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
          region: "Majuli, Assam",
        },
      ];
    }

    if (region === "tamil_nadu" || locale === "ta") {
      return [
        {
          slug: "pongal",
          category: "Harvest & Solar Rite",
          image: "https://images.unsplash.com/photo-1610448721566-47369c768e70?q=80&w=800&auto=format&fit=crop",
          region: "Tamil Nadu",
        },
        {
          slug: "toda-dairy-ritual",
          category: "Sacred Pastoral Ritual",
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
          region: "Nilgiris, Tamil Nadu",
        },
      ];
    }

    // Default India / Hindi Belt
    return [
      {
        slug: "diwali",
        category: "Living Festival",
        image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=800&auto=format&fit=crop",
        region: "Varanasi & Ayodhya",
      },
      {
        slug: "bishnoi-conservation",
        category: "Ecological Ethics",
        image: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=800&auto=format&fit=crop",
        region: "Rajasthan",
      },
    ];
  }, [region, locale]);

  // Tier 2: "Around India" (Exposes users to distinct traditions from other states)
  const aroundIndiaItems: CulturalProgressionItem[] = useMemo(() => {
    const pool: CulturalProgressionItem[] = [
      {
        slug: "aranmula-kannadi",
        category: "Sacred Metallurgy",
        image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=800&auto=format&fit=crop",
        region: "Kerala",
      },
      {
        slug: "patan-patola",
        category: "Double-Ikat Silk Craft",
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop",
        region: "Gujarat",
      },
      {
        slug: "diwali",
        category: "Festival of Lights",
        image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=800&auto=format&fit=crop",
        region: "Pan-India",
      },
    ];

    // Filter out items already in tier 1
    const tier1Slugs = new Set(regionalItems.map((r) => r.slug));
    return pool.filter((item) => !tier1Slugs.has(item.slug));
  }, [regionalItems]);

  // Tier 3: "Discover the world"
  const globalItems: CulturalProgressionItem[] = [
    {
      slug: "karesansui-ryoanji",
      category: "Zen Dry Rock Garden",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
      region: "Kyoto, Japan",
    },
    {
      slug: "marrakesh-courtyard",
      category: "Islamic Courtyard Riad",
      image: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop",
      region: "Marrakesh, Morocco",
    },
    {
      slug: "jerusalem-old-city",
      category: "Sacred Intersections",
      image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=800&auto=format&fit=crop",
      region: "Jerusalem",
    },
  ];

  return (
    <section className="space-y-12">
      {/* Hierarchy Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="text-xs font-mono uppercase tracking-wider text-primary border-primary/40 bg-primary/5"
            >
              <Globe className="size-3 mr-1.5 inline" />
              {localeInfo.regionName} · Global Cultural Progression
            </Badge>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Your World: Familiar Lineages, Wider Horizons
          </h2>
          <p className="mt-1 text-sm text-muted-foreground font-serif">
            Start with your regional roots, travel across India, and explore the living cultures of the world.
          </p>
        </div>

        <Link
          to="/knowledge"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline shrink-0"
        >
          <span>Explore Entire Knowledge Graph</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* 1. TIER 1: FROM YOUR REGION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-terracotta" />
            <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
              {t("section.fromYourRegion")} ({localeInfo.regionName})
            </h3>
          </div>
          <span className="text-xs font-mono text-muted-foreground">Local Roots</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regionalItems.map((item) => {
            const content = getContent({ entity: item.slug, language: locale });
            return (
              <Link
                key={item.slug}
                to="/knowledge/$slug"
                params={{ slug: item.slug }}
                className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-calm transition-all hover:border-primary/50 hover:shadow-lift flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="outline" className="text-[10px] font-mono uppercase text-muted-foreground">
                      {item.category}
                    </Badge>
                    <Badge className="bg-emerald-600/90 text-white text-[10px] flex items-center gap-1">
                      <ShieldCheck className="size-3" />
                      Verified
                    </Badge>
                  </div>

                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {content.localizedTitle}
                  </h4>

                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {content.localizedSummary}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-mono flex items-center gap-1">
                    <MapPin className="size-3 text-primary" />
                    {item.region}
                  </span>
                  <span className="font-medium text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Read canonical entry <ChevronRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. TIER 2: AROUND INDIA */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-saffron" />
            <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
              {t("section.aroundIndia")}
            </h3>
          </div>
          <span className="text-xs font-mono text-muted-foreground">Subcontinental Heritage</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aroundIndiaItems.map((item) => {
            const content = getContent({ entity: item.slug, language: locale });
            return (
              <Link
                key={item.slug}
                to="/knowledge/$slug"
                params={{ slug: item.slug }}
                className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-calm transition-all hover:border-primary/50 hover:shadow-lift flex flex-col justify-between min-h-[200px]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <Badge variant="outline" className="text-[10px] font-mono uppercase text-muted-foreground">
                      {item.category}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3 text-primary" />
                      {item.region}
                    </span>
                  </div>

                  <h4 className="font-serif text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {content.localizedTitle}
                  </h4>

                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {content.localizedSummary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-mono text-[11px]">
                    Canonical Knowledge Object
                  </span>
                  <span className="font-medium text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Explore <ChevronRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. TIER 3: DISCOVER THE WORLD */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-forest" />
            <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
              {t("section.discoverWorld")}
            </h3>
          </div>
          <span className="text-xs font-mono text-muted-foreground">Global Lineages</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {globalItems.map((item) => {
            const content = getContent({ entity: item.slug, language: locale });
            return (
              <Link
                key={item.slug}
                to="/knowledge/$slug"
                params={{ slug: item.slug }}
                className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-calm transition-all hover:border-primary/50 hover:shadow-lift flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3 text-primary" />
                      {item.region}
                    </span>
                  </div>

                  <h4 className="font-serif text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {content.localizedTitle}
                  </h4>

                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {content.localizedOneLiner}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-primary font-medium">
                  <span>Understand Lineage</span>
                  <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
