import { createFileRoute } from "@tanstack/react-router";
import {
  getActiveIncidents,
  createIncident,
  advanceIncidentPhase,
  resolveRequestId,
  formatSafeApiError,
  getStandardSecurityHeaders,
  trackSecurityEvent,
} from "@/lib/security";

/**
 * Enterprise Admin Security API: Incident Response Lifecycle & Containment
 */
export const Route = createFileRoute("/api/security/incident-response")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestId = resolveRequestId(request.headers);
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return formatSafeApiError(new Error("Unauthorized: Bearer token required."), requestId, 401);
        }

        const token = authHeader.replace("Bearer ", "").trim();

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: claimsData, error: claimsErr } = await supabaseAdmin.auth.getUser(token);
          if (claimsErr || !claimsData?.user) {
            return formatSafeApiError(new Error("Unauthorized: Invalid session."), requestId, 401);
          }

          const userId = claimsData.user.id;
          const { data: roleData } = await supabaseAdmin
            .from("studio_user_roles")
            .select("role")
            .eq("user_id", userId)
            .in("role", ["Founder", "Super Admin"])
            .maybeSingle();

          if (!roleData) {
            return formatSafeApiError(new Error("Forbidden: Administrator access required."), requestId, 403);
          }

          const incidents = getActiveIncidents();
          const headers = new Headers(getStandardSecurityHeaders());
          headers.set("Content-Type", "application/json");
          headers.set("x-request-id", requestId);

          return new Response(JSON.stringify({ data: incidents }), { status: 200, headers });
        } catch (err) {
          return formatSafeApiError(err, requestId, 500);
        }
      },

      POST: async ({ request }) => {
        const requestId = resolveRequestId(request.headers);
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return formatSafeApiError(new Error("Unauthorized: Bearer token required."), requestId, 401);
        }

        const token = authHeader.replace("Bearer ", "").trim();

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: claimsData, error: claimsErr } = await supabaseAdmin.auth.getUser(token);
          if (claimsErr || !claimsData?.user) {
            return formatSafeApiError(new Error("Unauthorized: Invalid session."), requestId, 401);
          }

          const userId = claimsData.user.id;
          const { data: roleData } = await supabaseAdmin
            .from("studio_user_roles")
            .select("role")
            .eq("user_id", userId)
            .in("role", ["Founder", "Super Admin"])
            .maybeSingle();

          if (!roleData) {
            return formatSafeApiError(new Error("Forbidden: Administrator access required."), requestId, 403);
          }

          const body = (await request.json()) as {
            action: "create" | "advance";
            incidentId?: string;
            title?: string;
            severity?: any;
            category?: any;
            targetUser?: string;
            targetIp?: string;
            nextPhase?: any;
            actionTaken?: string;
            notes?: string;
          };

          if (body.action === "create" && body.title) {
            const inc = await createIncident({
              title: body.title,
              severity: body.severity || "HIGH",
              category: body.category || "account_takeover_signal",
              targetUser: body.targetUser,
              targetIp: body.targetIp,
              notes: body.notes,
              actor: userId,
            });

            const headers = new Headers(getStandardSecurityHeaders());
            headers.set("Content-Type", "application/json");
            return new Response(JSON.stringify({ data: inc }), { status: 201, headers });
          }

          if (body.action === "advance" && body.incidentId && body.nextPhase) {
            const updated = await advanceIncidentPhase({
              incidentId: body.incidentId,
              nextPhase: body.nextPhase,
              actionTaken: body.actionTaken || "Admin advanced incident phase",
              actor: userId,
              notes: body.notes,
            });

            const headers = new Headers(getStandardSecurityHeaders());
            headers.set("Content-Type", "application/json");
            return new Response(JSON.stringify({ data: updated }), { status: 200, headers });
          }

          return formatSafeApiError(new Error("Invalid incident response request payload."), requestId, 400);
        } catch (err) {
          return formatSafeApiError(err, requestId, 500);
        }
      },
    },
  },
});
