/**
 * ==============================================================================
 * EKA LOCAL KNOWLEDGE RETRIEVAL LAYER — ADMIN & FOUNDER MANAGEMENT API
 * ==============================================================================
 * Provides capabilities for the EKA Founder Cockpit & Admin Panel:
 * - View knowledge assets
 * - Inspect individual records on-demand
 * - Flag records for community review / verification
 * - Re-index the knowledge library
 * - Monitor retrieval performance and asset statistics
 * ==============================================================================
 */

import * as fs from "node:fs";
import * as path from "node:path";
import {
  type KnowledgeCatalog,
  type QuestionRecord,
  type CulturalRecord,
} from "./types";
import { getKnowledgeBasePath, readLineRange } from "./markdown-reader";
import {
  buildLocalKnowledgeIndex,
  loadCatalog,
  clearIndexCache,
} from "./local-indexer";

export interface FlaggedRecord {
  id: string;
  sourceFile: string;
  lineStart: number;
  lineEnd: number;
  reason: string;
  flaggedAt: string;
  status: "pending_review" | "verified" | "rejected";
}

/**
 * Retrieves the high-level knowledge catalog and asset breakdown.
 */
export async function getKnowledgeAssets(): Promise<KnowledgeCatalog> {
  const catalog = loadCatalog();
  if (!catalog) {
    return await buildLocalKnowledgeIndex("phase1");
  }
  return catalog;
}

/**
 * Inspects a specific record from disk by its line range.
 */
export async function inspectRecord(
  subfolder: "cultural_intelligence" | "question_bank",
  fileName: string,
  startLine: number,
  endLine: number
): Promise<string[]> {
  const basePath = getKnowledgeBasePath();
  const filePath = path.join(basePath, subfolder, fileName);
  return await readLineRange(filePath, startLine, endLine);
}

/**
 * Flags a record for cultural review / verification.
 */
export async function flagRecord(
  sourceFile: string,
  recordId: string,
  startLine: number,
  endLine: number,
  reason: string
): Promise<FlaggedRecord> {
  const basePath = getKnowledgeBasePath();
  const flagsPath = path.join(basePath, "index", "flagged_records.json");

  let flags: FlaggedRecord[] = [];
  if (fs.existsSync(flagsPath)) {
    try {
      flags = JSON.parse(fs.readFileSync(flagsPath, "utf8"));
    } catch {
      flags = [];
    }
  }

  const newFlag: FlaggedRecord = {
    id: recordId,
    sourceFile,
    lineStart: startLine,
    lineEnd: endLine,
    reason,
    flaggedAt: new Date().toISOString(),
    status: "pending_review",
  };

  flags.push(newFlag);
  fs.writeFileSync(flagsPath, JSON.stringify(flags, null, 2), "utf8");
  return newFlag;
}

/**
 * Retrieves all currently flagged records for community / scholar review.
 */
export async function getFlaggedRecords(): Promise<FlaggedRecord[]> {
  const basePath = getKnowledgeBasePath();
  const flagsPath = path.join(basePath, "index", "flagged_records.json");
  if (!fs.existsSync(flagsPath)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(flagsPath, "utf8"));
  } catch {
    return [];
  }
}

/**
 * Triggers a re-index of the knowledge base.
 */
export async function reindexKnowledge(
  mode: "phase1" | "full" = "phase1"
): Promise<KnowledgeCatalog> {
  clearIndexCache();
  return await buildLocalKnowledgeIndex(mode);
}

/**
 * Summarizes knowledge statistics for the Founder dashboard.
 */
export async function getKnowledgeStats() {
  const catalog = await getKnowledgeAssets();
  const flagged = await getFlaggedRecords();

  const totalChunks = catalog.questionChunks.length;
  const totalQuestions = catalog.questionChunks.reduce((acc, c) => acc + c.recordCount, 0);
  const totalCulturalFiles = catalog.culturalFiles.length;
  const totalCulturalRecords = catalog.culturalFiles.reduce((acc, c) => acc + c.recordCount, 0);

  return {
    mode: catalog.mode,
    lastIndexedAt: catalog.lastIndexedAt,
    totalQuestions,
    totalChunks,
    totalCulturalRecords,
    totalCulturalFiles,
    totalFlagged: flagged.length,
    pendingReview: flagged.filter((f) => f.status === "pending_review").length,
  };
}
