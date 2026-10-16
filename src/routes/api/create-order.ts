import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import Razorpay from "razorpay";
import { PLUS_ANNUAL_PAISE, PLUS_PRICE_PAISE } from "@/lib/constants/economics";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export const Route = createFileRoute("/api/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization") ?? "";
          if (!authHeader.startsWith("Bearer ")) return json({ error: "Authentication required." }, 401);

          const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
          const publishableKey =
            process.env.SUPABASE_PUBLISHABLE_KEY ||
            process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
            process.env.SUPABASE_ANON_KEY ||
            process.env.VITE_SUPABASE_ANON_KEY;
          if (!supabaseUrl || !publishableKey) return json({ error: "Supabase server auth is not configured." }, 503);

          const token = authHeader.slice("Bearer ".length).trim();
          const authClient = createClient(supabaseUrl, publishableKey, { auth: { persistSession: false } });
          const { data: auth, error: authError } = await authClient.auth.getUser(token);
          if (authError || !auth.user) return json({ error: "Your session is invalid or expired. Please sign in again." }, 401);

          const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
          const keySecret = process.env.RAZORPAY_KEY_SECRET;
          if (!keyId || !keySecret) return json({ error: "Razorpay credentials are not configured." }, 503);

          let body: { amount?: number; currency?: string; receipt?: string; notes?: Record<string, string> };
          try {
            body = (await request.json()) as typeof body;
          } catch {
            return json({ error: "Invalid JSON request body." }, 400);
          }

          const plan = body.notes?.plan;
          const expectedAmount =
            plan === "annual" ? PLUS_ANNUAL_PAISE :
            plan === "plus" || plan === "monthly" || plan === "creator" ? PLUS_PRICE_PAISE :
            null;

          if (typeof plan !== "string" || expectedAmount === null) return json({ error: "Unsupported subscription plan." }, 400);
          if (Number(body.amount) !== expectedAmount) {
            return json({ error: "The requested amount does not match the selected EKA membership plan." }, 400);
          }
          if ((body.currency || "INR") !== "INR") return json({ error: "Only INR memberships are supported." }, 400);

          const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
          const receipt = body.receipt || `eka_${auth.user.id.slice(0, 8)}_${Date.now()}`;
          const order = await razorpay.orders.create({
            amount: expectedAmount,
            currency: "INR",
            receipt,
            notes: { user_id: auth.user.id, plan },
          }) as unknown as { id: string; amount: number; currency: string; receipt: string | null; status: string };

          // Persist the EKA order before exposing checkout. payments.order_id references this record.
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { error: orderSaveError } = await supabaseAdmin.from("orders").insert({
            order_id: order.id,
            user_id: auth.user.id,
            amount_minor: expectedAmount,
            currency: "INR",
            receipt: order.receipt || receipt,
            razorpay_order_id: order.id,
            status: "CREATED",
            purpose: "subscription",
            notes: { user_id: auth.user.id, plan },
            metadata: { provider: "razorpay", checkout_version: "eka-plus-v1" },
          });
          if (orderSaveError) {
            console.error("[Razorpay create-order] Local order persistence failed:", orderSaveError.message);
            return json({ error: "Could not safely record the checkout order. Please retry." }, 503);
          }

          return json({
            order_id: order.id,
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            status: order.status,
          });
        } catch (error: any) {
          console.error("[Razorpay create-order error]:", error?.message || "Unknown error");
          return json({ error: error?.error?.description || "Failed to create Razorpay order." }, 500);
        }
      },
    },
  },
});
