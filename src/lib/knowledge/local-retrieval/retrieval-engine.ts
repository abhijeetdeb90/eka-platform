/**
 * ==============================================================================
 * EKA LOCAL KNOWLEDGE RETRIEVAL LAYER — RETRIEVAL ENGINE
 * ==============================================================================
 * Coordinates the targeted search and record extraction:
 * User Query → Classify → Query Index → Extract Matching Lines Only → Minimal AI Context
 *
 * Adheres strictly to the token minimization rule:
 * Context sent to AI is strictly proportional to the query, NOT the library size.
 * ==============================================================================
 */

import {
  type QuestionRecord,
  type CulturalRecord,
  type QueryClassification,
  type TargetedContext,
  type IKnowledgeStore,
  type KnowledgeCatalog,
} from "./types";
import { classifyQuery, getAssociatedTraditions } from "./query-classifier";
import {
  loadQuestionIndex,
  loadCulturalIndex,
  loadCatalog,
  buildLocalKnowledgeIndex,
} from "./local-indexer";
import {
  extractQuestionRecord,
  extractCulturalRecord,
  readLineRange,
} from "./markdown-reader";

export class LocalKnowledgeStore implements IKnowledgeStore {
  classifyQuery(query: string): QueryClassification {
    return classifyQuery(query);
  }

  async searchQuestions(
    classification: QueryClassification,
    limit: number = 3
  ): Promise<QuestionRecord[]> {
    const questionIndex = loadQuestionIndex();
    if (questionIndex.length === 0) {
      return [];
    }

    const { domain, intent, detectedEntities, keywords } = classification;

    // Scoring heuristic
    const scored = questionIndex.map((entry) => {
      let score = 0;

      // Domain match (+50)
      if (entry.d && entry.d.toLowerCase() === domain.toLowerCase()) {
        score += 50;
      }

      // Intent match (+30)
      if (entry.i && entry.i.toLowerCase() === intent.toLowerCase()) {
        score += 30;
      }

      // Entity mention in question (+100)
      for (const ent of detectedEntities) {
        if (entry.q.toLowerCase().includes(ent.toLowerCase())) {
          score += 100;
        }
      }

      // Keyword overlap (+10 per word)
      const qLower = entry.q.toLowerCase();
      for (const kw of keywords) {
        if (qLower.includes(kw)) {
          score += 10;
        }
      }

      return { entry, score };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    // Pick top candidates
    const topEntries = scored.filter((s) => s.score > 0).slice(0, limit);

    // Extract exact records from disk
    const records: QuestionRecord[] = [];
    for (const item of topEntries) {
      const rec = await extractQuestionRecord(
        item.entry.file,
        item.entry.start,
        item.entry.end
      );
      if (rec) {
        records.push(rec);
      }
    }

    return records;
  }

  async searchCulturalRecords(
    classification: QueryClassification,
    limit: number = 2
  ): Promise<CulturalRecord[]> {
    const culturalIndex = loadCulturalIndex();
    if (culturalIndex.length === 0) {
      return [];
    }

    const { detectedEntities, keywords, originalQuery } = classification;
    const queryLower = originalQuery.toLowerCase();

    const scored = culturalIndex.map((entry) => {
      let score = 0;
      const titleLower = entry.title.toLowerCase();

      // Entity match on title (+150)
      for (const ent of detectedEntities) {
        if (titleLower.includes(ent.toLowerCase())) {
          score += 150;
        }
        // Boost for mapped traditions (e.g. Diwali -> Hinduism) (+120)
        const associated = getAssociatedTraditions(ent);
        for (const assoc of associated) {
          if (titleLower.includes(assoc.toLowerCase()) || entry.category.toLowerCase().includes(assoc.toLowerCase())) {
            score += 120;
          }
        }
      }

      // Exact title in query (+100)
      if (queryLower.includes(titleLower) && titleLower.length > 2) {
        score += 100;
      }

      // Keyword match in entry keywords (+15)
      for (const kw of keywords) {
        if (entry.keywords.includes(kw)) {
          score += 15;
        }
        if (titleLower.includes(kw)) {
          score += 25;
        }
      }

      return { entry, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topEntries = scored.filter((s) => s.score > 0).slice(0, limit);

    // Extract records on demand from disk
    const records: CulturalRecord[] = [];
    for (const item of topEntries) {
      const rec = await extractCulturalRecord(
        item.entry.file,
        item.entry.start,
        item.entry.end
      );
      if (rec) {
        records.push(rec);
      }
    }

    return records;
  }

  async retrieveRecordByLineRange(
    filePath: string,
    lineStart: number,
    lineEnd: number
  ): Promise<string> {
    const lines = await readLineRange(filePath, lineStart, lineEnd);
    return lines.join("\n");
  }

  async getCatalog(): Promise<KnowledgeCatalog> {
    const catalog = loadCatalog();
    if (!catalog) {
      return await this.rebuildIndex("phase1");
    }
    return catalog;
  }

  async rebuildIndex(phase: "phase1" | "full" = "phase1"): Promise<KnowledgeCatalog> {
    return await buildLocalKnowledgeIndex(phase);
  }
}

/**
 * Builds minimal, token-budgeted context package for the AI layer.
 */
export async function assembleTargetedContext(
  query: string,
  store: IKnowledgeStore = new LocalKnowledgeStore()
): Promise<TargetedContext> {
  const classification = store.classifyQuery(query);

  // Parallel retrieval of matching records
  const [matchedQuestions, matchedCulturalRecords] = await Promise.all([
    store.searchQuestions(classification, 2),
    store.searchCulturalRecords(classification, 2),
  ]);

  const accessedFilesSet = new Set<string>();
  matchedQuestions.forEach((q) => accessedFilesSet.add(q.chunkFile));
  matchedCulturalRecords.forEach((c) => accessedFilesSet.add(c.sourceFile));

  // Build high-density, minimal token prompt
  const promptLines: string[] = [
    `### EKA VERIFIED CULTURAL CONTEXT (RETRIEVED ON-DEMAND)`,
    `Domain: ${classification.domain} | Intent: ${classification.intent}`,
  ];

  if (matchedCulturalRecords.length > 0) {
    promptLines.push(`\n[Primary Cultural Dataset Records]`);
    for (const c of matchedCulturalRecords) {
      promptLines.push(`- Entity: ${c.title} (${c.category})`);
      if (c.fields["Practices / Rituals"]) {
        promptLines.push(`  Practices: ${c.fields["Practices / Rituals"]}`);
      }
      if (c.fields["Major Traditions & Rituals"]) {
        promptLines.push(`  Traditions: ${c.fields["Major Traditions & Rituals"]}`);
      }
      if (c.fields["Primary Geography"] || c.fields["Geography"]) {
        promptLines.push(
          `  Geography: ${c.fields["Primary Geography"] || c.fields["Geography"]}`
        );
      }
      if (c.fields["Verification Requirement"] || c.fields["Verification"]) {
        promptLines.push(
          `  Verification: ${c.fields["Verification Requirement"] || c.fields["Verification"]}`
        );
      }
      if (c.fields["Image Search Prompt"]) {
        promptLines.push(`  Visual Key: ${c.fields["Image Search Prompt"]}`);
      }
    }
  }

  if (matchedQuestions.length > 0) {
    promptLines.push(`\n[Question Bank Guidance & Epistemic Rules]`);
    for (const q of matchedQuestions) {
      promptLines.push(`- Reference Q: "${q.question}" [${q.id}]`);
      promptLines.push(`  AI Behavior Rule: ${q.aiBehavior}`);
      promptLines.push(`  Verification Level: ${q.verificationLevel}`);
      promptLines.push(`  Regional Context: ${q.regionalContext}`);
    }
  }

  const formattedContextPrompt = promptLines.join("\n");

  // Approximate tokens (1 token ~= 4 chars)
  const estimatedTokens = Math.ceil(formattedContextPrompt.length / 4);

  return {
    query,
    classification,
    matchedQuestions,
    matchedCulturalRecords,
    formattedContextPrompt,
    estimatedTokens,
    accessedFiles: Array.from(accessedFilesSet),
  };
}
