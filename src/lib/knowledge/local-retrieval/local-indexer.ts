/**
 * ==============================================================================
 * EKA LOCAL KNOWLEDGE RETRIEVAL LAYER — LOCAL INDEXER
 * ==============================================================================
 * Builds lightweight JSON indexes stored inside `knowledge/index/`.
 * Supports:
 * - Phase 1: 1 cultural file + 1 question-bank chunk (architectural proof)
 * - Full Mode: All 7 cultural files + 20 question-bank chunks (expanded)
 *
 * Index stores ONLY metadata & line pointers, NEVER the full 10,000 question bodies!
 * ==============================================================================
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";
import {
  type QuestionIndexEntry,
  type CulturalIndexEntry,
  type KnowledgeCatalog,
} from "./types";
import { getKnowledgeBasePath } from "./markdown-reader";

// Phase 1 Proof Target Files
export const PHASE_1_TARGETS = {
  culturalFile: "Religions_Traditions.md",
  questionChunk: "Sheet1_chunk_01.md",
};

// All Cultural Intelligence Files
export const ALL_CULTURAL_FILES = [
  "Religions_Traditions.md",
  "Culture_Communities.md",
  "India_Languages.md",
  "Global_Languages.md",
  "Image_Prompt_Library.md",
  "Antigravity_Schema.md",
  "README.md",
];

// All 20 Question Chunks
export const ALL_QUESTION_CHUNKS = Array.from({ length: 20 }, (_, idx) => {
  const num = String(idx + 1).padStart(2, "0");
  return `Sheet1_chunk_${num}.md`;
});

/**
 * Streams a Question Chunk Markdown file to index each question's line boundaries.
 */
async function indexQuestionChunkFile(
  filePath: string,
  fileName: string
): Promise<QuestionIndexEntry[]> {
  const fileStream = fs.createReadStream(filePath, { encoding: "utf8" });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const entries: QuestionIndexEntry[] = [];
  let currentEntry: Partial<QuestionIndexEntry> | null = null;
  let lineNumber = 0;

  for await (const line of rl) {
    lineNumber++;
    const trimmed = line.trim();

    if (trimmed.startsWith("## Question")) {
      // Close previous entry if open
      if (currentEntry && currentEntry.id && currentEntry.start) {
        currentEntry.end = lineNumber - 1;
        entries.push(currentEntry as QuestionIndexEntry);
      }
      currentEntry = {
        file: fileName,
        start: lineNumber,
      };
    } else if (currentEntry) {
      if (trimmed.startsWith("- **EKA_Q_ID:**")) {
        currentEntry.id = trimmed.replace("- **EKA_Q_ID:**", "").trim();
      } else if (trimmed.startsWith("- **Domain:**")) {
        currentEntry.d = trimmed.replace("- **Domain:**", "").trim();
      } else if (trimmed.startsWith("- **Intent:**")) {
        currentEntry.i = trimmed.replace("- **Intent:**", "").trim();
      } else if (trimmed.startsWith("- **Question:**")) {
        currentEntry.q = trimmed.replace("- **Question:**", "").trim();
      }
    }
  }

  // Close final entry
  if (currentEntry && currentEntry.id && currentEntry.start) {
    currentEntry.end = lineNumber;
    entries.push(currentEntry as QuestionIndexEntry);
  }

  return entries;
}

/**
 * Streams a Cultural Intelligence Markdown file to index each record's line boundaries.
 */
async function indexCulturalFile(
  filePath: string,
  fileName: string
): Promise<CulturalIndexEntry[]> {
  const fileStream = fs.createReadStream(filePath, { encoding: "utf8" });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const entries: CulturalIndexEntry[] = [];
  let currentEntry: Partial<CulturalIndexEntry> | null = null;
  let collectedText: string[] = [];
  let lineNumber = 0;

  for await (const line of rl) {
    lineNumber++;
    const trimmed = line.trim();

    if (trimmed.startsWith("### Record")) {
      // Close previous record
      if (currentEntry && currentEntry.id && currentEntry.start) {
        currentEntry.end = lineNumber - 1;
        currentEntry.keywords = extractKeywordsFromText(collectedText.join(" "));
        entries.push(currentEntry as CulturalIndexEntry);
      }
      currentEntry = {
        id: `${fileName}_${trimmed.replace(/[^0-9]/g, "")}`,
        file: fileName,
        start: lineNumber,
        title: "",
        category: "",
      };
      collectedText = [];
    } else if (currentEntry) {
      collectedText.push(trimmed);
      if (
        trimmed.startsWith("- **Tradition:**") ||
        trimmed.startsWith("- **Culture / Community:**") ||
        trimmed.startsWith("- **Language:**") ||
        trimmed.startsWith("- **Asset Type:**") ||
        trimmed.startsWith("- **Field:**") ||
        trimmed.startsWith("- **EKA Cultural Intelligence Master Dataset:**")
      ) {
        const colonIdx = trimmed.indexOf(":**");
        currentEntry.title = trimmed.slice(colonIdx + 3).trim();
      } else if (
        trimmed.startsWith("- **Category:**") ||
        trimmed.startsWith("- **Region / Cluster:**") ||
        trimmed.startsWith("- **Language Family:**") ||
        trimmed.startsWith("- **Use Case:**")
      ) {
        const colonIdx = trimmed.indexOf(":**");
        currentEntry.category = trimmed.slice(colonIdx + 3).trim();
      }
    }
  }

  // Close final entry
  if (currentEntry && currentEntry.id && currentEntry.start) {
    currentEntry.end = lineNumber;
    currentEntry.keywords = extractKeywordsFromText(collectedText.join(" "));
    entries.push(currentEntry as CulturalIndexEntry);
  }

  return entries;
}

function extractKeywordsFromText(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);
  return Array.from(new Set(words)).slice(0, 50);
}

/**
 * Builds and saves local JSON indexes for the knowledge base.
 */
export async function buildLocalKnowledgeIndex(
  mode: "phase1" | "full" = "phase1"
): Promise<KnowledgeCatalog> {
  const basePath = getKnowledgeBasePath();
  const indexDir = path.join(basePath, "index");
  const culturalDir = path.join(basePath, "cultural_intelligence");
  const questionDir = path.join(basePath, "question_bank");

  if (!fs.existsSync(indexDir)) {
    fs.mkdirSync(indexDir, { recursive: true });
  }

  const culturalFilesToIndex =
    mode === "phase1" ? [PHASE_1_TARGETS.culturalFile] : ALL_CULTURAL_FILES;

  const questionChunksToIndex =
    mode === "phase1" ? [PHASE_1_TARGETS.questionChunk] : ALL_QUESTION_CHUNKS;

  const questionEntries: QuestionIndexEntry[] = [];
  const questionChunkMeta: KnowledgeCatalog["questionChunks"] = [];

  for (const chunkFile of questionChunksToIndex) {
    const fullPath = path.join(questionDir, chunkFile);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      const entries = await indexQuestionChunkFile(fullPath, chunkFile);
      questionEntries.push(...entries);
      questionChunkMeta.push({
        fileName: chunkFile,
        recordCount: entries.length,
        byteSize: stats.size,
        indexed: true,
      });
    }
  }

  const culturalEntries: CulturalIndexEntry[] = [];
  const culturalFileMeta: KnowledgeCatalog["culturalFiles"] = [];

  for (const cultFile of culturalFilesToIndex) {
    const fullPath = path.join(culturalDir, cultFile);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      const entries = await indexCulturalFile(fullPath, cultFile);
      culturalEntries.push(...entries);
      culturalFileMeta.push({
        fileName: cultFile,
        recordCount: entries.length,
        byteSize: stats.size,
        indexed: true,
      });
    }
  }

  // Save compact indexes to disk
  const questionIndexPath = path.join(indexDir, "question_index.json");
  const culturalIndexPath = path.join(indexDir, "cultural_index.json");
  const catalogPath = path.join(indexDir, "catalog.json");

  fs.writeFileSync(questionIndexPath, JSON.stringify(questionEntries, null, 2), "utf8");
  fs.writeFileSync(culturalIndexPath, JSON.stringify(culturalEntries, null, 2), "utf8");

  const catalog: KnowledgeCatalog = {
    version: "1.0.0",
    mode: mode === "phase1" ? "phase1_proof" : "production_full",
    lastIndexedAt: new Date().toISOString(),
    culturalFiles: culturalFileMeta,
    questionChunks: questionChunkMeta,
    totalRecordsIndexed: questionEntries.length + culturalEntries.length,
  };

  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), "utf8");

  return catalog;
}

/**
 * Loads index from disk with in-memory caching.
 */
let cachedQuestionIndex: QuestionIndexEntry[] | null = null;
let cachedCulturalIndex: CulturalIndexEntry[] | null = null;
let cachedCatalog: KnowledgeCatalog | null = null;

export function loadQuestionIndex(): QuestionIndexEntry[] {
  if (cachedQuestionIndex) return cachedQuestionIndex;
  const basePath = getKnowledgeBasePath();
  const filePath = path.join(basePath, "index", "question_index.json");
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, "utf8");
  cachedQuestionIndex = JSON.parse(data) as QuestionIndexEntry[];
  return cachedQuestionIndex;
}

export function loadCulturalIndex(): CulturalIndexEntry[] {
  if (cachedCulturalIndex) return cachedCulturalIndex;
  const basePath = getKnowledgeBasePath();
  const filePath = path.join(basePath, "index", "cultural_index.json");
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, "utf8");
  cachedCulturalIndex = JSON.parse(data) as CulturalIndexEntry[];
  return cachedCulturalIndex;
}

export function loadCatalog(): KnowledgeCatalog | null {
  if (cachedCatalog) return cachedCatalog;
  const basePath = getKnowledgeBasePath();
  const filePath = path.join(basePath, "index", "catalog.json");
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const data = fs.readFileSync(filePath, "utf8");
  cachedCatalog = JSON.parse(data) as KnowledgeCatalog;
  return cachedCatalog;
}

export function clearIndexCache(): void {
  cachedQuestionIndex = null;
  cachedCulturalIndex = null;
  cachedCatalog = null;
}
