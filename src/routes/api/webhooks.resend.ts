import { createFileRoute } from "@tanstack/react-router";
import { auditService } from "@/lib/payments/audit.service";

/**
 * Resend Webhooks Handler Route
 * Handles email delivery status, bounces, and complaints.
 */
export const Route = createFileRoute("/api/webhooks/resend")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const webhookSecret = process.env["RESEND_WEBHOOK_SECRET"];
        const incomingSecret =
          request.headers.get("x-resend-signature") ||
          request.headers.get("x-webhook-secret") ||
          "";

        // If a webhook secret is configured in production, verify it
        if (webhookSecret && incomingSecret !== webhookSecret) {
          return new Response(JSON.stringify({ error: "Invalid webhook signature" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const payload = (await request.json()) as {
            type?: string;
            data?: {
              email_id?: string;
              to?: string[];
              from?: string;
              subject?: string;
              created_at?: string;
              bounce_type?: string;
            };
          };

          const eventType = payload.type || "unknown";
          const emailData = payload.data || {};
          const recipient = emailData.to?.[0] || "unknown";

          // Log delivery/bounce event in audit records
          await auditService.recordEvent({
            actor_id: "resend_system",
            action: `email_${eventType.replace(".", "_")}`,
            entity_type: "email_notification",
            entity_id: emailData.email_id || "resend-evt",
            metadata: {
              type: eventType,
              recipient,
              subject: emailData.subject,
              bounce_type: emailData.bounce_type,
              timestamp: emailData.created_at || new Date().toISOString(),
            },
          });

          return new Response(
            JSON.stringify({
              success: true,
              received_event: eventType,
              recipient,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (err) {
          console.error("[Resend Webhook Error]:", err);
          return new Response(JSON.stringify({ error: "Failed to process webhook" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
