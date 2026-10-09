import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { generateEkaId, EKA_STORAGE_NAMESPACES } from "@/lib/storage-lake";

// ==============================================================================
// CLOUDFLARE R2 MEDIA STORAGE ADAPTER FOR EKA
// ==============================================================================
// S3-compatible, zero-egress media storage for:
// - Community images, creator reels, visual stories, cultural archives
// - Short-lived signed URLs for direct client-to-storage uploads
// - Private storage for sensitive verification documents and governance records
// - Fast CDN delivery for public media assets
// ==============================================================================

const ACCOUNT_ID = process.env["CLOUDFLARE_ACCOUNT_ID"] || "";
const ACCESS_KEY_ID = process.env["R2_ACCESS_KEY_ID"] || "";
const SECRET_ACCESS_KEY = process.env["R2_SECRET_ACCESS_KEY"] || "";
const BUCKET_NAME = process.env["R2_BUCKET_NAME"] || "eka-media-production";
const PUBLIC_DOMAIN = process.env["R2_PUBLIC_DOMAIN"] || "https://media.eka.earth";

export const ALLOWED_MIME_TYPES = {
  // Images (Max 15 MB)
  "image/jpeg": { maxSize: 15 * 1024 * 1024, type: "image", ext: "jpg" },
  "image/png": { maxSize: 15 * 1024 * 1024, type: "image", ext: "png" },
  "image/webp": { maxSize: 15 * 1024 * 1024, type: "image", ext: "webp" },
  "image/gif": { maxSize: 15 * 1024 * 1024, type: "image", ext: "gif" },
  "image/avif": { maxSize: 15 * 1024 * 1024, type: "image", ext: "avif" },
  // Videos / Reels (Max 150 MB)
  "video/mp4": { maxSize: 150 * 1024 * 1024, type: "video", ext: "mp4" },
  "video/quicktime": { maxSize: 150 * 1024 * 1024, type: "video", ext: "mov" },
  "video/webm": { maxSize: 150 * 1024 * 1024, type: "video", ext: "webm" },
  // Audio recordings (Max 50 MB)
  "audio/mpeg": { maxSize: 50 * 1024 * 1024, type: "audio", ext: "mp3" },
  "audio/mp4": { maxSize: 50 * 1024 * 1024, type: "audio", ext: "m4a" },
  "audio/wav": { maxSize: 50 * 1024 * 1024, type: "audio", ext: "wav" },
  // Archival Documents / Manuscripts (Max 30 MB)
  "application/pdf": { maxSize: 30 * 1024 * 1024, type: "document", ext: "pdf" },
} as const;

export type SupportedMimeType = keyof typeof ALLOWED_MIME_TYPES;

let s3ClientInstance: S3Client | null = null;

function getR2Client(): S3Client | null {
  if (s3ClientInstance) return s3ClientInstance;
  if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    return null;
  }

  s3ClientInstance = new S3Client({
    region: "auto",
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  });

  return s3ClientInstance;
}

export interface PresignedUploadRequest {
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  namespace?: keyof typeof EKA_STORAGE_NAMESPACES;
  entityType?: "post" | "cultural_item" | "knowledge_object" | "creator_portfolio" | "avatar";
  isPublic?: boolean;
  userId?: string;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  publicUrl: string;
  fileKey: string;
  ekaId: string;
  expiresInSeconds: number;
  headers: Record<string, string>;
  isSimulatedDev?: boolean;
}

/**
 * Validates incoming upload request against strict MIME whitelist and size limits.
 */
export function validateUploadRequest(
  fileName: string,
  mimeType: string,
  fileSizeBytes: number,
): { valid: boolean; error?: string } {
  if (!fileName || fileName.trim().length === 0) {
    return { valid: false, error: "File name is required" };
  }

  const spec = ALLOWED_MIME_TYPES[mimeType as SupportedMimeType];
  if (!spec) {
    return {
      valid: false,
      error: `Unsupported MIME type: '${mimeType}'. Allowed: JPEG, PNG, WEBP, MP4, WEBM, MP3, PDF`,
    };
  }

  if (fileSizeBytes > spec.maxSize) {
    const maxMb = Math.round(spec.maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `File size exceeds ${maxMb}MB limit for ${spec.type} files`,
    };
  }

  return { valid: true };
}

/**
 * Generates a short-lived presigned URL for direct, secure upload from client to Cloudflare R2.
 */
export async function createPresignedUploadUrl(
  params: PresignedUploadRequest,
): Promise<PresignedUploadResponse> {
  const validation = validateUploadRequest(params.fileName, params.mimeType, params.fileSizeBytes);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const namespaceKey = params.namespace || "CONTENT";
  const namespacePath = EKA_STORAGE_NAMESPACES[namespaceKey] || "02_CONTENT";
  const ekaId = generateEkaId(params.entityType === "creator_portfolio" ? "CRP" : "MED");
  const ext = params.fileName.split(".").pop() || "bin";
  const sanitizedName = params.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileKey = `${namespacePath}/${ekaId}-${sanitizedName}.${ext}`;

  const client = getR2Client();
  const expiresInSeconds = 900; // 15 minutes

  const publicUrl = params.isPublic !== false
    ? `${PUBLIC_DOMAIN.replace(/\/$/, "")}/${fileKey}`
    : "";

  if (!client) {
    // Development / unconfigured environment fallback
    return {
      uploadUrl: `https://mock-upload.eka.earth/r2/${fileKey}?expires=${Date.now() + expiresInSeconds * 1000}`,
      publicUrl: publicUrl || `https://media.eka.earth/${fileKey}`,
      fileKey,
      ekaId,
      expiresInSeconds,
      headers: {
        "Content-Type": params.mimeType,
      },
      isSimulatedDev: true,
    };
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ContentType: params.mimeType,
    ContentLength: params.fileSizeBytes,
    Metadata: {
      "eka-id": ekaId,
      "uploaded-by": params.userId || "anonymous",
      "entity-type": params.entityType || "post",
    },
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });

  return {
    uploadUrl,
    publicUrl,
    fileKey,
    ekaId,
    expiresInSeconds,
    headers: {
      "Content-Type": params.mimeType,
    },
  };
}

/**
 * Generates a temporary signed download URL for private/restricted documents (e.g. verification proofs).
 */
export async function getPresignedDownloadUrl(
  fileKey: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const client = getR2Client();
  if (!client) {
    return `https://mock-storage.eka.earth/download/${fileKey}?expires=${Date.now() + expiresInSeconds * 1000}`;
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

/**
 * Returns the CDN public delivery URL for a public media file.
 */
export function getPublicMediaUrl(fileKey: string): string {
  if (fileKey.startsWith("http://") || fileKey.startsWith("https://")) {
    return fileKey;
  }
  return `${PUBLIC_DOMAIN.replace(/\/$/, "")}/${fileKey.replace(/^\//, "")}`;
}
