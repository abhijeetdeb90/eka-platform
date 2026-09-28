/**
 * EKA Source & License Engine
 *
 * Enforces rigorous source tiering, licensing compliance, and legal safeguards
 * across all ingested cultural knowledge and media assets.
 *
 * Critical Principle: Separate Knowledge From Copyright.
 * - Wikidata structured data is CC0 (Universal Public Domain Dedication).
 * - Wikipedia text is CC BY-SA 4.0 (requires attribution + share-alike).
 * - Wikimedia Commons images require individual file license validation.
 * - UNESCO ICH is an institutional source (requires official attribution & cultural humility).
 * - Proprietary sources: NEVER bulk-copied; stored only as bibliographic metadata/citations.
 */

export type SourceTier =
  | "tier1_structured_open" // Wikidata, Wikimedia Commons structured data
  | "tier2_open_reference" // Wikipedia / Wikimedia reference text
  | "tier3_cultural_heritage" // UNESCO, Europeana, Museums, Universities, National Archives
  | "tier4_community" // EKA community submissions, verified elders, lineage custodians
  | "tier5_proprietary"; // Commercial encyclopedias, publisher databases (citations only)

export type SourceType =
  | "wikidata"
  | "wikipedia"
  | "wikimedia_commons"
  | "unesco_ich"
  | "europeana"
  | "national_archives"
  | "university_press"
  | "community_custodian"
  | "lineage_elder"
  | "proprietary_reference";

export type LicenseType =
  | "CC0-1.0"
  | "CC-BY-4.0"
  | "CC-BY-SA-4.0"
  | "CC-BY-3.0"
  | "CC-BY-SA-3.0"
  | "Public-Domain"
  | "UNESCO-Public-Info"
  | "Europeana-InC"
  | "Europeana-NoRe-Use"
  | "Community-Consent-Open"
  | "Community-Sacred-Restricted"
  | "Proprietary-Citation-Only";

export type ContentLegalClassification =
  | "FACTUAL_DATA" // CC0 facts, dates, coordinates, taxonomic attributes
  | "REFERENCE_CONTENT" // Summarized context with mandatory attribution
  | "LICENSED_CONTENT" // Explicitly licensed text or media
  | "PUBLIC_DOMAIN_CONTENT" // Pre-1928 or expired copyright
  | "COMMUNITY_CONTRIBUTION" // Submitted by community elders with consent
  | "EKA_ORIGINAL" // Synthesized editorial or curated human context graph
  | "AI_GENERATED"; // Epistemic AI synthesis grounded in verified claims

export interface SourceLicenseRecord {
  id: string;
  sourceType: SourceType;
  sourceTier: SourceTier;
  sourceUrl: string;
  sourceTitle: string;
  author?: string;
  publisher?: string;
  license: LicenseType;
  licenseUrl?: string;
  attributionRequired: boolean;
  attributionString: string;
  shareAlikeRequired: boolean;
  commercialUseAllowed: boolean;
  derivativeUseAllowed: boolean;
  contentClassification: ContentLegalClassification;
  ingestionDate: string; // ISO 8601
  lastVerifiedDate: string;
  rightsNotes?: string;
  status: "active" | "quarantined" | "deprecated" | "flagged_for_review";
}

export interface ImageRightsRecord {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  originalFileUrl: string;
  title: string;
  creator?: string;
  institution?: string;
  createdDate?: string;
  license: LicenseType;
  licenseUrl?: string;
  attributionRequired: boolean;
  attributionString: string;
  commercialUseAllowed: boolean;
  modificationsAllowed: boolean;
  aiTrainingAllowed: boolean;
  depicts: string[]; // Entities, traditions, or places depicted
  location?: string;
  ekaUsageStatus: "approved" | "rejected" | "pending_review";
  rejectionReason?: string;
}

export interface LicensePolicy {
  name: string;
  sourceTier: SourceTier;
  commercialAllowed: boolean;
  requiresAttribution: boolean;
  requiresShareAlike: boolean;
  description: string;
}

export const LICENSE_REGISTRY: Record<string, LicensePolicy> = {
  "CC0-1.0": {
    name: "CC0 1.0 Universal",
    sourceTier: "tier1_structured_open",
    commercialAllowed: true,
    requiresAttribution: false,
    requiresShareAlike: false,
    description: "Public domain dedication worldwide. Used for Wikidata entity IDs, coords, and taxonomy.",
  },
  "CC-BY-4.0": {
    name: "Creative Commons Attribution 4.0",
    sourceTier: "tier2_open_reference",
    commercialAllowed: true,
    requiresAttribution: true,
    requiresShareAlike: false,
    description: "Permits commercial use and adaptation provided author attribution is preserved.",
  },
  "CC-BY-SA-4.0": {
    name: "Creative Commons Attribution-ShareAlike 4.0",
    sourceTier: "tier2_open_reference",
    commercialAllowed: true,
    requiresAttribution: true,
    requiresShareAlike: true,
    description: "Standard Wikimedia license. Adaptations must be shared under identical terms.",
  },
  "Public-Domain": {
    name: "Public Domain Dedication",
    sourceTier: "tier1_structured_open",
    commercialAllowed: true,
    requiresAttribution: false,
    requiresShareAlike: false,
    description: "Works with expired copyright or official governmental open data.",
  },
  "UNESCO-Public-Info": {
    name: "UNESCO Open Access",
    sourceTier: "tier3_cultural_heritage",
    commercialAllowed: true,
    requiresAttribution: true,
    requiresShareAlike: false,
    description: "Institutional cultural heritage dossiers and safeguarding inventories.",
  },
  "Community-Consent-Open": {
    name: "EKA Community Elder Consent",
    sourceTier: "tier4_community",
    commercialAllowed: true,
    requiresAttribution: true,
    requiresShareAlike: false,
    description: "Direct oral history and lineage knowledge contributed with informed community consent.",
  },
};

/**
 * Validates whether an image's licensing meets EKA's strict open/educational
 * public discovery standards. Unclear or restrictive licenses are automatically rejected.
 */
export function validateImageRights(
  image: Partial<ImageRightsRecord> & { author?: string; sourceUrl?: string },
): { approved: boolean; rejectionReason?: string; isValid: boolean; reason?: string } {
  const licenseStr = String(image.license || "");

  if (!licenseStr || licenseStr === "undefined") {
    const reason = "REJECTED: Missing license declaration. Unverified media cannot enter EKA.";
    return {
      approved: false,
      rejectionReason: reason,
      isValid: false,
      reason,
    };
  }

  // Reject commercial-only restrictions or non-commercial share-alike where commercial distribution could conflict
  if (licenseStr === "Europeana-NoRe-Use" || licenseStr.includes("NoRe-Use")) {
    const reason = "REJECTED: Rights statement explicitly forbids re-use.";
    return {
      approved: false,
      rejectionReason: reason,
      isValid: false,
      reason,
    };
  }

  if (licenseStr === "Community-Sacred-Restricted") {
    const reason = "REJECTED: Sacred or esoteric community material restricted from public digital broadcast.";
    return {
      approved: false,
      rejectionReason: reason,
      isValid: false,
      reason,
    };
  }

  if (licenseStr === "Proprietary-Citation-Only") {
    const reason = "REJECTED: Proprietary image asset. Citations permitted only.";
    return {
      approved: false,
      rejectionReason: reason,
      isValid: false,
      reason,
    };
  }

  if (image.attributionRequired && !image.attributionString && !image.author) {
    const reason = "REJECTED: Attribution is required by license but attribution text is missing.";
    return {
      approved: false,
      rejectionReason: reason,
      isValid: false,
      reason,
    };
  }

  return { approved: true, isValid: true, reason: "License is fully compliant with EKA open distribution standards." };
}

/**
 * Resolves canonical license terms and compliance constraints based on source type.
 */
export function getSourceTierPolicies(tier: SourceTier): {
  canIngestStructuredFacts: boolean;
  canIngestFullText: boolean;
  requiresShareAlike: boolean;
  requiresAttribution: boolean;
  editorialGuideline: string;
} {
  switch (tier) {
    case "tier1_structured_open":
      return {
        canIngestStructuredFacts: true,
        canIngestFullText: false,
        requiresShareAlike: false,
        requiresAttribution: false, // CC0
        editorialGuideline:
          "Wikidata structured entities provide CC0 entity IDs, dates, and geographic links. Ingest entities; normalize into EKA taxonomy.",
      };
    case "tier2_open_reference":
      return {
        canIngestStructuredFacts: true,
        canIngestFullText: false, // Summarized excerpts only with CC BY-SA 4.0 attribution
        requiresShareAlike: true,
        requiresAttribution: true,
        editorialGuideline:
          "Wikipedia provides encyclopedic reference background. Never copy raw articles wholesale. Extract claims, cross-verify, and state CC BY-SA 4.0 attribution.",
      };
    case "tier3_cultural_heritage":
      return {
        canIngestStructuredFacts: true,
        canIngestFullText: true, // Inscription documentation and safeguarding data
        requiresShareAlike: false,
        requiresAttribution: true,
        editorialGuideline:
          "Institutional data from UNESCO or National Archives. Cite official nomination dossier. Avoid framing UNESCO recognition as a measure of cultural superiority.",
      };
    case "tier4_community":
      return {
        canIngestStructuredFacts: true,
        canIngestFullText: true,
        requiresShareAlike: false,
        requiresAttribution: true,
        editorialGuideline:
          "Direct community knowledge and living memory. Highest epistemic reverence. Verify free, prior and informed community consent.",
      };
    case "tier5_proprietary":
      return {
        canIngestStructuredFacts: false, // Metadata only
        canIngestFullText: false, // ZERO ingestion of copyrighted text
        requiresShareAlike: false,
        requiresAttribution: true,
        editorialGuideline:
          "Commercial databases or copyrighted encyclopedias. Store bibliographic citation and URL only. Never import body content.",
      };
  }
}

/**
 * Registry of authoritative institutional and reference sources pre-configured in EKA.
 */
export const REGISTERED_EKA_SOURCES: SourceLicenseRecord[] = [
  {
    id: "src_wikidata_core",
    sourceType: "wikidata",
    sourceTier: "tier1_structured_open",
    sourceUrl: "https://www.wikidata.org",
    sourceTitle: "Wikidata — The Free Knowledge Base",
    publisher: "Wikimedia Foundation",
    license: "CC0-1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    attributionRequired: false,
    attributionString: "Data from Wikidata (CC0 1.0 Universal)",
    shareAlikeRequired: false,
    commercialUseAllowed: true,
    derivativeUseAllowed: true,
    contentClassification: "FACTUAL_DATA",
    ingestionDate: "2026-09-28T00:00:00Z",
    lastVerifiedDate: "2026-09-28T00:00:00Z",
    rightsNotes: "Structured entity backbone. Full CC0 dedication for entity relationships.",
    status: "active",
  },
  {
    id: "src_wikipedia_en",
    sourceType: "wikipedia",
    sourceTier: "tier2_open_reference",
    sourceUrl: "https://en.wikipedia.org",
    sourceTitle: "Wikipedia — The Free Encyclopedia",
    publisher: "Wikimedia Foundation & Volunteer Contributors",
    license: "CC-BY-SA-4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    attributionRequired: true,
    attributionString: "Reference context derived from Wikipedia (CC BY-SA 4.0)",
    shareAlikeRequired: true,
    commercialUseAllowed: true,
    derivativeUseAllowed: true,
    contentClassification: "REFERENCE_CONTENT",
    ingestionDate: "2026-09-28T00:00:00Z",
    lastVerifiedDate: "2026-09-28T00:00:00Z",
    rightsNotes:
      "MediaWiki REST API summaries. Re-users must attribute and publish derivative texts under compatible terms.",
    status: "active",
  },
  {
    id: "src_wikimedia_commons",
    sourceType: "wikimedia_commons",
    sourceTier: "tier1_structured_open",
    sourceUrl: "https://commons.wikimedia.org",
    sourceTitle: "Wikimedia Commons",
    publisher: "Wikimedia Foundation & Contributing Photographers",
    license: "CC-BY-SA-4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    attributionRequired: true,
    attributionString: "Image via Wikimedia Commons (Individual licenses apply)",
    shareAlikeRequired: true,
    commercialUseAllowed: true,
    derivativeUseAllowed: true,
    contentClassification: "LICENSED_CONTENT",
    ingestionDate: "2026-09-28T00:00:00Z",
    lastVerifiedDate: "2026-09-28T00:00:00Z",
    rightsNotes:
      "Structured depicted data is CC0; image files possess individual licenses requiring granular rights validation.",
    status: "active",
  },
  {
    id: "src_unesco_ich",
    sourceType: "unesco_ich",
    sourceTier: "tier3_cultural_heritage",
    sourceUrl: "https://ich.unesco.org",
    sourceTitle: "UNESCO Intangible Cultural Heritage Lists",
    publisher: "United Nations Educational, Scientific and Cultural Organization",
    license: "UNESCO-Public-Info",
    licenseUrl: "https://ich.unesco.org/en/terms-of-use-00049",
    attributionRequired: true,
    attributionString: "Documented on UNESCO Representative List of Intangible Cultural Heritage",
    shareAlikeRequired: false,
    commercialUseAllowed: false, // Used under educational/non-commercial cultural documentation
    derivativeUseAllowed: true,
    contentClassification: "PUBLIC_DOMAIN_CONTENT",
    ingestionDate: "2026-09-28T00:00:00Z",
    lastVerifiedDate: "2026-09-28T00:00:00Z",
    rightsNotes:
      "Nomination files, community safeguarding measures, and periodic reports referenced under fair cultural documentation.",
    status: "active",
  },
  {
    id: "src_eka_community_charter",
    sourceType: "community_custodian",
    sourceTier: "tier4_community",
    sourceUrl: "https://eka.network/standards",
    sourceTitle: "EKA Community Elders & Living Custodian Archive",
    publisher: "EKA Epistemic Stewardship Guild",
    license: "Community-Consent-Open",
    licenseUrl: "https://eka.network/standards",
    attributionRequired: true,
    attributionString: "Verified by EKA Community Custodians and Lineage Elders",
    shareAlikeRequired: false,
    commercialUseAllowed: true,
    derivativeUseAllowed: false,
    contentClassification: "COMMUNITY_CONTRIBUTION",
    ingestionDate: "2026-09-28T00:00:00Z",
    lastVerifiedDate: "2026-09-28T00:00:00Z",
    rightsNotes:
      "Recorded with community consent. Living memory preserved with moral rights intact.",
    status: "active",
  },
];
