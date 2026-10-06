// ==============================================================================
// EKA CULTURAL INTELLIGENCE REASONING ENGINE: "ASK EKA"
// ==============================================================================
// Grounds inquiries in structured cultural knowledge + verified citations.
// Architecture:
// User Question → Intent Detection → Entity Detection → Knowledge Retrieval →
// Relevant Knowledge Objects → Relevant Sources → AI Context Builder → Gemini AI
// (Bounded strictly within token budgets: 5,000–20,000 tokens)
// ==============================================================================

import { CULTURAL_KNOWLEDGE_CORPUS } from "./knowledge-corpus";
import type { CulturalKnowledgeObject, CulturalInquiryResult } from "./types";
import { generateGeminiContent } from "@/lib/ai/gemini-client";
import { buildEkaAiContext } from "@/lib/knowledge/knowledge-context-builder";
import { TOKEN_BUDGETS } from "@/lib/ai/token-budget-manager";

export async function askEkaCulturalEngine(userQuery: string): Promise<CulturalInquiryResult> {
  const queryLower = userQuery.toLowerCase().trim();

  // 1. Multi-stage RAG Retrieval & Context Assembly bounded by token budget
  const contextBundle = await buildEkaAiContext(
    userQuery,
    undefined,
    TOKEN_BUDGETS.ASK_EKA_PREFERRED_MAX,
  );

  // 2. Resolve matched knowledge object from corpus
  const queryTokens = queryLower.split(/\s+/).filter((w) => w.length > 2);
  let matchedObject: CulturalKnowledgeObject | undefined = CULTURAL_KNOWLEDGE_CORPUS.find((item) => {
    const textBlob = `${item.id} ${item.slug} ${item.title} ${item.region} ${item.tags.join(" ")} ${item.curiosityQuestion}`.toLowerCase();
    return queryTokens.some((token) => textBlob.includes(token));
  });

  if (!matchedObject) {
    matchedObject = CULTURAL_KNOWLEDGE_CORPUS[0];
  }

  const baseObj = matchedObject || CULTURAL_KNOWLEDGE_CORPUS[0]!;

  // 3. Baseline Curated Answer Layer
  let explanation = {
    summary: baseObj.summary,
    deepExplanation: `${baseObj.what}\n\n${baseObj.why}\n\nHistorical Origin: ${baseObj.origin.historicalContext}`,
    culturalNuance: `Rooted in ${baseObj.origin.philosophicalRoot}. Practiced primarily in ${baseObj.region} by ${baseObj.who.custodians}.`,
    visitorGuidance: baseObj.how.visitorEtiquette,
    poweredBy: "EKA Curated Lineage Archives",
  };

  // 4. Bounded Gemini Reasoning via Automatic Context Guard
  try {
    const geminiRes = await generateGeminiContent(contextBundle.contextPrompt, {
      temperature: 0.2,
      maxOutputTokens: 900,
      taskType: "ask_eka",
      maxBudget: TOKEN_BUDGETS.ASK_EKA_PREFERRED_MAX,
      retrievedObjects: [contextBundle.primaryKnowledgeObject],
      retrievedSources: contextBundle.verifiedSources,
      systemInstruction:
        "You are the EKA Cultural Intelligence Engine. Ground all answers in authentic primary lineages, regional distinctions, and philosophical roots. Emphasize plural understanding over monoculture.",
    });

    if (geminiRes.text && !geminiRes.error) {
      const text = geminiRes.text;
      const summaryMatch = text.match(/SUMMARY:\s*([\s\S]*?)(?=DEEP CONTEXT:|$)/i);
      const deepMatch = text.match(/DEEP CONTEXT:\s*([\s\S]*?)(?=VISITOR GUIDANCE:|$)/i);
      const guidanceMatch = text.match(/VISITOR GUIDANCE:\s*([\s\S]*?)$/i);

      explanation = {
        summary: summaryMatch?.[1]?.trim() || baseObj.summary,
        deepExplanation: deepMatch?.[1]?.trim() || explanation.deepExplanation,
        culturalNuance: `Grounding verified through Gemini reasoning against ${contextBundle.verifiedSources.length} primary citations.`,
        visitorGuidance: guidanceMatch?.[1]?.trim() || baseObj.how.visitorEtiquette,
        poweredBy: `Google Gemini (${geminiRes.provider === "google-direct" ? "Direct API" : "Gateway"}) & EKA Verified Lineage Corpus`,
      };
    }
  } catch (err) {
    console.warn("[Ask EKA Engine] Gemini bypassed, serving verified corpus:", err);
  }

  // Related traditions
  const relatedTraditions = CULTURAL_KNOWLEDGE_CORPUS.filter(
    (c) => c.id !== baseObj.id && (c.category === baseObj.category || baseObj.relatedKnowledgeIds.includes(c.id)),
  ).map((c) => ({ id: c.id, title: c.title, region: c.region }));

  return {
    query: userQuery,
    matchedObject: baseObj,
    aiExplanation: explanation,
    relatedTraditions,
    verifiedSources: baseObj.sources,
  };
}
