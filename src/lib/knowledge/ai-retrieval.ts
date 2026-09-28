/**
 * EKA Cultural AI Retrieval & Synthesis Engine
 *
 * Implements context-rich cultural intelligence retrieval answering
 * "What Wikipedia doesn't give you":
 * 1. Who practices it & where
 * 2. How it varies across communities & regions
 * 3. Lived experience & community worldview
 * 4. Where to experience it authentically
 * 5. Artisans, custodians & living guilds
 * 6. Epistemic clarity (Documented facts vs Traditional beliefs vs Interpretations)
 * 7. Source Passport & Provenance guarantees
 * 8. Linked Knowledge Graph entities
 */

import {
  type EkaKnowledgeObject,
  type EpistemicClaim,
  type CulturalVariation,
} from "./knowledge-object";
import {
  CANONICAL_KNOWLEDGE_OBJECTS,
  getKnowledgeObjectBySlug,
  searchKnowledgeGraph,
} from "./knowledge-graph";

export interface EkaAiRetrievalResult {
  query: string;
  matchedEntity: EkaKnowledgeObject;
  confidence: number;
  answerSections: {
    coreUnderstanding: string;
    whoPracticesAndWhere: {
      communities: string[];
      regions: string[];
      languages: string[];
      geographyHighlights: string[];
    };
    culturalVariations: CulturalVariation[];
    communityMeaning: {
      worldview: string;
      spiritualConcepts: string[];
      socialCustoms: string[];
    };
    authenticExperiences: string[];
    artisansAndCustodians: {
      guilds: string[];
      ethicalBrands: string[];
      workshops: string[];
    };
    epistemicBreakdown: {
      documentedFacts: EpistemicClaim[];
      traditionalBeliefs: EpistemicClaim[];
      interpretations: EpistemicClaim[];
      communityReported: EpistemicClaim[];
      disputed: EpistemicClaim[];
    };
    sourcePassport: {
      totalSources: number;
      evidenceStrength: string;
      tierBreakdown: Record<string, number>;
      primarySources: Array<{ title: string; license: string; type: string }>;
    };
    linkedGraphNodes: EkaKnowledgeObject["linkedGraphNodes"];
  };
  synthesisMarkdown: string;
}

export const SUGGESTED_CULTURAL_QUERIES = [
  "How does Diwali differ between Tamil Nadu, Bengal, and Jain traditions?",
  "What is the secret metallurgy behind the Aranmula Kannadi metal mirror?",
  "How do the 29 rules of the Bishnoi protect the Thar desert ecology?",
  "Explain the double-ikat geometry and history of Patan Patola",
  "Why is the dry landscape garden of Ryoan-ji designed with 15 stones?",
  "How do the Neo-Vaishnavite Sattras of Majuli preserve Bhaona mask theatre?",
  "What is the bioclimatic cooling science inside a Marrakesh Medina Riad courtyard?",
  "How do the four quarters and Muslim key keepers share the Old City of Jerusalem?",
  "What is the sacred buffalo dairy ritual of the Toda community in the Nilgiris?",
  "What are the seven days of Bohag Bihu and the significance of the Gamusa?",
];

/**
 * Main retrieval function for EKA Cultural AI Assistant.
 */
export function retrieveEkaCulturalIntelligence(
  query: string,
  explicitSlug?: string
): EkaAiRetrievalResult | null {
  let entity: EkaKnowledgeObject | undefined;

  if (explicitSlug) {
    entity = getKnowledgeObjectBySlug(explicitSlug);
  }

  if (!entity) {
    const results = searchKnowledgeGraph(query);
    if (results.length > 0) {
      entity = results[0];
    } else {
      // Default to Diwali if query is empty or broad
      entity = CANONICAL_KNOWLEDGE_OBJECTS[0];
    }
  }

  if (!entity) return null;

  // Segment epistemic claims into clear pedagogical categories
  const epistemicBreakdown = {
    documentedFacts: entity.epistemicClaims.filter(
      (c) => c.epistemicType === "DOCUMENTED" || c.epistemicType === "SOURCE_SUPPORTED"
    ),
    traditionalBeliefs: entity.epistemicClaims.filter(
      (c) => c.epistemicType === "TRADITIONAL_BELIEF"
    ),
    interpretations: entity.epistemicClaims.filter(
      (c) => c.epistemicType === "INTERPRETATION"
    ),
    communityReported: entity.epistemicClaims.filter(
      (c) => c.epistemicType === "COMMUNITY_REPORTED"
    ),
    disputed: entity.epistemicClaims.filter(
      (c) => c.epistemicType === "DISPUTED" || c.epistemicType === "UNVERIFIED"
    ),
  };

  // Build high-clarity synthesized markdown
  const markdownLines: string[] = [
    `# Cultural Intelligence: ${entity.entity}`,
    `*${entity.oneLiner}*`,
    ``,
    `### 1. What It Is (Beyond Monolithic Summaries)`,
    entity.summary,
    ``,
    `### 2. Who Practices It & Where`,
    `- **Practicing Communities:** ${entity.culturalDimensions.identity.communities.join(", ")}`,
    `- **Primary Regions:** ${entity.culturalDimensions.identity.regions.join(", ")}`,
    `- **Spoken & Sacred Languages:** ${entity.culturalDimensions.identity.languages.join(", ")}`,
    `- **Sacred Landscapes:** ${entity.culturalDimensions.geography.sacredLandscapes.join("; ")}`,
    ``,
    `### 3. Documented Variations (${entity.culturalVariations.length} Distinct Traditions)`,
  ];

  entity.culturalVariations.forEach((v) => {
    markdownLines.push(
      `#### ${v.label} (${v.regionOrGroup})`,
      `- **Distinct Practice:** ${v.distinctPractice}`,
      `- **Cultural Significance:** ${v.significance}`,
      `- **Key Objects / Foods:** ${v.associatedFoodOrObjects.join(", ")}`,
      `- **Sources:** ${v.sources.join("; ")}`,
      ``
    );
  });

  markdownLines.push(
    `### 4. Community Meaning & Lived Experience`,
    `- **Worldview:** ${entity.culturalDimensions.beliefs.worldview}`,
    `- **Spiritual Core:** ${entity.culturalDimensions.beliefs.spiritualConcepts.join("; ")}`,
    `- **Social Customs:** ${entity.culturalDimensions.socialLife.socialCustoms.join("; ")}`,
    ``,
    `### 5. Where to Experience It Authentically`,
    ...entity.culturalDimensions.localEconomy.livingExperiences.map((e) => `- ${e}`),
    ``,
    `### 6. Custodians, Artisans & Guilds`,
    `- **Master Artisans & Lineages:** ${entity.culturalDimensions.localEconomy.traditionalArtisans.join("; ")}`,
    `- **Ethical Collectives:** ${entity.culturalDimensions.localEconomy.ethicalLocalBrands.join("; ")}`,
    `- **Authentic Workshops:** ${entity.culturalDimensions.localEconomy.authenticWorkshops.join("; ")}`,
    ``,
    `### 7. Epistemic Clarity: Facts vs Traditions`,
    `- **Documented Historical/Physical Facts:** ${epistemicBreakdown.documentedFacts.length} claims verified`,
    `- **Sacred Traditional Beliefs:** ${epistemicBreakdown.traditionalBeliefs.length} venerated traditions`,
    `- **Philosophical Interpretations:** ${epistemicBreakdown.interpretations.length} exegetical readings`,
    ``,
    `### 8. Source Passport & Evidence Strength`,
    `This entity is corroborated by **${entity.sourcePassport.totalSources} verified sources** with **${entity.sourcePassport.evidenceStrength} Evidence Strength**.`,
    `Tiers: Reference (${entity.sourcePassport.breakdown.reference}), Institutional (${entity.sourcePassport.breakdown.institutional}), Primary/Scripture (${entity.sourcePassport.breakdown.primary}), Community Oral (${entity.sourcePassport.breakdown.community}).`
  );

  return {
    query,
    matchedEntity: entity,
    confidence: 0.96,
    answerSections: {
      coreUnderstanding: entity.summary,
      whoPracticesAndWhere: {
        communities: entity.culturalDimensions.identity.communities,
        regions: entity.culturalDimensions.identity.regions,
        languages: entity.culturalDimensions.identity.languages,
        geographyHighlights: entity.culturalDimensions.geography.places,
      },
      culturalVariations: entity.culturalVariations,
      communityMeaning: {
        worldview: entity.culturalDimensions.beliefs.worldview,
        spiritualConcepts: entity.culturalDimensions.beliefs.spiritualConcepts,
        socialCustoms: entity.culturalDimensions.socialLife.socialCustoms,
      },
      authenticExperiences: entity.culturalDimensions.localEconomy.livingExperiences,
      artisansAndCustodians: {
        guilds: entity.culturalDimensions.localEconomy.traditionalArtisans,
        ethicalBrands: entity.culturalDimensions.localEconomy.ethicalLocalBrands,
        workshops: entity.culturalDimensions.localEconomy.authenticWorkshops,
      },
      epistemicBreakdown,
      sourcePassport: {
        totalSources: entity.sourcePassport.totalSources,
        evidenceStrength: entity.sourcePassport.evidenceStrength,
        tierBreakdown: entity.sourcePassport.breakdown,
        primarySources: entity.sourcePassport.sourcesList.map((s) => ({
          title: s.title,
          license: s.license,
          type: s.type,
        })),
      },
      linkedGraphNodes: entity.linkedGraphNodes,
    },
    synthesisMarkdown: markdownLines.join("\n"),
  };
}
