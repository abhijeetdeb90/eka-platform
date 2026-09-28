// ==============================================================================
// EKA STUDIO — CENTRALIZED HYBRID SEARCH SERVICE
// ==============================================================================

import { SEED_KNOWLEDGE_OBJECTS } from "./knowledge-service";
import { SEED_CONTENT_ITEMS } from "./content-service";
import { SEED_MEDIA_ASSETS } from "./media-service";
import { SEED_TAXONOMY_NODES } from "./taxonomy-service";

export interface UnifiedSearchResult {
  id: string;
  title: string;
  subtitle: string;
  entity_type: "knowledge_object" | "content" | "media" | "taxonomy" | "place" | "community";
  tradition?: string;
  community?: string;
  geography?: string;
  language?: string;
  verification_status?: string;
  match_score: number;
  snippet?: string;
  href: string;
}

export interface SearchFilterCriteria {
  query: string;
  geography?: string;
  language?: string;
  tradition?: string;
  community?: string;
  content_type?: string;
  verification_status?: string;
  is_semantic?: boolean;
}

export function searchStudioEntities(criteria: SearchFilterCriteria): UnifiedSearchResult[] {
  const q = criteria.query.toLowerCase().trim();
  const results: UnifiedSearchResult[] = [];

  // 1. Search Knowledge Objects
  SEED_KNOWLEDGE_OBJECTS.forEach((ko) => {
    let score = 0;
    const textMatch =
      ko.title.toLowerCase().includes(q) ||
      ko.summary.toLowerCase().includes(q) ||
      ko.description.toLowerCase().includes(q) ||
      ko.tradition.toLowerCase().includes(q);

    if (!q || textMatch) {
      score += 0.8;
      if (ko.title.toLowerCase().includes(q)) score += 0.4;
      if (ko.verification_status === "Published" || ko.verification_status === "Expert Verified")
        score += 0.2;

      // Filter checks
      if (criteria.tradition && criteria.tradition !== "all" && ko.tradition !== criteria.tradition)
        return;
      if (criteria.community && criteria.community !== "all" && ko.community !== criteria.community)
        return;
      if (
        criteria.verification_status &&
        criteria.verification_status !== "all" &&
        ko.verification_status !== criteria.verification_status
      )
        return;
      if (
        criteria.content_type &&
        criteria.content_type !== "all" &&
        criteria.content_type !== "knowledge_object"
      )
        return;

      results.push({
        id: ko.id,
        title: ko.title,
        subtitle: `${ko.type} · ${ko.tradition}`,
        entity_type: "knowledge_object",
        tradition: ko.tradition,
        community: ko.community,
        geography: ko.geography.cultural_locus || ko.geography.country,
        language: ko.language.liturgical,
        verification_status: ko.verification_status,
        match_score: Number(score.toFixed(2)),
        snippet: ko.summary,
        href: `/studio?tab=knowledge&id=${ko.id}`,
      });
    }
  });

  // 2. Search Content Items
  SEED_CONTENT_ITEMS.forEach((c) => {
    let score = 0;
    const textMatch =
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q));

    if (!q || textMatch) {
      score += 0.75;
      if (c.title.toLowerCase().includes(q)) score += 0.35;

      if (criteria.tradition && criteria.tradition !== "all" && c.tradition !== criteria.tradition)
        return;
      if (criteria.community && criteria.community !== "all" && c.community !== criteria.community)
        return;
      if (
        criteria.content_type &&
        criteria.content_type !== "all" &&
        criteria.content_type !== "content"
      )
        return;

      results.push({
        id: c.id,
        title: c.title,
        subtitle: `${c.type.toUpperCase()} · ${c.creator_name}`,
        entity_type: "content",
        tradition: c.tradition,
        community: c.community,
        language: c.language,
        verification_status: c.status === "published" ? "Published" : "Draft",
        match_score: Number(score.toFixed(2)),
        snippet: c.description,
        href: `/studio?tab=content&id=${c.id}`,
      });
    }
  });

  // 3. Search Media Assets
  SEED_MEDIA_ASSETS.forEach((m) => {
    let score = 0;
    const textMatch =
      m.title.toLowerCase().includes(q) ||
      m.caption?.toLowerCase().includes(q) ||
      m.tags.some((t) => t.toLowerCase().includes(q));

    if (!q || textMatch) {
      score += 0.6;
      if (
        criteria.content_type &&
        criteria.content_type !== "all" &&
        criteria.content_type !== "media"
      )
        return;

      results.push({
        id: m.id,
        title: m.title,
        subtitle: `${m.file_type.toUpperCase()} · ${m.license}`,
        entity_type: "media",
        verification_status: m.copyright_status,
        match_score: Number(score.toFixed(2)),
        snippet: m.caption || m.alt_text,
        href: `/studio?tab=media&id=${m.id}`,
      });
    }
  });

  // 4. Search Taxonomy
  SEED_TAXONOMY_NODES.forEach((t) => {
    const textMatch =
      t.name.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q);
    if (!q || textMatch) {
      if (
        criteria.content_type &&
        criteria.content_type !== "all" &&
        criteria.content_type !== "taxonomy"
      )
        return;

      results.push({
        id: t.id,
        title: t.name,
        subtitle: `Taxonomy: ${t.kind}`,
        entity_type: "taxonomy",
        match_score: 0.7,
        snippet: t.description,
        href: `/studio?tab=taxonomy&id=${t.id}`,
      });
    }
  });

  return results.sort((a, b) => b.match_score - a.match_score);
}
