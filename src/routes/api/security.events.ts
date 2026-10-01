import { createFileRoute } from "@tanstack/react-router";
import {
  getSecurityMonitoringMetrics,
  resolveRequestId,
  formatSafeApiError,
  getStandardSecurityHeaders,
  trackSecurityEvent,
} from "@/lib/security";

/**
 * Enterprise Admin Security API: Real-time threat telemetry & incident metrics.
 * Strictly restricted to authorized Super Admin / Founder operators.
 */
export const Route = createFileRoute("/api/security/events")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestId = resolveRequestId(request.headers);
        const authHeader = request.headers.get("authorization");

        if (!authHeader?.startsWith("Bearer ")) {
          return formatSafeApiError(new Error("Unauthorized: Access token required."), requestId, 401);
        }

        const token = authHeader.replace("Bearer ", "").trim();

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          if (!supabaseAdmin) {
            return formatSafeApiError(new Error("Database unavailable."), requestId, 503);
          }

          // Verify user claims and role
          const { data: claimsData, error: claimsErr } = await supabaseAdmin.auth.getUser(token);
          if (claimsErr || !claimsData?.user) {
            return formatSafeApiError(new Error("Unauthorized: Invalid session token."), requestId, 401);
          }

          const userId = claimsData.user.id;

          // Check role in studio_user_roles
          const { data: roleData, error: roleErr } = await (supabaseAdmin as any)
            .from("studio_user_roles")
            .select("role")
            .eq("user_id", userId)
            .in("role", ["Founder", "Super Admin"])
            .maybeSingle();

          if (roleErr || !roleData) {
            await trackSecurityEvent({
              severity: "HIGH",
              category: "rbac_denial",
              eventType: "unauthorized_security_dashboard_api_access_attempt",
              actorId: userId,
              details: { endpoint: "/api/security/events" },
            });

            return formatSafeApiError(
              new Error("Forbidden: Access restricted to authorized platform administrators."),
              requestId,
              403,
            );
          }

          const metrics = await getSecurityMonitoringMetrics();

          const headers = new Headers(getStandardSecurityHeaders());
          headers.set("Content-Type", "application/json");
          headers.set("x-request-id", requestId);

          return new Response(JSON.stringify({ data: metrics }), {
            status: 200,
            headers,
          });
        } catch (err) {
          return formatSafeApiError(err, requestId, 500);
        }
      },
    },
  },
});
