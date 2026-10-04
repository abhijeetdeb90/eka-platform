// ==============================================================================
// EKA PLATFORM — CENTRALIZED ACCESS CONTROL & RBAC ARCHITECTURE
// ==============================================================================
// Hard product separation:
// 1. CONSUMER (Public / Launch-Ready: eka.world)
// 2. FOUNDER / ADMIN (Private Internal Operating System: admin.eka.world)
// 3. BRANDS / ENTERPRISE (Future B2B Product: business.eka.world)
// ==============================================================================

import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

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

/**
 * Fetch authenticated user and roles from Supabase session and user_roles table.
 */
export async function getSessionAndRoles(): Promise<{
  userId: string | null;
  roles: string[];
  isAuthenticated: boolean;
}> {
  try {
    // 1. Fast local session check
    let localUserId: string | null = null;
    if (typeof window !== "undefined") {
      const tokenStr =
        localStorage.getItem("sb-auth-token") ||
        localStorage.getItem("sb-kbiutqzhcbyuseygcspe-auth-token") ||
        localStorage.getItem("sb-woflebpvqiwwzhggwwxv-auth-token");
      if (tokenStr) {
        try {
          const parsed = JSON.parse(tokenStr);
          if (parsed?.user?.id) {
            localUserId = parsed.user.id;
          }
        } catch {}
      }
    }

    const { data: auth, error: authError } = await supabase.auth.getUser();
    const userId = auth?.user?.id || localUserId;

    if (!userId || authError) {
      return { userId: null, roles: [], isAuthenticated: false };
    }

    // 2. Fetch roles assigned to this user
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

/**
 * Route guard for Founder/Admin routes:
 * If user is unauthenticated or not a founder/admin/moderator,
 * immediately deny access and silently redirect to consumer root ('/').
 * DO NOT expose internal UI or structure to unauthorized users.
 */
export async function verifyFounderAdminAccess(redirectTo: string = "/"): Promise<{ userId: string; roles: string[] }> {
  const session = await getSessionAndRoles();

  if (!session.isAuthenticated) {
    // Not signed in -> silent redirect to home or auth
    throw redirect({ to: "/auth" });
  }

  const hasAccess = session.roles.some((r) =>
    FOUNDER_ADMIN_ROLES.includes(r as (typeof FOUNDER_ADMIN_ROLES)[number])
  );

  if (!hasAccess) {
    // Authenticated consumer or creator attempting to access internal admin -> DENY ACCESS
    console.warn(`[AccessControl] Denied internal admin access to user ${session.userId}. Redirecting to ${redirectTo}`);
    throw redirect({ to: redirectTo });
  }

  return { userId: session.userId!, roles: session.roles };
}

/**
 * Route guard for Brands/Enterprise routes:
 * If user is unauthenticated or not a brand/enterprise/admin,
 * immediately deny access and redirect to consumer root ('/').
 */
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

/**
 * Server-side API request authorization validator:
 * Validates request authorization header or bearer token.
 */
export async function assertServerRole(
  request: Request,
  allowedRoles: string[]
): Promise<{ ok: boolean; status: number; error?: string; userId?: string }> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return { ok: false, status: 401, error: "Unauthorized: Missing Authorization header" };
  }

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return { ok: false, status: 401, error: "Unauthorized: Invalid Bearer token" };
  }

  // Validate with supabase
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return { ok: false, status: 401, error: "Unauthorized: Invalid session" };
  }

  const { data: roleRecords } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id);

  const roles = (roleRecords ?? []).map((r) => String(r.role).toLowerCase());
  const hasAllowedRole = roles.some((r) => allowedRoles.includes(r));

  if (!hasAllowedRole) {
    return { ok: false, status: 403, error: "Forbidden: Access restricted to authorized roles" };
  }

  return { ok: true, status: 200, userId: data.user.id };
}
