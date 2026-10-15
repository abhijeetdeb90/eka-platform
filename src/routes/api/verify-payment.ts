import { createFileRoute } from "@tanstack/react-router";
import crypto from "node:crypto";
import { requireServerAuth, resolveActingUserId } from "@/lib/auth/access-control";

/**
 * Backend Endpoint: Verify Razorpay Payment Signature
 * POST /api/verify-payment
 *
 * Requires authenticated Bearer token. Subscription activation is bound to
 * the authenticated user (admins may activate for another user_id).
 *
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Compares generated signature with razorpay_signature using timing-safe comparison.
 */
export const Route = createFileRoute("/api/verify-payment")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const auth = await requireServerAuth(request);
          if (!auth.ok) {
            return new Response(
              JSON.stringify({ success: false, error: auth.error }),
              { status: auth.status, headers: { "Content-Type": "application/json" } },
            );
          }

          const keySecret = process.env.RAZORPAY_KEY_SECRET;

          if (!keySecret) {
            return new Response(
              JSON.stringify({
                success: false,
                error: "RAZORPAY_KEY_SECRET is not configured on the server.",
              }),
              { status: 500, headers: { "Content-Type": "application/json" } },
            );
          }

          let body: {
            razorpay_order_id?: string;
            razorpay_payment_id?: string;
            razorpay_signature?: string;
            order_id?: string;
            payment_id?: string;
            user_id?: string;
            plan_id?: string;
            amount_minor?: number;
          };

          try {
            body = (await request.json()) as typeof body;
          } catch {
            return new Response(
              JSON.stringify({
                success: false,
                error: "Invalid JSON in request body.",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const orderId = body.razorpay_order_id || body.order_id;
          const paymentId = body.razorpay_payment_id || body.payment_id;
          const signature = body.razorpay_signature;

          if (!orderId || !paymentId || !signature) {
            const missing: string[] = [];
            if (!orderId) missing.push("razorpay_order_id");
            if (!paymentId) missing.push("razorpay_payment_id");
            if (!signature) missing.push("razorpay_signature");

            return new Response(
              JSON.stringify({
                success: false,
                error: `Missing required payment verification fields: ${missing.join(", ")}`,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const payload = `${orderId}|${paymentId}`;
          const generatedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(payload)
            .digest("hex");

          const a = Buffer.from(generatedSignature, "utf-8");
          const b = Buffer.from(signature, "utf-8");
          const isMatch = a.length === b.length && crypto.timingSafeEqual(a, b);

          if (!isMatch) {
            console.warn("[Razorpay Verification Failed]: Signature mismatch for order", orderId);
            return new Response(
              JSON.stringify({
                success: false,
                error: "Payment signature verification failed. Signature mismatch.",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const target = resolveActingUserId(auth.userId, auth.roles, body.user_id);
          if (!target.ok) {
            return new Response(
              JSON.stringify({ success: false, error: target.error }),
              { status: target.status, headers: { "Content-Type": "application/json" } },
            );
          }

          const planId = body.plan_id || "plus";
          const amountMinor = body.amount_minor || 49900;

          try {
            const supabaseUrl =
              process.env.SUPABASE_URL ||
              process.env.VITE_SUPABASE_URL ||
              "https://kbiutqzhcbyuseygcspe.supabase.co";
            const supabaseKey =
              process.env.SUPABASE_SERVICE_ROLE_KEY ||
              process.env.SUPABASE_SECRET_KEY ||
              process.env.SUPABASE_ANON_KEY ||
              process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
              "";

            if (!supabaseKey) {
              console.warn("[verify-payment] No Supabase key available for persistence");
            } else {
              const renewalDate = new Date(Date.now() + 30 * 86400 * 1000).toISOString();
              await fetch(`${supabaseUrl}/rest/v1/subscriptions`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  apikey: supabaseKey,
                  Authorization: `Bearer ${supabaseKey}`,
                  Prefer: "resolution=merge-duplicates",
                },
                body: JSON.stringify({
                  user_id: target.userId,
                  plan: planId,
                  status: "active",
                  price_cents: amountMinor,
                  currency: "INR",
                  razorpay_payment_id: paymentId,
                  razorpay_order_id: orderId,
                  current_period_end: renewalDate,
                  cancel_at_period_end: false,
                  updated_at: new Date().toISOString(),
                }),
              });
            }
          } catch (persistErr) {
            console.warn("[verify-payment] Database persistence notice:", persistErr);
          }

          return new Response(
            JSON.stringify({
              success: true,
              message: "Payment verified successfully.",
              order_id: orderId,
              payment_id: paymentId,
              user_id: target.userId,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        } catch (error: any) {
          console.error("[Razorpay verify-payment error]:", error);
          return new Response(
            JSON.stringify({
              success: false,
              error: error?.message || "Failed to verify payment.",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
