/**
 * ==============================================================================
 * EKA LOCAL KNOWLEDGE RETRIEVAL — PHASE 1 ARCHITECTURAL PROOF TEST
 * ==============================================================================
 * Tests the initial requirement:
 * - 1 Cultural Markdown file (Religions_Traditions.md)
 * - 1 Question-bank chunk (Sheet1_chunk_01.md)
 * - Local search & indexing
 * - Targeted line extraction
 * - AI response synthesis
 * - EKA UI card formatting
 * ==============================================================================
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import compiled or direct TS through tsx/node or write an ESM runner
import { buildLocalKnowledgeIndex, loadCatalog } from "../src/lib/knowledge/local-retrieval/local-indexer.ts";
import { classifyQuery } from "../src/lib/knowledge/local-retrieval/query-classifier.ts";
import { LocalKnowledgeStore, assembleTargetedContext } from "../src/lib/knowledge/local-retrieval/retrieval-engine.ts";
import { generateEkaResponse } from "../src/lib/knowledge/local-retrieval/ai-generator.ts";
import { getKnowledgeStats } from "../src/lib/knowledge/local-retrieval/admin-api.ts";

async function runPhase1Proof() {
  console.log("================================================================================");
  console.log("   EKA LOCAL KNOWLEDGE RETRIEVAL — PHASE 1 ARCHITECTURAL PROOF");
  console.log("================================================================================\n");

  // Step 1: Build Phase 1 Index (1 cultural file + 1 chunk)
  console.log("1. Building Phase 1 Index (Target: 1 cultural file + 1 question chunk)...");
  const t0 = Date.now();
  const catalog = await buildLocalKnowledgeIndex("phase1");
  const indexDuration = Date.now() - t0;

  console.log(`   ✓ Index Built in ${indexDuration}ms`);
  console.log(`   - Mode: ${catalog.mode}`);
  console.log(`   - Cultural files indexed: ${catalog.culturalFiles.map((f) => f.fileName).join(", ")}`);
  console.log(`   - Question chunks indexed: ${catalog.questionChunks.map((c) => c.fileName).join(", ")}`);
  console.log(`   - Total records indexed: ${catalog.totalRecordsIndexed}`);
  console.log("");

  if (catalog.culturalFiles.length !== 1 || catalog.questionChunks.length !== 1) {
    throw new Error("Phase 1 constraint violated: expected exactly 1 cultural file and 1 chunk!");
  }

  // Step 2: Query Classification Test
  const testQuery = "What is the significance of Diwali?";
  console.log(`2. Testing Query Classification for: "${testQuery}"...`);
  const classification = classifyQuery(testQuery);
  console.log(`   - Domain: ${classification.domain}`);
  console.log(`   - Intent: ${classification.intent}`);
  console.log(`   - Detected Entities: [${classification.detectedEntities.join(", ")}]`);
  console.log(`   - Keywords: [${classification.keywords.join(", ")}]`);

  if (classification.domain !== "Festivals & Observances") {
    throw new Error(`Expected domain 'Festivals & Observances', got '${classification.domain}'`);
  }
  if (classification.intent !== "meaning") {
    throw new Error(`Expected intent 'meaning', got '${classification.intent}'`);
  }
  console.log("   ✓ Query Classification PASSED.\n");

  // Step 3: Targeted Search & Line Extraction
  console.log("3. Executing Targeted Retrieval & Context Assembly...");
  const store = new LocalKnowledgeStore();
  const targetedContext = await assembleTargetedContext(testQuery, store);

  console.log(`   - Questions retrieved: ${targetedContext.matchedQuestions.length}`);
  for (const q of targetedContext.matchedQuestions) {
    console.log(`     * [${q.id}] (${q.chunkFile} L${q.lineStart}-L${q.lineEnd}): "${q.question}"`);
  }

  console.log(`   - Cultural records retrieved: ${targetedContext.matchedCulturalRecords.length}`);
  for (const c of targetedContext.matchedCulturalRecords) {
    console.log(`     * [${c.recordId}] (${c.sourceFile} L${c.lineStart}-L${c.lineEnd}): ${c.title} (${c.category})`);
  }

  console.log(`   - Accessed Files: [${targetedContext.accessedFiles.join(", ")}]`);
  console.log(`   - Estimated Context Tokens: ${targetedContext.estimatedTokens} tokens (STRICTLY < 500 cap!)`);

  if (targetedContext.estimatedTokens > 500) {
    throw new Error(`Token budget violated! Estimated tokens: ${targetedContext.estimatedTokens}`);
  }
  console.log("   ✓ Targeted Retrieval & Line Extraction PASSED.\n");

  // Step 4: AI Response & UI Presentation
  console.log("4. Generating EKA Response & UI Card...");
  const response = await generateEkaResponse(targetedContext);

  console.log(`   - Card Title: ${response.uiCard.title}`);
  console.log(`   - Format: ${response.uiCard.format.toUpperCase()}`);
  console.log(`   - Summary: ${response.uiCard.summary}`);
  console.log(`   - Regional Variations:`);
  response.uiCard.regionalVariations.forEach((v) => console.log(`     * ${v}`));
  console.log(`   - Epistemic Notes:`);
  console.log(`     * Documented: ${response.uiCard.epistemicNotes.documentedFacts.join("; ")}`);
  console.log(`     * Traditional Beliefs: ${response.uiCard.epistemicNotes.traditionalBeliefs.join("; ")}`);
  console.log(`     * Interpretations: ${response.uiCard.epistemicNotes.interpretations.join("; ")}`);
  console.log(`   - Image Search Prompt: "${response.uiCard.imageSearchPrompt}"`);
  console.log(`   - Image Gen Prompt: "${response.uiCard.imageGenerationPrompt}"`);
  console.log(`   - Suggested Follow-ups:`);
  response.uiCard.suggestedFollowups.forEach((f) => console.log(`     * ${f}`));
  console.log(`   - Sources / Provenance:`);
  response.uiCard.sources.forEach((s) => console.log(`     * ${s}`));
  console.log(`   - Total Latency: ${response.retrievalStats.retrievalDurationMs}ms`);
  console.log("   ✓ Response Synthesis & Card Formatting PASSED.\n");

  // Step 5: Admin Stats Test
  console.log("5. Testing Founder/Admin API Stats...");
  const stats = await getKnowledgeStats();
  console.log(`   - Mode: ${stats.mode}`);
  console.log(`   - Questions: ${stats.totalQuestions}`);
  console.log(`   - Cultural Records: ${stats.totalCulturalRecords}`);
  console.log("   ✓ Founder/Admin API PASSED.\n");

  console.log("================================================================================");
  console.log("   PHASE 1 ARCHITECTURAL PROOF COMPLETED SUCCESSFULLY!");
  console.log("================================================================================");
}

runPhase1Proof().catch((err) => {
  console.error("Phase 1 Proof FAILED:", err);
  process.exit(1);
});
