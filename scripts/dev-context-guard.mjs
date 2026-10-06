#!/usr/bin/env node
// ==============================================================================
// EKA DEVELOPMENT CONTEXT GUARD (Section 33.2, 33.15)
// ==============================================================================
// Protects development operations against context window explosion.
// Strictly enforces exclusions and produces compact TASK HANDOFF structures.
// ==============================================================================

import fs from "node:fs";
import path from "node:path";

// Section 33.2 Strict Exclusions
export const BANNED_PATTERNS = [
  /node_modules/i,
  /\.git/i,
  /\.next/i,
  /dist/i,
  /build/i,
  /coverage/i,
  /\.cache/i,
  /tmp/i,
  /logs/i,
  /generated/i,
  /uploads/i,
  /videos/i,
  /\.(png|jpe?g|gif|webp|avif|svg|ico|mp4|webm|mov|apk|ipa|zip|tar|gz)$/i,
  /\.env(\..+)?$/i,
  /credentials/i,
  /private[_-]?keys?/i,
  /\.vercel/i,
  /\.backup-vault/i,
];

// Section 33.1 Budgets
export const DEV_BUDGETS = {
  NORMAL_DEV_TASK: 100_000,
  LARGE_ENGINEERING_TASK: 200_000,
  HARD_PROVIDER_CEILING: 1_048_576,
};

/**
 * Checks if a path should be excluded.
 */
export function isExcluded(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  return BANNED_PATTERNS.some((pattern) => pattern.test(normalized));
}

/**
 * Fast token estimation (~3.8 chars per token).
 */
export function estimateTokens(content) {
  if (!content) return 0;
  return Math.ceil(content.length / 3.8);
}

/**
 * Scans a directory recursively respecting Section 33.2 exclusions.
 */
export function scanDirectory(dirPath, maxFiles = 500) {
  let fileList = [];
  let totalChars = 0;
  let totalTokens = 0;

  function traverse(current) {
    if (fileList.length >= maxFiles) return;
    if (isExcluded(current)) return;

    try {
      const stats = fs.statSync(current);
      if (stats.isDirectory()) {
        const entries = fs.readdirSync(current);
        for (const entry of entries) {
          traverse(path.join(current, entry));
        }
      } else if (stats.isFile()) {
        const ext = path.extname(current).toLowerCase();
        if (
          [".ts", ".tsx", ".js", ".jsx", ".json", ".sql", ".md", ".css"].includes(
            ext
          )
        ) {
          const content = fs.readFileSync(current, "utf-8");
          const tokens = estimateTokens(content);
          fileList.push({
            path: current,
            bytes: stats.size,
            tokens,
          });
          totalChars += content.length;
          totalTokens += tokens;
        }
      }
    } catch {
      // ignore unreadable
    }
  }

  traverse(dirPath);
  return { fileList, totalChars, totalTokens };
}

/**
 * Generates compact TASK HANDOFF template (Section 33.15).
 */
export function generateTaskHandoff({
  objective = "Engineering Task",
  currentState = "In progress",
  filesChanged = [],
  filesRequiringAttention = [],
  errors = "None",
  tests = "Passing",
  nextAction = "Verify implementation",
}) {
  return `## TASK HANDOFF
Objective: ${objective}
Current state: ${currentState}
Files changed:
${filesChanged.map((f) => `- ${f}`).join("\n") || "- None"}
Files requiring attention:
${filesRequiringAttention.map((f) => `- ${f}`).join("\n") || "- None"}
Errors: ${errors}
Tests: ${tests}
Next action: ${nextAction}`;
}

// CLI Execution
if (process.argv[1] && process.argv[1].endsWith("dev-context-guard.mjs")) {
  const targetDir = process.argv[2] || "src";
  console.log(`[EKA Context Guard] Scanning "${targetDir}" for token budget compliance...`);

  const { fileList, totalTokens } = scanDirectory(targetDir);
  console.log(`Scanned ${fileList.length} relevant files (Excluded node_modules, .git, binaries).`);
  console.log(`Total Estimated Tokens: ${totalTokens.toLocaleString()}`);

  if (totalTokens > DEV_BUDGETS.NORMAL_DEV_TASK) {
    console.warn(
      `\n⚠️  WARNING: Context size (${totalTokens.toLocaleString()}) exceeds normal dev target (${DEV_BUDGETS.NORMAL_DEV_TASK.toLocaleString()}).`
    );
    console.log("\nRecommended Section 33.15 Task Handoff Format:");
    console.log(
      generateTaskHandoff({
        objective: "Modularize large repository inspection",
        currentState: "Exceeded 100k dev threshold",
        filesChanged: fileList.slice(0, 5).map((f) => f.path),
        filesRequiringAttention: ["Inspect targeted modules selectively"],
        errors: "Prevented context overflow",
        tests: "Smoke testing recommended",
        nextAction: "Execute task in modular phases",
      })
    );
  } else {
    console.log(`✅ Within safe dev task budget (<= ${DEV_BUDGETS.NORMAL_DEV_TASK.toLocaleString()} tokens).`);
  }
}
