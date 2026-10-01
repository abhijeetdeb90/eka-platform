// ==============================================================================
// EKA STUDIO — VISUAL DATA-DRIVEN HOMEPAGE BUILDER SERVICE
// ==============================================================================

import { supabase } from "@/integrations/supabase/client";
import { logStudioAction } from "./audit";
import { SEED_KNOWLEDGE_OBJECTS } from "./knowledge-service";
import type {
  HomepageDataSource,
  HomepageLayout,
  HomepageSection,
  StudioRole,
} from "./types";

export const HOMEPAGE_DATA_SOURCES: Array<{ value: HomepageDataSource; label: string }> = [
  { value: "curated", label: "Curated Selection" },
  { value: "trending", label: "Trending Discourses & Reflections" },
  { value: "featured_knowledge", label: "Featured Knowledge Objects" },
  { value: "culture", label: "Explore by Culture" },
  { value: "geography", label: "Explore by Geography" },
  { value: "festivals", label: "Living Sacred Festivals" },
  { value: "places", label: "Sacred Places & Tirthas" },
  { value: "creators", label: "Authentic Creators & Scholars" },
  { value: "communities", label: "Sacred Communities & Sanghas" },
  { value: "businesses", label: "Local Heritage Businesses & Guilds" },
];

export const HOMEPAGE_LAYOUTS: Array<{ value: HomepageLayout; label: string; icon: string }> = [
  { value: "hero", label: "Cinematic Hero", icon: "LayoutTemplate" },
  { value: "grid", label: "3-Column Grid", icon: "Grid" },
  { value: "carousel", label: "Horizontal Carousel", icon: "GalleryHorizontal" },
  { value: "rail", label: "Sidebar Discovery Rail", icon: "Columns" },
  { value: "list", label: "Compact List", icon: "List" },
  { value: "featured_card", label: "Full-Bleed Feature", icon: "CreditCard" },
];

export const SEED_HOMEPAGE_SECTIONS: HomepageSection[] = [
  {
    id: "sec_hero",
    title: "One Within. One With All.",
    subtitle: "A calm social network and living epistemic sanctuary for spiritual heritage, contemplative wisdom, and sacred rhythms.",
    layout: "hero",
    data_source: "curated",
    config: {
      limit: 1,
      badge: "Living Heritage",
      cta_text: "Begin Your Path",
      cta_link: "/join",
      background_tint: "parchment",
    },
    selected_ids: ["ko_sandhya_01"],
    sort_order: 1,
    is_visible: true,
    created_at: "2026-09-01T08:00:00Z",
    updated_at: "2026-09-26T12:00:00Z",
  },
  {
    id: "sec_featured_knowledge",
    title: "Featured Knowledge Objects",
    subtitle: "Canonically verified wisdom traditions with explainable multi-source provenance.",
    layout: "grid",
    data_source: "featured_knowledge",
    config: {
      limit: 3,
      badge: "Verified Canon",
      cta_text: "Explore Wisdom Graph",
      cta_link: "/app/wisdom",
    },
    selected_ids: ["ko_sandhya_01", "ko_varanasi_02", "ko_bodhgaya_04"],
    sort_order: 2,
    is_visible: true,
    created_at: "2026-09-02T09:00:00Z",
    updated_at: "2026-09-26T12:00:00Z",
  },
  {
    id: "sec_explore_culture",
    title: "Explore by Culture",
    subtitle: "Navigate humanity's sacred traditions across South Asia, East Asia, and the Global Diaspora.",
    layout: "carousel",
    data_source: "culture",
    config: {
      limit: 4,
      badge: "Ontology",
      cta_text: "View Cultural Taxonomy",
      cta_link: "/app/discover",
    },
    selected_ids: ["tax_south_asia", "tax_tamil_nadu", "tax_assam", "tax_maharashtra"],
    sort_order: 3,
    is_visible: true,
    created_at: "2026-09-03T10:00:00Z",
    updated_at: "2026-09-26T12:00:00Z",
  },
  {
    id: "sec_places",
    title: "Sacred Places & Tirthas",
    subtitle: "Ancient riverbanks, monolithic rock temples, and sacred mountain peaks.",
    layout: "grid",
    data_source: "places",
    config: {
      limit: 3,
      badge: "Sacred Geography",
      cta_text: "Explore Map",
      cta_link: "/app/junction",
    },
    selected_ids: ["ko_varanasi_02", "ko_bodhgaya_04"],
    sort_order: 4,
    is_visible: true,
    created_at: "2026-09-04T11:00:00Z",
    updated_at: "2026-09-26T12:00:00Z",
  },
  {
    id: "sec_festivals",
    title: "Living Sacred Festivals",
    subtitle: "Align with celestial transitions, solar junctions, and community celebrations.",
    layout: "rail",
    data_source: "festivals",
    config: {
      limit: 3,
      badge: "Sacred Calendar",
      cta_text: "View Observances",
      cta_link: "/app/observe",
    },
    selected_ids: ["ko_chhath_05"],
    sort_order: 5,
    is_visible: true,
    created_at: "2026-09-05T12:00:00Z",
    updated_at: "2026-09-26T12:00:00Z",
  },
  {
    id: "sec_communities",
    title: "Custodians & Living Communities",
    subtitle: "Join Circles and Sanghas gathered in reverent practice and mutual study.",
    layout: "list",
    data_source: "communities",
    config: {
      limit: 3,
      badge: "Sanghas",
      cta_text: "Discover Sanghas",
      cta_link: "/app/sanghas",
    },
    selected_ids: [],
    sort_order: 6,
    is_visible: true,
    created_at: "2026-09-06T14:00:00Z",
    updated_at: "2026-09-26T12:00:00Z",
  },
  {
    id: "sec_businesses",
    title: "Local Heritage Businesses & Guilds",
    subtitle: "Authentic handloom weavers, incense purveyors, and sacred bookmakers.",
    layout: "grid",
    data_source: "businesses",
    config: {
      limit: 3,
      badge: "Heritage Economy",
      cta_text: "Visit Market",
      cta_link: "/app/market",
    },
    selected_ids: ["biz_banaras_handloom"],
    sort_order: 7,
    is_visible: true,
    created_at: "2026-09-07T16:00:00Z",
    updated_at: "2026-09-26T12:00:00Z",
  },
];

let liveHomepageSections = [...SEED_HOMEPAGE_SECTIONS];

export async function fetchHomepageSections(): Promise<HomepageSection[]> {
  try {
    const { data, error } = await (supabase as any)
      .from("homepage_sections")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data && data.length > 0) {
      return data as unknown as HomepageSection[];
    }
  } catch {
    // fallback
  }

  return [...liveHomepageSections].sort((a, b) => a.sort_order - b.sort_order);
}

// Function consumed by consumer client frontend to dynamically render homepage
export async function fetchActiveHomepageSections(): Promise<HomepageSection[]> {
  const all = await fetchHomepageSections();
  const now = new Date().toISOString();
  return all.filter((s) => {
    if (!s.is_visible) return false;
    if (s.schedule_publish && s.schedule_publish > now) return false;
    if (s.schedule_unpublish && s.schedule_unpublish < now) return false;
    return true;
  });
}

export async function saveHomepageSection(
  sec: Partial<HomepageSection> & { title: string },
  actorRole: StudioRole = "Content Admin",
): Promise<HomepageSection> {
  const isNew = !sec.id;
  const id = sec.id || `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const saved: HomepageSection = {
    id,
    title: sec.title,
    subtitle: sec.subtitle || "",
    layout: sec.layout || "grid",
    data_source: sec.data_source || "curated",
    config: sec.config || { limit: 4, cta_text: "Explore", cta_link: "/app/explore" },
    selected_ids: sec.selected_ids || [],
    sort_order: sec.sort_order ?? liveHomepageSections.length + 1,
    is_visible: sec.is_visible ?? true,
    schedule_publish: sec.schedule_publish || null,
    schedule_unpublish: sec.schedule_unpublish || null,
    created_at: sec.created_at || now,
    updated_at: now,
  };

  const idx = liveHomepageSections.findIndex((s) => s.id === id);
  if (idx >= 0) {
    liveHomepageSections[idx] = saved;
  } else {
    liveHomepageSections.push(saved);
  }

  await logStudioAction({
    actor_role: actorRole,
    action: isNew ? "create" : "edit",
    target_type: "homepage_section",
    target_id: id,
    target_title: saved.title,
    details: { layout: saved.layout, data_source: saved.data_source, visible: saved.is_visible },
  });

  return saved;
}

export async function reorderHomepageSections(
  orderedIds: string[],
  actorRole: StudioRole = "Content Admin",
): Promise<HomepageSection[]> {
  const idToOrder = new Map(orderedIds.map((id, index) => [id, index + 1]));

  liveHomepageSections.forEach((s) => {
    if (idToOrder.has(s.id)) {
      s.sort_order = idToOrder.get(s.id)!;
      s.updated_at = new Date().toISOString();
    }
  });

  liveHomepageSections.sort((a, b) => a.sort_order - b.sort_order);

  await logStudioAction({
    actor_role: actorRole,
    action: "edit",
    target_type: "homepage_section",
    target_title: "Homepage Layout Reordering",
    details: { order: orderedIds },
  });

  return [...liveHomepageSections];
}

export async function duplicateHomepageSection(
  id: string,
  actorRole: StudioRole = "Content Admin",
): Promise<HomepageSection> {
  const orig = liveHomepageSections.find((s) => s.id === id);
  if (!orig) throw new Error("Section not found");

  const { id: _, ...rest } = orig;
  const duplicated = await saveHomepageSection(
    {
      ...rest,
      title: `${orig.title} (Copy)`,
      sort_order: orig.sort_order + 1,
      is_visible: false,
    },
    actorRole,
  );

  return duplicated;
}

export async function deleteHomepageSection(
  id: string,
  actorRole: StudioRole = "Content Admin",
): Promise<void> {
  const target = liveHomepageSections.find((s) => s.id === id);
  liveHomepageSections = liveHomepageSections.filter((s) => s.id !== id);

  await logStudioAction({
    actor_role: actorRole,
    action: "delete",
    target_type: "homepage_section",
    target_id: id,
    target_title: target?.title || id,
    details: { deleted: true },
  });
}

export async function toggleSectionVisibility(
  id: string,
  visible: boolean,
  actorRole: StudioRole = "Content Admin",
): Promise<HomepageSection> {
  const sec = liveHomepageSections.find((s) => s.id === id);
  if (!sec) throw new Error("Section not found");
  sec.is_visible = visible;
  sec.updated_at = new Date().toISOString();

  await logStudioAction({
    actor_role: actorRole,
    action: visible ? "publish" : "unpublish",
    target_type: "homepage_section",
    target_id: id,
    target_title: sec.title,
    details: { is_visible: visible },
  });

  return sec;
}

// Resolver for dynamic card rendering
export function resolveSectionCards(section: HomepageSection) {
  if (section.selected_ids.length > 0) {
    const selected = SEED_KNOWLEDGE_OBJECTS.filter((ko) => section.selected_ids.includes(ko.id));
    if (selected.length > 0) return selected;
  }

  // Fallback to data_source filter
  switch (section.data_source) {
    case "featured_knowledge":
      return SEED_KNOWLEDGE_OBJECTS.filter((k) => k.verification_status === "Published" || k.verification_status === "Expert Verified");
    case "places":
      return SEED_KNOWLEDGE_OBJECTS.filter((k) => k.type === "Place");
    case "festivals":
      return SEED_KNOWLEDGE_OBJECTS.filter((k) => k.type === "Festival");
    case "culture":
    case "geography":
      return SEED_KNOWLEDGE_OBJECTS.slice(0, 3);
    default:
      return SEED_KNOWLEDGE_OBJECTS.slice(0, section.config.limit || 3);
  }
}
