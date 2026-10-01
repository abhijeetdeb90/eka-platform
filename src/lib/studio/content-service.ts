// ==============================================================================
// EKA STUDIO — STRUCTURED CONTENT & PAGE BUILDER SERVICE
// ==============================================================================

import { supabase } from "@/integrations/supabase/client";
import { logStudioAction } from "./audit";
import type { ContentItem, StudioRole } from "./types";

export const SEED_CONTENT_ITEMS: ContentItem[] = [
  {
    id: "content_art_01",
    title: "Silence Isn’t the Absence of Thought: The Contemplative Space",
    slug: "silence-isnt-the-absence-of-thought",
    type: "article",
    description: "An essay exploring what practitioners across traditions mean when they say 'sit' in meditation.",
    body: `Silence is not an empty vacuum; it is the luminous space in which thought becomes visible without gripping the mind. Across the Upanishads, the desert monastic fathers of Mount Athos, and the Zen halls of Kyoto, silence is understood not as sensory deprivation but as radical presence.\n\nWhen we sit still, the turbulence of habit patterns (samskaras) begins to settle like silt in a glass of water. It requires courage to let the sediment settle without stirring it again with narrative explanation.`,
    media: [
      {
        url: "/still-water.jpg",
        type: "image",
        alt: "Still water reflection",
        caption: "Stillness as reflective presence",
      },
    ],
    creator_name: "EKA Contemplative Circle",
    category: "Contemplative Philosophy",
    tags: ["Silence", "Practice", "Zen", "Vedanta"],
    location: "Rishikesh",
    language: "en",
    tradition: "Advaita Vedanta & Zen",
    community: "Global Seekers",
    sources: ["Upanishads", "Dogen's Shobogenzo"],
    related_objects: ["ko_sandhya_01", "ko_bodhgaya_04"],
    seo_metadata: {
      meta_title: "Silence Isn’t the Absence of Thought — EKA",
      meta_description: "Discover what practitioners across spiritual traditions mean by contemplative sitting.",
      og_image: "/still-water.jpg",
    },
    visibility: "public",
    status: "published",
    created_at: "2026-09-12T10:00:00Z",
    updated_at: "2026-09-20T14:30:00Z",
  },
  {
    id: "content_art_02",
    title: "The Small Flame That People Keep: A History of Sacred Light",
    slug: "the-small-flame-that-people-keep",
    type: "article",
    description: "Oil lamps, candles, ghee wicks — why nearly every tradition marks attention with living fire.",
    body: `Fire is the only terrestrial element that never points downward. In the Vedic agnihotra, the Menorah of Jerusalem, the vigil lamp (kandylaki) of Byzantine iconography, and the clay diya of Diwali, living flame acts as a bridge between the physical and the transcendent.\n\nTo hold a flame is to hold an emblem of fragile awareness in an indifferent dark. It demands daily fuel, gentle breath, and conscious presence.`,
    media: [
      {
        url: "/ritual-lamp.jpg",
        type: "image",
        alt: "Brass ritual diya lamp",
        caption: "A ghee lamp alight before dawn",
      },
    ],
    creator_name: "Archival Research Desk",
    category: "Sacred Material Culture",
    tags: ["Ritual", "Devotion", "Light", "Aarti"],
    location: "Varanasi",
    language: "en",
    tradition: "Sanatana Dharma / Universal",
    community: "Living Traditions Custodians",
    sources: ["Rigveda Agni Sukta 1.1", "Gombrich on Symbolic Form"],
    related_objects: ["ko_varanasi_02"],
    seo_metadata: {
      meta_title: "The Small Flame That People Keep — EKA",
      meta_description: "Why ancient and living civilizations kindle living fire as devotion.",
      og_image: "/ritual-lamp.jpg",
    },
    visibility: "public",
    status: "published",
    created_at: "2026-09-15T11:00:00Z",
    updated_at: "2026-09-22T09:15:00Z",
  },
  {
    id: "content_page_03",
    title: "Living Hermeneutics: The 5-Tier Epistemic Charter",
    slug: "epistemic-charter-and-methodology",
    type: "page",
    description: "The official institutional framework governing truth, interpretation, and provenance on EKA.",
    body: `EKA establishes a machine-readable distinction between five epistemic tiers to prevent misinformation, doctrinal erasure, and commercial flattening of sacred traditions.\n\n1. Documented Tradition: Primary canonical scripture and verifiable historical chronicles.\n2. Interpretation: Hermeneutic school commentary by identified scholars.\n3. Opinion & Reflection: Subjective lived experience.\n4. Living Practice: Regional folkways and oral customs.\n5. Modern Adaptation: Contemporary wellness syntheses.`,
    media: [],
    creator_name: "EKA Standards Council",
    category: "Institutional Governance",
    tags: ["Trust", "Methodology", "Charter", "Epistemology"],
    language: "en",
    tradition: "Universal / Interfaith",
    sources: ["EKA KNOW-002 Specification", "UNESCO Intangible Heritage Convention 2003"],
    related_objects: [],
    seo_metadata: {
      meta_title: "EKA Epistemic Charter & Truth Standards",
      meta_description: "How EKA verifies spiritual and cultural claims with explainable provenance.",
    },
    visibility: "public",
    status: "published",
    created_at: "2026-09-01T08:00:00Z",
    updated_at: "2026-09-25T16:00:00Z",
  },
];

let liveContent = [...SEED_CONTENT_ITEMS];

export async function fetchContentItems(filter?: {
  type?: string;
  status?: string;
  visibility?: string;
  query?: string;
}): Promise<ContentItem[]> {
  try {
    let q = (supabase as any).from("content_items").select("*");
    if (filter?.type && filter.type !== "all") q = q.eq("type", filter.type);
    if (filter?.status && filter.status !== "all") q = q.eq("status", filter.status);
    if (filter?.visibility && filter.visibility !== "all") q = q.eq("visibility", filter.visibility);

    const { data, error } = await q.order("updated_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return data as unknown as ContentItem[];
    }
  } catch {
    // fallback
  }

  return liveContent.filter((c) => {
    if (filter?.type && filter.type !== "all" && c.type !== filter.type) return false;
    if (filter?.status && filter.status !== "all" && c.status !== filter.status) return false;
    if (filter?.visibility && filter.visibility !== "all" && c.visibility !== filter.visibility)
      return false;
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });
}

export async function getContentItemById(id: string): Promise<ContentItem | null> {
  const item = liveContent.find((c) => c.id === id);
  return item ? JSON.parse(JSON.stringify(item)) : null;
}

export async function saveContentItem(
  item: Partial<ContentItem> & { title: string },
  actorRole: StudioRole = "Content Admin",
): Promise<ContentItem> {
  const isNew = !item.id;
  const id = item.id || `content_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const saved: ContentItem = {
    id,
    title: item.title,
    slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    type: item.type || "article",
    description: item.description || "",
    body: item.body || "",
    media: item.media || [],
    ...(item.author_id ? { author_id: item.author_id } : {}),
    creator_name: item.creator_name || "EKA Editorial",
    category: item.category || "General",
    tags: item.tags || [],
    location: item.location || "",
    language: item.language || "en",
    tradition: item.tradition || "",
    community: item.community || "",
    sources: item.sources || [],
    related_objects: item.related_objects || [],
    seo_metadata: item.seo_metadata || {
      meta_title: item.title,
      ...(item.description ? { meta_description: item.description } : {}),
    },
    visibility: item.visibility || "public",
    status: item.status || "draft",
    scheduled_publish_at: item.scheduled_publish_at || null,
    created_at: item.created_at || now,
    updated_at: now,
  };

  const idx = liveContent.findIndex((c) => c.id === id);
  if (idx >= 0) {
    liveContent[idx] = saved;
  } else {
    liveContent.unshift(saved);
  }

  await logStudioAction({
    actor_role: actorRole,
    action: isNew ? "create" : "edit",
    target_type: "content",
    target_id: id,
    target_title: saved.title,
    details: { type: saved.type, status: saved.status, visibility: saved.visibility },
  });

  return saved;
}

export async function duplicateContentItem(
  id: string,
  actorRole: StudioRole = "Content Admin",
): Promise<ContentItem> {
  const orig = await getContentItemById(id);
  if (!orig) throw new Error("Content item not found");

  const { id: _, ...rest } = orig;
  const duplicated = await saveContentItem(
    {
      ...rest,
      title: `${orig.title} (Copy)`,
      slug: `${orig.slug}-copy-${Date.now().toString(36)}`,
      status: "draft",
    },
    actorRole,
  );

  return duplicated;
}

export async function archiveContentItem(
  id: string,
  actorRole: StudioRole = "Content Admin",
): Promise<void> {
  const item = await getContentItemById(id);
  if (!item) return;
  item.status = "archived";
  await saveContentItem(item, actorRole);

  await logStudioAction({
    actor_role: actorRole,
    action: "delete",
    target_type: "content",
    target_id: id,
    target_title: item.title,
    details: { archived: true },
  });
}

export async function publishContentItem(
  id: string,
  actorRole: StudioRole = "Content Admin",
): Promise<ContentItem> {
  const item = await getContentItemById(id);
  if (!item) throw new Error("Not found");
  item.status = "published";
  item.scheduled_publish_at = null;
  const saved = await saveContentItem(item, actorRole);

  await logStudioAction({
    actor_role: actorRole,
    action: "publish",
    target_type: "content",
    target_id: id,
    target_title: item.title,
    details: { published: true },
  });

  return saved;
}

export async function unpublishContentItem(
  id: string,
  actorRole: StudioRole = "Content Admin",
): Promise<ContentItem> {
  const item = await getContentItemById(id);
  if (!item) throw new Error("Not found");
  item.status = "draft";
  const saved = await saveContentItem(item, actorRole);

  await logStudioAction({
    actor_role: actorRole,
    action: "unpublish",
    target_type: "content",
    target_id: id,
    target_title: item.title,
    details: { status: "draft" },
  });

  return saved;
}

export async function scheduleContentItem(
  id: string,
  scheduleDate: string,
  actorRole: StudioRole = "Content Admin",
): Promise<ContentItem> {
  const item = await getContentItemById(id);
  if (!item) throw new Error("Not found");
  item.status = "scheduled";
  item.scheduled_publish_at = scheduleDate;
  const saved = await saveContentItem(item, actorRole);

  await logStudioAction({
    actor_role: actorRole,
    action: "publish",
    target_type: "content",
    target_id: id,
    target_title: item.title,
    details: { scheduled_for: scheduleDate },
  });

  return saved;
}
