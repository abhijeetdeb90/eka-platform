/**
 * EKA Monetization & Access Model
 *
 * Core Philosophy:
 * - Knowledge should be free.
 * - Intelligence should be paid.
 * - Creation should be paid.
 *
 * Product Architecture:
 * - FREE: Discover → Read → Explore → Follow
 * - EKA+: Ask → Understand → Compare → Research
 * - CREATOR: Create → Publish → Analyse → Grow
 */

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MonetizationTier = "free" | "plus" | "creator";

export interface AccessModelFeature {
  id: string;
  name: string;
  category: "Knowledge (Library)" | "Intelligence (AI)" | "Creation (Studio)";
  free: boolean;
  paid: boolean;
  description: string;
}

/**
 * Canonical EKA Feature Matrix matching specification:
 * Knowledge is free, Intelligence is paid, Creation is paid.
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

  // 2. EKA Intelligence (AI & Deep Research) — Paid (EKA+)
  {
    id: "eka_ai",
    name: "EKA AI",
    category: "Intelligence (AI)",
    free: false,
    paid: true,
    description: "Ask EKA contextual inquiry engine powered by grounded epistemic models and primary provenance.",
  },
  {
    id: "ai_cultural_comparisons",
    name: "AI cultural comparisons",
    category: "Intelligence (AI)",
    free: false,
    paid: true,
    description: "Cross-cultural parallel synthesis comparing rituals, foodways, and spiritual roots across civilizations.",
  },
  {
    id: "personalized_learning",
    name: "Personalised cultural learning",
    category: "Intelligence (AI)",
    free: false,
    paid: true,
    description: "Tailored daily wisdom, 7-to-90 day contemplative journeys, and adaptive curiosity loops.",
  },
  {
    id: "deep_research",
    name: "Deep research / source exploration",
    category: "Intelligence (AI)",
    free: false,
    paid: true,
    description: "Primary manuscript citations, multi-lingual translations, academic verifiers, and lineage roots.",
  },

  // 3. Creator Studio & Monetization — Free creation for all, Pro tools for creators
  {
    id: "create_publish",
    name: "Publish stories, photos, videos & carousels",
    category: "Creation (Studio)",
    free: true,
    paid: true,
    description: "Share reflections, stories, multi-image carousels, and video reels with the global community for free.",
  },
  {
    id: "creator_studio",
    name: "Creator Studio",
    category: "Creation (Studio)",
    free: false,
    paid: true,
    description: "Professional monetization workspace for cultural storytellers, researchers, and community custodians.",
  },
  {
    id: "creator_analytics",
    name: "Creator analytics",
    category: "Creation (Studio)",
    free: false,
    paid: true,
    description: "Real-time engagement telemetry, Qualified Contribution Score (QCS), and audience insights.",
  },
  {
    id: "advanced_creator_tools",
    name: "Advanced monetization & offerings",
    category: "Creation (Studio)",
    free: false,
    paid: true,
    description: "Publish paid workshops, consultations, cultural experiences, digital products, and manage payout ledgers.",
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

export const PRODUCT_TIERS: Record<MonetizationTier, ProductTierConfig> = {
  free: {
    id: "free",
    badge: "Open Cultural Commons",
    name: "Free Seeker",
    tagline: "Discover → Share → Connect → Belong",
    headline: "Creation and knowledge are open to all.",
    price: "₹0",
    period: "forever",
    priceNote: "Free forever · No credit card required",
    description:
      "Open access to explore EKA's cultural library, post reflections, share photos, publish stories, upload videos, and create carousels.",
    highlights: [
      "Publish photos, stories, videos & multi-image carousels",
      "Explore the interactive Global Cultural Map",
      "Read all cultural stories & living traditions",
      "Join Circles and connect with custodians",
      "Full search across global cultural knowledge",
      "Follow creators & save public traditions",
    ],
    ctaLabel: "Start Exploring Free",
    actionUrl: "/discover",
  },
  plus: {
    id: "plus",
    badge: "EKA Intelligence",
    name: "EKA+",
    tagline: "Ask → Understand → Compare → Research",
    headline: "Intelligence should be paid.",
    price: "₹299",
    period: "month",
    priceNote: "+ applicable taxes · Cancel anytime",
    description:
      "Go beyond the story. Ask questions with EKA AI, compare cultures across regions, and explore deep verified sources.",
    highlights: [
      "Ask EKA AI: Grounded contextual intelligence",
      "AI Cross-cultural comparison & parallel synthesis",
      "Personalised cultural learning & daily journeys",
      "Deep research: Primary sources & manuscript citations",
      "Grounded in verified primary lineages & zero hallucination",
    ],
    ctaLabel: "Unlock EKA+ Intelligence",
    actionUrl: "/membership",
    popular: true,
  },
  creator: {
    id: "creator",
    badge: "Paid Workspace",
    name: "Creator Studio",
    tagline: "Create → Publish → Analyse → Grow",
    headline: "Creation should be paid.",
    price: "₹799",
    period: "month",
    priceNote: "+ applicable taxes · Professional suite",
    description:
      "A dedicated, professional workspace for cultural storytellers, researchers, and lineage custodians to publish paid offerings and earn.",
    highlights: [
      "Full Creator Studio professional workspace",
      "Offer paid workshops, cultural consultations & masterclasses",
      "Transaction-driven commerce with transparent 5–10% commission",
      "Audience analytics & Qualified Contribution Score (QCS)",
      "Direct payout settlement ledger with automated tax compliance",
    ],
    ctaLabel: "Enter Creator Studio",
    actionUrl: "/app/creator",
  },
};

export const CORE_PHILOSOPHY = {
  title: "The Important Distinction",
  pillars: [
    {
      title: "Knowledge should be free.",
      description:
        "EKA's cultural database and global map are completely open. Cultural stories are never locked behind a paywall; they belong to the human commons.",
    },
    {
      title: "Intelligence should be paid.",
      description:
        "EKA AI, contextual synthesis, personalized learning paths, and cross-cultural comparisons require computation and epistemic curation.",
    },
    {
      title: "Creation is open to everyone.",
      description:
        "Every seeker can post stories, share photos, upload videos, and build multi-slide carousels for free. Creator Studio is an optional workspace for professional creators who offer ticketed events, workshops, cultural experiences, consultations, and digital products, with transparent transaction accounting and direct payouts.",
    },
  ],
  subscriptionHook:
    "Go beyond the story. Ask questions. Compare cultures. Explore deeper. Create with EKA.",
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

  // Intelligence is accessible to EKA+ and Creator tiers
  const canUseIntelligence = tier === "plus" || tier === "creator";

  // Creator workspace is accessible only to Creator tier
  const canUseCreatorStudio = tier === "creator";

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
