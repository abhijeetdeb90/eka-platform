import { createFileRoute } from "@tanstack/react-router";
import { paymentsService } from "@/lib/payments/payments.service";

/**
 * EKA Payments API: Orders, Checkout Verification & Status
 */
export const Route = createFileRoute("/api/payments")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as Record<string, unknown>;
          const action = (body["action"] as string) ?? "create_order";

          switch (action) {
            case "create_order": {
              const amountMinor = Number(body["amount_minor"]);
              const purpose = (body["purpose"] as any) ?? "one_time";
              const userId = body["user_id"] as string | undefined;
              const customerId = body["customer_id"] as string | undefined;
              const currency = (body["currency"] as any) ?? "INR";
              const notes = body["notes"] as Record<string, string> | undefined;

              const order = await paymentsService.createOrder({
                amount_minor: amountMinor,
                purpose,
                currency,
                ...(userId ? { user_id: userId } : {}),
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
              const userId = body["user_id"] as string | undefined;

              const result = await paymentsService.verifyAndCapturePayment({
                order_id: orderId,
                razorpay_order_id: razorpayOrderId,
                razorpay_payment_id: razorpayPaymentId,
                razorpay_signature: razorpaySignature,
                ...(userId ? { user_id: userId } : {}),
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
