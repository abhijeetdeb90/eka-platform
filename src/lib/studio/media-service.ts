// ==============================================================================
// EKA STUDIO — CENTRALIZED MEDIA ASSET LIBRARY SERVICE
// ==============================================================================

import { supabase } from "@/integrations/supabase/client";
import { logStudioAction } from "./audit";
import type { MediaAsset, StudioRole } from "./types";

export const SEED_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: "media_img_01",
    title: "Varanasi Ghat Dawn Silhouette",
    filename: "varanasi-ghats-dawn.jpg",
    file_type: "image",
    url: "/hero.jpg",
    thumbnail_url: "/hero.jpg",
    mime_type: "image/jpeg",
    size_bytes: 2840500,
    copyright_status: "licensed",
    license: "Creative Commons BY-NC 4.0",
    creator: "Aditya Verma (EKA Field Photographer)",
    source: "Kashi Heritage Documentation Project",
    alt_text: "Pilgrims offering water to the rising sun on ancient stone ghats",
    caption: "Dawn contemplative arghya at Dashashwamedh Ghat",
    usage_rights: "Unrestricted editorial and educational use across EKA platform",
    tags: ["Varanasi", "Ghats", "Dawn", "Sun", "Devotion"],
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "media_img_02",
    title: "Brass Ritual Oil Diya Lamp",
    filename: "ritual-lamp-close.jpg",
    file_type: "image",
    url: "/ritual-lamp.jpg",
    thumbnail_url: "/ritual-lamp.jpg",
    mime_type: "image/jpeg",
    size_bytes: 1420000,
    copyright_status: "owned",
    license: "All Rights Reserved to EKA Sacred Media Archive",
    creator: "EKA Studio Photography Desk",
    source: "Sacred Material Culture Collection",
    alt_text: "Clay and brass oil lamp burning softly in quiet dawn",
    caption: "The solitary flame preserved across contemplative lineages",
    usage_rights: "Exclusive platform ownership",
    tags: ["Ritual", "Diya", "Light", "Devotion"],
    created_at: "2026-09-04T10:00:00Z",
  },
  {
    id: "media_aud_03",
    title: "Chishti Qawwali: Live Sama Recording (Nizamuddin)",
    filename: "chishti-sama-nizamuddin.mp3",
    file_type: "audio",
    url: "https://media.eka.earth/audio/chishti-sama-excerpt.mp3",
    mime_type: "audio/mpeg",
    size_bytes: 8450000,
    copyright_status: "licensed",
    license: "Archival Fair Use / Educational",
    creator: "Niazi Brothers Qawwal Lineage",
    source: "Dargah Hazrat Nizamuddin Auliya Field Recording",
    alt_text: "Sufi mystical qawwali recording featuring harmonium, tabla, and choral chant",
    caption: "Live acoustic transmission of Amir Khusrau's Persian and Braj poetry",
    usage_rights: "Audio stream only; commercial resale prohibited",
    tags: ["Qawwali", "Sufi", "Nizamuddin", "Amir Khusrau", "Chant"],
    created_at: "2026-09-10T14:00:00Z",
  },
  {
    id: "media_doc_04",
    title: "Rigveda Samhita Mandala 3 Critical Edition Facsimile",
    filename: "rigveda-mandala-3-facsimile.pdf",
    file_type: "document",
    url: "https://media.eka.earth/docs/rigveda-mandala-3-poona.pdf",
    mime_type: "application/pdf",
    size_bytes: 16500000,
    copyright_status: "public_domain",
    license: "Public Domain (Pre-1923 Scholarly Critical Edition)",
    creator: "Vaidika Samshodhana Mandala, Poona",
    source: "National Archives of India / Poona Sanskrit Series",
    alt_text: "High-resolution Devanagari Sanskrit manuscript scan with Vedic accents",
    caption: "Critical edition containing the canonical Gayatri mantra (RV 3.62.10)",
    usage_rights: "Unrestricted open public domain document",
    tags: ["Rigveda", "Manuscript", "Facsimile", "Sanskrit", "Vedic"],
    created_at: "2026-09-15T09:00:00Z",
  },
];

let liveMedia = [...SEED_MEDIA_ASSETS];

export async function fetchMediaAssets(filter?: {
  file_type?: string;
  copyright_status?: string;
  query?: string;
}): Promise<MediaAsset[]> {
  try {
    let q = (supabase as any).from("media_assets").select("*");
    if (filter?.file_type && filter.file_type !== "all") q = q.eq("file_type", filter.file_type);
    if (filter?.copyright_status && filter.copyright_status !== "all")
      q = q.eq("copyright_status", filter.copyright_status);

    const { data, error } = await q.order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return data as unknown as MediaAsset[];
    }
  } catch {
    // fallback
  }

  return liveMedia.filter((m) => {
    if (filter?.file_type && filter.file_type !== "all" && m.file_type !== filter.file_type)
      return false;
    if (
      filter?.copyright_status &&
      filter.copyright_status !== "all" &&
      m.copyright_status !== filter.copyright_status
    )
      return false;
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.creator?.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });
}

export async function saveMediaAsset(
  asset: Partial<MediaAsset> & { title: string; filename: string; file_type: MediaAsset["file_type"]; url: string },
  actorRole: StudioRole = "Content Admin",
): Promise<MediaAsset> {
  const isNew = !asset.id;
  const id = asset.id || `media_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const saved: MediaAsset = {
    id,
    title: asset.title,
    filename: asset.filename,
    file_type: asset.file_type,
    url: asset.url,
    thumbnail_url: asset.thumbnail_url || asset.url,
    mime_type: asset.mime_type || "application/octet-stream",
    size_bytes: asset.size_bytes || 1024 * 512,
    copyright_status: asset.copyright_status || "licensed",
    license: asset.license || "All Rights Reserved",
    creator: asset.creator || "Unknown",
    source: asset.source || "EKA Archive",
    alt_text: asset.alt_text || asset.title,
    caption: asset.caption || "",
    usage_rights: asset.usage_rights || "Editorial use",
    tags: asset.tags || [],
    created_at: asset.created_at || now,
  };

  const idx = liveMedia.findIndex((m) => m.id === id);
  if (idx >= 0) {
    liveMedia[idx] = saved;
  } else {
    liveMedia.unshift(saved);
  }

  await logStudioAction({
    actor_role: actorRole,
    action: isNew ? "create" : "edit",
    target_type: "media",
    target_id: id,
    target_title: saved.title,
    details: { file_type: saved.file_type, copyright: saved.copyright_status },
  });

  return saved;
}

export async function deleteMediaAsset(
  id: string,
  actorRole: StudioRole = "Content Admin",
): Promise<void> {
  const target = liveMedia.find((m) => m.id === id);
  liveMedia = liveMedia.filter((m) => m.id !== id);

  await logStudioAction({
    actor_role: actorRole,
    action: "delete",
    target_type: "media",
    target_id: id,
    target_title: target?.title || id,
    details: { deleted: true },
  });
}
