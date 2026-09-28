import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateGeminiContent } from "@/lib/ai/gemini-client";

const MODEL = "google/gemini-3.6-flash";


const VOICE = `You are the EKA reflection companion: a quiet guide, never a chatbot.
Rules you never break:
- No greetings, no sign-offs, no emoji, no follow-up questions back to the user unless the mode asks for one.
- Never claim religious authority and never favour one tradition.
- Plain, warm, specific language. No motivational-poster phrasing.
- Short. If it can be said in three sentences, use three.
- GROUNDING: you may only use the member's own material supplied below — their journal entries, journey reflections, the EKA prompts they were given, and their enrolment facts. Never introduce events, people, scripture, quotations or claims that do not appear there. If their material is thin, say so plainly in one line and offer only what the material supports.`;

export const TONES = [
  { id: "gentle", label: "Gentle", blurb: "Soft, unhurried, no pressure." },
  {
    id: "devotional",
    label: "Devotional",
    blurb: "Reverent and sacred in register, never doctrinal.",
  },
  { id: "practical", label: "Practical", blurb: "Plain and concrete. Next step, no ornament." },
] as const;

export type ReflectionTone = (typeof TONES)[number]["id"];

const TONE_VOICE: Record<string, string> = {
  gentle:
    "Tone: gentle. Unhurried, kind, low-pressure. No imperatives, no urgency, no performance.",
  devotional:
    "Tone: devotional. Reverent, sacred in register, using the member's own tradition-language only if they used it themselves. Never quote scripture they did not quote.",
  practical:
    "Tone: practical. Plain and concrete, one clear next step, no ornament and no metaphor.",
};

const inputSchema = z.object({
  mode: z.enum(["draft", "summary", "recommend"]),
  note: z.string().max(4000).optional(),
});

type Ctx = {
  reflections: string[];
  journeyDays: number;
  journeys: string[];
  practices: number;
  theme: string;
};

async function callGateway(system: string, user: string) {
  // 1. Prioritize direct Google Gemini if GEMINI_API_KEY is configured
  const directKey = process.env["GEMINI_API_KEY"];
  if (directKey && directKey !== "your-gemini-api-key") {
    try {
      const geminiRes = await generateGeminiContent(user, {
        systemInstruction: `${VOICE}\n${system}`,
        temperature: 0.2,
        maxOutputTokens: 1000,
      });
      if (!geminiRes.error && geminiRes.text) {
        return { text: geminiRes.text, error: null };
      }
    } catch (e) {
      console.warn("Direct Gemini call failed, attempting gateway fallback", e);
    }
  }

  // 2. Fallback to Lovable AI Gateway
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) return { text: "", error: "The companion is not available right now." };

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: `${VOICE}\n${system}` },
          { role: "user", content: user },
        ],
      }),
    });
    if (res.status === 429)
      return { text: "", error: "The companion is resting. Try again in a moment." };
    if (res.status === 402)
      return { text: "", error: "The companion is unavailable until AI credits are topped up." };
    if (!res.ok) {
      console.error("AI gateway error", res.status, await res.text());
      return { text: "", error: "The companion could not answer just now." };
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return {
      text: json.choices?.[0]?.message?.content?.trim() ?? "",
      error: null as string | null,
    };
  } catch (error) {
    console.error("AI gateway failure", error);
    return { text: "", error: "The companion could not answer just now." };
  }
}

/**
 * One quiet companion with three narrow jobs: help start a reflection,
 * summarise what has changed, and suggest what to practise next.
 */
export const companion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("reflection_tone")
      .eq("id", userId)
      .maybeSingle();
    const tone = (profile as { reflection_tone?: string } | null)?.reflection_tone ?? "gentle";

    const [journal, logs, enrollments, practices] = await Promise.all([
      supabase
        .from("journal_entries")
        .select("content, mood, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("journey_day_logs")
        .select("day_number, reflection, completed_on")
        .eq("user_id", userId)
        .order("completed_on", { ascending: false })
        .limit(14),
      supabase
        .from("journey_enrollments")
        .select("journeys(title, theme, promise)")
        .eq("user_id", userId)
        .is("completed_at", null)
        .limit(3),
      supabase
        .from("practice_completions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);

    const ctx: Ctx = {
      reflections: [
        ...(journal.data ?? []).map((j) => String(j.content)),
        ...(logs.data ?? []).map((l) => String(l.reflection ?? "")),
      ]
        .filter(Boolean)
        .slice(0, 12),
      journeyDays: logs.data?.length ?? 0,
      journeys: ((enrollments.data ?? []) as unknown as { journeys: { title: string } | null }[])
        .map((e) => e.journeys?.title)
        .filter((t): t is string => Boolean(t)),
      practices: practices.count ?? 0,
      theme: new Date().toLocaleString("en", { month: "long" }),
    };

    const profileLine = `Their active journeys: ${ctx.journeys.join(", ") || "none yet"}. Journey days logged: ${ctx.journeyDays}. Practices completed: ${ctx.practices}.`;
    const recent = ctx.reflections.length
      ? `Their recent reflections, newest first:\n${ctx.reflections.map((r) => `- ${r.slice(0, 400)}`).join("\n")}`
      : "They have not written any reflections yet.";

    let system = "";
    let user = "";
    if (data.mode === "draft") {
      system =
        "Offer an opening for today's reflection: two or three sentences in the member's own register, written in first person as a starting draft they will edit. End mid-thought so they finish it. Never invent events they did not mention.";
      user = `${profileLine}\n${recent}\n\nWhat they typed so far (may be empty): ${data.note ?? ""}`;
    } else if (data.mode === "summary") {
      system =
        "Summarise what has actually changed across their reflections. Name concrete shifts and one thing that has not moved. Maximum 120 words. No praise inflation.";
      user = `${profileLine}\n${recent}`;
    } else {
      system =
        "Recommend the next EKA Daily prompt and, if useful, one journey. Give exactly two short lines: 'Tomorrow: …' and 'Because: …'. Ground the reason in their own words.";
      user = `${profileLine}\n${recent}\nCurrent month: ${ctx.theme}.`;
    }

    const grounding =
      "Everything you may draw on is below. It is the member's own writing and their own EKA prompts. Use nothing else.";
    const { text, error } = await callGateway(
      `${TONE_VOICE[tone] ?? TONE_VOICE["gentle"]}\n${system}\n${grounding}`,
      user,
    );
    if (text) {
      await supabase
        .from("ai_insights")
        .insert({ user_id: userId, kind: data.mode, content: text });
    }
    return { text, error };
  });

/* --------------------------------------------------------- wisdom navigator ---
 * Suggests what to explore next from the member's own passport and the trust
 * graph. Every suggestion carries a reason, and a person is always one tap away.
 * -------------------------------------------------------------------------- */

export type NavigatorGuide = {
  slug: string;
  name: string;
  headline: string | null;
  traditions: string[];
  verified: boolean;
  recommended: boolean;
  rating: number;
  reviews: number;
};

export const navigator = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [passportRes, themesRes, guidesRes, journeysRes] = await Promise.all([
      supabase.rpc("my_wisdom_passport"),
      supabase.from("themes").select("label, blurb").eq("active", true).limit(16),
      supabase
        .from("practitioners")
        .select(
          "slug, display_name, headline, traditions, identity_verified, eka_recommended, rating, review_count",
        )
        .eq("status", "approved")
        .order("eka_recommended", { ascending: false })
        .order("rating", { ascending: false })
        .limit(6),
      supabase.from("journeys").select("title, theme").limit(12),
    ]);

    const passport = (passportRes.data ?? null) as null | {
      practices?: number;
      traditions?: string[];
      journey_list?: { title: string; completed: boolean }[];
      reflections?: number;
      circles?: number;
      sessions?: number;
    };

    const guides: NavigatorGuide[] = ((guidesRes.data ?? []) as Record<string, unknown>[]).map(
      (g) => ({
        slug: String(g["slug"]),
        name: String(g["display_name"] ?? "A guide on EKA"),
        headline: (g["headline"] as string | null) ?? null,
        traditions: (g["traditions"] as string[] | null) ?? [],
        verified: Boolean(g["identity_verified"]),
        recommended: Boolean(g["eka_recommended"]),
        rating: Number(g["rating"] ?? 0),
        reviews: Number(g["review_count"] ?? 0),
      }),
    );

    const passportLine = passport
      ? `Practices completed: ${passport.practices ?? 0}. Traditions explored: ${(passport.traditions ?? []).join(", ") || "none yet"}. Journeys: ${(passport.journey_list ?? []).map((j) => `${j.title}${j.completed ? " (completed)" : ""}`).join(", ") || "none yet"}. Reflections written: ${passport.reflections ?? 0}. Circles: ${passport.circles ?? 0}. Sessions with teachers: ${passport.sessions ?? 0}.`
      : "Their passport is empty.";

    const themeLine = ((themesRes.data ?? []) as { label: string; blurb: string | null }[])
      .map((t) => `- ${t.label}: ${t.blurb ?? ""}`)
      .join("\n");
    const journeyLine = ((journeysRes.data ?? []) as { title: string; theme: string | null }[])
      .map((j) => `- ${j.title}${j.theme ? ` (${j.theme})` : ""}`)
      .join("\n");
    const guideLine = guides
      .map(
        (g) =>
          `- ${g.name}${g.headline ? `: ${g.headline}` : ""} — traditions: ${g.traditions.join(", ") || "unstated"}; identity verified: ${g.verified ? "yes" : "no"}; EKA recommended: ${g.recommended ? "yes" : "no"}; rating ${g.rating} from ${g.reviews} reviews`,
      )
      .join("\n");

    const system = `Suggest what this member might explore next on EKA. Give at most three suggestions, each exactly two lines:
'Next: …' naming one theme, journey or practice from the lists supplied.
'Because: …' pointing at something in their own passport.
Only name items that appear in the lists below. If their passport is thin, say so in one line and suggest a single gentle starting point. Never recommend a specific teacher by name and never imply a teacher is spiritually authoritative.`;

    const user = `Their Wisdom Passport: ${passportLine}

Themes available:
${themeLine || "- none"}

Journeys available:
${journeyLine || "- none"}

Verified guides currently available (context only, do not name them):
${guideLine || "- none"}`;

    const { text, error } = await callGateway(system, user);
    if (text) {
      await supabase
        .from("ai_insights")
        .insert({ user_id: userId, kind: "navigator", content: text });
    }
    return {
      text,
      error,
      guides,
      hasPassport: Boolean(passport && (passport.practices ?? 0) + (passport.reflections ?? 0) > 0),
    };
  });
