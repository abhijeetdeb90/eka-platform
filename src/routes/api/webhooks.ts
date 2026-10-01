import { createFileRoute } from "@tanstack/react-router";
import { webhookService } from "@/lib/payments/webhooks.service";

/**
 * Universal Webhooks Gateway Route
 */
export const Route = createFileRoute("/api/webhooks")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const signature =
          request.headers.get("x-razorpay-signature") ??
          request.headers.get("X-Razorpay-Signature") ??
          "";

        const rawBody = await request.text();

        if (!signature) {
          return new Response(JSON.stringify({ error: "Missing webhook signature header." }), {
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
          return new Response(JSON.stringify({ error: errMsg }), {
            status: errMsg.includes("signature") ? 401 : 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
