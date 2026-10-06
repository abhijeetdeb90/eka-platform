/**
 * ==============================================================================
 * EKA LOCAL KNOWLEDGE RETRIEVAL LAYER — TYPE DEFINITIONS
 * ==============================================================================
 * Defines the contracts for local Markdown assets, indexing, query classification,
 * targeted retrieval, minimal AI context packaging, and UI rendering.
 *
 * Progression Roadmap:
 * V1: Local .md -> local targeted retrieval
 * V2: .md -> indexed local search & caching
 * V3: .md -> database / search index
 * V4: Database + vector retrieval + knowledge graph
 * V5: Large-scale EKA Cultural Intelligence Engine
 * ==============================================================================
 */

export type EkaDomain =
  | "Festivals & Observances"
  | "Philosophy & Ethics"
  | "Art & Architecture"
  | "Languages & Scripts"
  | "Rituals & Samskaras"
  | "Food & Culinary Heritage"
  | "Music & Dance"
  | "Community & Guilds"
  | "Sacred Geography"
  | "Clothing & Textiles"
  | "Sacred Texts"
  | "Craft & Metallurgy"
  | "General Culture";

export type EkaIntent =
  | "meaning"
  | "origin"
  | "practice"
  | "regional_variation"
  | "sources"
  | "comparison"
  | "visitor_guidance"
  | "philosophy"
  | "custodians"
  | "general";

/**
 * Question Bank record extracted on-demand from Markdown chunk
 */
export interface QuestionRecord {
  id: string; // e.g. "EKA-Q-00001"
  questionNumber: number;
  domain: string;
  intent: string;
  question: string;
  answerType: string;
  primaryFormat: string;
  formats: {
    text: boolean;
    images: boolean;
    video: boolean;
    reel: boolean;
  };
  sourceCitations: string;
  regionalContext: string;
  verificationLevel: string;
  aiBehavior: string;
  chunkFile: string; // e.g. "Sheet1_chunk_01.md"
  lineStart: number;
  lineEnd: number;
}

/**
 * Cultural Intelligence record extracted on-demand from Markdown dataset
 */
export interface CulturalRecord {
  recordId: string; // e.g. "rec_1"
  recordNumber: number;
  sourceFile: string; // e.g. "Religions_Traditions.md"
  title: string; // Primary name / Tradition / Culture / Language
  category: string; // Category or region
  fields: Record<string, string>;
  lineStart: number;
  lineEnd: number;
}

/**
 * Zero-token query classification output
 */
export interface QueryClassification {
  originalQuery: string;
  domain: EkaDomain;
  intent: EkaIntent;
  detectedEntities: string[];
  keywords: string[];
  confidence: number;
}

/**
 * Compact index entries kept in lightweight JSON index
 */
export interface QuestionIndexEntry {
  id: string;
  q: string; // Question text
  d: string; // Domain
  i: string; // Intent
  file: string; // Chunk file name
  start: number; // Line start
  end: number; // Line end
}

export interface CulturalIndexEntry {
  id: string;
  title: string;
  category: string;
  file: string; // Cultural file name
  start: number;
  end: number;
  keywords: string[];
}

export interface KnowledgeCatalog {
  version: string;
  mode: "phase1_proof" | "production_full";
  lastIndexedAt: string;
  culturalFiles: Array<{
    fileName: string;
    recordCount: number;
    byteSize: number;
    indexed: boolean;
  }>;
  questionChunks: Array<{
    fileName: string;
    recordCount: number;
    byteSize: number;
    indexed: boolean;
  }>;
  totalRecordsIndexed: number;
}

/**
 * Minimal context bundle passed to AI
 */
export interface TargetedContext {
  query: string;
  classification: QueryClassification;
  matchedQuestions: QuestionRecord[];
  matchedCulturalRecords: CulturalRecord[];
  formattedContextPrompt: string;
  estimatedTokens: number;
  accessedFiles: string[];
}

/**
 * Final EKA Response with multi-format presentation payload
 */
export interface EkaKnowledgeResponse {
  query: string;
  classification: QueryClassification;
  retrievalStats: {
    questionsFound: number;
    culturalRecordsFound: number;
    filesAccessed: string[];
    retrievalDurationMs: number;
    contextTokens: number;
  };
  aiAnswer: string;
  uiCard: {
    title: string;
    format: "card" | "reel" | "story";
    summary: string;
    coreUnderstanding: string;
    regionalVariations: string[];
    epistemicNotes: {
      documentedFacts: string[];
      traditionalBeliefs: string[];
      interpretations: string[];
    };
    imageSearchPrompt?: string;
    imageGenerationPrompt?: string;
    suggestedFollowups: string[];
    sources: string[];
    tags: string[];
  };
}

/**
 * Modular interface for knowledge storage & retrieval
 * Allows seamless migration: Local MD -> SQLite/Postgres -> Vector DB / KG
 */
export interface IKnowledgeStore {
  classifyQuery(query: string): QueryClassification;
  searchQuestions(classification: QueryClassification, limit?: number): Promise<QuestionRecord[]>;
  searchCulturalRecords(classification: QueryClassification, limit?: number): Promise<CulturalRecord[]>;
  retrieveRecordByLineRange(filePath: string, lineStart: number, lineEnd: number): Promise<string>;
  getCatalog(): Promise<KnowledgeCatalog>;
  rebuildIndex(phase: "phase1" | "full"): Promise<KnowledgeCatalog>;
}
