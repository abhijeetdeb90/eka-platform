/**
 * EKA Monetization & Access Model
 *
 * Core Philosophy:
 * - Knowledge is free.
 * - Intelligence is premium.
 * - Creation is rewarded.
 *
 * Product Architecture:
 * - Free Seeker (₹0): Discover → Read → Explore → Publish (photos, videos, carousels, articles) → Follow
 * - EKA+ (₹499/mo): Ask EKA AI → Understand → Deeper Research → Creator Analytics & Workspace
 */

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MonetizationTier = "free" | "plus" | "creator";

export interface AccessModelFeature {
  id: string;
  name: string;
  category: "Knowledge (Library)" | "Intelligence (AI)" | "Creation & Analytics";
  free: boolean;
  paid: boolean;
  description: string;
}

/**
 * Canonical EKA Feature Matrix matching revised specification:
 * Knowledge is free. Intelligence is premium. Creation is rewarded.
 */
export const EKA_ACCESS_FEATURES: AccessModelFeature[] = [
  // 1. Cultural Library (Knowledge) — 100% Free & Open
  {
    id: "global_map",
    name: "Explore the global map",
    category: "Knowledge (Library)",
    free: true,
    paid: true,
    description: "Explore 195+ countries, interactive map pins, regions, and geographic cultural hotspots without restriction.",
  },
  {
    id: "cultural_stories",
    name: "Read all cultural stories",
    category: "Knowledge (Library)",
    free: true,
    paid: true,
    description: "Full access to thousands of living cultural traditions, festivals, rituals, and heritage stories.",
  },
  {
    id: "images_traditions_places",
    name: "View images, traditions & places",
    category: "Knowledge (Library)",
    free: true,
    paid: true,
    description: "High-resolution curated media, authentic photos, sacred places, and community practices.",
  },
  {
    id: "cultures_communities",
    name: "Explore cultures & communities",
    category: "Knowledge (Library)",
    free: true,
    paid: true,
    description: "Discover custodian communities, languages, ethnic lineages, and regional origins.",
  },
  {
    id: "search_knowledge",
    name: "Search cultural knowledge",
    category: "Knowledge (Library)",
    free: true,
    paid: true,
    description: "Full-text search across EKA's public cultural database, traditions, places, and tags.",
  },

  // 2. Open Publishing — 100% Free for all registered users
  {
    id: "create_publish",
    name: "Free publishing for all creators",
    category: "Creation & Analytics",
    free: true,
    paid: true,
    description: "Publish reflections, photos, vertical videos/reels, multi-image carousels, and written stories with zero paywall.",
  },

  // 3. EKA+ Unified Subscription (₹499/mo) — AI, Research & Creator Analytics
  {
    id: "eka_ai",
    name: "Ask EKA AI (Source-Backed)",
    category: "Intelligence (AI)",
    free: false,
    paid: true,
    description: "Source-backed cultural questions, contextual inquiries, and citation links with monthly usage allowance.",
  },
  {
    id: "ai_cultural_comparisons",
    name: "AI cross-cultural comparisons",
    category: "Intelligence (AI)",
    free: false,
    paid: true,
    description: "Cross-cultural parallel synthesis comparing rituals, foodways, and spiritual roots across civilizations.",
  },
  {
    id: "deep_research",
    name: "Advanced research & source lineages",
    category: "Intelligence (AI)",
    free: false,
    paid: true,
    description: "Deeper research workflows, follow-up inquiries, and primary manuscript references where operational.",
  },
  {
    id: "creator_analytics",
    name: "Creator performance analytics",
    category: "Creation & Analytics",
    free: false,
    paid: true,
    description: "Real-time engagement telemetry, content performance summaries, and audience insights based on stored data.",
  },
  {
    id: "creator_studio_workspace",
    name: "Creator Studio workspace",
    category: "Creation & Analytics",
    free: false,
    paid: true,
    description: "Professional content management workspace, drafts management, and structured publishing tools.",
  },
];

export interface ProductTierConfig {
  id: MonetizationTier;
  badge: string;
  name: string;
  tagline: string;
  headline: string;
  price: string;
  period: string;
  priceNote: string;
  description: string;
  highlights: string[];
  ctaLabel: string;
  actionUrl: string;
  popular?: boolean;
}

export const PRODUCT_TIERS: Record<"free" | "plus", ProductTierConfig> = {
  free: {
    id: "free",
    badge: "Open Cultural Commons",
    name: "EKA Seeker",
    tagline: "Discover → Share → Connect → Belong",
    headline: "Discover culture. Share your story. Find your community.",
    price: "₹0",
    period: "forever",
    priceNote: "Free forever · No credit card required",
    description:
      "Open access to explore EKA's cultural library and publish photos, vertical videos, reels, carousels, and stories freely.",
    highlights: [
      "Publish photos, vertical videos, reels & multi-image carousels",
      "Publish cultural stories and written articles",
      "Create a profile & build your audience",
      "Explore the interactive Global Cultural Map",
      "Read all cultural stories & living traditions",
      "Follow creators, save public traditions & join communities",
    ],
    ctaLabel: "Start Exploring Free",
    actionUrl: "/discover",
  },
  plus: {
    id: "plus",
    badge: "Unified Membership",
    name: "EKA+",
    tagline: "Understand deeper. Research smarter. Grow your audience.",
    headline: "Understand deeper. Research smarter. Grow your audience.",
    price: "₹499",
    period: "month",
    priceNote: "+ applicable taxes · Cancel anytime",
    description:
      "Cultural intelligence and professional creator tools unified in one membership. Source-backed AI, deep research, and creator analytics.",
    highlights: [
      "Ask EKA AI: Source-backed cultural questions & research",
      "Cross-cultural comparisons & contextual synthesis",
      "Advanced research workflows & verified citations",
      "Creator analytics: Real stored audience & content telemetry",
      "Creator Studio: Professional content management workspace",
    ],
    ctaLabel: "Get EKA+",
    actionUrl: "/membership",
    popular: true,
  },
};

export const CORE_PHILOSOPHY = {
  title: "The Core Philosophy",
  tagline: "Knowledge is free. Intelligence is premium. Creation is rewarded.",
  pillars: [
    {
      title: "Knowledge is free.",
      description:
        "EKA's cultural database and global map are completely open. Cultural stories belong to the human commons and are never paywalled.",
    },
    {
      title: "Intelligence is premium.",
      description:
        "Source-backed Ask EKA AI, contextual synthesis, cross-cultural comparisons, and manuscript exploration require computation and epistemic curation.",
    },
    {
      title: "Creation is rewarded.",
      description:
        "Publishing photos, videos, carousels, and articles is 100% free for everyone. EKA+ provides unified creator analytics and advanced workspace tools to help you grow your audience.",
    },
  ],
  subscriptionHook:
    "Discover freely. Share your lineage. Go deeper with EKA+.",
};

const STORAGE_KEY = "eka_user_tier_preview";

/**
 * Hook to manage monetization tier with live preview toggling for instant dev / user verification.
 */
export function useMonetizationTier() {
  const [tier, setTierState] = useState<MonetizationTier>("free");
  const [isSimulated, setIsSimulated] = useState(false);

  useEffect(() => {
    // Check localStorage simulation first
    const saved = localStorage.getItem(STORAGE_KEY) as MonetizationTier | null;
    if (saved && (saved === "free" || saved === "plus" || saved === "creator")) {
      setTierState(saved);
      setIsSimulated(true);
      return;
    }

    // Otherwise check Supabase subscription
    void (async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (auth.user) {
          const { data } = await supabase
            .from("subscriptions")
            .select("plan, status")
            .eq("user_id", auth.user.id)
            .maybeSingle();

          if (data && (data.status === "active" || data.status === "trialing")) {
            if (data.plan === "creator") {
              setTierState("creator");
            } else {
              setTierState("plus");
            }
          }
        }
      } catch {
        // Fallback to free
      }
    })();
  }, []);

  const setTier = (newTier: MonetizationTier) => {
    setTierState(newTier);
    setIsSimulated(true);
    localStorage.setItem(STORAGE_KEY, newTier);
  };

  const resetToReal = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsSimulated(false);
    setTierState("free");
  };

  const isFree = tier === "free";
  const isPlus = tier === "plus";
  const isCreator = tier === "creator";

  // Intelligence is accessible to EKA+ subscribers (and legacy creator records)
  const canUseIntelligence = tier === "plus" || tier === "creator";

  // Creator workspace & analytics are unified into EKA+ (and accessible to legacy creator subscribers)
  const canUseCreatorStudio = tier === "plus" || tier === "creator";

  return {
    tier,
    isFree,
    isPlus,
    isCreator,
    canUseIntelligence,
    canUseCreatorStudio,
    isSimulated,
    setTier,
    resetToReal,
  };
}
