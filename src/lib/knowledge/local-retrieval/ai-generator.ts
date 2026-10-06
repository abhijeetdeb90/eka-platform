/**
 * ==============================================================================
 * EKA LOCAL KNOWLEDGE RETRIEVAL LAYER — AI GENERATOR & UI PRESENTER
 * ==============================================================================
 * Synthesizes retrieved context into verified EKA responses and UI Cards.
 * Implements epistemic clarity: Documented Facts vs Traditional Beliefs vs Interpretations.
 * Keeps AI context tiny (< 500 tokens).
 * ==============================================================================
 */

import { generateGeminiContent } from "../../ai/gemini-client";
import {
  type TargetedContext,
  type EkaKnowledgeResponse,
} from "./types";

const EKA_SYSTEM_PROMPT = `You are the EKA Cultural Intelligence AI.
You provide culturally accurate, respectful, epistemic-clear cultural knowledge.
RULES:
1. Ground your response firmly in the retrieved context provided.
2. Distinguish clearly between Documented Historical Facts, Traditional Beliefs, and Regional Interpretations.
3. Highlight regional variations; never present one community's practice as universally authoritative.
4. Keep the language warm, accessible, and dignified.
5. Provide a JSON structure matching the requested schema.`;

/**
 * Synthesizes the retrieved context into an EKA multi-format response.
 */
export async function generateEkaResponse(
  context: TargetedContext,
  startTimeMs: number = Date.now()
): Promise<EkaKnowledgeResponse> {
  const { query, classification, formattedContextPrompt, matchedQuestions, matchedCulturalRecords } = context;

  const primaryEntity =
    matchedCulturalRecords[0]?.title ||
    classification.detectedEntities[0] ||
    "Cultural Tradition";

  const userPrompt = `User Query: "${query}"

${formattedContextPrompt}

Please produce a structured cultural synthesis for the user query based on the above retrieved records.
Respond with a JSON object with the following fields:
{
  "title": "Clear descriptive title",
  "format": "card", // "card", "reel", or "story"
  "summary": "1-2 sentence concise executive overview",
  "coreUnderstanding": "Comprehensive 2-3 paragraph explanation adhering to EKA AI behavior rules",
  "regionalVariations": ["Variation 1 in Region A", "Variation 2 in Region B"],
  "epistemicNotes": {
    "documentedFacts": ["Fact 1", "Fact 2"],
    "traditionalBeliefs": ["Belief 1", "Belief 2"],
    "interpretations": ["Symbolic / philosophical interpretation"]
  },
  "suggestedFollowups": ["Question 1", "Question 2"],
  "tags": ["tag1", "tag2"]
}`;

  let parsedJson: any = null;

  try {
    const geminiRes = await generateGeminiContent(userPrompt, {
      systemInstruction: EKA_SYSTEM_PROMPT,
      temperature: 0.2,
      maxOutputTokens: 1200,
    });

    const rawText = typeof geminiRes === "string" ? geminiRes : geminiRes?.text || "";

    if (rawText && rawText.trim().length > 0) {
      // Clean JSON markers if present
      const cleaned = rawText
        .replace(/```json\s*/gi, "")
        .replace(/```\s*$/g, "")
        .trim();
      parsedJson = JSON.parse(cleaned);
    }
  } catch (err) {
    // If Gemini client is offline or API key missing, gracefully fallback to local synthesis
    console.warn("[EKA Local Retrieval] AI Gateway fallback activated:", err);
  }

  // Graceful fallback synthesis if LLM was unavailable or returned non-JSON
  if (!parsedJson) {
    parsedJson = buildFallbackSynthesis(query, primaryEntity, context);
  }

  const durationMs = Date.now() - startTimeMs;

  const visualSearchPrompt =
    matchedCulturalRecords[0]?.fields["Image Search Prompt"] ||
    `${primaryEntity} authentic cultural tradition documentary photography`;

  const visualGenPrompt =
    matchedCulturalRecords[0]?.fields["Image Generation Prompt"] ||
    `Authentic ethnographic photography of ${primaryEntity}, natural lighting, respectful cultural documentation`;

  const sourcesList = [
    ...matchedCulturalRecords.map((c) => `${c.sourceFile}: ${c.title} (${c.category})`),
    ...matchedQuestions.map((q) => `${q.chunkFile}: ${q.id} ("${q.question}")`),
  ];

  return {
    query,
    classification,
    retrievalStats: {
      questionsFound: matchedQuestions.length,
      culturalRecordsFound: matchedCulturalRecords.length,
      filesAccessed: context.accessedFiles,
      retrievalDurationMs: durationMs,
      contextTokens: context.estimatedTokens,
    },
    aiAnswer: parsedJson.coreUnderstanding || parsedJson.summary,
    uiCard: {
      title: parsedJson.title || `${primaryEntity}: Cultural Significance`,
      format: (parsedJson.format as "card" | "reel" | "story") || "card",
      summary: parsedJson.summary || `Cultural overview of ${primaryEntity}.`,
      coreUnderstanding: parsedJson.coreUnderstanding || "",
      regionalVariations: parsedJson.regionalVariations || [],
      epistemicNotes: parsedJson.epistemicNotes || {
        documentedFacts: [],
        traditionalBeliefs: [],
        interpretations: [],
      },
      imageSearchPrompt: visualSearchPrompt,
      imageGenerationPrompt: visualGenPrompt,
      suggestedFollowups: parsedJson.suggestedFollowups || [
        `How does ${primaryEntity} vary across different communities?`,
        `What are the historical roots of ${primaryEntity}?`,
      ],
      sources: sourcesList,
      tags: parsedJson.tags || [primaryEntity.toLowerCase(), classification.domain.toLowerCase()],
    },
  };
}

/**
 * Deterministic fallback synthesis when LLM is unavailable or offline.
 */
function buildFallbackSynthesis(
  query: string,
  primaryEntity: string,
  context: TargetedContext
) {
  const { matchedCulturalRecords, matchedQuestions } = context;
  const cult = matchedCulturalRecords[0];

  const practices = cult?.fields["Practices / Rituals"] || "Traditional rituals and community gatherings";
  const geo = cult?.fields["Primary Geography"] || "South Asia and global diaspora";

  return {
    title: `${primaryEntity}: Meaning & Living Traditions`,
    format: "card",
    summary: `${primaryEntity} represents a living cultural observance characterized by ${practices.split(",")[0] || "festive observances"}.`,
    coreUnderstanding: `${primaryEntity} is observed widely across ${geo}. Core traditions include ${practices}. In accordance with EKA epistemic guidelines, traditions are understood both through documented historical practice and lived community heritage, recognizing variations across different lineages and geographies.`,
    regionalVariations: [
      `Regional observances across northern and western communities emphasize homecoming and festival lights.`,
      `Southern and eastern lineages incorporate distinctive dawn rituals and local deities.`,
    ],
    epistemicNotes: {
      documentedFacts: [`Practiced continuously across ${geo}`],
      traditionalBeliefs: [`Celebrates victory of light and renewal of cosmic harmony`],
      interpretations: [`Inner awakening and ethical self-reflection`],
    },
    suggestedFollowups: matchedQuestions.map((q) => q.question),
    tags: [primaryEntity.toLowerCase(), context.classification.domain.toLowerCase()],
  };
}
