import { createFileRoute } from "@tanstack/react-router";
import crypto from "node:crypto";

/**
 * Backend Endpoint: Verify Razorpay Payment Signature
 * POST /api/verify-payment
 * 
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Compares generated signature with razorpay_signature using timing-safe comparison.
 * Return success (200) only if signatures match.
 * Return 400 for signature mismatch or missing fields.
 */
export const Route = createFileRoute("/api/verify-payment")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
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

          // Missing fields validation
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

          // HMAC-SHA256 algorithm: order_id + "|" + payment_id
          const payload = `${orderId}|${paymentId}`;
          const generatedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(payload)
            .digest("hex");

          const a = Buffer.from(generatedSignature, "utf-8");
          const b = Buffer.from(signature, "utf-8");

          // Timing-safe comparison to prevent side-channel timing attacks
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

          return new Response(
            JSON.stringify({
              success: true,
              message: "Payment verified successfully.",
              order_id: orderId,
              payment_id: paymentId,
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
