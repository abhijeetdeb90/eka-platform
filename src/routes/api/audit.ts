import { createFileRoute } from "@tanstack/react-router";
import { auditService } from "@/lib/payments/audit.service";
import { assertServerRole } from "@/lib/auth/access-control";

/**
 * EKA Audit API: Query immutable transaction and security audit logs
 * Strictly restricted to Founder / Admin roles only.
 */
export const Route = createFileRoute("/api/audit")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await assertServerRole(request, ["admin", "super_admin", "founder"]);
        if (!auth.ok) {
          return new Response(JSON.stringify({ error: auth.error ?? "Unauthorized" }), {
            status: auth.status,
            headers: { "Content-Type": "application/json" },
          });
        }

        const logs = await auditService.queryLogs({ limit: 100 });
        return new Response(JSON.stringify({ success: true, logs }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },

      POST: async ({ request }) => {
        const auth = await assertServerRole(request, ["admin", "super_admin", "founder"]);
        if (!auth.ok) {
          return new Response(JSON.stringify({ error: auth.error ?? "Unauthorized" }), {
            status: auth.status,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const body = (await request.json()) as Record<string, unknown>;
          const entityId = body["entity_id"] as string | undefined;
          const entityType = body["entity_type"] as string | undefined;
          const actorId = body["actor_id"] as string | undefined;
          const limit = body["limit"] ? Number(body["limit"]) : 50;

          const logs = await auditService.queryLogs({
            ...(entityId ? { entity_id: entityId } : {}),
            ...(entityType ? { entity_type: entityType } : {}),
            ...(actorId ? { actor_id: actorId } : {}),
            limit,
          });

          return new Response(JSON.stringify({ success: true, logs }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: String(error) }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
