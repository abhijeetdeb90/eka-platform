/**
 * EKA Card Generator
 *
 * Automatically converts structured EkaKnowledgeObjects into typed
 * EkaDiscoveryCard primitives with verified provenance badges, dimension tags,
 * and deep links to `/knowledge/$slug`.
 */

import type { EkaDiscoveryCard, CardType } from "../homepage-data";
import type { EkaKnowledgeObject } from "./knowledge-object";
import { CANONICAL_KNOWLEDGE_OBJECTS } from "./knowledge-graph";

function mapKnowledgeTypeToCardType(type: EkaKnowledgeObject["type"]): CardType {
  switch (type) {
    case "festival":
      return "tradition";
    case "tradition":
      return "tradition";
    case "craft":
      return "knowledge";
    case "culture":
      return "culture";
    case "place":
      return "place";
    case "community":
      return "community";
    case "foodway":
      return "local";
    case "art":
      return "culture";
    case "language":
      return "knowledge";
    case "person":
      return "creator";
    default:
      return "culture";
  }
}

/**
 * Converts a canonical EkaKnowledgeObject into a primary EkaDiscoveryCard.
 */
export function knowledgeObjectToCard(obj: EkaKnowledgeObject): EkaDiscoveryCard {
  const primaryRegion = obj.culturalDimensions.identity.regions[0] || "Global";
  const primaryCommunity = obj.culturalDimensions.identity.communities[0];
  const primaryImage =
    obj.images[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop";

  const topSources = obj.sourcePassport.sourcesList.map((s) => s.title).slice(0, 2);
  const sourceCitation = `Verified by ${obj.sourcePassport.totalSources} sources (${topSources.join("; ")})`;

  const tags = [
    obj.type.toUpperCase(),
    ...obj.culturalDimensions.identity.regions.slice(0, 2),
    ...obj.culturalDimensions.identity.communities.slice(0, 2),
    `${obj.culturalVariations.length} documented variations`,
    `${obj.sourcePassport.evidenceStrength} Evidence`,
  ];

  return {
    id: `card-${obj.slug}`,
    type: mapKnowledgeTypeToCardType(obj.type),
    categoryBadge: `${obj.type.toUpperCase()} · ${primaryRegion.toUpperCase()}`,
    title: obj.entity,
    oneLiner: obj.oneLiner,
    fullExplanation: obj.summary,
    image: primaryImage,
    location: primaryRegion,
    community: primaryCommunity,
    tradition: obj.culturalDimensions.beliefs.worldview.slice(0, 80) + "...",
    verified: obj.sourcePassport.evidenceStrength === "Strong",
    sourceCitation,
    knowledgeTags: tags,
    linkTo: `/knowledge/${obj.slug}`,
    stats: {
      saves: 142 + obj.culturalVariations.length * 37,
      discussions: 18 + obj.sourcePassport.totalSources * 4,
    },
    featured: true,
  };
}

/**
 * Generates an array of all primary discovery cards for all canonical objects.
 */
export function getAllGeneratedKnowledgeCards(): EkaDiscoveryCard[] {
  return CANONICAL_KNOWLEDGE_OBJECTS.map(knowledgeObjectToCard);
}

/**
 * Generates secondary variation cards for a single knowledge object to enable
 * granular card-based browsing of regional differences.
 */
export function generateVariationCards(obj: EkaKnowledgeObject): EkaDiscoveryCard[] {
  return obj.culturalVariations.map((v) => {
    return {
      id: `var-card-${v.id}`,
      type: "tradition",
      categoryBadge: `VARIATION · ${v.dimension.toUpperCase()}`,
      title: `${v.label} (${obj.entity})`,
      oneLiner: v.distinctPractice,
      fullExplanation: `${v.significance} Observed in ${v.regionOrGroup}. Documented in ${v.sources.join(", ")}. Associated with: ${v.associatedFoodOrObjects.join(", ")}.`,
      image:
        obj.images[0]?.thumbnailUrl ||
        "https://images.unsplash.com/photo-1576761428284-5f96307e5932?q=80&w=600&auto=format&fit=crop",
      location: v.regionOrGroup,
      verified: true,
      sourceCitation: v.sources.join("; "),
      knowledgeTags: [v.dimension, v.regionOrGroup, "EKA Documented Variation"],
      linkTo: `/knowledge/${obj.slug}#${v.id}`,
      stats: {
        saves: 85,
        discussions: 12,
      },
    };
  });
}
