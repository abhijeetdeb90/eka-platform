import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";

/* ------------------------------------------------------- campaign engine ---
 * "7 Days. One Path." is the first campaign, not the only one. A campaign is
 * an ordered set of days, each with a promise, an action and a place to go.
 * Editors add new arcs in the database; nothing here is hardcoded to a week.
 * -------------------------------------------------------------------------- */

export type Campaign = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  promise: string;
  day_count: number;
  active: boolean;
  sort_order: number;
};

export type CampaignDay = {
  id: string;
  campaign_id: string;
  day_number: number;
  title: string;
  promise: string;
  action: string;
  route: string;
  cta: string;
  minutes: number;
  tokens: number;
};

export type CampaignStep = {
  campaign_id: string;
  day_number: number;
  completed_on: string;
  note: string | null;
};

export const CAMPAIGN_SLUG = "7-days-one-path";

export async function fetchCampaign(slug = CAMPAIGN_SLUG): Promise<Campaign | null> {
  const { data } = await supabase
    .from("campaigns")
    .select("id, slug, title, tagline, promise, day_count, active, sort_order")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Campaign) ?? null;
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  const { data } = await supabase
    .from("campaigns")
    .select("id, slug, title, tagline, promise, day_count, active, sort_order")
    .eq("active", true)
    .order("sort_order");
  return (data ?? []) as Campaign[];
}

export async function fetchCampaignDays(campaignId: string): Promise<CampaignDay[]> {
  const { data } = await supabase
    .from("campaign_days")
    .select("id, campaign_id, day_number, title, promise, action, route, cta, minutes, tokens")
    .eq("campaign_id", campaignId)
    .order("day_number");
  return (data ?? []) as CampaignDay[];
}

export async function fetchCampaignProgress(campaignId: string): Promise<CampaignStep[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("campaign_progress")
    .select("campaign_id, day_number, completed_on, note")
    .eq("user_id", uid)
    .eq("campaign_id", campaignId)
    .order("day_number");
  return (data ?? []) as CampaignStep[];
}

export async function completeCampaignDay(campaignId: string, dayNumber: number, note?: string) {
  const uid = await currentUserId();
  if (!uid) return { error: "Please sign in." };
  const { error } = await supabase
    .from("campaign_progress")
    .upsert(
      { user_id: uid, campaign_id: campaignId, day_number: dayNumber, note: note ?? null },
      { onConflict: "user_id,campaign_id,day_number" },
    );
  return { error: error?.message ?? null };
}

/** The next unfinished day, so a member always knows where they are. */
export function nextCampaignDay(days: CampaignDay[], steps: CampaignStep[]) {
  const done = new Set(steps.map((s) => s.day_number));
  return days.find((d) => !done.has(d.day_number)) ?? null;
}

export function campaignPercent(days: CampaignDay[], steps: CampaignStep[]) {
  if (days.length === 0) return 0;
  return Math.round((Math.min(steps.length, days.length) / days.length) * 100);
}
