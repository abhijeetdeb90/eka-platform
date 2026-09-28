import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

/**
 * The pre-login questionnaire. Answers live on the device until an account
 * exists, then move onto the profile once and are cleared. Nothing here gates
 * access, and the optional context fields never reach moderation.
 */

export const STANDARDS_VERSION = "2026-09-v1";

const STORAGE_KEY = "eka.join.progress";

export const AGE_BRACKETS = ["18–24", "25–34", "35–44", "45–54", "55+"] as const;

export const LANGUAGES = [
  "English",
  "हिन्दी",
  "বাংলা",
  "தமிழ்",
  "मराठी",
  "ગુજરાતી",
  "Español",
  "Français",
  "العربية",
  "Other",
] as const;

export const PURPOSES = [
  { key: "learn", label: "Learn", note: "Understand traditions other than my own" },
  { key: "discuss", label: "Discuss ideas", note: "Thoughtful conversation, not argument" },
  { key: "meet", label: "Meet people", note: "Find others walking a similar path" },
  { key: "build", label: "Build community", note: "Host circles and gatherings" },
  { key: "share", label: "Share knowledge", note: "Teach what I have been taught" },
  { key: "other", label: "Other", note: "Tell us in your own words" },
] as const;

/** Offered as suggestions only. Anyone can type their own, or say nothing. */
export const PATHS = [
  "Hinduism",
  "Buddhism",
  "Islam",
  "Christianity",
  "Sikhism",
  "Jainism",
  "Judaism",
  "Indigenous / folk traditions",
  "Spiritual, not religious",
  "Agnostic / atheist",
  "Still exploring",
] as const;

export const PREFER_NOT_TO_SAY = "Prefer not to say";

export type JoinAnswers = {
  step: number;
  name: string;
  ageBracket: string;
  region: string;
  language: string;
  photoDataUrl: string | null;
  religion: string;
  communityBackground: string;
  purposes: string[];
  purposeOther: string;
  standardsAccepted: boolean;
  termsAccepted: boolean;
  ageConfirmed: boolean;
  marketingOptIn: boolean;
  acceptedAt: string | null;
};

export const emptyAnswers: JoinAnswers = {
  step: 0,
  name: "",
  ageBracket: "",
  region: "",
  language: "",
  photoDataUrl: null,
  religion: "",
  communityBackground: "",
  purposes: [],
  purposeOther: "",
  standardsAccepted: false,
  termsAccepted: false,
  ageConfirmed: false,
  marketingOptIn: false,
  acceptedAt: null,
};

export const step1Schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter at least two characters.")
    .max(60, "Keep it under 60 characters."),
  ageBracket: z.string().trim().min(1, "Choose an age bracket."),
  region: z.string().trim().min(2, "Where are you joining from?").max(60),
  language: z.string().trim().min(1, "Choose a language."),
});

export const step3Schema = z.object({
  purposes: z.array(z.string()).min(1, "Choose at least one."),
  purposeOther: z.string().trim().max(140, "Keep it under 140 characters."),
});

export const step4Schema = z.object({
  standardsAccepted: z.literal(true, {
    message: "You need to agree to the Community Standards to continue.",
  }),
  termsAccepted: z.literal(true, {
    message: "You need to accept the Terms & Conditions and Privacy Policy.",
  }),
  ageConfirmed: z.literal(true, {
    message:
      "You must confirm you are at least 18 years of age (or have parental/guardian consent).",
  }),
  marketingOptIn: z.boolean().optional(),
});

export function loadAnswers(): JoinAnswers {
  if (typeof window === "undefined") return emptyAnswers;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAnswers;
    return { ...emptyAnswers, ...(JSON.parse(raw) as Partial<JoinAnswers>) };
  } catch {
    return emptyAnswers;
  }
}

export function saveAnswers(answers: JoinAnswers) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    /* a full storage quota must never block signing up */
  }
}

export function clearAnswers() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/** True once someone has completed the questionnaire and agreed to the standards. */
export function hasAgreed(): boolean {
  return loadAnswers().standardsAccepted;
}

function dataUrlToBlob(dataUrl: string): Blob | null {
  const [head, body] = dataUrl.split(",");
  if (!head || !body) return null;
  const type = /data:(.*?);/.exec(head)?.[1] ?? "image/jpeg";
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type });
}

async function uploadPhoto(userId: string, dataUrl: string): Promise<string | null> {
  const blob = dataUrlToBlob(dataUrl);
  if (!blob) return null;
  const path = `${userId}/avatar-${Date.now()}.jpg`;
  const { error } = await supabase.storage.from("post-media").upload(path, blob, { upsert: true });
  if (error) return null;
  const { data } = await supabase.storage
    .from("post-media")
    .createSignedUrl(path, 60 * 60 * 24 * 365);
  return data?.signedUrl ?? null;
}

/**
 * Move questionnaire answers onto the freshly created profile. Runs once, is
 * safe to call on every mount, and never overwrites something already set.
 */
export async function applyJoinAnswers(): Promise<boolean> {
  const answers = loadAnswers();
  if (!answers.standardsAccepted) return false;

  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, standards_accepted_at")
    .eq("id", uid)
    .maybeSingle();

  const purposes =
    answers.purposes.includes("other") && answers.purposeOther.trim()
      ? [...answers.purposes.filter((p) => p !== "other"), `other:${answers.purposeOther.trim()}`]
      : answers.purposes;

  const patch: {
    age_bracket: string | null;
    region: string | null;
    language: string | null;
    religion: string | null;
    community_background: string | null;
    purposes: string[];
    standards_version: string;
    standards_accepted_at: string;
    display_name?: string;
    avatar_url?: string;
  } = {
    age_bracket: answers.ageBracket || null,
    region: answers.region || null,
    language: answers.language || null,
    religion: answers.religion && answers.religion !== PREFER_NOT_TO_SAY ? answers.religion : null,
    community_background:
      answers.communityBackground && answers.communityBackground !== PREFER_NOT_TO_SAY
        ? answers.communityBackground
        : null,
    purposes,
    standards_version: STANDARDS_VERSION,
    standards_accepted_at:
      profile?.standards_accepted_at ?? answers.acceptedAt ?? new Date().toISOString(),
  };

  if (answers.name && !profile?.display_name) patch.display_name = answers.name;

  if (answers.photoDataUrl && !profile?.avatar_url) {
    const url = await uploadPhoto(uid, answers.photoDataUrl);
    if (url) patch.avatar_url = url;
  }

  const { error } = await supabase.from("profiles").update(patch).eq("id", uid);
  if (error) return false;

  clearAnswers();
  return true;
}
