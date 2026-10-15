import { createFileRoute } from "@tanstack/react-router";
import { paymentsService } from "@/lib/payments/payments.service";
import { requireServerAuth, resolveActingUserId } from "@/lib/auth/access-control";

/**
 * EKA Payments API: Orders, Checkout Verification & Status
 * Requires authenticated Bearer token. user_id is bound to the caller
 * unless the caller is an admin.
 */
export const Route = createFileRoute("/api/payments")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const auth = await requireServerAuth(request);
          if (!auth.ok) {
            return new Response(JSON.stringify({ error: auth.error }), {
              status: auth.status,
              headers: { "Content-Type": "application/json" },
            });
          }

          const body = (await request.json()) as Record<string, unknown>;
          const action = (body["action"] as string) ?? "create_order";

          switch (action) {
            case "create_order": {
              const amountMinor = Number(body["amount_minor"]);
              if (!amountMinor || amountMinor < 100) {
                return new Response(
                  JSON.stringify({ error: "Invalid amount_minor (minimum 100 paise)" }),
                  { status: 400, headers: { "Content-Type": "application/json" } }
                );
              }

              const target = resolveActingUserId(
                auth.userId,
                auth.roles,
                body["user_id"] as string | undefined
              );
              if (!target.ok) {
                return new Response(JSON.stringify({ error: target.error }), {
                  status: target.status,
                  headers: { "Content-Type": "application/json" },
                });
              }

              const purpose = (body["purpose"] as any) ?? "one_time";
              const customerId = body["customer_id"] as string | undefined;
              const currency = (body["currency"] as any) ?? "INR";
              const notes = body["notes"] as Record<string, string> | undefined;

              const order = await paymentsService.createOrder({
                amount_minor: amountMinor,
                purpose,
                currency,
                user_id: target.userId,
                ...(customerId ? { customer_id: customerId } : {}),
                ...(notes ? { notes } : {}),
              });

              return new Response(JSON.stringify({ success: true, order }), {
                status: 201,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "verify_payment": {
              const orderId = body["order_id"] as string;
              const razorpayOrderId = body["razorpay_order_id"] as string;
              const razorpayPaymentId = body["razorpay_payment_id"] as string;
              const razorpaySignature = body["razorpay_signature"] as string;

              if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
                return new Response(
                  JSON.stringify({ error: "Missing required verification fields" }),
                  { status: 400, headers: { "Content-Type": "application/json" } }
                );
              }

              const target = resolveActingUserId(
                auth.userId,
                auth.roles,
                body["user_id"] as string | undefined
              );
              if (!target.ok) {
                return new Response(JSON.stringify({ error: target.error }), {
                  status: target.status,
                  headers: { "Content-Type": "application/json" },
                });
              }

              const result = await paymentsService.verifyAndCapturePayment({
                order_id: orderId,
                razorpay_order_id: razorpayOrderId,
                razorpay_payment_id: razorpayPaymentId,
                razorpay_signature: razorpaySignature,
                user_id: target.userId,
              });

              return new Response(JSON.stringify({ success: true, ...result }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "get_order": {
              const orderId = body["order_id"] as string;
              const order = paymentsService.getOrder(orderId);
              if (!order) {
                return new Response(JSON.stringify({ error: "Order not found" }), {
                  status: 404,
                  headers: { "Content-Type": "application/json" },
                });
              }
              const orderUserId = (order as any).user_id as string | undefined;
              if (orderUserId && orderUserId !== auth.userId && !auth.roles.some((r) =>
                ["admin", "super_admin", "founder"].includes(r)
              )) {
                return new Response(JSON.stringify({ error: "Forbidden" }), {
                  status: 403,
                  headers: { "Content-Type": "application/json" },
                });
              }
              return new Response(JSON.stringify({ success: true, order }), {
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
