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
import { getInvestorDemoSession, startInvestorDemoSession } from "./demo-session";

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
    if (typeof window === "undefined") {
      return { userId: null, roles: [], isAuthenticated: false };
    }

    // 0. Auto-activate demo if requested via query param
    if (window.location.search.includes("demo=admin") || window.location.search.includes("demo=true")) {
      startInvestorDemoSession("admin");
    } else if (window.location.search.includes("demo=enterprise")) {
      startInvestorDemoSession("enterprise");
    } else if (window.location.search.includes("demo=consumer")) {
      startInvestorDemoSession("consumer");
    }

    // Check for active investor demo presentation session
    const demo = getInvestorDemoSession();
    if (demo && demo.active) {
      return {
        userId: demo.userId,
        roles: demo.roles,
        isAuthenticated: true,
      };
    }

    // 1. Fast local session check via getSession
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
  // Check investor demo mode
  if (typeof window !== "undefined") {
    if (window.location.search.includes("demo=admin") || window.location.search.includes("demo=true")) {
      startInvestorDemoSession("admin");
      const demo = getInvestorDemoSession();
      if (demo) return { userId: demo.userId, roles: demo.roles };
    }
    const demo = getInvestorDemoSession();
    if (demo && demo.active && (demo.role === "admin" || demo.roles.includes("admin") || demo.roles.includes("founder"))) {
      return { userId: demo.userId, roles: demo.roles };
    }
  }

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
  // Check investor demo mode
  if (typeof window !== "undefined") {
    if (window.location.search.includes("demo=enterprise") || window.location.search.includes("demo=true")) {
      startInvestorDemoSession("enterprise");
      const demo = getInvestorDemoSession();
      if (demo) return { userId: demo.userId, roles: demo.roles };
    }
    const demo = getInvestorDemoSession();
    if (demo && demo.active && (demo.role === "enterprise" || demo.roles.includes("enterprise") || demo.roles.includes("brand"))) {
      return { userId: demo.userId, roles: demo.roles };
    }
  }

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

  // Validate session token with supabase
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return { ok: false, status: 401, error: "Unauthorized: Invalid session" };
  }

  const userId = data.user.id;
  let roles: string[] = [];

  // Try server admin client first if running in server context
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (supabaseAdmin) {
      const { data: roleRecords } = await (supabaseAdmin as any)
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      roles = (roleRecords ?? []).map((r: any) => String(r.role).toLowerCase());
    }
  } catch {
    // If supabaseAdmin is unavailable or fails, query using the authenticated token
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const client = createClient(
        process.env["VITE_SUPABASE_URL"] || "https://kbiutqzhcbyuseygcspe.supabase.co",
        process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] || "sb_publishable_DKdNOtbppccL297o2_Ixkw_f2j0Rf7-",
        {
          global: {
            headers: { Authorization: `Bearer ${token}` },
          },
          auth: { persistSession: false },
        }
      );
      const { data: roleRecords } = await client
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      roles = (roleRecords ?? []).map((r: any) => String(r.role).toLowerCase());
    } catch (e) {
      console.error("[assertServerRole] Failed to fetch roles:", e);
    }
  }

  const hasAllowedRole = roles.some((r) => allowedRoles.map((a) => a.toLowerCase()).includes(r));

  if (!hasAllowedRole) {
    return { ok: false, status: 403, error: "Forbidden: Access restricted to authorized roles" };
  }

  return { ok: true, status: 200, userId };
}
