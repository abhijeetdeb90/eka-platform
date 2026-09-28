/** Client-side media preparation for the composer: crop, downscale, and classify. */

export type AspectKey = "original" | "square" | "portrait" | "wide";

export const ASPECTS: { key: AspectKey; label: string; ratio: number | null }[] = [
  { key: "original", label: "Original", ratio: null },
  { key: "square", label: "1:1", ratio: 1 },
  { key: "portrait", label: "4:5", ratio: 4 / 5 },
  { key: "wide", label: "16:9", ratio: 16 / 9 },
];

export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;
export const VIDEO_MAX_BYTES = 50 * 1024 * 1024;
export const ACCEPTED_MEDIA =
  "image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime";

const MAX_EDGE = 1600;

export function isVideoFile(file: File) {
  return file.type.startsWith("video/");
}

/** True when a stored/served media URL points at a video file. */
export function isVideoUrl(url: string | null | undefined) {
  if (!url) return false;
  const path = url.split("?")[0] ?? "";
  return /\.(mp4|webm|mov|m4v)$/i.test(path);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image."));
    };
    img.src = url;
  });
}

/**
 * Centre-crops an image to the chosen aspect ratio and caps its longest edge,
 * so feed cards get consistent framing and images stay quick to load.
 */
export async function prepareImage(file: File, aspect: AspectKey): Promise<File> {
  if (file.type === "image/gif") return file;

  const img = await loadImage(file);
  const ratio = ASPECTS.find((a) => a.key === aspect)?.ratio ?? img.width / img.height;

  let sw = img.width;
  let sh = Math.round(sw / ratio);
  if (sh > img.height) {
    sh = img.height;
    sw = Math.round(sh * ratio);
  }
  const sx = Math.round((img.width - sw) / 2);
  const sy = Math.round((img.height - sh) / 2);

  const scale = Math.min(1, MAX_EDGE / Math.max(sw, sh));
  const dw = Math.max(1, Math.round(sw * scale));
  const dh = Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement("canvas");
  canvas.width = dw;
  canvas.height = dh;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/webp", 0.9),
  );
  if (!blob) return file;

  const name = file.name.replace(/\.[^.]+$/, "") || "photo";
  return new File([blob], `${name}.webp`, { type: "image/webp" });
}
