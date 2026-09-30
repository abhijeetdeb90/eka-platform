// ==============================================================================
// EKA DESIGN SYSTEM: THEME & EPISTEMIC TOKENS
// ==============================================================================
// Visual Philosophy: "ONE WITHIN. ONE WITH ALL."
// Indic Heritage, Earth Pigments, Deep Contemplative Contrast.
// ==============================================================================

export const colors = {
  terracotta: {
    DEFAULT: "#C85A32",
    light: "#D97754",
    dark: "#A3411E",
    bg: "rgba(200, 90, 50, 0.08)",
    border: "rgba(200, 90, 50, 0.25)",
  },
  saffron: {
    DEFAULT: "#E07A1E",
    light: "#F39C42",
    dark: "#B85C0A",
    bg: "rgba(224, 122, 30, 0.08)",
    border: "rgba(224, 122, 30, 0.25)",
  },
  forest: {
    DEFAULT: "#1B4332",
    light: "#2D6A4F",
    dark: "#081C15",
    bg: "rgba(27, 67, 50, 0.08)",
    border: "rgba(27, 67, 50, 0.25)",
  },
  sand: {
    DEFAULT: "#F7F4EE",
    warm: "#EFE9DE",
    dark: "#DED6C4",
  },
  ink: {
    DEFAULT: "#1C1917",
    muted: "#44403C",
    soft: "#78716C",
  },
  ochre: {
    DEFAULT: "#D97706",
    subtle: "#F59E0B",
  },
} as const;

export type EpistemicTier =
  | "DOCUMENTED"
  | "LIVING_PRACTICE"
  | "SACRED_GEOGRAPHY"
  | "ORAL_LORE";

export interface EpistemicMetadata {
  label: string;
  badgeText: string;
  description: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
}

export const epistemicTiers: Record<EpistemicTier, EpistemicMetadata> = {
  DOCUMENTED: {
    label: "Documented Heritage",
    badgeText: "Documented",
    description: "Supported by ancient manuscripts, archaeological archives, or peer-reviewed records.",
    colorClass: "text-emerald-400",
    borderClass: "border-emerald-500/30",
    bgClass: "bg-emerald-950/40",
  },
  LIVING_PRACTICE: {
    label: "Living Practice",
    badgeText: "Living Practice",
    description: "Maintained by active lineages, practitioner guilds, and generational keepers.",
    colorClass: "text-amber-400",
    borderClass: "border-amber-500/30",
    bgClass: "bg-amber-950/40",
  },
  SACRED_GEOGRAPHY: {
    label: "Sacred Geography",
    badgeText: "Sacred Geography",
    description: "Rooted in specific pilgrimage routes, sacred groves, river confluences, and temple networks.",
    colorClass: "text-cyan-400",
    borderClass: "border-cyan-500/30",
    bgClass: "bg-cyan-950/40",
  },
  ORAL_LORE: {
    label: "Oral Lore",
    badgeText: "Oral Lore",
    description: "Preserved through singing bards, vernacular ballads, and familial storytelling.",
    colorClass: "text-purple-300",
    borderClass: "border-purple-500/30",
    bgClass: "bg-purple-950/40",
  },
};

export type IntentTriggerType =
  | "INTO_THIS"
  | "SHOW_MORE"
  | "CONSIDER_THIS"
  | "EXPLORE_MAKER"
  | "SEEK_GUIDANCE"
  | "JOIN_CIRCLE";

export interface IntentTriggerConfig {
  id: IntentTriggerType;
  label: string;
  category: "resonance" | "curiosity" | "consideration" | "connection";
  iconName: string;
  successFeedback: string;
}

export const intentTriggers: Record<IntentTriggerType, IntentTriggerConfig> = {
  INTO_THIS: {
    id: "INTO_THIS",
    label: "I'm into this",
    category: "resonance",
    iconName: "Heart",
    successFeedback: "Tuned to your cultural resonance.",
  },
  SHOW_MORE: {
    id: "SHOW_MORE",
    label: "Show me more",
    category: "curiosity",
    iconName: "Sparkles",
    successFeedback: "Deepening your discovery thread.",
  },
  CONSIDER_THIS: {
    id: "CONSIDER_THIS",
    label: "I'd consider this",
    category: "consideration",
    iconName: "Compass",
    successFeedback: "Saved to your pilgrimage consideration list.",
  },
  EXPLORE_MAKER: {
    id: "EXPLORE_MAKER",
    label: "Explore Maker",
    category: "connection",
    iconName: "Layers",
    successFeedback: "Opening master artisan guild portfolio.",
  },
  SEEK_GUIDANCE: {
    id: "SEEK_GUIDANCE",
    label: "Seek Guidance",
    category: "connection",
    iconName: "Flame",
    successFeedback: "Connecting with lineage advisor.",
  },
  JOIN_CIRCLE: {
    id: "JOIN_CIRCLE",
    label: "Join Circle",
    category: "connection",
    iconName: "Orbit",
    successFeedback: "Entered contemplative circle.",
  },
};
