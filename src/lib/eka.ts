export const BRAND = {
  name: "EKA",
  tagline: "One Within. One With All.",
  positioning: "The Social Network for Your Inner Life.",
  secondary: "Connect. Explore. Practice. Belong.",
} as const;

export const INTENTIONS = [
  "Peace",
  "Purpose",
  "Knowledge",
  "Devotion",
  "Self-discovery",
  "Connection",
  "Discipline",
  "Curiosity",
  "Spiritual growth",
] as const;

export const INTERESTS = [
  "Meditation",
  "Yoga",
  "Prayer",
  "Mantra",
  "Breathwork",
  "Philosophy",
  "Vedanta",
  "Buddhism",
  "Sikh wisdom",
  "Christianity",
  "Islam",
  "Jain philosophy",
  "Hindu traditions",
  "Mindfulness",
  "Consciousness",
  "Self-development",
  "Spirituality",
] as const;

export const ACCOUNT_TYPES = ["personal", "creator", "organisation"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const POST_TYPES = [
  { value: "reflection", label: "Reflection", hint: "What I'm thinking about today." },
  { value: "practice", label: "Practice", hint: "Today's spiritual practice." },
  { value: "question", label: "Question", hint: "Ask the community." },
  { value: "wisdom", label: "Wisdom", hint: "A quote, teaching or insight." },
  { value: "experience", label: "Experience", hint: "Something you lived through." },
  { value: "discussion", label: "Discussion", hint: "A longer conversation." },
] as const;

export type PostType = (typeof POST_TYPES)[number]["value"];

export function postTypeLabel(value: string) {
  return POST_TYPES.find((t) => t.value === value)?.label ?? "Reflection";
}

export function initials(name?: string | null) {
  if (!name) return "E";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d`;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export const PLUS = {
  price: "₹99",
  cadence: "month",
  pitch: "A deeper EKA experience for people who want to go further within.",
  benefits: [
    "Ad-free, quieter feed",
    "Advanced profile",
    "Personal journal",
    "Saved collections",
    "Practice tracking",
    "Exclusive community features",
    "Personalised recommendations",
    "EKA Plus badge",
  ],
} as const;
