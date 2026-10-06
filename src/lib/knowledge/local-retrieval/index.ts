/**
 * ==============================================================================
 * EKA LOCAL KNOWLEDGE RETRIEVAL LAYER — PUBLIC INTERFACE
 * ==============================================================================
 * Main entry point for local-first, token-optimized cultural retrieval.
 * ==============================================================================
 */

export * from "./types";
export * from "./query-classifier";
export * from "./markdown-reader";
export * from "./local-indexer";
export * from "./retrieval-engine";
export * from "./ai-generator";
export * from "./admin-api";
export * from "./server-fn";

import { LocalKnowledgeStore, assembleTargetedContext } from "./retrieval-engine";
import { generateEkaResponse } from "./ai-generator";
import { type EkaKnowledgeResponse } from "./types";

/**
 * Executes the complete 10-step EKA local retrieval pipeline:
 * 1. Understand query
 * 2. Identify domain
 * 3. Identify intent
 * 4. Identify cultural entity / category
 * 5. Search local index
 * 6. Open ONLY relevant Markdown file(s)
 * 7. Retrieve ONLY relevant records
 * 8. Send ONLY that context to AI (minimal tokens)
 * 9. Generate verified response
 * 10. Format for EKA UI (Card / Reel / Story)
 */
export async function askEkaLocalKnowledge(
  query: string,
  store = new LocalKnowledgeStore()
): Promise<EkaKnowledgeResponse> {
  const startTime = Date.now();
  const context = await assembleTargetedContext(query, store);
  return await generateEkaResponse(context, startTime);
}
