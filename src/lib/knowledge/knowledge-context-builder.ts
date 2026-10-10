/**
 * ==============================================================================
 * EKA KNOWLEDGE ARCHITECTURE — CONTEXT BUILDER & RAG RETRIEVAL ENGINE
 * ==============================================================================
 * Specification: Sections 33.4, 33.5, 33.6, 33.7, 33.10, 33.11
 *
 * Implements the canonical EKA RAG pipeline:
 * User Question
 *   ↓
 * Intent Detection (question-corpus-service)
 *   ↓
 * Entity Detection
 *   ↓
 * Knowledge Retrieval (Supabase + Knowledge Graph + Semantic Ranking)
 *   ↓
 * Relevant Knowledge Objects (Pruned per 33.7)
 *   ↓
 * Relevant Relationships (Compressed per 33.6)
 *   ↓
 * Relevant Sources (Deduplicated, provenance preserved per 33.6)
 *   ↓
 * Relevant Community Perspectives
 *   ↓
 * Compact Context Builder (Token budget bounded: 5,000–20,000 tokens)
 *   ↓
 * Gemini AI Reasoning
 *   ↓
 * Answer + Sources + Next Discovery Suggestions
 * ==============================================================================
 */

import { supabase } from "@/integrations/supabase/client";
import {
  TOKEN_BUDGETS,
  estimateTokens,
  estimatePayloadTokens,
  pruneKnowledgeObjectForAi,
  deduplicateSources,
  compressTextToBudget,
} from "@/lib/ai/token-budget-manager";
import {
  retrieveRelevantCorpusQuestions,
  detectQuestionIntent,
} from "./question-corpus-service";
import { CANONICAL_KNOWLEDGE_OBJECTS } from "./knowledge-graph";

export interface RetrievedContextBundle {
  userQuery: string;
  detectedIntent: string;
  detectedEntities: string[];
  primaryKnowledgeObject: Record<string, any>;
  secondaryKnowledgeObjects: Record<string, any>[];
  verifiedSources: Array<{
    id: string;
    title: string;
    citationRef: string;
    language?: string;
    verifier?: string;
    trustScore?: number;
  }>;
  compressedRelationships: Array<{
    from: string;
    predicate: string;
    to: string;
  }>;
  communityPerspectives: Array<{
    region: string;
    practice: string;
    significance: string;
  }>;
  suggestedFollowups: string[];
  contextPrompt: string;
  estimatedTokens: number;
}

/**
 * Extracts candidate entities from query using keyword heuristics & gazetteer.
 */
export function detectEntitiesInQuery(query: string): string[] {
  const normalized = query.toLowerCase();
  const knownEntities = [
    "diwali",
    "deepavali",
    "aranmula kannadi",
    "aranmula",
    "bishnoi",
    "khejri",
    "patan patola",
    "patola",
    "sandhyavandanam",
    "gayatri",
    "bhakti",
    "kirtan",
    "varanasi",
    "kashi",
    "ganga aarti",
    "ganga",
    "shiva",
    "bhaona",
    "majuli",
    "ryoan-ji",
    "jerusalem",
    "toda",
    "bihu",
  ];

  const detected: string[] = [];
  for (const entity of knownEntities) {
    if (normalized.includes(entity)) {
      detected.push(entity);
    }
  }

  // If no known entities detected, take significant tokens
  if (detected.length === 0) {
    const tokens = normalized.split(/\s+/).filter((t) => t.length > 3);
    return tokens.slice(0, 3);
  }

  return detected;
}

/**
 * Stage-by-stage RAG Retrieval and Context Building bounded by token budget.
 */
export async function buildEkaAiContext(
  userQuery: string,
  explicitTargetSlug?: string,
  maxBudget = TOKEN_BUDGETS.ASK_EKA_PREFERRED_MAX,
): Promise<RetrievedContextBundle> {
  // 1. Intent Detection
  const detectedIntent = detectQuestionIntent(userQuery);

  // 2. Entity Detection
  const detectedEntities = detectEntitiesInQuery(userQuery);

  // 3. Question Corpus match for intent, evaluation, and follow-ups
  const { suggestedFollowups } = await retrieveRelevantCorpusQuestions(userQuery, 3);

  // 4. Retrieve candidate Knowledge Objects (from Supabase or canonical graph)
  let candidateObjects: any[] = [];

  try {
    // Attempt selective Supabase lookup
    const { data: dbObjects, error } = await (supabase as any)
      .from("knowledge_objects")
      .select("id, slug, title, summary, description, type, category, tradition, geography, sources, primary_references, regional_variations, verification_status, confidence, provenance")
      .limit(10);

    if (!error && dbObjects && dbObjects.length > 0) {
      candidateObjects = dbObjects;
    }
  } catch {
    // fallback to canonical graph
  }

  if (candidateObjects.length === 0) {
    candidateObjects = [...CANONICAL_KNOWLEDGE_OBJECTS];
  }

  // 5. Ranking & Filtering according to Section 33.5:
  // Priority:
  // 1. Exact entity match
  // 2. Exact question/topic match
  // 3. High-confidence Knowledge Objects
  // 4. Verified status
  const ranked = candidateObjects
    .map((obj) => {
      let score = 0;
      const title = (obj.title || obj.entity || "").toLowerCase();
      const slug = (obj.slug || "").toLowerCase();
      const summary = (obj.summary || obj.oneLiner || "").toLowerCase();

      // Exact slug match
      if (explicitTargetSlug && (slug === explicitTargetSlug.toLowerCase() || obj.id === explicitTargetSlug)) {
        score += 100;
      }

      // Entity matches
      for (const ent of detectedEntities) {
        if (title.includes(ent) || slug.includes(ent)) score += 50;
        else if (summary.includes(ent)) score += 20;
      }

      // Confidence & verification bonus
      if (obj.confidence) score += Math.round(obj.confidence * 10);
      if (obj.verification_status === "Published" || obj.verification_status === "Expert Verified") {
        score += 15;
      }

      return { obj, score };
    })
    .sort((a, b) => b.score - a.score);

  const topMatch = ranked[0]?.obj || candidateObjects[0];
  const secondaries = ranked.slice(1, 4).map((r) => r.obj);

  // 6. Prune Knowledge Objects for AI Context (Section 33.7)
  const prunedPrimary = pruneKnowledgeObjectForAi(topMatch, detectedIntent as any);
  const prunedSecondaries = secondaries.map((sec) =>
    pruneKnowledgeObjectForAi(sec, detectedIntent as any),
  );

  // 7. Aggregate & Deduplicate Sources (Section 33.6)
  const rawSources = [
    ...(prunedPrimary.sources || []),
    ...prunedSecondaries.flatMap((s) => s.sources || []),
  ];
  const verifiedSources = deduplicateSources(rawSources).slice(0, 6);

  // 8. Compress Relationships (Section 33.6)
  const compressedRelationships: Array<{ from: string; predicate: string; to: string }> = [];
  if (topMatch.linkedGraphNodes) {
    for (const [pred, targets] of Object.entries(topMatch.linkedGraphNodes)) {
      if (Array.isArray(targets)) {
        for (const t of targets.slice(0, 3)) {
          compressedRelationships.push({
            from: prunedPrimary.title,
            predicate: pred.toUpperCase(),
            to: typeof t === "string" ? t : (t as any).label || (t as any).entity || "",
          });
        }
      }
    }
  }

  // 9. Community Perspectives & Regional Variations
  const rawVariations = prunedPrimary.regional_variations || [];
  const communityPerspectives = rawVariations.map((v: any) => ({
    region: v.region || "Regional Expression",
    practice: v.distinctPractice || "",
    significance: v.significance || "",
  }));

  // 10. Assemble Compact Context Prompt (Target budget: 5,000–20,000 tokens)
  const promptLines: string[] = [
    `USER INQUIRY: "${userQuery}"`,
    `DETECTED INTENT: ${detectedIntent.toUpperCase()}`,
    `DETECTED ENTITIES: ${detectedEntities.join(", ") || "General"}`,
    ``,
    `CANONICAL KNOWLEDGE OBJECT:`,
    `- Title: ${prunedPrimary.title}`,
    `- Core Summary: ${prunedPrimary.summary || ""}`,
    prunedPrimary.what ? `- Essential Meaning: ${prunedPrimary.what}` : "",
    prunedPrimary.why ? `- Philosophical Root: ${prunedPrimary.why}` : "",
    prunedPrimary.origin ? `- Historical Origin: ${JSON.stringify(prunedPrimary.origin)}` : "",
    prunedPrimary.geography ? `- Geography & Sacred Locus: ${JSON.stringify(prunedPrimary.geography)}` : "",
    `- Epistemic Verification: ${prunedPrimary.verification_status} (Confidence: ${prunedPrimary.confidence})`,
    ``,
    `VERIFIED SOURCES & LINEAGES (${verifiedSources.length}):`,
    ...verifiedSources.map(
      (s) => `- ${s.title} [Ref: ${s.citationRef}] (Verified by: ${s.verifier || "EKA Lineage Archive"}, Trust: ${s.trustScore}%)`,
    ),
    ``,
  ];

  if (communityPerspectives.length > 0) {
    promptLines.push(
      `LIVING REGIONAL VARIATIONS:`,
      ...communityPerspectives.map((p: any) => `- [${p.region}] ${p.practice}: ${p.significance}`),
      ``,
    );
  }

  if (compressedRelationships.length > 0) {
    promptLines.push(
      `KNOWLEDGE GRAPH RELATIONSHIPS:`,
      ...compressedRelationships.map((r) => `- (${r.from}) -[${r.predicate}]-> (${r.to})`),
      ``,
    );
  }

  promptLines.push(
    `RESPONSE INSTRUCTIONS:`,
    `1. Answer concisely and reverently, honoring plural regional expressions without sectarian bias.`,
    `2. Ground statements in the verified sources provided above.`,
    `3. Format your answer into:`,
    `   SUMMARY: (2 clear sentences)`,
    `   DEEP CONTEXT: (1-2 paragraphs detailing lineage, meaning, and regional practice)`,
    `   VISITOR GUIDANCE: (Respectful etiquette and living observation)`,
  );

  let contextPrompt = promptLines.filter(Boolean).join("\n");
  let estimatedTokens = estimateTokens(contextPrompt);

  // If over budget, compress to fit
  if (estimatedTokens > maxBudget) {
    contextPrompt = compressTextToBudget(contextPrompt, maxBudget);
    estimatedTokens = estimateTokens(contextPrompt);
  }

  return {
    userQuery,
    detectedIntent,
    detectedEntities,
    primaryKnowledgeObject: prunedPrimary,
    secondaryKnowledgeObjects: prunedSecondaries,
    verifiedSources,
    compressedRelationships,
    communityPerspectives,
    suggestedFollowups,
    contextPrompt,
    estimatedTokens,
  };
}
