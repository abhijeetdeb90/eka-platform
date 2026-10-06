/**
 * EKA GOOGLE DRIVE 5 TB DATA LAKE & VAULT INITIALIZATION SCRIPT
 * ==============================================================================
 * Target Root Folder ID: 1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL
 * Target Root URL: https://drive.google.com/drive/folders/1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL
 *
 * Capabilities:
 * 1. Stages local directory mirror under .backup-vault/drive-staging/EKA_DATA/
 * 2. If GOOGLE_DRIVE_BACKUP_ACCESS_TOKEN is provided, idempotently creates the 
 *    folders on Google Drive via Google Drive v3 REST API.
 * 3. Exports drive_vault_manifest.json with mapping of namespaces and folder IDs.
 * ==============================================================================
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const GOOGLE_DRIVE_ROOT_FOLDER_ID = "1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL";
const VAULT_DIR = path.join(ROOT_DIR, ".backup-vault");
const STAGING_DIR = path.join(VAULT_DIR, "drive-staging", "EKA_DATA");

const VAULT_STRUCTURE = [
  {
    name: "01_USERS",
    description: "User profiles, preferences, and GDPR/DPDP export archives (Zero credentials)",
    subfolders: ["profiles", "preferences", "exports"],
  },
  {
    name: "02_CONTENT",
    description: "User-generated content, media attachments, and community discourse assets",
    subfolders: ["posts", "images", "videos", "documents"],
  },
  {
    name: "03_CULTURAL_KNOWLEDGE",
    description: "Canonical cultural knowledge vault, manuscripts, sacred geography media",
    subfolders: ["India", "Asia", "Middle_East", "Africa", "Europe", "Americas"],
  },
  {
    name: "04_CREATOR_CONTENT",
    description: "Creator masterclasses, practitioner workshop recordings, portfolio audio/video",
    subfolders: ["workshops", "audio_series", "masterclasses"],
  },
  {
    name: "05_AI_CORPUS",
    description: "Proprietary cultural datasets, transcripts, Q&A pairs, embeddings exports",
    subfolders: ["questions", "answers", "sources", "transcripts", "embeddings_exports"],
  },
  {
    name: "06_ANALYTICS",
    description: "Aggregated event telemetry, monthly cohort snapshots, business metrics",
    subfolders: ["cohorts", "telemetry_dumps", "reports"],
  },
  {
    name: "07_VERIFICATION",
    description: "Epistemic verification evidence, lineage proofs, source passport records",
    subfolders: ["lineages", "citations", "academic_reviews"],
  },
  {
    name: "08_ADMIN",
    description: "Executive reports, partner agreements, legal charters, investor materials",
    subfolders: ["investor_reports", "legal", "agreements"],
  },
  {
    name: "09_BACKUPS",
    description: "Automated Supabase schema manifests, migration logs, DR dumps",
    subfolders: ["schema_manifests", "dr_archives", "system_state"],
  },
  {
    name: "10_EXPORTS",
    description: "Public anonymized research releases, open cultural knowledge datasets",
    subfolders: ["public_research", "open_heritage"],
  },
];

async function createDriveFolderIfToken(folderName, parentFolderId, token) {
  if (!token) return null;

  try {
    // 1. Search if folder already exists in parent
    const query = encodeURIComponent(
      `name = '${folderName}' and '${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
    );
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data.files && data.files.length > 0) {
        console.log(`  ✓ Existing Drive folder found: ${folderName} (${data.files[0].id})`);
        return data.files[0].id;
      }
    }

    // 2. Create folder if not found
    const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [parentFolderId],
      }),
    });

    if (createRes.ok) {
      const created = await createRes.json();
      console.log(`  ✓ Created Drive folder: ${folderName} (${created.id})`);
      return created.id;
    } else {
      const err = await createRes.text();
      console.warn(`  ! Could not create Drive folder ${folderName}: ${err}`);
      return null;
    }
  } catch (err) {
    console.warn(`  ! Drive API error for ${folderName}:`, err.message);
    return null;
  }
}

export async function initDriveVault() {
  console.log("==================================================================");
  console.log("EKA GOOGLE DRIVE 5 TB DATA LAKE & VAULT INITIALIZER");
  console.log(`Target Root Drive ID: ${GOOGLE_DRIVE_ROOT_FOLDER_ID}`);
  console.log(`Target Root Drive URL: https://drive.google.com/drive/folders/${GOOGLE_DRIVE_ROOT_FOLDER_ID}`);
  console.log("==================================================================");

  const driveAccessToken = process.env.GOOGLE_DRIVE_BACKUP_ACCESS_TOKEN || process.env.GOOGLE_DRIVE_ACCESS_TOKEN;
  const isApiEnabled = Boolean(driveAccessToken);

  console.log(`Status: ${isApiEnabled ? "LIVE DRIVE API CONNECTED" : "OFFLINE / LOCAL STAGING MODE"}`);

  // Ensure staging directory
  if (!fs.existsSync(STAGING_DIR)) {
    fs.mkdirSync(STAGING_DIR, { recursive: true });
  }

  const manifest = {
    platform: "EKA Cultural Intelligence Platform",
    vaultRootFolderId: GOOGLE_DRIVE_ROOT_FOLDER_ID,
    vaultRootUrl: `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_ROOT_FOLDER_ID}`,
    initializedAt: new Date().toISOString(),
    apiConnected: isApiEnabled,
    namespaces: [],
  };

  for (const root of VAULT_STRUCTURE) {
    console.log(`\n→ Processing [${root.name}]...`);
    const localRootPath = path.join(STAGING_DIR, root.name);
    if (!fs.existsSync(localRootPath)) {
      fs.mkdirSync(localRootPath, { recursive: true });
    }

    // Create .keep or README in local staging
    fs.writeFileSync(
      path.join(localRootPath, "README.md"),
      `# ${root.name}\n\n${root.description}\n\nTarget Root Folder ID: ${GOOGLE_DRIVE_ROOT_FOLDER_ID}\n`,
      "utf8"
    );

    let driveFolderId = null;
    if (isApiEnabled) {
      driveFolderId = await createDriveFolderIfToken(root.name, GOOGLE_DRIVE_ROOT_FOLDER_ID, driveAccessToken);
    }

    const namespaceEntry = {
      id: root.name,
      description: root.description,
      driveFolderId: driveFolderId || GOOGLE_DRIVE_ROOT_FOLDER_ID,
      subfolders: [],
    };

    for (const sub of root.subfolders) {
      const localSubPath = path.join(localRootPath, sub);
      if (!fs.existsSync(localSubPath)) {
        fs.mkdirSync(localSubPath, { recursive: true });
      }
      fs.writeFileSync(
        path.join(localSubPath, ".keep"),
        `# EKA Data Vault Partition\nSubfolder: ${sub}\nCreated: ${new Date().toISOString()}\n`,
        "utf8"
      );

      let subDriveId = null;
      if (isApiEnabled && driveFolderId) {
        subDriveId = await createDriveFolderIfToken(sub, driveFolderId, driveAccessToken);
      }

      namespaceEntry.subfolders.push({
        name: sub,
        driveFolderId: subDriveId || null,
        localPath: path.relative(ROOT_DIR, localSubPath).replace(/\\/g, "/"),
      });
    }

    manifest.namespaces.push(namespaceEntry);
    console.log(`  ✓ Staged ${root.name} with ${root.subfolders.length} subpartitions.`);
  }

  // Save the manifest file
  const manifestPath = path.join(VAULT_DIR, "drive_vault_manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  console.log("\n==================================================================");
  console.log(`✓ Drive Vault Manifest generated: ${manifestPath}`);
  console.log(`✓ Local vault staged in: ${STAGING_DIR}`);
  console.log("==================================================================");

  return manifest;
}

// Direct execution
if (process.argv[1] && process.argv[1].endsWith("init-drive-vault.mjs")) {
  initDriveVault().catch(console.error);
}
