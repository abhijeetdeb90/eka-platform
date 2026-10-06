/**
 * ==============================================================================
 * EKA LOCAL KNOWLEDGE RETRIEVAL LAYER — TARGETED MARKDOWN READER
 * ==============================================================================
 * Stream-based targeted line extraction.
 * NEVER loads large files or 10,000 questions into memory.
 * Reads ONLY the exact line range for retrieved records from disk.
 * ==============================================================================
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";
import { type QuestionRecord, type CulturalRecord } from "./types";

/**
 * Resolves the root knowledge directory across development and production environments.
 */
export function getKnowledgeBasePath(): string {
  if (process.env["EKA_KNOWLEDGE_DIR"] && fs.existsSync(process.env["EKA_KNOWLEDGE_DIR"])) {
    return process.env["EKA_KNOWLEDGE_DIR"];
  }

  const candidatePaths = [
    path.resolve(process.cwd(), "knowledge"),
    path.resolve(process.cwd(), "EKA_LOCAL_KNOWLEDGE_MD"),
    path.resolve(process.cwd(), "..", "EKA_LOCAL_KNOWLEDGE_MD"),
    path.resolve(process.cwd(), "..", "knowledge"),
    "C:\\Users\\abhij\\OneDrive\\Documents\\EKA\\EKA\\knowledge",
    "C:\\Users\\abhij\\OneDrive\\Documents\\EKA\\EKA_LOCAL_KNOWLEDGE_MD",
  ];

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // Default fallback
  return path.resolve(process.cwd(), "knowledge");
}

/**
 * Reads only the specific line range from a file without loading the whole file into RAM.
 */
export async function readLineRange(filePath: string, startLine: number, endLine: number): Promise<string[]> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const fileStream = fs.createReadStream(filePath, { encoding: "utf8" });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const collectedLines: string[] = [];
  let currentLine = 0;

  for await (const line of rl) {
    currentLine++;
    if (currentLine >= startLine && currentLine <= endLine) {
      collectedLines.push(line);
    }
    if (currentLine > endLine) {
      rl.close();
      fileStream.destroy();
      break;
    }
  }

  return collectedLines;
}

/**
 * Parses raw lines of a Question Record block into a structured QuestionRecord.
 */
export function parseQuestionRecordLines(
  lines: string[],
  chunkFile: string,
  startLine: number,
  endLine: number
): QuestionRecord | null {
  const record: Partial<QuestionRecord> = {
    chunkFile,
    lineStart: startLine,
    lineEnd: endLine,
    formats: { text: false, images: false, video: false, reel: false },
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("## Question")) {
      const match = trimmed.match(/## Question\s+(\d+)/i);
      if (match?.[1]) {
        record.questionNumber = parseInt(match[1], 10);
      }
    } else if (trimmed.startsWith("- **EKA_Q_ID:**")) {
      record.id = trimmed.replace("- **EKA_Q_ID:**", "").trim();
    } else if (trimmed.startsWith("- **Domain:**")) {
      record.domain = trimmed.replace("- **Domain:**", "").trim();
    } else if (trimmed.startsWith("- **Intent:**")) {
      record.intent = trimmed.replace("- **Intent:**", "").trim();
    } else if (trimmed.startsWith("- **Question:**")) {
      record.question = trimmed.replace("- **Question:**", "").trim();
    } else if (trimmed.startsWith("- **Answer_Type:**")) {
      record.answerType = trimmed.replace("- **Answer_Type:**", "").trim();
    } else if (trimmed.startsWith("- **Primary_Format:**")) {
      record.primaryFormat = trimmed.replace("- **Primary_Format:**", "").trim();
    } else if (trimmed.startsWith("- **Text:**")) {
      record.formats!.text = trimmed.toUpperCase().includes("YES");
    } else if (trimmed.startsWith("- **Images:**")) {
      record.formats!.images = trimmed.toUpperCase().includes("YES");
    } else if (trimmed.startsWith("- **Video:**")) {
      record.formats!.video = trimmed.toUpperCase().includes("YES");
    } else if (trimmed.startsWith("- **Reel:**")) {
      record.formats!.reel = trimmed.toUpperCase().includes("YES");
    } else if (trimmed.startsWith("- **Source_Citations:**")) {
      record.sourceCitations = trimmed.replace("- **Source_Citations:**", "").trim();
    } else if (trimmed.startsWith("- **Regional_Context:**")) {
      record.regionalContext = trimmed.replace("- **Regional_Context:**", "").trim();
    } else if (trimmed.startsWith("- **Verification_Level:**")) {
      record.verificationLevel = trimmed.replace("- **Verification_Level:**", "").trim();
    } else if (trimmed.startsWith("- **AI_Behavior:**")) {
      record.aiBehavior = trimmed.replace("- **AI_Behavior:**", "").trim();
    }
  }

  if (!record.id || !record.question) {
    return null;
  }

  return record as QuestionRecord;
}

/**
 * Parses raw lines of a Cultural Record block into a structured CulturalRecord.
 */
export function parseCulturalRecordLines(
  lines: string[],
  sourceFile: string,
  startLine: number,
  endLine: number
): CulturalRecord | null {
  const fields: Record<string, string> = {};
  let recordNumber = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("### Record")) {
      const match = trimmed.match(/### Record\s+(\d+)/i);
      if (match?.[1]) {
        recordNumber = parseInt(match[1], 10);
      }
    } else if (trimmed.startsWith("- **")) {
      const colonIdx = trimmed.indexOf(":**");
      if (colonIdx > 4) {
        const key = trimmed.slice(4, colonIdx).trim();
        const value = trimmed.slice(colonIdx + 3).trim();
        fields[key] = value;
      }
    }
  }

  if (recordNumber === 0 && Object.keys(fields).length === 0) {
    return null;
  }

  // Derive primary title and category
  const title =
    fields["Tradition"] ||
    fields["Culture / Community"] ||
    fields["Language"] ||
    fields["Asset Type"] ||
    fields["Field"] ||
    fields["EKA Cultural Intelligence Master Dataset"] ||
    `Record ${recordNumber}`;

  const category =
    fields["Category"] ||
    fields["Region / Cluster"] ||
    fields["Language Family"] ||
    fields["Use Case"] ||
    "Cultural Asset";

  return {
    recordId: `rec_${recordNumber}`,
    recordNumber,
    sourceFile,
    title,
    category,
    fields,
    lineStart: startLine,
    lineEnd: endLine,
  };
}

/**
 * Extracts a single question record directly from disk by its line boundaries.
 */
export async function extractQuestionRecord(
  chunkFileName: string,
  startLine: number,
  endLine: number
): Promise<QuestionRecord | null> {
  const basePath = getKnowledgeBasePath();
  const filePath = path.join(basePath, "question_bank", chunkFileName);
  const lines = await readLineRange(filePath, startLine, endLine);
  return parseQuestionRecordLines(lines, chunkFileName, startLine, endLine);
}

/**
 * Extracts a single cultural record directly from disk by its line boundaries.
 */
export async function extractCulturalRecord(
  fileName: string,
  startLine: number,
  endLine: number
): Promise<CulturalRecord | null> {
  const basePath = getKnowledgeBasePath();
  const filePath = path.join(basePath, "cultural_intelligence", fileName);
  const lines = await readLineRange(filePath, startLine, endLine);
  return parseCulturalRecordLines(lines, fileName, startLine, endLine);
}
