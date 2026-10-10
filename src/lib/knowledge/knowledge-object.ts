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

/**
 * EKA Trust & Provenance Standard Verification Levels
 * Never display generic "Verified" without explaining the basis.
 */
export type TrustVerificationLevel =
  | "PRIMARY_SOURCE" // Original text, inscription, community record, practitioner testimony or equivalent
  | "INSTITUTIONAL" // Government, museum, university or recognised institution
  | "SCHOLARLY" // Academic/research source
  | "COMMUNITY_VERIFIED" // Relevant community/practitioner validation
  | "EKA_RESEARCHED" // Researched using multiple credible sources
  | "EKA_INTERPRETATION" // Clearly labelled editorial synthesis
  | "AI_SYNTHESIS"; // AI explanation grounded in cited EKA sources

export interface TrustVerificationMeta {
  level: TrustVerificationLevel;
  label: string;
  shortLabel: string;
  basis: string;
  colorClass: string;
  badgeBg: string;
  badgeBorder: string;
}

export function getTrustVerificationMeta(level: TrustVerificationLevel): TrustVerificationMeta {
  switch (level) {
    case "PRIMARY_SOURCE":
      return {
        level,
        label: "Primary Source Verified",
        shortLabel: "Primary Source",
        basis: "Grounding verified against original canonical text, rock inscription, temple epigraphy, or living lineage record.",
        colorClass: "text-emerald-700 dark:text-emerald-400",
        badgeBg: "bg-emerald-500/10",
        badgeBorder: "border-emerald-500/30",
      };
    case "INSTITUTIONAL":
      return {
        level,
        label: "Institutional Archive",
        shortLabel: "Institutional",
        basis: "Corroborated by governmental gazetteer, university research institute, national museum, or UNESCO heritage inventory.",
        colorClass: "text-blue-700 dark:text-blue-400",
        badgeBg: "bg-blue-500/10",
        badgeBorder: "border-blue-500/30",
      };
    case "SCHOLARLY":
      return {
        level,
        label: "Scholarly Research",
        shortLabel: "Scholarly",
        basis: "Supported by peer-reviewed academic literature, historical linguistics, or anthropological monographs.",
        colorClass: "text-indigo-700 dark:text-indigo-400",
        badgeBg: "bg-indigo-500/10",
        badgeBorder: "border-indigo-500/30",
      };
    case "COMMUNITY_VERIFIED":
      return {
        level,
        label: "Community Verified",
        shortLabel: "Community Verified",
        basis: "Directly validated by authorized practitioner lineage, hereditary guild elders, or indigenous custodian community.",
        colorClass: "text-purple-700 dark:text-purple-400",
        badgeBg: "bg-purple-500/10",
        badgeBorder: "border-purple-500/30",
      };
    case "EKA_RESEARCHED":
      return {
        level,
        label: "EKA Researched",
        shortLabel: "EKA Researched",
        basis: "Cross-referenced and synthesized by EKA editors using multiple credible secondary and tertiary sources.",
        colorClass: "text-amber-700 dark:text-amber-400",
        badgeBg: "bg-amber-500/10",
        badgeBorder: "border-amber-500/30",
      };
    case "EKA_INTERPRETATION":
      return {
        level,
        label: "EKA Editorial Interpretation",
        shortLabel: "Editorial Synthesis",
        basis: "Clearly labeled philosophical commentary or cultural exegesis synthesizing multiple traditions.",
        colorClass: "text-rose-700 dark:text-rose-400",
        badgeBg: "bg-rose-500/10",
        badgeBorder: "border-rose-500/30",
      };
    case "AI_SYNTHESIS":
    default:
      return {
        level,
        label: "AI Synthesis (Cited EKA Sources)",
        shortLabel: "AI Grounded",
        basis: "AI explanation strictly synthesized over and grounded in cited EKA canonical knowledge objects. May not exceed Level 1 verification.",
        colorClass: "text-stone-700 dark:text-stone-400",
        badgeBg: "bg-stone-500/10",
        badgeBorder: "border-stone-500/30",
      };
  }
}

/**
 * Standardized Epistemic Separation for Cultural Topics
 */
export interface DocumentedVsPerspective {
  documented: string[]; // Supported by credible archaeological, textual or epigraphic evidence
  communityPerspective: string[]; // What relevant living communities and lineage practitioners say
  commonBelief: string[]; // Widely held folklore/belief but not necessarily historically established
  interpretation: string[]; // Philosophical/editorial exegesis
  uncertain: string[]; // Incomplete, disputed, or limited evidence
}

/**
 * Living Culture Context: Documenting living human practice, not just museum relics
 */
export interface LivingCultureContext {
  whatItIs: string;
  whoPracticesToday: string[];
  wherePracticed: string[];
  howChanging: string;
  youngerGenerationEngagement: string;
  practitioners: string[];
  creators: string[];
  communityPerspectives: string[];
  howPeopleCanExperienceOrSupport: string[];
}

/**
 * Meet the Keeper: Practitioner & Lineage Custodian Profile
 */
export interface PractitionerProfile {
  id: string;
  name: string;
  community: string;
  location: string;
  practice: string;
  story: string;
  expertise: string;
  imageUrl?: string;
  contributionsCount: number;
  sources: string[];
  verificationLevel: TrustVerificationLevel;
  relatedTraditions: string[];
}

/**
 * Visual Stories: Multi-step ritual & living tradition templates
 */
export interface VisualStoryStep {
  stepNumber: string; // e.g. "01"
  name: string; // e.g. "Aiburo Bhaat"
  imageUrl: string;
  oneSentenceExplanation: string;
  culturalMeaning: string;
  source: string;
  relatedKnowledgeSlug?: string;
  whatToLookFor?: string;
  commonMisconception?: string;
  whereToExperienceRespectfully?: string;
  askEkaPrompt?: string;
  mediaMetadata?: {
    whatYouSee: string;
    location: string;
    culturalContext: string;
    tradition: string;
    dateTimeOrEra?: string;
    creatorOrPhotographer?: string;
    source: string;
    license?: string;
  };
}

export interface VisualStory {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  template:
    | "INSIDE_TRADITION"
    | "A_PLACE_A_STORY"
    | "BEHIND_THE_TRADITION"
    | "60_SECONDS_TO_UNDERSTAND"
    | "MEET_THE_KEEPER"
    | "THEN_NOW"
    | "CULTURE_X_CULTURE"
    | "WHY";
  traditionSlug: string;
  location: string;
  coverImage: string;
  steps: VisualStoryStep[];
  provenance: {
    verificationLevel: TrustVerificationLevel;
    sourcesCount: number;
    lastReviewed: string;
  };
}

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
  reviewStatus?: "approved" | "pending_review" | "quarantined";
  reviewerNotes?: string;
}

export type EkaEntityType =
  | "festival"
  | "tradition"
  | "story"
  | "ritual"
  | "practice"
  | "place"
  | "sacred_place"
  | "person"
  | "community"
  | "language"
  | "food"
  | "foodway"
  | "craft"
  | "artform"
  | "art"
  | "historical_event"
  | "cultural_object"
  | "cultural_concept"
  | "creator"
  | "practitioner"
  | "source"
  | "culture";

export interface CanonicalGeography {
  country: string;
  region: string; // e.g. South Asia, East Asia, Global
  state?: string;
  district?: string;
  city?: string;
  coordinates?: { lat: number; lng: number };
}

export interface EkaKnowledgeObject {
  id: string;
  slug: string;
  entity: string;
  type: EkaEntityType;
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

  // Canonical EKA Trust & Provenance Properties
  verificationLevel?: TrustVerificationLevel;
  lastReviewed?: string;
  lastUpdated?: string;
  contributor?: string;
  evidenceDisclaimer?: string;

  // Canonical Epistemic Clarity
  documentedVsPerspective?: DocumentedVsPerspective;

  // Canonical Living Culture & Human Custodians
  livingCulture?: LivingCultureContext;
  practitioners?: PractitionerProfile[];
  visualStory?: VisualStory;

  // Cultural Discovery Alternatives to Infinite Scrolling
  youMightAlsoWonder?: string[];

  // Canonical Geographic Coordinates
  canonicalGeography?: CanonicalGeography;
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
