// ==============================================================================
// EKA PRODUCT STATUS REGISTRY — SINGLE SOURCE OF TRUTH FOR INVESTOR PRESENTATION
// ==============================================================================
// Framework: LIVE (Production operational), BETA (Functional, tested/rolled out),
// ROADMAP (Planned, strategic future direction).
// ==============================================================================

import type { MaturityStatus } from "@/components/investor/ProductStatus";

export interface ProductFeature {
  id: string;
  name: string;
  status: MaturityStatus;
  description: string;
}

export interface InvestorProduct {
  id: string;
  name: string;
  headline: string;
  status: MaturityStatus;
  sublabel: string;
  description: string;
  url: string;
  externalUrl?: string;
  platform: "Web" | "Android" | "iOS" | "Cross-Platform" | "Infrastructure & APIs";
  version: string;
  accessType: "Open Web" | "Secure Investor Demo" | "Controlled Distribution" | "TestFlight Beta" | "Roadmap";
  lastVerified: string;
  investorVisible: boolean;
  repo: string;
  features: ProductFeature[];
  mobileSpecs?: {
    framework: string;
    bundleId: string;
    distributionChannel: string;
    targetOs: string;
    buildStatus: string;
    downloadNote: string;
  };
  demoAccess?: {
    role: "consumer" | "admin" | "enterprise";
    email: string;
    note: string;
  };
}

export interface RoadmapItem {
  id: string;
  title: string;
  category: "Platform" | "Community" | "Enterprise" | "Technology" | "Global";
  target: "2027" | "Future" | "Under Exploration";
  description: string;
  impact: string;
}

/**
 * 1. Master Product Registry
 */
export const PRODUCT_STATUS_REGISTRY: InvestorProduct[] = [
  {
    id: "consumer-web",
    name: "EKA Consumer Web",
    headline: "One World. A Billion Stories.",
    status: "LIVE",
    sublabel: "Production systems currently operational",
    description:
      "Universal living cultural discovery sanctuary. Explores living traditions, sacred cartography, 9:16 vertical reels, structured knowledge codex, and community circles.",
    url: "/",
    platform: "Web",
    version: "v2.4.0-production",
    accessType: "Open Web",
    lastVerified: "2026-10-06",
    investorVisible: true,
    repo: "abhijeetdeb90/eka-platform",
    features: [
      {
        id: "cw-home",
        name: "Living Editorial Home",
        status: "LIVE",
        description: "Dynamic editorial canvas, continuous cultural loop & daily ritual",
      },
      {
        id: "cw-discover",
        name: "Cultural Cartography & Map",
        status: "LIVE",
        description: "Google Maps Platform integration, sacred geography & places",
      },
      {
        id: "cw-stories",
        name: "1 Billion Stories (Reels)",
        status: "LIVE",
        description: "9:16 vertical short-form cultural reels from living lineages",
      },
      {
        id: "cw-learn",
        name: "Knowledge Codex & Explainers",
        status: "LIVE",
        description: "Structured explainers across 10 cultural dimensions",
      },
      {
        id: "cw-ask",
        name: "Ask EKA (AI Companion)",
        status: "LIVE",
        description: "Semantic cultural question answering with Google Gemini 2.5 flash",
      },
      {
        id: "cw-community",
        name: "Community Circles (Sanghas)",
        status: "LIVE",
        description: "Multi-faith cultural groups, discourse topics & member circles",
      },
      {
        id: "cw-messages",
        name: "Meaningful Direct Messages",
        status: "LIVE",
        description: "Secure 1:1 and practitioner messaging conversations",
      },
      {
        id: "cw-my-eka",
        name: "My EKA & Wisdom Passport",
        status: "LIVE",
        description: "Personal reflections, bookmarks, practice history & settings",
      },
      {
        id: "cw-create",
        name: "Discourse & Story Composer",
        status: "LIVE",
        description: "User and artisan contribution to the living global archive",
      },
      {
        id: "cw-recs",
        name: "Cross-Cultural Affinity Engine",
        status: "BETA",
        description: "Algorithmic recommendations across traditions undergoing testing",
      },
    ],
    demoAccess: {
      role: "consumer",
      email: "investor.consumer@eka.demo",
      note: "Instant 1-click consumer exploration with sample bookmarks & active feed",
    },
  },
  {
    id: "founder-admin",
    name: "EKA Admin & Operations OS",
    headline: "Mission Governance & Platform Controls",
    status: "LIVE",
    sublabel: "Operational administrative platform with investor-safe presentation mode",
    description:
      "Executive control plane featuring Founder Cockpit, 12-subsystem topology, oral history moderation queues, platform economics, double-entry ledgers, and trust & safety.",
    url: "/founder-admin",
    platform: "Web",
    version: "v2.4.0-admin",
    accessType: "Secure Investor Demo",
    lastVerified: "2026-10-06",
    investorVisible: true,
    repo: "abhijeetdeb90/eka-platform",
    features: [
      {
        id: "fa-cockpit",
        name: "Executive Cockpit & Dispatches",
        status: "LIVE",
        description: "Strategic directives, MAU telemetry & investor evidence layer",
      },
      {
        id: "fa-ops",
        name: "Operations Radar & Health",
        status: "LIVE",
        description: "12-subsystem topology, service latency pings & audit logs",
      },
      {
        id: "fa-studio",
        name: "Studio Control Plane",
        status: "LIVE",
        description: "Taxonomy editor, knowledge graph viewer & user management",
      },
      {
        id: "fa-economics",
        name: "Platform Economics & Ledger",
        status: "LIVE",
        description: "Append-only double-entry ledger, P&L waterfall & reserve pools",
      },
      {
        id: "fa-risk",
        name: "Creator Risk & Fraud (KYC/AML)",
        status: "LIVE",
        description: "Automated anomaly audits, payout gates & dispute reserves",
      },
      {
        id: "fa-knowledge",
        name: "5-Tier Provenance Verification",
        status: "LIVE",
        description: "Source passport license validation & oral history queue",
      },
      {
        id: "fa-ai-workflows",
        name: "AI-Assisted Moderation Assist",
        status: "BETA",
        description: "Gemini-powered oral history transcript and sensitivity flagging",
      },
    ],
    demoAccess: {
      role: "admin",
      email: "investor.admin@eka.demo",
      note: "Investor-safe read-only admin session. Live production write/delete actions are sandboxed.",
    },
  },
  {
    id: "brands-enterprise",
    name: "EKA Enterprise & Brand Growth OS",
    headline: "Cultural Intelligence & Brand Growth Layer",
    status: "BETA",
    sublabel: "Functional enterprise environment undergoing controlled rollout",
    description:
      "B2B growth and institutional operating system. Features Cultural Trend Radar, Brand Brain AI co-pilot, Closed-Loop Attribution, Creator Marketplace, and Enterprise API provisioning.",
    url: "/brands-enterprise",
    platform: "Web",
    version: "v1.2.0-beta",
    accessType: "Secure Investor Demo",
    lastVerified: "2026-10-06",
    investorVisible: true,
    repo: "abhijeetdeb90/eka-platform",
    features: [
      {
        id: "be-radar",
        name: "Cultural Trend Radar",
        status: "LIVE",
        description: "Culture → Emerging Interest → Commercial Opportunity pipeline",
      },
      {
        id: "be-brain",
        name: "Brand Brain AI Co-Pilot",
        status: "LIVE",
        description: "Institutional memory & cultural sensitivity query assistant",
      },
      {
        id: "be-attribution",
        name: "Closed-Loop Attribution",
        status: "LIVE",
        description: "Discovery → Intent → CRM → Purchase → Lifetime Value pipeline",
      },
      {
        id: "be-marketplace",
        name: "Artisan & Creator Marketplace",
        status: "LIVE",
        description: "Brand sponsorship workflows & verified heritage creator matching",
      },
      {
        id: "be-campaigns",
        name: "Campaign Autopilot",
        status: "LIVE",
        description: "Budget allocation, creative targeting & cultural resonance scoring",
      },
      {
        id: "be-workspaces",
        name: "Institutional Namespaces & APIs",
        status: "BETA",
        description: "Multi-tenant museum & university workspaces, API keys & rate limiters",
      },
      {
        id: "be-kg-api",
        name: "External Knowledge Graph APIs",
        status: "ROADMAP",
        description: "High-throughput commercial cultural ontology endpoints",
      },
    ],
    demoAccess: {
      role: "enterprise",
      email: "investor.enterprise@eka.demo",
      note: "Investor enterprise demo session with sample brand campaigns, Brand Brain AI, and attribution telemetry.",
    },
  },
  {
    id: "android-app",
    name: "EKA Android App",
    headline: "Sacred Sadhana & Cultural Reels on Mobile",
    status: "BETA",
    sublabel: "Functional mobile architecture under controlled testing",
    description:
      "Native mobile experience built on Expo SDK 52 (React Native). Includes offline-first encrypted sadhana journals, background meditation audio engine, and zero-tracking local panchangam scheduling.",
    url: "/investor#android",
    platform: "Android",
    version: "v1.0.4-beta (Build 18)",
    accessType: "Controlled Distribution",
    lastVerified: "2026-10-06",
    investorVisible: true,
    repo: "abhijeetdeb90/eka-platform (mobile/)",
    mobileSpecs: {
      framework: "Expo SDK 52 · React Native Fabric Architecture",
      bundleId: "earth.eka.app",
      distributionChannel: "Firebase App Distribution & Internal Track",
      targetOs: "Android 11+ (API Level 30+)",
      buildStatus: "Architecture & UI Prototypes Verified · Controlled Beta",
      downloadNote: "Beta testing slots allocated via Google Play internal group or direct APK artifact upon partner request.",
    },
    features: [
      {
        id: "and-offline",
        name: "Encrypted Offline Journal",
        status: "BETA",
        description: "SQLCipher private journal cache with optional cloud sync",
      },
      {
        id: "and-audio",
        name: "Background Sacred Audio Engine",
        status: "BETA",
        description: "Lock-screen meditation & soundscape streaming with low battery drain",
      },
      {
        id: "and-reels",
        name: "60 FPS Vertical Reels",
        status: "BETA",
        description: "Hardware-accelerated gesture reels mirroring web discovery",
      },
      {
        id: "and-biometric",
        name: "Biometric Passcode Gate",
        status: "BETA",
        description: "Device fingerprint / face auth for private reflections",
      },
    ],
  },
  {
    id: "ios-app",
    name: "EKA iOS App",
    headline: "Immersive Living Cultural Sanctuary for iPhone",
    status: "BETA",
    sublabel: "Functional iOS experience currently in TestFlight beta testing",
    description:
      "Native iOS client engineered for Apple devices. Supports dynamic island audio status, tactile haptics, offline sadhana journals, and buttery-smooth 120Hz ProMotion cultural narrative viewing.",
    url: "/investor#ios",
    platform: "iOS",
    version: "v1.0.4-beta (Build 22)",
    accessType: "TestFlight Beta",
    lastVerified: "2026-10-06",
    investorVisible: true,
    repo: "abhijeetdeb90/eka-platform (mobile/)",
    mobileSpecs: {
      framework: "Expo SDK 52 · React Native Fabric with Native iOS Modules",
      bundleId: "earth.eka.mobile",
      distributionChannel: "Apple TestFlight Beta",
      targetOs: "iOS 17.0+",
      buildStatus: "TestFlight Closed Beta Cohort Active",
      downloadNote: "Invite-only Apple TestFlight link issued to verified accredited investors and cultural partners.",
    },
    features: [
      {
        id: "ios-audio",
        name: "Lockscreen & Dynamic Island Audio",
        status: "BETA",
        description: "Native AVPlayer background streaming with metadata",
      },
      {
        id: "ios-haptics",
        name: "CoreHaptics Devotional Touch",
        status: "BETA",
        description: "Tactile haptic feedback during contemplation & bell soundscapes",
      },
      {
        id: "ios-offline",
        name: "Local Private Journal Cache",
        status: "BETA",
        description: "Zero-cloud default private notes with FaceID protection",
      },
      {
        id: "ios-widgets",
        name: "Lockscreen Daily Observance Widget",
        status: "ROADMAP",
        description: "Solar panchangam & festival alerts on iOS lockscreen",
      },
    ],
  },
];

/**
 * 2. Strategic Roadmap Registry
 */
export const ROADMAP_REGISTRY: RoadmapItem[] = [
  {
    id: "rm-global-expansion",
    title: "Global Cultural Intelligence Expansion",
    category: "Global",
    target: "2027",
    description:
      "Expanding the initial Indiawedge into comprehensive regional archives across Southeast Asia, Middle East, Central Africa, Western Europe, and Indigenous Americas.",
    impact: "Grows cultural node network from 2,500 to 50,000+ verified living traditions.",
  },
  {
    id: "rm-knowledge-graph",
    title: "Epistemic 5-Tier Knowledge Graph V2",
    category: "Technology",
    target: "2027",
    description:
      "Full neo4j/pgvector semantic graph connecting cross-cultural archetypes (e.g. fire offerings across Vedic, Shinto, Zoroastrian, and Celtic traditions).",
    impact: "Powers autonomous cross-cultural synthesis and automated comparative ontology.",
  },
  {
    id: "rm-enterprise-apis",
    title: "Commercial Cultural Intelligence APIs",
    category: "Enterprise",
    target: "2027",
    description:
      "High-concurrency GraphQL and REST APIs enabling luxury houses, game studios, streaming platforms, and tourism boards to query authenticated cultural context.",
    impact: "B2B SaaS subscription and API tier with consumption billing.",
  },
  {
    id: "rm-creator-economy",
    title: "Global Artisan Direct Royalty Engine",
    category: "Community",
    target: "Future",
    description:
      "Cross-border automated 70/30 creator revenue splits via UPI, Stripe Connect, and local banking rails directly to master craftspeople and monastic lineages.",
    impact: "Direct economic preservation of endangered indigenous knowledge custodians.",
  },
  {
    id: "rm-acoustic-archive",
    title: "Dialect & Acoustic Oral History Archiving",
    category: "Platform",
    target: "Future",
    description:
      "High-fidelity lossless acoustic preservation of endangered chanting styles, village dialects, and oral epics with automatic phonetic phoneme alignment.",
    impact: "Preserves oral languages before linguistic extinction.",
  },
  {
    id: "rm-cultural-commerce",
    title: "Fair-Trade Artisan Guilds & Provenance Tags",
    category: "Platform",
    target: "Under Exploration",
    description:
      "Physical GI-tagged artisan craft verification (Aranmula mirrors, Majuli masks, Banarasi looms) with QR provenance passports linked to EKA profiles.",
    impact: "Connects cultural discovery with verified authentic patronage.",
  },
];

export const REGISTRY_STORAGE_KEY = "eka_investor_registry_overrides";

/**
 * Get active registry with real-time internal administrative overrides
 */
export function getActiveRegistry(): InvestorProduct[] {
  if (typeof window !== "undefined") {
    try {
      const saved = window.localStorage.getItem(REGISTRY_STORAGE_KEY);
      if (saved) {
        const overrides = JSON.parse(saved);
        return PRODUCT_STATUS_REGISTRY.map((p) => {
          if (overrides[p.id]) {
            return {
              ...p,
              ...overrides[p.id],
            };
          }
          return p;
        });
      }
    } catch (e) {
      console.warn("Failed to parse investor registry overrides:", e);
    }
  }
  return PRODUCT_STATUS_REGISTRY;
}

/**
 * Filter helpers
 */
export function getProductsByStatus(status: MaturityStatus): InvestorProduct[] {
  return getActiveRegistry().filter((p) => p.status === status);
}

export function getAllProducts(): InvestorProduct[] {
  return getActiveRegistry();
}

export function getRoadmapItems(): RoadmapItem[] {
  return ROADMAP_REGISTRY;
}

export function getFeatureCounts() {
  const products = getActiveRegistry();
  let live = 0;
  let beta = 0;
  let roadmap = 0;

  for (const p of products) {
    if (p.status === "LIVE") live++;
    if (p.status === "BETA") beta++;
    if (p.status === "ROADMAP") roadmap++;
  }

  return { live, beta, roadmap, total: products.length };
}
