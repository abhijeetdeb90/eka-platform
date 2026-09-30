import { createFileRoute } from "@tanstack/react-router";
import {
  getUserSessions,
  revokeSession,
  revokeAllUserSessions,
  resolveRequestId,
  formatSafeApiError,
  getStandardSecurityHeaders,
} from "@/lib/security";

/**
 * User Security API: Device & Session Management
 */
export const Route = createFileRoute("/api/security/sessions")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestId = resolveRequestId(request.headers);
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return formatSafeApiError(new Error("Unauthorized."), requestId, 401);
        }

        const token = authHeader.replace("Bearer ", "").trim();

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin.auth.getUser(token);
          if (error || !data?.user) {
            return formatSafeApiError(new Error("Unauthorized: Invalid session."), requestId, 401);
          }

          const sessions = getUserSessions(data.user.id);

          const headers = new Headers(getStandardSecurityHeaders());
          headers.set("Content-Type", "application/json");
          headers.set("x-request-id", requestId);

          return new Response(JSON.stringify({ data: sessions }), {
            status: 200,
            headers,
          });
        } catch (err) {
          return formatSafeApiError(err, requestId, 500);
        }
      },

      POST: async ({ request }) => {
        const requestId = resolveRequestId(request.headers);
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return formatSafeApiError(new Error("Unauthorized."), requestId, 401);
        }

        const token = authHeader.replace("Bearer ", "").trim();

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin.auth.getUser(token);
          if (error || !data?.user) {
            return formatSafeApiError(new Error("Unauthorized: Invalid session."), requestId, 401);
          }

          const body = (await request.json()) as { sessionId?: string; revokeAll?: boolean };

          if (body.revokeAll) {
            const count = await revokeAllUserSessions(data.user.id, "User requested revocation of all sessions");
            const headers = new Headers(getStandardSecurityHeaders());
            headers.set("Content-Type", "application/json");
            return new Response(JSON.stringify({ success: true, revokedCount: count }), { status: 200, headers });
          }

          if (body.sessionId) {
            const success = await revokeSession(data.user.id, body.sessionId);
            const headers = new Headers(getStandardSecurityHeaders());
            headers.set("Content-Type", "application/json");
            return new Response(JSON.stringify({ success }), { status: 200, headers });
          }

          return formatSafeApiError(new Error("Missing sessionId or revokeAll flag."), requestId, 400);
        } catch (err) {
          return formatSafeApiError(err, requestId, 500);
        }
      },
    },
  },
});
