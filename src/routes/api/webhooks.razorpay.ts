import { createFileRoute } from "@tanstack/react-router";
import { webhookService } from "@/lib/payments/webhooks.service";

/**
 * EKA Dedicated Razorpay Webhook Ingestion Endpoint
 * 
 * Verifies HMAC signature, enforces idempotency, prevents duplicate runs,
 * and synchronizes EKA financial ledger, subscriptions, and payouts.
 */
export const Route = createFileRoute("/api/webhooks/razorpay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const signature =
          request.headers.get("x-razorpay-signature") ??
          request.headers.get("X-Razorpay-Signature") ??
          "";

        const rawBody = await request.text();

        if (!signature) {
          return new Response(JSON.stringify({ error: "Missing x-razorpay-signature header." }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const result = await webhookService.handleWebhook(rawBody, signature);

          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          const errMsg = String(error);
          const isSignatureError = errMsg.includes("signature");

          console.error("[Razorpay Webhook Error]:", errMsg);

          return new Response(JSON.stringify({ error: errMsg }), {
            status: isSignatureError ? 401 : 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
