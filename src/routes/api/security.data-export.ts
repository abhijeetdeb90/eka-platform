import { createFileRoute } from "@tanstack/react-router";
import {
  generateUserDataExport,
  resolveRequestId,
  formatSafeApiError,
  getStandardSecurityHeaders,
} from "@/lib/security";

/**
 * Data Privacy API: DPDP Act (2023) Statutory Right to Data Portability
 */
export const Route = createFileRoute("/api/security/data-export")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestId = resolveRequestId(request.headers);
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return formatSafeApiError(new Error("Unauthorized: Bearer token required."), requestId, 401);
        }

        const token = authHeader.replace("Bearer ", "").trim();

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin.auth.getUser(token);
          if (error || !data?.user) {
            return formatSafeApiError(new Error("Unauthorized: Invalid session."), requestId, 401);
          }

          const exportBundle = await generateUserDataExport(data.user.id);

          const headers = new Headers(getStandardSecurityHeaders());
          headers.set("Content-Type", "application/json");
          headers.set("Content-Disposition", `attachment; filename="eka_privacy_export_${data.user.id.slice(0, 8)}.json"`);
          headers.set("x-request-id", requestId);

          return new Response(JSON.stringify(exportBundle, null, 2), {
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
