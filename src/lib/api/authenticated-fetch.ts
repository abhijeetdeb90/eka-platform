import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch helper for money / protected APIs.
 * Always attaches Authorization: Bearer <supabase access_token>.
 * Throws if the user is not signed in (callers should send user to /auth).
 */
export async function getAccessToken(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(`Auth session error: ${error.message}`);
  }
  const token = data.session?.access_token;
  if (!token) {
    throw new Error("Sign in required to continue with this payment action.");
  }
  return token;
}

export type AuthenticatedFetchInit = RequestInit & {
  /** If true, allow unauthenticated request (rare; default false). */
  allowAnonymous?: boolean;
};

export async function authenticatedFetch(
  input: string | URL,
  init: AuthenticatedFetchInit = {},
): Promise<Response> {
  const { allowAnonymous, headers: initHeaders, ...rest } = init;
  const headers = new Headers(initHeaders);

  if (!headers.has("Content-Type") && rest.body && typeof rest.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  if (!allowAnonymous) {
    const token = await getAccessToken();
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(input, { ...rest, headers });
}
