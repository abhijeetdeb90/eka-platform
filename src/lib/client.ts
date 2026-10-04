import { supabase } from "@/integrations/supabase/client";

/**
 * Re-exports the unified single source of truth Supabase client.
 * Prevents multiple competing Supabase client instances.
 */
export function createClient() {
  return supabase;
}

export { supabase };
