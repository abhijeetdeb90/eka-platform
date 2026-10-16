import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import Razorpay from "razorpay";
import crypto from "node:crypto";
import { PLUS_ANNUAL_PAISE, PLUS_PRICE_PAISE } from "@/lib/constants/economics";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export const Route = createFileRoute("/api/verify-payment")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization") ?? "";
          if (!authHeader.startsWith("Bearer ")) return json({ success: false, error: "Authentication required." }, 401);

          const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
          const publishableKey =
            process.env.SUPABASE_PUBLISHABLE_KEY ||
            process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
            process.env.SUPABASE_ANON_KEY ||
            process.env.VITE_SUPABASE_ANON_KEY;
          if (!supabaseUrl || !publishableKey) return json({ success: false, error: "Supabase server auth is not configured." }, 503);

          const token = authHeader.slice("Bearer ".length).trim();
          const authClient = createClient(supabaseUrl, publishableKey, { auth: { persistSession: false } });
          const { data: auth, error: authError } = await authClient.auth.getUser(token);
          if (authError || !auth.user) return json({ success: false, error: "Your session is invalid or expired." }, 401);

          const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
          const keySecret = process.env.RAZORPAY_KEY_SECRET;
          if (!keyId || !keySecret) return json({ success: false, error: "Razorpay credentials are not configured." }, 503);

          let body: { razorpay_order_id?: string; razorpay_payment_id?: string; razorpay_signature?: string };
          try {
            body = (await request.json()) as typeof body;
          } catch {
            return json({ success: false, error: "Invalid JSON request body." }, 400);
          }

          const orderId = body.razorpay_order_id;
          const paymentId = body.razorpay_payment_id;
          const signature = body.razorpay_signature;
          if (!orderId || !paymentId || !signature) {
            return json({ success: false, error: "Missing required Razorpay verification fields." }, 400);
          }

          const expectedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");
          const a = Buffer.from(expectedSignature, "utf8");
          const b = Buffer.from(signature, "utf8");
          if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
            return json({ success: false, error: "Payment signature verification failed." }, 400);
          }

          const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
          const [order, payment] = await Promise.all([
            razorpay.orders.fetch(orderId),
            razorpay.payments.fetch(paymentId),
          ]);
          const plan = order.notes?.plan;
          const expectedAmount =
            plan === "annual" ? PLUS_ANNUAL_PAISE :
            plan === "plus" || plan === "monthly" || plan === "creator" ? PLUS_PRICE_PAISE :
            null;

          if (expectedAmount === null) return json({ success: false, error: "Order has an unsupported membership plan." }, 400);
          if (order.notes?.user_id !== auth.user.id) return json({ success: false, error: "This order does not belong to the signed-in account." }, 403);
          if (payment.order_id !== orderId || payment.amount !== expectedAmount || order.amount !== expectedAmount || payment.currency !== "INR") {
            return json({ success: false, error: "The payment does not match the expected order amount or currency." }, 400);
          }
          if (payment.status !== "captured") {
            return json({ success: false, error: "Payment is not captured yet. Membership has not been activated." }, 409);
          }

          const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          if (!serviceRoleKey) {
            console.error("[Razorpay verify-payment] SUPABASE_SERVICE_ROLE_KEY is not configured.");
            return json({ success: false, error: "Payment was verified, but membership activation is not configured. Please contact support." }, 503);
          }

          const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

          // Tie provider payment to an order created by EKA for this authenticated user.
          const { data: localOrder, error: localOrderError } = await admin
            .from("orders")
            .select("order_id, user_id, amount_minor, currency, status, purpose, notes")
            .eq("order_id", orderId)
            .maybeSingle();
          if (localOrderError || !localOrder) {
            console.error("[Razorpay verify-payment] Local order lookup failed:", localOrderError?.message || "Order not found");
            return json({ success: false, error: "This checkout order is not registered with EKA." }, 409);
          }
          const localNotes = (localOrder.notes ?? {}) as Record<string, unknown>;
          if (
            localOrder.user_id !== auth.user.id ||
            localOrder.purpose !== "subscription" ||
            localOrder.amount_minor !== expectedAmount ||
            localOrder.currency !== "INR" ||
            localNotes.plan !== plan ||
            localOrder.status === "EXPIRED"
          ) {
            return json({ success: false, error: "The EKA order does not match this account or membership plan." }, 403);
          }

          const now = new Date();
          const periodDays = plan === "annual" ? 365 : 30;
          const proposedPeriodEnd = new Date(now.getTime() + periodDays * 86_400_000).toISOString();
          const { data: existingSubscription, error: existingSubscriptionError } = await admin
            .from("subscriptions")
            .select("provider_reference, current_period_end, started_at, status")
            .eq("user_id", auth.user.id)
            .eq("plan", plan)
            .maybeSingle();
          if (existingSubscriptionError) {
            console.error("[Razorpay verify-payment] Existing subscription lookup failed:", existingSubscriptionError.message);
            return json({ success: false, error: "Could not verify the current membership state." }, 500);
          }
          const sameVerifiedOrder =
            existingSubscription?.provider_reference === orderId &&
            existingSubscription?.status === "active";
          const currentPeriodEnd =
            sameVerifiedOrder && existingSubscription?.current_period_end
              ? existingSubscription.current_period_end
              : proposedPeriodEnd;
          const startedAt =
            sameVerifiedOrder && existingSubscription?.started_at
              ? existingSubscription.started_at
              : now.toISOString();

          const paymentWrite = await admin.from("payments").upsert({
            payment_id: paymentId,
            order_id: orderId,
            user_id: auth.user.id,
            amount_minor: payment.amount,
            currency: payment.currency,
            status: "CAPTURED",
            method: ["card", "netbanking", "wallet", "emi", "upi"].includes(payment.method || "") ? payment.method : "unknown",
            razorpay_payment_id: paymentId,
            razorpay_order_id: orderId,
            razorpay_signature: signature,
            captured_at: now.toISOString(),
            metadata: { plan },
            updated_at: now.toISOString(),
          }, { onConflict: "payment_id" });
          if (paymentWrite.error) {
            console.error("[Razorpay verify-payment] Payment persistence failed:", paymentWrite.error.message);
            return json({ success: false, error: "Payment was captured, but recording it failed. Please retry verification." }, 500);
          }

          const subscriptionWrite = await admin.from("subscriptions").upsert({
            user_id: auth.user.id,
            plan,
            status: "active",
            provider: "razorpay",
            price_cents: payment.amount,
            currency: "INR",
            razorpay_payment_id: paymentId,
            current_period_end: currentPeriodEnd,
            expires_at: currentPeriodEnd,
            provider_reference: orderId,
            started_at: startedAt,
            cancel_at_period_end: false,
            canceled_at: null,
            paused_until: null,
            updated_at: now.toISOString(),
          }, { onConflict: "user_id,plan" });
          if (subscriptionWrite.error) {
            console.error("[Razorpay verify-payment] Subscription persistence failed:", subscriptionWrite.error.message);
            return json({ success: false, error: "Payment was captured, but membership activation failed. Please contact support." }, 500);
          }

          const orderUpdate = await admin
            .from("orders")
            .update({ status: "PAID", updated_at: now.toISOString() })
            .eq("order_id", orderId)
            .eq("user_id", auth.user.id);
          if (orderUpdate.error) {
            console.error("[Razorpay verify-payment] Local order completion failed:", orderUpdate.error.message);
            return json({ success: false, error: "Membership was recorded, but the checkout receipt could not be finalized. Please retry verification." }, 500);
          }

          return json({ success: true, message: "Payment verified and membership activated.", order_id: orderId, payment_id: paymentId });
        } catch (error: any) {
          console.error("[Razorpay verify-payment error]:", error?.message || "Unknown error");
          return json({ success: false, error: "Failed to verify payment with the payment provider." }, 500);
        }
      },
    },
  },
});
