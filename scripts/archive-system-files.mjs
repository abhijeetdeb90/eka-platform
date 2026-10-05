/**
 * EKA FULL-SYSTEM ARCHIVE & MANIFEST GENERATOR
 * ==============================================================================
 * Inspects all local project files, sub-systems, migrations, configurations,
 * and builds high-fidelity audit manifests (JSON + Markdown) for offsite backup
 * to the Google Drive Cloud Vault:
 * Folder ID: 1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL
 * ==============================================================================
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const GOOGLE_DRIVE_FOLDER_ID = "1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL";
const GOOGLE_DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_FOLDER_ID}`;

// Ignore patterns to maintain zero secret leakage and clean archives
const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  ".vercel",
  ".tanstack",
  ".temp",
  "dist",
  ".output",
  "build",
  "test-results",
  ".system_generated",
]);

const SENSITIVE_FILE_PATTERNS = [
  /^\.env$/,
  /^\.env\.local$/,
  /^\.env\.production$/,
  /^\.env\.preview$/,
  /\.pem$/,
  /\.key$/,
  /id_rsa/,
];

function isSensitive(filePath) {
  const base = path.basename(filePath);
  return SENSITIVE_FILE_PATTERNS.some((p) => p.test(base));
}

function calculateFileHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(fileBuffer).digest("hex");
  } catch {
    return null;
  }
}

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return content.split("\n").length;
  } catch {
    return 0;
  }
}

function categorizeFile(relPath) {
  const norm = relPath.replace(/\\/g, "/");
  if (norm.startsWith("supabase/migrations/")) return "Database Migration";
  if (norm.startsWith("src/routes/")) return "Application Route / Page";
  if (norm.startsWith("src/components/brand/")) return "Brand & Identity Asset";
  if (norm.startsWith("src/components/")) return "UI Component";
  if (norm.startsWith("src/lib/auth/") || norm.startsWith("src/hooks/useRole") || norm.startsWith("src/hooks/useAuth")) return "Authentication & RBAC";
  if (norm.startsWith("src/lib/security/") || norm.startsWith("src/routes/api/security")) return "Enterprise Security & Threat Monitoring";
  if (norm.startsWith("src/lib/payments/")) return "Ledger & Financial Settlement";
  if (norm.startsWith("src/apps/founder-admin/")) return "Founder Cockpit & Platform Ops";
  if (norm.startsWith("src/apps/")) return "Internal Workspace Container";
  if (norm.startsWith("src/integrations/supabase/")) return "Supabase SDK & Types";
  if (norm.startsWith("src/services/") || norm.startsWith("src/lib/")) return "Core Business Logic / Service";
  if (norm.startsWith("src/hooks/")) return "React State Hook";
  if (norm.startsWith("docs/") || norm.endsWith(".md")) return "Architecture Documentation";
  if (norm.endsWith(".json") || norm.endsWith(".config.ts") || norm.endsWith(".toml")) return "Configuration & Tooling";
  return "System Support File";
}

function scanDirectory(dir, relPrefix = "") {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(relPrefix, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(scanDirectory(fullPath, relPath));
    } else if (entry.isFile()) {
      if (isSensitive(relPath)) {
        console.log(`[Security Shield] Bypassed secret file: ${relPath}`);
        continue;
      }

      const stat = fs.statSync(fullPath);
      const category = categorizeFile(relPath);
      const sha256 = calculateFileHash(fullPath);
      const lines = countLines(fullPath);

      results.push({
        path: relPath.replace(/\\/g, "/"),
        sizeBytes: stat.size,
        lines,
        category,
        sha256,
        lastModified: stat.mtime.toISOString(),
      });
    }
  }

  return results;
}

export function generateSystemManifest() {
  console.log("==================================================================");
  console.log("EKA SYSTEM ARCHIVE & VAULT MANIFEST GENERATION");
  console.log(`Root Directory: ${ROOT_DIR}`);
  console.log(`Google Drive Target Vault: ${GOOGLE_DRIVE_FOLDER_URL}`);
  console.log("==================================================================");

  const scannedFiles = scanDirectory(ROOT_DIR);

  // Group stats
  const totalFiles = scannedFiles.length;
  const totalSizeBytes = scannedFiles.reduce((acc, f) => acc + f.sizeBytes, 0);
  const totalLines = scannedFiles.reduce((acc, f) => acc + f.lines, 0);

  const categoryBreakdown = {};
  for (const f of scannedFiles) {
    categoryBreakdown[f.category] = (categoryBreakdown[f.category] || 0) + 1;
  }

  const timestamp = new Date().toISOString();

  const manifestData = {
    platform: "EKA — The Living Cultural Intelligence Layer",
    version: "2.4.0-production",
    generatedAt: timestamp,
    vault: {
      target: "Google Drive Cloud Vault",
      folderId: GOOGLE_DRIVE_FOLDER_ID,
      folderUrl: GOOGLE_DRIVE_FOLDER_URL,
      storageRole: "Disaster Recovery, Archival & Business Continuity Vault (Non-Live Data)",
      liveDatabase: "Supabase (PostgreSQL 15 + RLS + GoTrue Auth) [Project: kbiutqzhcbyuseygcspe]",
    },
    statistics: {
      totalFiles,
      totalLines,
      totalSizeBytes,
      totalSizeMB: (totalSizeBytes / (1024 * 1024)).toFixed(2),
      categories: categoryBreakdown,
    },
    subsystems: {
      coreEka: [
        "People & Identities (Biographical Passports)",
        "Living Stories (Multimodal Narrative Graph)",
        "Traditions & Customs (Temporal Ritual Context)",
        "Communities & Circles (Cultural Affinity Hubs)",
        "Places & Geographies (Sacred & Indigenous Cartography)",
        "Languages & Dialects (Phonetic & Oral Preservations)",
        "Rituals & Observances (Cyclical Calendar)",
        "Knowledge & Epistemic Taxonomies (5-Tier Provenance)",
        "Audio / Oral Heritage (Acoustic Preservations)",
        "Visual & Material Culture (Artisan Artifacts)",
        "Ledger & Settlement (Dual-Entry Creator Ledger)",
        "Governance & Security (Super-Admin Cockpit & Threat Telemetry)",
      ],
    },
    files: scannedFiles,
  };

  // Write EKA_SYSTEM_MANIFEST.json
  const jsonPath = path.join(ROOT_DIR, "EKA_SYSTEM_MANIFEST.json");
  fs.writeFileSync(jsonPath, JSON.stringify(manifestData, null, 2), "utf8");
  console.log(`✓ Generated: ${jsonPath} (${totalFiles} tracked files)`);

  // Write EKA_SYSTEM_MANIFEST.md
  let markdown = `# EKA PLATFORM — FULL SYSTEM ARCHIVE MANIFEST\n\n`;
  markdown += `**Canonical Platform:** EKA — The Living Cultural Intelligence Layer  \n`;
  markdown += `**Manifest Generated:** \`${timestamp}\`  \n`;
  markdown += `**Version:** \`2.4.0-production\`  \n`;
  markdown += `**Live Production URL:** [eka-platform.vercel.app](https://eka-platform.vercel.app)  \n`;
  markdown += `**Google Drive Offsite Backup Vault:** [Google Drive Target Folder](${GOOGLE_DRIVE_FOLDER_URL}) (Folder ID: \`${GOOGLE_DRIVE_FOLDER_ID}\`)  \n\n`;

  markdown += `## 1. Executive Summary & Vault Architecture\n\n`;
  markdown += `EKA operates on a dual-tier storage and resilience architecture:\n`;
  markdown += `- **Live Tier (Transactional Source of Truth):** Supabase (PostgreSQL 15, GoTrue Auth, Row-Level Security, Storage Buckets). Project ID: \`kbiutqzhcbyuseygcspe\`.\n`;
  markdown += `- **Vault Tier (Disaster Recovery & Enterprise Archive):** Google Drive Secure Enterprise Vault (\`${GOOGLE_DRIVE_FOLDER_ID}\`). Stores snapshot dumps, schema migration catalogs, offline system manifests, and business continuity artifacts.\n\n`;

  markdown += `## 2. Platform Telemetry & Codebase Metrics\n\n`;
  markdown += `| Metric | Count |\n`;
  markdown += `| :--- | :--- |\n`;
  markdown += `| **Total Monitored Files** | ${totalFiles} |\n`;
  markdown += `| **Total Source Lines** | ${totalLines.toLocaleString()} |\n`;
  markdown += `| **Total Project Size** | ${(totalSizeBytes / (1024 * 1024)).toFixed(2)} MB |\n`;
  markdown += `| **Database Migrations** | ${categoryBreakdown["Database Migration"] || 0} files |\n`;
  markdown += `| **UI Components & Views** | ${(categoryBreakdown["UI Component"] || 0) + (categoryBreakdown["Application Route / Page"] || 0)} modules |\n`;
  markdown += `| **Security & RBAC Modules** | ${(categoryBreakdown["Authentication & RBAC"] || 0) + (categoryBreakdown["Enterprise Security & Threat Monitoring"] || 0)} modules |\n\n`;

  markdown += `### Component Distribution\n\n`;
  for (const [cat, count] of Object.entries(categoryBreakdown)) {
    markdown += `- **${cat}:** ${count} files\n`;
  }

  markdown += `\n## 3. Subsystem Topologies Tracked\n\n`;
  manifestData.subsystems.coreEka.forEach((sub, i) => {
    markdown += `${i + 1}. **${sub}**\n`;
  });

  markdown += `\n## 4. Disaster Recovery & Restoration Protocol\n\n`;
  markdown += `1. **Codebase Restoration:** Clone or unpack repository files verified against the SHA-256 hashes registered in \`EKA_SYSTEM_MANIFEST.json\`.\n`;
  markdown += `2. **Dependency Resolution:** Run \`npm ci\` or \`npm install\` under Node.js >= 22.\n`;
  markdown += `3. **Database Schema Application:** Execute \`supabase/migrations/*.sql\` in lexicographical sequence against the Supabase project.\n`;
  markdown += `4. **Environment Configuration:** Populate \`.env\` from \`.env.example\` with production secrets in Vercel and Supabase.\n`;
  markdown += `5. **Google Drive Sync:** Execute \`npm run backup:drive\` or \`node scripts/backup-to-drive.mjs\` to verify sync integrity.\n\n`;

  markdown += `*Vault Target: \`${GOOGLE_DRIVE_FOLDER_URL}\`*\n`;

  const mdPath = path.join(ROOT_DIR, "EKA_SYSTEM_MANIFEST.md");
  fs.writeFileSync(mdPath, markdown, "utf8");
  console.log(`✓ Generated: ${mdPath}`);

  return manifestData;
}

// Direct execution
if (process.argv[1] && process.argv[1].endsWith("archive-system-files.mjs")) {
  generateSystemManifest();
}
