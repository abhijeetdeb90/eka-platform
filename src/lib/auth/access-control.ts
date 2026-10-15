// =============================================================================
// EKA PLATFORM — CENTRALIZED ACCESS CONTROL & RBAC ARCHITECTURE
// =============================================================================
// Hard product separation:
// 1. CONSUMER (Public / Pre-Launch Early Access: eka.earth)
// 2. FOUNDER / ADMIN (Private Internal Operating System: /founder-admin)
// 3. BRANDS / ENTERPRISE (Separate Commercial B2B Product: /brands-enterprise)
// =============================================================================

import { redirect } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { getInvestorDemoSession } from "@/lib/auth/demo-session";

export type EkaRole =
  | "consumer"
  | "creator"
  | "brand"
  | "enterprise"
  | "moderator"
  | "admin"
  | "super_admin"
  | "founder";

export const FOUNDER_ADMIN_ROLES = ["founder", "super_admin", "admin", "moderator"] as const;
export const BRANDS_ENTERPRISE_ROLES = ["brand", "enterprise", "founder", "super_admin", "admin"] as const;
export const ADMIN_ROLES = ["admin", "super_admin", "founder"] as const;

/** Build marker so smoke tests can confirm the guarded bundle is live. */
export const EKA_AUTH_GUARD_VERSION = "v1-money-route-auth";

function supabaseUrl(): string {
  return (
    process.env["SUPABASE_URL"] ||
    process.env["VITE_SUPABASE_URL"] ||
    "https://kbiutqzhcbyuseygcspe.supabase.co"
  );
}

function supabasePublishableKey(): string {
  return (
    process.env["SUPABASE_PUBLISHABLE_KEY"] ||
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    process.env["SUPABASE_ANON_KEY"] ||
    process.env["VITE_SUPABASE_ANON_KEY"] ||
    ""
  );
}

/**
 * Browser-only session helper. Do not call from server route handlers.
 */
export async function getSessionAndRoles(): Promise<{
  userId: string | null;
  roles: string[];
  isAuthenticated: boolean;
}> {
  try {
    if (typeof window === "undefined") {
      return { userId: null, roles: [], isAuthenticated: false };
    }

    const { supabase } = await import("@/integrations/supabase/client");

    const demo = getInvestorDemoSession();
    if (demo && demo.active) {
      return {
        userId: demo.userId,
        roles: demo.roles,
        isAuthenticated: true,
      };
    }

    const { data: sessionData } = await supabase.auth.getSession();
    let userId = sessionData?.session?.user?.id ?? null;

    if (!userId) {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (!authError && auth?.user?.id) {
        userId = auth.user.id;
      }
    }

    if (!userId) {
      return { userId: null, roles: [], isAuthenticated: false };
    }

    const { data: roleRecords } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    const roles = (roleRecords ?? []).map((r) => String(r.role).toLowerCase());

    return {
      userId,
      roles,
      isAuthenticated: true,
    };
  } catch (err) {
    console.warn("[AccessControl] Error resolving roles:", err);
    return { userId: null, roles: [], isAuthenticated: false };
  }
}

export async function verifyFounderAdminAccess(redirectTo: string = "/"): Promise<{ userId: string; roles: string[] }> {
  const session = await getSessionAndRoles();

  if (!session.isAuthenticated) {
    throw redirect({ to: "/auth" });
  }

  const hasAccess = session.roles.some((r) =>
    FOUNDER_ADMIN_ROLES.includes(r as (typeof FOUNDER_ADMIN_ROLES)[number])
  );

  if (!hasAccess) {
    console.warn(`[AccessControl] Denied internal admin access to user ${session.userId}. Redirecting to ${redirectTo}`);
    throw redirect({ to: redirectTo });
  }

  return { userId: session.userId!, roles: session.roles };
}

export async function verifyBrandEnterpriseAccess(redirectTo: string = "/"): Promise<{ userId: string; roles: string[] }> {
  const session = await getSessionAndRoles();

  if (!session.isAuthenticated) {
    throw redirect({ to: "/auth" });
  }

  const hasAccess = session.roles.some((r) =>
    BRANDS_ENTERPRISE_ROLES.includes(r as (typeof BRANDS_ENTERPRISE_ROLES)[number])
  );

  if (!hasAccess) {
    console.warn(`[AccessControl] Denied brands/enterprise access to user ${session.userId}. Redirecting to ${redirectTo}`);
    throw redirect({ to: redirectTo });
  }

  return { userId: session.userId!, roles: session.roles };
}

async function resolveRolesForUser(userId: string, token: string): Promise<string[]> {
  let roles: string[] = [];

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (supabaseAdmin) {
      const { data: roleRecords } = await (supabaseAdmin as any)
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      roles = (roleRecords ?? []).map((r: any) => String(r.role).toLowerCase());
      if (roles.length > 0) return roles;
    }
  } catch {
    // fall through
  }

  try {
    const key = supabasePublishableKey();
    if (!key) return roles;
    const client = createClient(supabaseUrl(), key, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: roleRecords } = await client.from("user_roles").select("role").eq("user_id", userId);
    roles = (roleRecords ?? []).map((r: any) => String(r.role).toLowerCase());
  } catch (e) {
    console.error("[assertServerRole] Failed to fetch roles:", e);
  }

  return roles;
}

/**
 * Validate Bearer token using a server-safe Supabase client (no browser storage).
 */
async function validateBearerUser(token: string): Promise<{ userId: string } | null> {
  const key = supabasePublishableKey();
  if (!key) {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await (supabaseAdmin as any).auth.getUser(token);
      if (error || !data?.user) return null;
      return { userId: data.user.id as string };
    } catch {
      return null;
    }
  }

  const client = createClient(supabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data?.user) return null;
  return { userId: data.user.id };
}

export async function assertServerRole(
  request: Request,
  allowedRoles: string[]
): Promise<{ ok: boolean; status: number; error?: string; userId?: string; roles?: string[] }> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return { ok: false, status: 401, error: "Unauthorized: Missing Authorization header" };
  }

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return { ok: false, status: 401, error: "Unauthorized: Invalid Bearer token" };
  }

  const user = await validateBearerUser(token);
  if (!user) {
    return { ok: false, status: 401, error: "Unauthorized: Invalid session" };
  }

  const roles = await resolveRolesForUser(user.userId, token);
  const hasAllowedRole = roles.some((r) => allowedRoles.map((a) => a.toLowerCase()).includes(r));

  if (!hasAllowedRole) {
    return { ok: false, status: 403, error: "Forbidden: Access restricted to authorized roles" };
  }

  return { ok: true, status: 200, userId: user.userId, roles };
}

/**
 * Require any authenticated user (no role gate).
 * Server-safe: does not import the browser Supabase client.
 */
export async function requireServerAuth(
  request: Request
): Promise<{ ok: true; userId: string; roles: string[] } | { ok: false; status: number; error: string }> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return { ok: false, status: 401, error: "Unauthorized: Missing Authorization header" };
  }

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return { ok: false, status: 401, error: "Unauthorized: Invalid Bearer token" };
  }

  const user = await validateBearerUser(token);
  if (!user) {
    return { ok: false, status: 401, error: "Unauthorized: Invalid session" };
  }

  const roles = await resolveRolesForUser(user.userId, token);
  return { ok: true, userId: user.userId, roles };
}

export function isAdminRole(roles: string[]): boolean {
  return roles.some((r) => ADMIN_ROLES.includes(r as (typeof ADMIN_ROLES)[number]));
}

export function resolveActingUserId(
  authUserId: string,
  roles: string[],
  requestedId: string | undefined | null
): { ok: true; userId: string } | { ok: false; status: number; error: string } {
  if (!requestedId || requestedId === authUserId) {
    return { ok: true, userId: authUserId };
  }
  if (isAdminRole(roles)) {
    return { ok: true, userId: requestedId };
  }
  return {
    ok: false,
    status: 403,
    error: "Forbidden: Cannot act on behalf of another user",
  };
}

/** Standard 401 JSON for money routes (includes guard version for deploy verification). */
export function unauthorizedResponse(error: string, status = 401): Response {
  return new Response(JSON.stringify({ error, guard: EKA_AUTH_GUARD_VERSION }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-EKA-Auth-Guard": EKA_AUTH_GUARD_VERSION,
      "Cache-Control": "no-store",
    },
  });
}
