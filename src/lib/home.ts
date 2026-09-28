import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";

/** A circle gathering that has not happened yet, from a circle the member belongs to. */
export type UpcomingCircle = {
  id: string;
  title: string;
  kind: string;
  starts_at: string;
  community_id: string;
  community_name: string;
  community_slug: string;
};

export async function fetchUpcomingCircles(): Promise<UpcomingCircle[]> {
  const uid = await currentUserId();
  if (!uid) return [];

  const { data: memberships } = await supabase
    .from("community_members")
    .select("community_id")
    .eq("user_id", uid);

  const ids = (memberships ?? []).map((m) => m.community_id);
  if (ids.length === 0) return [];

  const { data } = await supabase
    .from("circle_activities")
    .select("id, title, kind, starts_at, community_id, closed, communities(name, slug)")
    .in("community_id", ids)
    .eq("closed", false)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(3);

  return (data ?? [])
    .filter((a) => a.starts_at)
    .map((a) => ({
      id: a.id,
      title: a.title,
      kind: a.kind,
      starts_at: a.starts_at as string,
      community_id: a.community_id,
      community_name: (a.communities as { name: string } | null)?.name ?? "Circle",
      community_slug: (a.communities as { slug: string } | null)?.slug ?? "",
    }));
}

/** Circles worth joining when the member has none yet. */
export async function fetchSuggestedCircles() {
  const { data } = await supabase
    .from("communities")
    .select("id, slug, name, category, member_count")
    .order("member_count", { ascending: false })
    .limit(3);
  return data ?? [];
}

/** Rotating wisdom line, stable for the whole day. */
const WISDOM = [
  { line: "The quieter you become, the more you can hear.", source: "Ram Dass" },
  { line: "What you seek is seeking you.", source: "Rumi" },
  { line: "Be still, and know.", source: "Psalm 46" },
  { line: "No mud, no lotus.", source: "Thich Nhat Hanh" },
  { line: "The wound is the place where the light enters you.", source: "Rumi" },
  { line: "You are what your deep, driving desire is.", source: "Brihadaranyaka Upanishad" },
  { line: "Do not speak unless it improves on silence.", source: "Zen saying" },
] as const;

export function wisdomForToday(date = new Date()) {
  const seed = Math.floor(date.getTime() / 86_400_000);
  return WISDOM[seed % WISDOM.length]!;
}

export function greetingFor(date = new Date()) {
  const h = date.getHours();
  if (h < 5) return "Still awake";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

/* --- Personalisation ------------------------------------------------------ */

/** Wisdom lines tagged by tradition so EKA Today can echo the member's own path. */
const TRADITION_WISDOM: Record<string, { line: string; source: string }[]> = {
  hindu: [
    { line: "You are what your deep, driving desire is.", source: "Brihadaranyaka Upanishad" },
    { line: "Yoga is the stilling of the movements of the mind.", source: "Patanjali" },
  ],
  buddhist: [
    { line: "No mud, no lotus.", source: "Thich Nhat Hanh" },
    { line: "Nothing whatsoever should be clung to.", source: "The Buddha" },
  ],
  muslim: [
    { line: "What you seek is seeking you.", source: "Rumi" },
    { line: "The wound is the place where the light enters you.", source: "Rumi" },
  ],
  islamic: [
    { line: "What you seek is seeking you.", source: "Rumi" },
    { line: "Hearts find rest in remembrance.", source: "Qur'an 13:28" },
  ],
  christian: [
    { line: "Be still, and know.", source: "Psalm 46" },
    { line: "The light shines in the darkness.", source: "John 1:5" },
  ],
  sikh: [
    { line: "The one who conquers the mind conquers the world.", source: "Guru Nanak" },
    { line: "Truth is high, but higher still is truthful living.", source: "Guru Granth Sahib" },
  ],
  jain: [
    { line: "Live and let live.", source: "Jain precept" },
    { line: "The soul is the maker of its own state.", source: "Acharanga Sutra" },
  ],
  jewish: [
    { line: "You are not obliged to finish the work.", source: "Pirkei Avot" },
    { line: "In the beginning, there was a voice over the deep.", source: "Genesis" },
  ],
  taoist: [
    { line: "Nature does not hurry, yet everything is accomplished.", source: "Lao Tzu" },
    { line: "Muddy water is best cleared by leaving it alone.", source: "Alan Watts" },
  ],
  secular: [
    { line: "Attention is the rarest and purest form of generosity.", source: "Simone Weil" },
    { line: "Do not speak unless it improves on silence.", source: "Zen saying" },
  ],
};

/** Wisdom lines nudged toward practices the member said they care about. */
const INTEREST_WISDOM: Record<string, { line: string; source: string }> = {
  meditation: { line: "The quieter you become, the more you can hear.", source: "Ram Dass" },
  silence: { line: "Silence is the language of God.", source: "Rumi" },
  service: { line: "The best among you are those who serve.", source: "Prophetic saying" },
  gratitude: { line: "Gratitude turns what we have into enough.", source: "Meister Eckhart" },
  grief: { line: "Grief is love with nowhere to go.", source: "Jamie Anderson" },
  scripture: { line: "Read one page twice, and it will read you.", source: "Study maxim" },
};

/**
 * Today's line, chosen from the member's own tradition and interests when known.
 * Still stable for the whole day so the page does not shuffle on every render.
 */
export function wisdomForProfile(
  profile: { religion?: string | null; interests?: string[] | null } | null | undefined,
  date = new Date(),
) {
  const seed = Math.floor(date.getTime() / 86_400_000);
  const pool: { line: string; source: string }[] = [];

  const religion = (profile?.religion ?? "").toLowerCase().trim();
  for (const [key, lines] of Object.entries(TRADITION_WISDOM)) {
    if (religion && (religion.includes(key) || key.includes(religion))) pool.push(...lines);
  }
  for (const interest of profile?.interests ?? []) {
    const match = INTEREST_WISDOM[interest.toLowerCase().trim()];
    if (match) pool.push(match);
  }

  if (pool.length === 0) return wisdomForToday(date);
  return pool[seed % pool.length]!;
}

const norm = (s: string) => s.toLowerCase().trim();

/** Explore topics ordered by how closely they match the member's faith and interests. */
export function rankTopicsForProfile<
  T extends { title: string; tradition: string; kind?: string; summary?: string },
>(
  topics: T[],
  profile: { religion?: string | null; interests?: string[] | null } | null | undefined,
) {
  const religion = norm(profile?.religion ?? "");
  const interests = (profile?.interests ?? []).map(norm).filter(Boolean);
  if (!religion && interests.length === 0) return topics;

  const score = (t: T) => {
    const tradition = norm(t.tradition);
    const haystack = norm(`${t.title} ${t.tradition} ${t.kind ?? ""} ${t.summary ?? ""}`);
    let n = 0;
    if (religion && (tradition.includes(religion) || religion.includes(tradition))) n += 3;
    for (const i of interests) if (i.length > 2 && haystack.includes(i)) n += 2;
    return n;
  };

  return [...topics]
    .map((t, i) => ({ t, i, s: score(t) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map((x) => x.t);
}

/** Topics the member has actually been writing about lately. */
export async function fetchRecentTopics(): Promise<string[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("posts")
    .select("topic, created_at")
    .eq("author_id", uid)
    .not("topic", "is", null)
    .order("created_at", { ascending: false })
    .limit(20);
  const seen = new Set<string>();
  for (const row of data ?? []) {
    const topic = (row.topic ?? "").trim();
    if (topic) seen.add(topic);
  }
  return [...seen].slice(0, 4);
}

/**
 * Circles worth joining, weighted by the member's faith, saved interests and the
 * topics from their recent posts — with popular circles as the fallback tail.
 */
export async function fetchPersonalCircles(
  profile: { religion?: string | null; interests?: string[] | null } | null | undefined,
  recentTopics: string[] = [],
) {
  const { data } = await supabase
    .from("communities")
    .select("id, slug, name, category, description, member_count")
    .order("member_count", { ascending: false })
    .limit(40);

  const rows = data ?? [];
  const religion = norm(profile?.religion ?? "");
  const signals = [...(profile?.interests ?? []), ...recentTopics]
    .map(norm)
    .filter((s) => s.length > 2);

  const score = (c: (typeof rows)[number]) => {
    const haystack = norm(`${c.name} ${c.category ?? ""} ${c.description ?? ""}`);
    let n = 0;
    if (religion && haystack.includes(religion)) n += 3;
    for (const s of signals) if (haystack.includes(s)) n += 2;
    return n;
  };

  return rows
    .map((c, i) => ({ c, i, s: score(c) }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, 3)
    .map((x) => ({ ...x.c, matched: x.s > 0 }));
}
