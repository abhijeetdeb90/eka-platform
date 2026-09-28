/**
 * EKA Cultural Knowledge Object Model
 *
 * Defines the canonical EKA Knowledge Object primitive.
 * Instead of storing raw wiki text, EKA stores structured, provenance-rich
 * entities capturing:
 * - 10 Cultural Dimensions
 * - Cultural Variations (Regional, Community, Historical, Contemporary, Diaspora)
 * - Epistemic Taxonomy (Fact vs Interpretation)
 * - Source Passport
 * - Sensitive Workflow Flags
 */

import type { IngestedEkaImageNode } from "./connectors/wikimedia-commons";
import type { SourceTier, LicenseType } from "./source-license-engine";

export type EpistemicClassification =
  | "DOCUMENTED" // Supported by manuscripts, inscriptions, or epigraphy
  | "SOURCE_SUPPORTED" // Supported by scholarly peer-reviewed citation
  | "COMMUNITY_REPORTED" // Transmitted by verified lineage elders
  | "INTERPRETATION" // Exegetical or philosophical reading
  | "TRADITIONAL_BELIEF" // Revered sacred tradition without secular archaeology
  | "CONTEMPORARY_PRACTICE" // Modern living evolution observed today
  | "DISPUTED" // Divergent accounts between communities or scholars
  | "UNVERIFIED"; // Uncorroborated oral anecdote needing review

export interface EpistemicClaim {
  claimId: string;
  statement: string;
  epistemicType: EpistemicClassification;
  sourceIds: string[];
  confidence: number; // 0.0 - 1.0
  verificationStatus: "verified" | "review_needed" | "community_dispute";
  notes?: string;
}

export interface CulturalVariation {
  id: string;
  dimension: "regional" | "community" | "historical" | "contemporary" | "diaspora";
  label: string;
  regionOrGroup: string;
  distinctPractice: string;
  significance: string;
  associatedFoodOrObjects: string[];
  sources: string[];
}

export interface CulturalDimensions {
  identity: {
    canonicalName: string;
    alternativeNames: string[];
    languages: string[];
    regions: string[];
    communities: string[];
  };
  history: {
    origins: string;
    historicalPeriods: string[];
    migrations?: string[];
    milestones: string[];
  };
  beliefs: {
    worldview: string;
    spiritualConcepts: string[];
    philosophicalConcepts: string[];
    religiousContext: string[];
  };
  practices: {
    rituals: string[];
    ceremonies: string[];
    festivals: string[];
    dailyPractices: string[];
  };
  materialCulture: {
    clothing: string[];
    foodways: string[];
    architecture: string[];
    crafts: string[];
    sacredObjects: string[];
  };
  arts: {
    music: string[];
    dance: string[];
    literature: string[];
    theatre: string[];
    visualArts: string[];
  };
  socialLife: {
    familyStructure?: string;
    communityGatherings: string[];
    traditionalOccupations: string[];
    socialCustoms: string[];
  };
  geography: {
    places: string[];
    sacredLandscapes: string[];
    pilgrimageRoutes: string[];
    coordinates?: { lat: number; lng: number };
  };
  language: {
    script: string[];
    keyTerminology: Array<{ term: string; meaning: string; language: string }>;
    sacredChantsOrCouplets?: string[];
  };
  modernContext: {
    diasporaPresence: string;
    contemporaryPractice: string;
    safeguardingEfforts: string[];
    endangeredElements?: string[];
  };
  localEconomy: {
    traditionalArtisans: string[];
    ethicalLocalBrands: string[];
    livingExperiences: string[];
    authenticWorkshops: string[];
  };
}

export interface SourcePassportItem {
  id: string;
  title: string;
  sourceTier: SourceTier;
  citationOrUrl: string;
  license: LicenseType;
  type: "scripture" | "institutional_dossier" | "archive" | "reference_encyclopedia" | "community_oral";
  verifiedBy?: string;
}

export interface SourcePassport {
  totalSources: number;
  breakdown: {
    primary: number;
    institutional: number;
    reference: number;
    community: number;
  };
  evidenceStrength: "Strong" | "Moderate" | "Disputed";
  documentedVariationsCount: number;
  lastReviewedDate: string;
  sourcesList: SourcePassportItem[];
}

export interface LinkedGraphNode {
  targetId: string;
  targetSlug: string;
  targetName: string;
  targetType:
    | "culture"
    | "community"
    | "tradition"
    | "festival"
    | "place"
    | "craft"
    | "food"
    | "creator"
    | "source"
    | "image";
  relation:
    | "practiced_by"
    | "occurs_in"
    | "associated_with_food"
    | "associated_with_craft"
    | "documented_by"
    | "represented_by"
    | "explained_by"
    | "related_to_tradition"
    | "sacred_to";
  description: string;
}

export interface SensitiveWorkflowFlags {
  requiresReview: boolean;
  flagReasons: Array<
    | "religious_claim"
    | "medical_claim"
    | "cultural_dispute"
    | "community_identity_claim"
    | "historical_controversy"
  >;
  reviewStatus: "approved" | "pending_review" | "quarantined";
  reviewerNotes?: string;
}

export interface EkaKnowledgeObject {
  id: string;
  slug: string;
  entity: string;
  type:
    | "festival"
    | "tradition"
    | "culture"
    | "community"
    | "place"
    | "craft"
    | "foodway"
    | "art"
    | "language"
    | "person";
  summary: string;
  oneLiner: string;
  culturalDimensions: CulturalDimensions;
  culturalVariations: CulturalVariation[];
  epistemicClaims: EpistemicClaim[];
  sourcePassport: SourcePassport;
  images: IngestedEkaImageNode[];
  linkedGraphNodes: LinkedGraphNode[];
  sensitiveWorkflowFlags: SensitiveWorkflowFlags;
  createdAt: string;
  updatedAt: string;
}

/**
 * Calculates a SourcePassport summary for an EKA Knowledge Object.
 */
export function generateSourcePassport(
  sources: SourcePassportItem[],
  variationsCount: number,
): SourcePassport {
  const breakdown = {
    primary: 0,
    institutional: 0,
    reference: 0,
    community: 0,
  };

  sources.forEach((s) => {
    if (s.sourceTier === "tier1_structured_open" || s.sourceTier === "tier2_open_reference") {
      breakdown.reference += 1;
    } else if (s.sourceTier === "tier3_cultural_heritage") {
      breakdown.institutional += 1;
    } else if (s.sourceTier === "tier4_community") {
      breakdown.community += 1;
    } else {
      breakdown.primary += 1;
    }
  });

  const total = sources.length;
  let evidenceStrength: SourcePassport["evidenceStrength"] = "Moderate";
  if (total >= 4 && (breakdown.institutional > 0 || breakdown.primary > 0)) {
    evidenceStrength = "Strong";
  } else if (total < 2) {
    evidenceStrength = "Moderate";
  }

  return {
    totalSources: total,
    breakdown,
    evidenceStrength,
    documentedVariationsCount: variationsCount,
    lastReviewedDate: new Date().toISOString().split("T")[0]!,
    sourcesList: sources,
  };
}
