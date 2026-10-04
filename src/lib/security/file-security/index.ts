// ==============================================================================
// EKA PLATFORM — MALWARE, FILE & UPLOAD SECURITY ENGINE
// ==============================================================================

import type { FileValidationResult } from "../types";

// Maximum allowable file sizes in bytes
export const FILE_SIZE_LIMITS = {
  avatar: 2 * 1024 * 1024, // 2 MB
  document: 10 * 1024 * 1024, // 10 MB
  media: 50 * 1024 * 1024, // 50 MB
};

// Strict extension whitelist
const ALLOWED_EXTENSIONS = new Set([
  "jpg", "jpeg", "png", "webp", "gif",
  "pdf",
  "mp3", "m4a", "wav",
  "mp4", "webm"
]);

// Dangerous executable extensions that are unconditionally rejected
const DANGEROUS_EXTENSIONS = new Set([
  "exe", "bat", "cmd", "sh", "bash", "ps1", "php", "phtml", "py", "rb",
  "js", "mjs", "cjs", "ts", "html", "htm", "vbs", "msi", "scr", "jar",
  "com", "reg", "hta", "cpl"
]);

/**
 * Validates magic binary header signatures to determine true file type.
 */
export function detectMagicBytesMime(buffer: Uint8Array): string | null {
  if (!buffer || buffer.length < 4) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }

  // GIF: 47 49 46 38
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return "image/gif";
  }

  // WebP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer.length >= 12 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }

  // PDF: 25 50 44 46 (%PDF)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return "application/pdf";
  }

  // MP3: 49 44 33 (ID3) or FF FB
  if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
    return "audio/mpeg";
  }
  if (buffer[0] === 0xff && (buffer[1] === 0xfb || buffer[1] === 0xf3)) {
    return "audio/mpeg";
  }

  // MP4: .... ftyp
  if (
    buffer.length >= 8 &&
    buffer[4] === 0x66 &&
    buffer[5] === 0x74 &&
    buffer[6] === 0x79 &&
    buffer[7] === 0x70
  ) {
    return "video/mp4";
  }

  return null;
}

/**
 * Sanitizes filenames to eliminate path traversal (../), null-bytes, and unsafe chars.
 * Replaces risky naming with a deterministic UUID-based sanitized name.
 */
export function sanitizeUploadFilename(originalName: string, extension: string): string {
  const cleanExt = extension.toLowerCase().replace(/[^a-z0-9]/g, "");
  const baseName = originalName
    .replace(/(\.\.[\/\\])+/g, "")
    .replace(/[\0\x00-\x1F\x7F]/g, "")
    .replace(/[^a-zA-Z0-9_\-\.]/g, "_")
    .slice(0, 50);

  const uid = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10);
  return `${Date.now()}_${uid}_${baseName}.${cleanExt}`;
}

/**
 * Strips script tags, active event handlers, and javascript URIs from SVG/XML markup.
 */
export function sanitizeSvgXml(rawSvg: string): string {
  return rawSvg
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/on\w+\s*=\s*[^>\s]+/gi, "")
    .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')
    .replace(/xlink:href\s*=\s*["']javascript:[^"']*["']/gi, 'xlink:href="#"');
}

/**
 * Comprehensive file and upload validator.
 */
export function validateUploadedFile(params: {
  filename: string;
  sizeBytes: number;
  claimedMimeType: string;
  buffer?: Uint8Array;
  category?: "avatar" | "document" | "media";
}): FileValidationResult {
  const category = params.category || "media";
  const maxSize = FILE_SIZE_LIMITS[category];

  // 1. File size verification
  if (params.sizeBytes > maxSize) {
    return {
      isValid: false,
      sanitizedFilename: "",
      mimeType: params.claimedMimeType,
      detectedMimeType: "unknown",
      sizeBytes: params.sizeBytes,
      riskLevel: "rejected",
      error: `File size (${(params.sizeBytes / (1024 * 1024)).toFixed(1)}MB) exceeds maximum allowed limit of ${(maxSize / (1024 * 1024)).toFixed(0)}MB for ${category}.`,
    };
  }

  // 2. Extension validation
  const extParts = params.filename.split(".");
  const ext = extParts.length > 1 ? extParts.pop()!.toLowerCase() : "";

  if (DANGEROUS_EXTENSIONS.has(ext)) {
    return {
      isValid: false,
      sanitizedFilename: "",
      mimeType: params.claimedMimeType,
      detectedMimeType: "executable",
      sizeBytes: params.sizeBytes,
      riskLevel: "rejected",
      error: `Dangerous or executable file extension ('.${ext}') is strictly prohibited.`,
    };
  }

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return {
      isValid: false,
      sanitizedFilename: "",
      mimeType: params.claimedMimeType,
      detectedMimeType: "unsupported",
      sizeBytes: params.sizeBytes,
      riskLevel: "rejected",
      error: `File extension ('.${ext}') is not an accepted format.`,
    };
  }

  // 3. Binary Magic Bytes verification (if buffer is supplied)
  let detectedMime = params.claimedMimeType;
  if (params.buffer && params.buffer.length >= 4) {
    const magicMime = detectMagicBytesMime(params.buffer);
    if (!magicMime) {
      return {
        isValid: false,
        sanitizedFilename: "",
        mimeType: params.claimedMimeType,
        detectedMimeType: "corrupted_or_disguised",
        sizeBytes: params.sizeBytes,
        riskLevel: "rejected",
        error: "File binary header does not match any recognized safe media format.",
      };
    }
    detectedMime = magicMime;
  }

  const sanitizedFilename = sanitizeUploadFilename(params.filename, ext);

  return {
    isValid: true,
    sanitizedFilename,
    mimeType: params.claimedMimeType,
    detectedMimeType: detectedMime,
    sizeBytes: params.sizeBytes,
    riskLevel: "safe",
  };
}
