import { createFileRoute } from "@tanstack/react-router";
import {
  analyzeUrlForPhishing,
  checkRateLimit,
  resolveRequestId,
  formatSafeApiError,
  getStandardSecurityHeaders,
} from "@/lib/security";

/**
 * Public Security API: Analyzes a target URL for phishing, typosquatting,
 * brand impersonation, and obfuscation before external navigation.
 */
export const Route = createFileRoute("/api/public/security/verify-url")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestId = resolveRequestId(request.headers);
        const clientIp =
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

        // Rate limit: 60/min
        const rateCheck = checkRateLimit(`verify_url:${clientIp}`, "api_standard");
        if (!rateCheck.allowed) {
          return formatSafeApiError(
            new Error("Rate limit exceeded for URL verification."),
            requestId,
            429,
          );
        }

        try {
          const body = (await request.json()) as { url?: string };
          if (!body.url || typeof body.url !== "string") {
            return formatSafeApiError(new Error("Missing or invalid 'url' parameter."), requestId, 400);
          }

          const analysis = analyzeUrlForPhishing(body.url);

          const headers = new Headers(getStandardSecurityHeaders());
          headers.set("Content-Type", "application/json");
          headers.set("x-request-id", requestId);

          return new Response(JSON.stringify({ data: analysis }), {
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
