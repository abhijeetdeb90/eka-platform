import { createFileRoute } from "@tanstack/react-router";
import { refundsService } from "@/lib/payments/refunds.service";
import { assertServerRole } from "@/lib/auth/access-control";

/**
 * EKA Refunds API: Full and Partial Refunds with Ledger Reversals
 * Restricted to admin / founder roles. Refunds move money and must never
 * be callable by an unauthenticated or end-user session.
 */
export const Route = createFileRoute("/api/refunds")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const auth = await assertServerRole(request, ["admin", "super_admin", "founder"]);
          if (!auth.ok) {
            return new Response(JSON.stringify({ error: auth.error ?? "Unauthorized" }), {
              status: auth.status,
              headers: { "Content-Type": "application/json" },
            });
          }

          const body = (await request.json()) as Record<string, unknown>;
          const action = (body["action"] as string) ?? "process_refund";

          switch (action) {
            case "process_refund": {
              const paymentId = body["payment_id"] as string;
              if (!paymentId) {
                return new Response(JSON.stringify({ error: "payment_id is required" }), {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                });
              }
              const amountMinor = body["amount_minor"] ? Number(body["amount_minor"]) : undefined;
              const reason = (body["reason"] as string) ?? "Customer requested refund";
              const notes = body["notes"] as Record<string, string> | undefined;

              const refund = await refundsService.processRefund({
                payment_id: paymentId,
                reason,
                ...(amountMinor !== undefined ? { amount_minor: amountMinor } : {}),
                ...(notes ? { notes } : {}),
              });

              return new Response(JSON.stringify({ success: true, refund }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "get_refund": {
              const refundId = body["refund_id"] as string;
              const refund = refundsService.getRefund(refundId);
              if (!refund) {
                return new Response(JSON.stringify({ error: "Refund not found" }), {
                  status: 404,
                  headers: { "Content-Type": "application/json" },
                });
              }

              return new Response(JSON.stringify({ success: true, refund }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            default:
              return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
          }
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
