/**
 * ==============================================================================
 * EKA LOCAL KNOWLEDGE RETRIEVAL — TANSTACK START SERVER FUNCTIONS
 * ==============================================================================
 * Bridges the local markdown retrieval engine with the React UI.
 * Keeps knowledge files completely on the server/local disk.
 * Frontend bundle size impact: 0 bytes of markdown or question bank.
 * ==============================================================================
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { askEkaLocalKnowledge } from "./index";
import { getKnowledgeStats, getKnowledgeAssets, inspectRecord } from "./admin-api";

const QueryInputSchema = z.object({
  query: z.string().min(1).max(1000),
});

const InspectRecordSchema = z.object({
  subfolder: z.enum(["cultural_intelligence", "question_bank"]),
  fileName: z.string(),
  startLine: z.number().int().positive(),
  endLine: z.number().int().positive(),
});

/**
 * Server Function: Queries local cultural knowledge on-demand.
 * AI receives only the minimal retrieved records (< 500 tokens).
 */
export const askEkaKnowledgeServerFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => QueryInputSchema.parse(d))
  .handler(async ({ data }) => {
    return await askEkaLocalKnowledge(data.query);
  });

/**
 * Server Function: Retrieves knowledge library telemetry for Admin Dashboard.
 */
export const getKnowledgeCatalogServerFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const stats = await getKnowledgeStats();
    const assets = await getKnowledgeAssets();
    return { stats, assets };
  });

/**
 * Server Function: Inspects a specific record on-demand without loading entire file.
 */
export const inspectRecordServerFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => InspectRecordSchema.parse(d))
  .handler(async ({ data }) => {
    return await inspectRecord(data.subfolder, data.fileName, data.startLine, data.endLine);
  });
