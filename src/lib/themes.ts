import { supabase } from "@/integrations/supabase/client";

/* ------------------------------------------------------- problem-first ------
 * People arrive with a question, not with a tradition. Themes let someone
 * start from "grief" or "purpose" and find five different ways forward.
 * -------------------------------------------------------------------------- */

export type Lane = "explore" | "practice" | "connect" | "experience" | "deepen";

export const LANES: { key: Lane; label: string; blurb: string }[] = [
  { key: "explore", label: "Explore", blurb: "What different traditions say" },
  { key: "practice", label: "Practice", blurb: "Something to do today" },
  { key: "connect", label: "Connect", blurb: "People sitting with the same question" },
  { key: "experience", label: "Experience", blurb: "Conversations and gatherings" },
  { key: "deepen", label: "Deepen", blurb: "Guidance from a practitioner" },
];

export type Theme = { slug: string; label: string; blurb: string; keywords: string[] };

export type ThemeLink = {
  id: string;
  lane: Lane;
  target_kind: string;
  target_ref: string;
  note: string | null;
};

export async function fetchThemes(): Promise<Theme[]> {
  const { data } = await supabase
    .from("themes")
    .select("slug, label, blurb, keywords")
    .eq("active", true)
    .order("sort_order");
  return (data ?? []) as Theme[];
}

export async function fetchTheme(slug: string): Promise<Theme | null> {
  const { data } = await supabase
    .from("themes")
    .select("slug, label, blurb, keywords")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Theme) ?? null;
}

export async function fetchThemeLinks(slug: string): Promise<ThemeLink[]> {
  const { data } = await supabase
    .from("theme_links")
    .select("id, lane, target_kind, target_ref, note")
    .eq("theme_slug", slug)
    .order("sort_order");
  return (data ?? []) as ThemeLink[];
}

export type ThemeLanes = {
  posts: { id: string; content: string; topic: string | null; author_id: string }[];
  practices: { id: string; slug: string; title: string; tradition: string | null }[];
  people: { id: string; username: string; display_name: string; avatar_url: string | null }[];
  episodes: { id: string; title: string; scheduled_at: string | null }[];
  practitioners: { id: string; slug: string; display_name: string; headline: string }[];
};

/** Everything a theme touches, drawn from what already exists on EKA. */
export async function fetchThemeLanes(theme: Theme): Promise<ThemeLanes> {
  const words = [theme.slug, theme.label.toLowerCase(), ...theme.keywords];
  const ilike = words.map((w) => `content.ilike.%${w}%`).join(",");

  const [posts, practices, people, episodes, practitioners] = await Promise.all([
    supabase
      .from("posts")
      .select("id, content, topic, author_id")
      .eq("status", "visible")
      .or(ilike)
      .limit(6),
    supabase
      .from("practices")
      .select("id, slug, title, tradition")
      .or(words.map((w) => `title.ilike.%${w}%`).join(","))
      .limit(6),
    supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, interests")
      .overlaps("interests", words)
      .limit(8),
    supabase
      .from("episodes")
      .select("id, title, scheduled_at")
      .eq("published", true)
      .or(words.map((w) => `title.ilike.%${w}%`).join(","))
      .limit(5),
    supabase
      .from("practitioners")
      .select("id, slug, display_name, headline, categories")
      .eq("status", "active")
      .limit(20),
  ]);

  const matching = (practitioners.data ?? []).filter((p) =>
    words.some(
      (w) =>
        (p.headline ?? "").toLowerCase().includes(w) ||
        (p.categories ?? []).some((c: string) => c.toLowerCase().includes(w)),
    ),
  );

  return {
    posts: (posts.data ?? []) as ThemeLanes["posts"],
    practices: (practices.data ?? []) as ThemeLanes["practices"],
    people: (people.data ?? []) as ThemeLanes["people"],
    episodes: (episodes.data ?? []) as ThemeLanes["episodes"],
    practitioners: matching.slice(0, 5) as ThemeLanes["practitioners"],
  };
}
