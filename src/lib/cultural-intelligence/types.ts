// ==============================================================================
// EKA CULTURAL INTELLIGENCE ENGINE: SCHEMAS & TYPES
// ==============================================================================
// Implements the EKA V0.1 7-point Cultural Knowledge Object:
// What → Why → Origin → Where → Who → How → Sources → Related Knowledge
// ==============================================================================

import type { EpistemicTier } from "@/lib/tokens/theme";

export interface PrimaryCitation {
  id: string;
  title: string;
  sourceType: "canonical_text" | "oral_lineage" | "archaeological" | "field_ethnography";
  language?: string;
  era?: string;
  citationRef: string;
  verifier: string;
  verifierRole: "Scholar" | "Lineage Holder" | "Community Steward" | "Master Artisan" | "Archivist";
  trustScore: number; // 0 - 100
  originalExcerpt?: string;
  translationExcerpt: string;
}

export interface CulturalKnowledgeObject {
  id: string;
  slug: string;
  curiosityQuestion: string; // e.g. "Why do Bengalis celebrate Durga Puja differently?"
  title: string;
  category: "tradition" | "festival_ritual" | "sacred_place" | "community" | "craft_food";
  epistemicTier: EpistemicTier;
  region: string;
  summary: string;
  
  // The 7-Point Core Knowledge Dimensions
  what: string;
  why: string;
  origin: {
    era: string;
    historicalContext: string;
    philosophicalRoot: string;
  };
  where: {
    locationName: string;
    state: string;
    coordinates?: string;
    geographicalSignificance: string;
  };
  who: {
    custodians: string;
    lineageOrGuild: string;
    transmissionStatus: "vibrant" | "living" | "endangered" | "reviving" | "archival";
  };
  how: {
    practiceSteps: string[];
    visitorEtiquette: string;
  };
  sources: PrimaryCitation[];
  
  // Connected Graph
  relatedKnowledgeIds: string[];
  communityCircleSlug?: string;
  tags: string[];
  imageUrl: string;
}

export interface CulturalInquiryResult {
  query: string;
  matchedObject?: CulturalKnowledgeObject;
  aiExplanation: {
    summary: string;
    deepExplanation: string;
    culturalNuance: string;
    visitorGuidance: string;
    poweredBy: string;
  };
  relatedTraditions: Array<{ id: string; title: string; region: string }>;
  verifiedSources: PrimaryCitation[];
}
