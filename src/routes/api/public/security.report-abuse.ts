import { createFileRoute } from "@tanstack/react-router";
import {
  reportPhishingDomain,
  trackSecurityEvent,
  recordSecurityAudit,
  checkRateLimit,
  resolveRequestId,
  formatSafeApiError,
  getStandardSecurityHeaders,
  detectApplicationAttacks,
} from "@/lib/security";

/**
 * Public Security API: Community Abuse & Phishing Reporting
 */
export const Route = createFileRoute("/api/public/security/report-abuse")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestId = resolveRequestId(request.headers);
        const clientIp =
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

        // Rate limit: 10 reports per minute per IP
        const rateCheck = checkRateLimit(`report_abuse:${clientIp}`, "auth");
        if (!rateCheck.allowed) {
          return formatSafeApiError(
            new Error("Too many abuse reports submitted. Please wait."),
            requestId,
            429,
          );
        }

        try {
          const body = (await request.json()) as {
            targetUrl?: string;
            reason?: string;
            category?: string;
            details?: string;
          };

          if (!body.reason || (!body.targetUrl && !body.details)) {
            return formatSafeApiError(new Error("Missing required report fields."), requestId, 400);
          }

          // Threat scan description and target to prevent injection into security system
          const scanText = `${body.targetUrl || ""} ${body.details || ""}`;
          const attackCheck = await detectApplicationAttacks({
            input: scanText,
            source: "abuse_report_body",
            ipAddress: clientIp,
          });

          if (!attackCheck.isClean) {
            return formatSafeApiError(new Error("Invalid report payload."), requestId, 400);
          }

          if (body.targetUrl) {
            reportPhishingDomain(body.targetUrl, body.reason);
          }

          await trackSecurityEvent({
            severity: "MEDIUM",
            category: "phishing_detected",
            eventType: "community_abuse_report_filed",
            ipAddress: clientIp,
            details: {
              targetUrl: body.targetUrl,
              reason: body.reason,
              category: body.category || "phishing",
            },
          });

          await recordSecurityAudit({
            action: "abuse_report_recorded",
            resourceType: "report",
            resourceId: body.targetUrl,
            result: "success",
            ipAddress: clientIp,
            requestId,
          });

          const headers = new Headers(getStandardSecurityHeaders());
          headers.set("Content-Type", "application/json");
          headers.set("x-request-id", requestId);

          return new Response(
            JSON.stringify({
              success: true,
              message: "Report received. EKA Trust & Safety team is investigating.",
              requestId,
            }),
            { status: 200, headers },
          );
        } catch (err) {
          return formatSafeApiError(err, requestId, 500);
        }
      },
    },
  },
});
