import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";
import { formatINR } from "@/lib/billing";
import { checkout, PLATFORM_FEE_PERCENT } from "@/lib/pay";

export { formatINR, PLATFORM_FEE_PERCENT };

/**
 * EKA is not a shop. It is a way to meet people who can guide a practice.
 * Everything here is written from that side: the practitioner names the payout
 * they want, and the seeker sees the whole arithmetic before paying.
 */

export type MarketCategory = {
  slug: string;
  label: string;
  glyph: string;
  blurb: string;
};

export const MARKET_CATEGORIES: MarketCategory[] = [
  {
    slug: "living-crafts",
    label: "Master Crafts & Artisans",
    glyph: "🏺",
    blurb: "Handloom, metalwork, woodcarving & indigenous arts",
  },
  {
    slug: "cultural-consultation",
    label: "Cultural Heritage & Lineage",
    glyph: "📜",
    blurb: "One-on-one inquiry into history, rituals, and regional traditions",
  },
  {
    slug: "culinary-traditions",
    label: "Foodways & Ancestral Gastronomy",
    glyph: "🌾",
    blurb: "Ancient fermentation, heritage grains, and culinary rituals",
  },
  {
    slug: "oral-traditions",
    label: "Oral Epics & Sacred Music",
    glyph: "🪕",
    blurb: "Chants, folk epics, living ballads, and classical traditions",
  },
  {
    slug: "sacred-geography",
    label: "Sacred Geography & Architecture",
    glyph: "🏛️",
    blurb: "Monastic sanctuaries, pilgrimage routes, and temple science",
  },
  {
    slug: "contemplative-practice",
    label: "Contemplative Wisdom & Silence",
    glyph: "🕯️",
    blurb: "Monastic contemplation, breathwork, Zen, and Advaita guidance",
  },
  {
    slug: "rituals",
    label: "Rituals & Seasonal Ceremonies",
    glyph: "✨",
    blurb: "Marking life thresholds, solstices, and harvest observances",
  },
  {
    slug: "languages-manuscripts",
    label: "Classical Languages & Philosophy",
    glyph: "📚",
    blurb: "Study with scholars in primary languages and classical texts",
  },
  {
    slug: "yoga",
    label: "Traditional Yoga & Embodied Arts",
    glyph: "🧘",
    blurb: "Root lineage asana, pranayama, and somatic philosophy",
  },
  {
    slug: "astrology",
    label: "Traditional Cosmologies",
    glyph: "🔭",
    blurb: "Ancient astronomical calendars and reflective chart reading",
  },
];

export const CATEGORY_LABEL = Object.fromEntries(MARKET_CATEGORIES.map((c) => [c.slug, c.label]));

export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "rating", label: "Highest rated" },
  { value: "experience", label: "Most experienced" },
  { value: "price", label: "Price: low to high" },
  { value: "new", label: "New practitioners" },
] as const;
export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export type Practitioner = {
  id: string;
  user_id: string | null;
  slug: string;
  display_name: string;
  headline: string;
  about: string;
  avatar_url: string | null;
  categories: string[];
  traditions: string[];
  expertise: string[];
  languages: string[];
  mode: string;
  location: string | null;
  years_experience: number;
  status: string;
  identity_verified: boolean;
  credentials_verified: boolean;
  experience_verified: boolean;
  standards_accepted: boolean;
  eka_recommended: boolean;
  rating: number;
  review_count: number;
  session_count: number;
  created_at: string;
};

export type Package = {
  id: string;
  practitioner_id: string;
  title: string;
  description: string;
  duration_minutes: number;
  sessions_count: number;
  payout_cents: number;
  price_cents: number;
  active: boolean;
  sort_order: number;
};

export type Slot = { id: string; practitioner_id: string; starts_at: string; booked: boolean };

export type Booking = {
  id: string;
  seeker_id: string;
  practitioner_id: string;
  package_id: string | null;
  slot_id: string | null;
  package_title: string;
  duration_minutes: number;
  starts_at: string | null;
  price_cents: number;
  fee_cents: number;
  payout_cents: number;
  status: string;
  join_url: string | null;
  created_at: string;
};

export type Review = {
  id: string;
  booking_id: string;
  practitioner_id: string;
  reviewer_id: string;
  rating: number;
  body: string;
  created_at: string;
};

const PRACTITIONER_COLUMNS =
  "id, user_id, slug, display_name, headline, about, avatar_url, categories, traditions, expertise, languages, mode, location, years_experience, status, identity_verified, credentials_verified, experience_verified, standards_accepted, eka_recommended, rating, review_count, session_count, created_at";

const PACKAGE_COLUMNS =
  "id, practitioner_id, title, description, duration_minutes, sessions_count, payout_cents, price_cents, active, sort_order";

const BOOKING_COLUMNS =
  "id, seeker_id, practitioner_id, package_id, slot_id, package_title, duration_minutes, starts_at, price_cents, fee_cents, payout_cents, status, join_url, created_at";

/* ------------------------------------------------------------------ pricing */

/**
 * The practitioner names what they receive; EKA's 10% sits on top and is shown
 * at checkout. Nobody is ever told afterwards that ₹1,000 became ₹900.
 */
export function priceForPayout(payoutCents: number) {
  const { creator, fee, total } = checkout(payoutCents, "added");
  return { price: total, fee, payout: creator };
}

/**
 * What a seeker pays for a package. Legacy rows stored a grossed-up price with
 * the payout beside it; both shapes resolve to the same three numbers.
 */
export function splitPrice(priceCents: number, payoutCents?: number | null) {
  if (payoutCents && payoutCents > 0) {
    const fee = Math.round((payoutCents * PLATFORM_FEE_PERCENT) / 100);
    return { price: payoutCents + fee, fee, payout: payoutCents };
  }
  return priceForPayout(priceCents);
}

export function fromPrice(packages: Package[]) {
  const active = packages.filter((p) => p.active);
  if (!active.length) return null;
  return Math.min(...active.map((p) => p.price_cents));
}

/* ------------------------------------------------------------------- badges */

export type Badge = { label: string; tone: "verified" | "quiet" };

export function badgesFor(p: Practitioner): Badge[] {
  const badges: Badge[] = [];
  // "Eka Verified" is only shown when identity AND credentials were reviewed.
  if (p.identity_verified && p.credentials_verified)
    badges.push({ label: "Eka Verified", tone: "verified" });
  else if (p.credentials_verified) badges.push({ label: "Credential Verified", tone: "verified" });
  if (p.years_experience >= 10) badges.push({ label: "Experienced Practitioner", tone: "quiet" });
  if (p.rating >= 4.8 && p.review_count >= 20) badges.push({ label: "Top Rated", tone: "quiet" });
  if (p.eka_recommended) badges.push({ label: "Eka Recommended", tone: "quiet" });
  return badges;
}

export function isEkaVerified(p: Practitioner) {
  return p.identity_verified && p.credentials_verified;
}

export function authenticityChecks(p: Practitioner) {
  return [
    { label: "Identity verified", ok: p.identity_verified },
    { label: "Credentials reviewed", ok: p.credentials_verified },
    { label: "Experience verified", ok: p.experience_verified },
    { label: "Eka community reviews", ok: p.review_count > 0 },
    { label: "Marketplace standards accepted", ok: p.standards_accepted },
  ];
}

/* ------------------------------------------------------------------ queries */

export type MarketFilters = {
  q?: string;
  category?: string;
  verifiedOnly?: boolean;
  mode?: string;
  language?: string;
  minRating?: number;
  minExperience?: number;
  maxPrice?: number;
  tradition?: string;
  availableOnly?: boolean;
  availableIds?: Set<string>;
  sort?: SortKey;
};

/** Practitioners with at least one open slot ahead — used by the availability filter. */
export async function fetchAvailablePractitionerIds(): Promise<Set<string>> {
  const { data } = await supabase
    .from("practitioner_slots")
    .select("practitioner_id")
    .eq("booked", false)
    .gte("starts_at", new Date().toISOString());
  return new Set((data ?? []).map((r) => r.practitioner_id as string));
}

export async function fetchPractitioners(): Promise<Practitioner[]> {
  const { data } = await supabase
    .from("practitioners")
    .select(PRACTITIONER_COLUMNS)
    .eq("status", "active")
    .order("eka_recommended", { ascending: false })
    .order("rating", { ascending: false });
  return ((data ?? []) as Practitioner[]).map((p) => ({ ...p, rating: Number(p.rating) }));
}

export async function fetchAllPackages(): Promise<Package[]> {
  const { data } = await supabase
    .from("practitioner_packages")
    .select(PACKAGE_COLUMNS)
    .eq("active", true)
    .order("sort_order");
  return (data ?? []) as Package[];
}

export function applyFilters(
  people: Practitioner[],
  packagesByPractitioner: Record<string, Package[]>,
  f: MarketFilters,
): Practitioner[] {
  const q = (f.q ?? "").trim().toLowerCase();
  const filtered = people.filter((p) => {
    if (f.category && !p.categories.includes(f.category)) return false;
    if (f.verifiedOnly && !isEkaVerified(p)) return false;
    if (f.mode && f.mode !== "any" && p.mode !== f.mode && p.mode !== "both") return false;
    if (f.language && !p.languages.includes(f.language)) return false;
    if (f.tradition && !p.traditions.includes(f.tradition)) return false;
    if (f.availableOnly && !(f.availableIds?.has(p.id) ?? false)) return false;
    if (f.minRating && p.rating < f.minRating) return false;
    if (f.minExperience && p.years_experience < f.minExperience) return false;
    if (f.maxPrice) {
      const min = fromPrice(packagesByPractitioner[p.id] ?? []);
      if (min === null || min > f.maxPrice) return false;
    }
    if (q) {
      const hay = [
        p.display_name,
        p.headline,
        p.about,
        ...p.expertise,
        ...p.traditions,
        ...p.categories,
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const sorted = [...filtered];
  switch (f.sort) {
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "experience":
      sorted.sort((a, b) => b.years_experience - a.years_experience);
      break;
    case "price":
      sorted.sort(
        (a, b) =>
          (fromPrice(packagesByPractitioner[a.id] ?? []) ?? Infinity) -
          (fromPrice(packagesByPractitioner[b.id] ?? []) ?? Infinity),
      );
      break;
    case "new":
      sorted.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
      break;
    default:
      sorted.sort(
        (a, b) => Number(b.eka_recommended) - Number(a.eka_recommended) || b.rating - a.rating,
      );
  }
  return sorted;
}

export function groupPackages(packages: Package[]) {
  return packages.reduce<Record<string, Package[]>>((acc, p) => {
    (acc[p.practitioner_id] ??= []).push(p);
    return acc;
  }, {});
}

export async function fetchPractitioner(slug: string): Promise<Practitioner | null> {
  const { data } = await supabase
    .from("practitioners")
    .select(PRACTITIONER_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  return data ? ({ ...data, rating: Number((data as Practitioner).rating) } as Practitioner) : null;
}

export async function fetchPackages(practitionerId: string): Promise<Package[]> {
  const { data } = await supabase
    .from("practitioner_packages")
    .select(PACKAGE_COLUMNS)
    .eq("practitioner_id", practitionerId)
    .order("sort_order");
  return (data ?? []) as Package[];
}

export async function fetchSlots(practitionerId: string): Promise<Slot[]> {
  const { data } = await supabase
    .from("practitioner_slots")
    .select("id, practitioner_id, starts_at, booked")
    .eq("practitioner_id", practitionerId)
    .eq("booked", false)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at")
    .limit(30);
  return (data ?? []) as Slot[];
}

export async function fetchReviews(practitionerId: string): Promise<Review[]> {
  const { data } = await supabase
    .from("marketplace_reviews")
    .select("id, booking_id, practitioner_id, reviewer_id, rating, body, created_at")
    .eq("practitioner_id", practitionerId)
    .order("created_at", { ascending: false })
    .limit(20);
  return (data ?? []) as Review[];
}

/* ------------------------------------------------------------------ booking */

export async function bookPackage(input: {
  pkg: Package;
  slot: Slot | null;
  note?: string;
}): Promise<Booking | null> {
  const uid = await currentUserId();
  if (!uid) return null;
  const { price, fee, payout } = splitPrice(input.pkg.price_cents, input.pkg.payout_cents);

  const { data, error } = await supabase
    .from("marketplace_bookings")
    .insert({
      seeker_id: uid,
      practitioner_id: input.pkg.practitioner_id,
      package_id: input.pkg.id,
      slot_id: input.slot?.id ?? null,
      package_title: input.pkg.title,
      duration_minutes: input.pkg.duration_minutes,
      starts_at: input.slot?.starts_at ?? null,
      price_cents: price,
      fee_cents: fee,
      payout_cents: payout,
      status: "confirmed",
      join_url: "https://meet.eka.app/session",
      note: input.note ?? null,
    })
    .select(BOOKING_COLUMNS)
    .maybeSingle();
  if (error || !data) return null;

  if (input.slot)
    await supabase.from("practitioner_slots").update({ booked: true }).eq("id", input.slot.id);

  // Ledger first: the seeker's payment and the practitioner's payout are rows.
  await supabase.from("wallet_transactions").insert({
    user_id: uid,
    kind: "purchase",
    amount_cents: price,
    fee_cents: fee,
    reference_kind: "booking",
    reference_id: data.id,
    status: "settled",
    note: `${input.pkg.title} — test payment path`,
  });

  return data as Booking;
}

export async function fetchBooking(id: string): Promise<Booking | null> {
  const { data } = await supabase
    .from("marketplace_bookings")
    .select(BOOKING_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  return (data as Booking) ?? null;
}

export async function fetchMyBookings(): Promise<Booking[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("marketplace_bookings")
    .select(BOOKING_COLUMNS)
    .eq("seeker_id", uid)
    .order("created_at", { ascending: false });
  return (data ?? []) as Booking[];
}

export async function markBookingComplete(id: string) {
  await supabase.from("marketplace_bookings").update({ status: "completed" }).eq("id", id);
}

export async function leaveReview(booking: Booking, rating: number, body: string) {
  const uid = await currentUserId();
  if (!uid) return { error: "Not signed in" };
  const { error } = await supabase.from("marketplace_reviews").insert({
    booking_id: booking.id,
    practitioner_id: booking.practitioner_id,
    reviewer_id: uid,
    rating,
    body,
  });
  return { error: error?.message ?? null };
}

export async function fetchReviewForBooking(bookingId: string): Promise<Review | null> {
  const { data } = await supabase
    .from("marketplace_reviews")
    .select("id, booking_id, practitioner_id, reviewer_id, rating, body, created_at")
    .eq("booking_id", bookingId)
    .maybeSingle();
  return (data as Review) ?? null;
}

/* ------------------------------------------------------- practitioner side */

export async function fetchMyPractitioner(): Promise<Practitioner | null> {
  const uid = await currentUserId();
  if (!uid) return null;
  const { data } = await supabase
    .from("practitioners")
    .select(PRACTITIONER_COLUMNS)
    .eq("user_id", uid)
    .maybeSingle();
  return data ? ({ ...data, rating: Number((data as Practitioner).rating) } as Practitioner) : null;
}

export async function createMyPractitioner(input: {
  display_name: string;
  headline: string;
  about: string;
  categories: string[];
  years_experience: number;
}) {
  const uid = await currentUserId();
  if (!uid) return { error: "Not signed in" };
  const slug = `${input.display_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${uid.slice(0, 6)}`;
  const { error } = await supabase.from("practitioners").insert({
    user_id: uid,
    slug,
    display_name: input.display_name,
    headline: input.headline,
    about: input.about,
    categories: input.categories,
    years_experience: input.years_experience,
    standards_accepted: true,
    status: "active",
  });
  return { error: error?.message ?? null };
}

export async function createPackage(
  practitionerId: string,
  input: {
    title: string;
    description: string;
    duration_minutes: number;
    payout_cents: number;
    sessions_count: number;
  },
) {
  const { price } = priceForPayout(input.payout_cents);
  const { error } = await supabase.from("practitioner_packages").insert({
    practitioner_id: practitionerId,
    title: input.title,
    description: input.description,
    duration_minutes: input.duration_minutes,
    sessions_count: input.sessions_count,
    payout_cents: input.payout_cents,
    price_cents: price,
  });
  return { error: error?.message ?? null };
}

export async function addSlot(practitionerId: string, startsAt: string) {
  const { error } = await supabase
    .from("practitioner_slots")
    .insert({ practitioner_id: practitionerId, starts_at: startsAt });
  return { error: error?.message ?? null };
}

export async function fetchPractitionerBookings(practitionerId: string): Promise<Booking[]> {
  const { data } = await supabase
    .from("marketplace_bookings")
    .select(BOOKING_COLUMNS)
    .eq("practitioner_id", practitionerId)
    .order("created_at", { ascending: false });
  return (data ?? []) as Booking[];
}

export function monthSummary(bookings: Booking[]) {
  const now = new Date();
  const mine = bookings.filter((b) => {
    const d = new Date(b.created_at);
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear() &&
      b.status !== "cancelled"
    );
  });
  const gross = mine.reduce((s, b) => s + b.price_cents, 0);
  const fee = mine.reduce((s, b) => s + b.fee_cents, 0);
  return { sessions: mine.length, gross, fee, net: gross - fee };
}

export function formatSlot(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
