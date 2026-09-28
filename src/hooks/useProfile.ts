import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProfileRow } from "@/lib/api";

export type Profile = ProfileRow;

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile | null> => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, display_name, username, avatar_url, bio, account_type, intentions, interests, practices, verified, suspended, onboarded, reflection_tone, created_at, age_bracket, region, language, religion, community_background, purposes, standards_accepted_at",
        )
        .eq("id", auth.user.id)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as Profile) ?? null;
    },
  });
}

export function useSubscription() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return null;
      const { data } = await supabase
        .from("subscriptions")
        .select("plan, status, started_at, expires_at")
        .eq("user_id", auth.user.id)
        .maybeSingle();
      return data ?? null;
    },
  });
}
