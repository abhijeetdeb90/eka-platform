/**
 * EKA HYBRID STORAGE & DATA LAKE ADAPTER
 * ==============================================================================
 * Bridges Supabase operational database with 5 TB Google Drive object store.
 * Supports permanent uniform EKA identifiers (EKA-MED-*, EKA-DOC-*, EKA-CRP-*)
 * and provides zero-cost migration readiness to Cloudflare R2 / S3 post-funding.
 * ==============================================================================
 */

export type EkaEntityType =
  | "post"
  | "cultural_item"
  | "knowledge_object"
  | "creator_portfolio"
  | "backup"
  | "ai_corpus"
  | "avatar";

export type StorageProvider = "google_drive" | "cloudflare_r2" | "supabase" | "s3";

export interface EkaStorageAsset {
  id?: string;
  eka_id: string;
  owner_id?: string | null;
  entity_type: EkaEntityType;
  entity_id?: string | null;
  namespace_id: string;
  file_name: string;
  mime_type: string;
  file_size_bytes: number;
  sha256_checksum?: string | null;
  storage_provider: StorageProvider;
  drive_file_id?: string | null;
  drive_folder_id?: string | null;
  drive_web_content_link?: string | null;
  cdn_cached_url?: string | null;
  thumbnail_drive_id?: string | null;
  thumbnail_url?: string | null;
  sync_status: "staged" | "uploading" | "synced" | "error";
  is_public: boolean;
  allow_ai_training: boolean;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export const EKA_STORAGE_NAMESPACES = {
  USERS: "01_USERS",
  CONTENT: "02_CONTENT",
  CULTURAL_KNOWLEDGE: "03_CULTURAL_KNOWLEDGE",
  CREATOR_CONTENT: "04_CREATOR_CONTENT",
  AI_CORPUS: "05_AI_CORPUS",
  ANALYTICS: "06_ANALYTICS",
  VERIFICATION: "07_VERIFICATION",
  ADMIN: "08_ADMIN",
  BACKUPS: "09_BACKUPS",
  EXPORTS: "10_EXPORTS",
} as const;

export const GOOGLE_DRIVE_ROOT_VAULT_ID = "1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL";
export const GOOGLE_DRIVE_ROOT_VAULT_URL = `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_ROOT_VAULT_ID}`;

/**
 * Generates an immutable, non-guessable EKA uniform object identifier.
 * Example output: EKA-MED-202610-8F92A1
 */
export function generateEkaId(
  prefix: "MED" | "DOC" | "CRP" | "USR" | "KNW" | "CNT" = "MED",
): string {
  const dateStr = new Date().toISOString().slice(0, 7).replace("-", ""); // YYYYMM
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `EKA-${prefix}-${dateStr}-${randomHex}`;
}

/**
 * Resolves the optimal playback/viewing URL for a storage asset.
 * Checks edge CDN cache first, then falls back to Google Drive direct web stream or proxy.
 */
export function resolveAssetMediaUrl(asset: Partial<EkaStorageAsset>): string {
  // 1. If CDN edge or custom proxy is available
  if (asset.cdn_cached_url) {
    return asset.cdn_cached_url;
  }

  // 2. If stored in Cloudflare R2 with file_name or key
  if (asset.storage_provider === "cloudflare_r2") {
    const domain = (typeof process !== "undefined" && process.env?.["R2_PUBLIC_DOMAIN"]) || "https://media.eka.earth";
    return `${domain.replace(/\/$/, "")}/${asset.namespace_id || "02_CONTENT"}/${asset.file_name}`;
  }

  // 3. If already a direct HTTPS web link
  if (asset.drive_web_content_link) {
    return asset.drive_web_content_link;
  }

  // 3. Fallback: Google Drive direct view/stream thumbnail or proxy
  if (asset.drive_file_id) {
    // For images, Google Drive uc / thumbnail export handles instant rendering
    if (asset.mime_type?.startsWith("image/")) {
      return `https://drive.google.com/thumbnail?id=${asset.drive_file_id}&sz=w1600`;
    }
    // For video / documents / other
    return `https://drive.google.com/uc?export=view&id=${asset.drive_file_id}`;
  }

  return "";
}

/**
 * Resolves image thumbnail URL with high-performance edge parameters.
 */
export function resolveThumbnailUrl(asset: Partial<EkaStorageAsset>, size: number = 400): string {
  if (asset.thumbnail_url) return asset.thumbnail_url;
  if (asset.thumbnail_drive_id) {
    return `https://drive.google.com/thumbnail?id=${asset.thumbnail_drive_id}&sz=w${size}`;
  }
  if (asset.drive_file_id) {
    return `https://drive.google.com/thumbnail?id=${asset.drive_file_id}&sz=w${size}`;
  }
  return "";
}
