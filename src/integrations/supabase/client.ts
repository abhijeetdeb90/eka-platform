import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const DEFAULT_SUPABASE_URL = "https://kbiutqzhcbyuseygcspe.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_DKdNOtbppccL297o2_Ixkw_f2j0Rf7-";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    // New Supabase API keys are opaque strings, not bearer JWTs.
    if (
      isNewSupabaseApiKey(supabaseKey) &&
      headers.get("Authorization") === `Bearer ${supabaseKey}`
    ) {
      headers.delete("Authorization");
    }

    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

/**
 * Robust storage adapter with cookie synchronization for seamless SSR,
 * page refresh, and cross-session persistence on Vercel and local environments.
 */
function createAuthStorage() {
  if (typeof window === "undefined") return undefined;

  // Cleanup obsolete project tokens from previous iterations
  try {
    window.localStorage.removeItem("sb-woflebpvqiwwzhggwwxv-auth-token");
    document.cookie = "sb-woflebpvqiwwzhggwwxv-auth-token=; path=/; max-age=0; SameSite=Lax";
  } catch {}

  return {
    getItem: (key: string): string | null => {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        window.localStorage.setItem(key, value);
        // Synchronize auth session cookie for SSR request forwarding
        if (key.includes("auth-token")) {
          const isHttps = window.location.protocol === "https:";
          const maxAge = 60 * 60 * 24 * 30; // 30 days
          document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${isHttps ? "; Secure" : ""}`;
        }
      } catch (err) {
        console.warn("[SupabaseAuthStorage] setItem warning:", err);
      }
    },
    removeItem: (key: string): void => {
      try {
        window.localStorage.removeItem(key);
        if (key.includes("auth-token")) {
          document.cookie = `${encodeURIComponent(key)}=; path=/; max-age=0; SameSite=Lax`;
        }
      } catch (err) {
        console.warn("[SupabaseAuthStorage] removeItem warning:", err);
      }
    },
  };
}

function createSupabaseClient() {
  const SUPABASE_URL =
    import.meta.env?.["VITE_SUPABASE_URL"] ||
    import.meta.env?.["NEXT_PUBLIC_SUPABASE_URL"] ||
    import.meta.env?.["SUPABASE_URL"] ||
    (typeof process !== "undefined"
      ? process.env?.["VITE_SUPABASE_URL"] ||
        process.env?.["NEXT_PUBLIC_SUPABASE_URL"] ||
        process.env?.["SUPABASE_URL"]
      : undefined) ||
    DEFAULT_SUPABASE_URL;

  const SUPABASE_PUBLISHABLE_KEY =
    import.meta.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    import.meta.env?.["VITE_SUPABASE_ANON_KEY"] ||
    import.meta.env?.["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] ||
    import.meta.env?.["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ||
    import.meta.env?.["SUPABASE_PUBLISHABLE_KEY"] ||
    import.meta.env?.["SUPABASE_ANON_KEY"] ||
    (typeof process !== "undefined"
      ? process.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
        process.env?.["VITE_SUPABASE_ANON_KEY"] ||
        process.env?.["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] ||
        process.env?.["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ||
        process.env?.["SUPABASE_PUBLISHABLE_KEY"] ||
        process.env?.["SUPABASE_ANON_KEY"]
      : undefined) ||
    DEFAULT_SUPABASE_PUBLISHABLE_KEY;

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
    },
    auth: {
      storage: createAuthStorage(),
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

// Exported singleton client with lazy proxy initialization
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});

/**
 * Checks whether Google OAuth provider is actively enabled in the Supabase project.
 */
export async function isGoogleAuthEnabled(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const supabaseUrl =
      import.meta.env?.["VITE_SUPABASE_URL"] ||
      import.meta.env?.["NEXT_PUBLIC_SUPABASE_URL"] ||
      import.meta.env?.["SUPABASE_URL"] ||
      DEFAULT_SUPABASE_URL;

    const supabaseKey =
      import.meta.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
      import.meta.env?.["VITE_SUPABASE_ANON_KEY"] ||
      import.meta.env?.["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] ||
      import.meta.env?.["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ||
      DEFAULT_SUPABASE_PUBLISHABLE_KEY;

    const res = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: { apikey: supabaseKey },
    });
    if (!res.ok) return true; // Fail-open to avoid blocking if settings endpoint changes
    const data = (await res.json()) as { external?: { google?: boolean } };
    return Boolean(data?.external?.google);
  } catch {
    return true; // Fail-open fallback
  }
}
