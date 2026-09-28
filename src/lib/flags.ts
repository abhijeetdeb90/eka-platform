import { supabase } from "@/integrations/supabase/client";

/* ------------------------------------------------------------ feature flags -
 * New systems ship dark. An administrator turns each one on when it is ready,
 * so a half-built surface never reaches a member by accident.
 * -------------------------------------------------------------------------- */

export type FeatureFlag =
  | "trust_profile_enabled"
  | "wisdom_passport_enabled"
  | "discovery_v2_enabled"
  | "creator_score_v2_enabled"
  | "wisdom_graph_enabled"
  | "wisdom_compare_enabled"
  | "ai_navigator_enabled"
  | "cultural_archive_enabled"
  | "institutional_network_enabled"
  | "wisdom_api_enabled";

export type Flags = Record<FeatureFlag, boolean>;

export const DEFAULT_FLAGS: Flags = {
  trust_profile_enabled: true,
  wisdom_passport_enabled: false,
  discovery_v2_enabled: false,
  creator_score_v2_enabled: true,
  wisdom_graph_enabled: false,
  wisdom_compare_enabled: false,
  ai_navigator_enabled: false,
  cultural_archive_enabled: false,
  institutional_network_enabled: false,
  wisdom_api_enabled: false,
};

export const FLAG_LABEL: Record<FeatureFlag, string> = {
  trust_profile_enabled: "Trust profiles",
  wisdom_passport_enabled: "Wisdom Passport",
  discovery_v2_enabled: "Problem-first discovery",
  creator_score_v2_enabled: "Creator Score 2.0",
  wisdom_graph_enabled: "Wisdom Graph",
  wisdom_compare_enabled: "Wisdom Compare",
  ai_navigator_enabled: "Wisdom Navigator (AI)",
  cultural_archive_enabled: "Cultural Archive",
  institutional_network_enabled: "Institutional network",
  wisdom_api_enabled: "Wisdom API",
};

export async function fetchFlags(): Promise<Flags> {
  const { data } = await supabase
    .from("platform_config")
    .select("value")
    .eq("key", "feature_flags")
    .maybeSingle();
  const raw = (data?.value ?? {}) as Partial<Record<FeatureFlag, unknown>>;
  const out = { ...DEFAULT_FLAGS };
  for (const key of Object.keys(DEFAULT_FLAGS) as FeatureFlag[]) {
    if (typeof raw[key] === "boolean") out[key] = raw[key] as boolean;
  }
  return out;
}

export async function saveFlags(flags: Flags) {
  const { error } = await supabase
    .from("platform_config")
    .update({ value: flags })
    .eq("key", "feature_flags");
  return { error };
}
