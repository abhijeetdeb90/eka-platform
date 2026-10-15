import { createFileRoute } from "@tanstack/react-router";
import Razorpay from "razorpay";
import { requireServerAuth } from "@/lib/auth/access-control";

/**
 * Backend Endpoint: Create Razorpay Order
 * POST /api/create-order
 *
 * Requires authenticated Bearer token. Order notes are stamped with the
 * authenticated user_id so downstream verification cannot be spoofed.
 *
 * Request: { amount (paise), currency?, receipt?, notes? }
 * Minimum amount: 100 paise (₹1)
 * Returns: { order_id, amount, currency, receipt }
 */
export const Route = createFileRoute("/api/create-order")({
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

          const keyId =
            process.env.RAZORPAY_KEY_ID ||
            process.env.VITE_RAZORPAY_KEY_ID;
          const keySecret = process.env.RAZORPAY_KEY_SECRET;

          if (!keyId || !keySecret) {
            return new Response(
              JSON.stringify({
                error: "Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
              }),
              { status: 503, headers: { "Content-Type": "application/json" } },
            );
          }

          let body: {
            amount?: number;
            currency?: string;
            receipt?: string;
            notes?: Record<string, string>;
          };

          try {
            body = (await request.json()) as typeof body;
          } catch {
            return new Response(
              JSON.stringify({ error: "Invalid JSON in request body." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const amount = Number(body.amount);
          if (!amount || isNaN(amount) || amount < 100) {
            return new Response(
              JSON.stringify({
                error: "Invalid amount. Minimum amount is 100 paise (₹1.00).",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const currency = body.currency || "INR";
          const receipt =
            body.receipt ||
            `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

          const notes: Record<string, string> = {
            ...(body.notes || {}),
            eka_user_id: auth.userId,
          };

          const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
          });

          const order = await razorpay.orders.create({
            amount: Math.round(amount),
            currency,
            receipt,
            notes,
          });

          return new Response(
            JSON.stringify({
              order_id: order.id,
              id: order.id,
              amount: order.amount,
              currency: order.currency,
              receipt: order.receipt,
              status: order.status,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error: any) {
          console.error("[Razorpay create-order error]:", error);
          const statusCode = error?.statusCode || 500;
          return new Response(
            JSON.stringify({
              error:
                error?.error?.description ||
                error?.message ||
                "Failed to create Razorpay order.",
              details: error?.error || error,
            }),
            {
              status: statusCode === 401 ? 401 : 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
