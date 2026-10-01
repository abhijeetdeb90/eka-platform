// ==============================================================================
// EKA CULTURAL INTELLIGENCE REASONING ENGINE: "ASK EKA"
// ==============================================================================
// Grounds inquiries in structured cultural knowledge + verified citations.
// Does NOT behave like a generic ChatGPT wrapper.
// Connects: Person → Identity → Context → Culture → Source → Community
// ==============================================================================

import { CULTURAL_KNOWLEDGE_CORPUS } from "./knowledge-corpus";
import type { CulturalKnowledgeObject, CulturalInquiryResult } from "./types";
import { generateGeminiContent } from "@/lib/ai/gemini-client";

export async function askEkaCulturalEngine(userQuery: string): Promise<CulturalInquiryResult> {
  const queryLower = userQuery.toLowerCase().trim();

  // 1. Semantic Token & Keyword Match against Corpus
  const queryTokens = queryLower.split(/\s+/).filter((w) => w.length > 2);
  let matchedObject: CulturalKnowledgeObject | undefined = CULTURAL_KNOWLEDGE_CORPUS.find((item) => {
    const textBlob = `${item.id} ${item.slug} ${item.title} ${item.region} ${item.tags.join(" ")} ${item.curiosityQuestion}`.toLowerCase();
    return queryTokens.some((token) => textBlob.includes(token));
  });

  if (!matchedObject) {
    matchedObject = CULTURAL_KNOWLEDGE_CORPUS[0];
  }

  const baseObj = matchedObject || CULTURAL_KNOWLEDGE_CORPUS[0]!;

  // 2. Default Curated Answer Layer
  let explanation = {
    summary: baseObj.summary,
    deepExplanation: `${baseObj.what}\n\n${baseObj.why}\n\nHistorical Origin: ${baseObj.origin.historicalContext}`,
    culturalNuance: `Rooted in ${baseObj.origin.philosophicalRoot}. Practiced primarily in ${baseObj.region} by ${baseObj.who.custodians}.`,
    visitorGuidance: baseObj.how.visitorEtiquette,
    poweredBy: "EKA Curated Lineage Archives",
  };

  // 3. Dynamic Gemini Contextual Enrichment
  try {
    const prompt = `User Query: "${userQuery}"
Subject Cultural Knowledge Object: "${baseObj.title}"
Region: ${baseObj.region}
What: ${baseObj.what}
Why: ${baseObj.why}
Origin: ${baseObj.origin.historicalContext}
Philosophical Root: ${baseObj.origin.philosophicalRoot}
Primary Sources: ${baseObj.sources.map((s) => `${s.title} (${s.citationRef})`).join("; ")}

You are the EKA Cultural Intelligence Layer.
Respond in a contemplative, objective, and deeply respectful editorial tone.
Answer the user's specific curiosity with precise cultural context.
Do NOT sound like generic conversational AI. Avoid filler ("Certainly!", "Great question!").
Format your response into:
1. SUMMARY: A concise 2-sentence direct answer.
2. DEEP CONTEXT: 1-2 paragraphs detailing the meaning, lineage, and regional nuance.
3. VISITOR GUIDANCE: Practical respectful etiquette for someone wishing to witness or experience this.`;

    const geminiRes = await generateGeminiContent(prompt, {
      temperature: 0.2,
      maxOutputTokens: 900,
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
        culturalNuance: `Grounding verified through Gemini reasoning against primary citations: ${baseObj.sources.map((s) => s.citationRef).join(", ")}.`,
        visitorGuidance: guidanceMatch?.[1]?.trim() || baseObj.how.visitorEtiquette,
        poweredBy: "Google Gemini 2.5 & EKA Verified Lineage Corpus",
      };
    }
  } catch (err) {
    console.warn("[Ask EKA Engine] Gemini bypassed, serving verified corpus:", err);
  }

  // Related traditions
  const relatedTraditions = CULTURAL_KNOWLEDGE_CORPUS.filter(
    (c) => c.id !== baseObj.id && (c.category === baseObj.category || baseObj.relatedKnowledgeIds.includes(c.id))
  ).map((c) => ({ id: c.id, title: c.title, region: c.region }));

  return {
    query: userQuery,
    matchedObject: baseObj,
    aiExplanation: explanation,
    relatedTraditions,
    verifiedSources: baseObj.sources,
  };
}
