import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

async function roles() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [] as string[];
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", auth.user.id);
  if (error) throw error;
  return (data ?? []).map((r) => r.role as string);
}

/** True when the signed-in user is a moderator or admin. */
export function useIsModerator() {
  return useQuery({
    queryKey: ["is-moderator"],
    queryFn: async () => (await roles()).some((r) => r === "moderator" || r === "admin"),
  });
}

/** True only for admins — money, configuration and verification live behind this. */
export function useIsAdmin() {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => (await roles()).includes("admin"),
  });
}
