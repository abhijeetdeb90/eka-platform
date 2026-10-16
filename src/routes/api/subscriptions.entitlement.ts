import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/api/subscriptions/entitlement")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const json = (body: unknown, status = 200) =>
          new Response(JSON.stringify(body), {
            status,
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          });

        try {
          const header = request.headers.get("authorization") || request.headers.get("Authorization");
          if (!header?.startsWith("Bearer ")) return json({ isEntitled: false, reason: "Sign in required." }, 401);

          const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
          const publishableKey =
            process.env.SUPABASE_PUBLISHABLE_KEY ||
            process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
            process.env.SUPABASE_ANON_KEY ||
            process.env.VITE_SUPABASE_ANON_KEY;
          if (!supabaseUrl || !publishableKey) {
            return json({ isEntitled: false, reason: "Membership verification is not configured." }, 503);
          }

          const token = header.slice("Bearer ".length).trim();
          const client = createClient<Database>(supabaseUrl, publishableKey, {
            global: { headers: { Authorization: `Bearer ${token}` } },
            auth: { persistSession: false, autoRefreshToken: false },
          });
          const { data: auth, error: authError } = await client.auth.getUser(token);
          if (authError || !auth.user) return json({ isEntitled: false, reason: "Session is invalid or expired." }, 401);

          const { data: records, error } = await client
            .from("subscriptions")
            .select("plan, status, current_period_end, paused_until, cancel_at_period_end, provider, provider_reference, razorpay_payment_id, updated_at")
            .eq("user_id", auth.user.id)
            .order("updated_at", { ascending: false })
            .limit(5);

          if (error) {
            console.error("[Entitlement Check DB Error]:", error.message);
            return json({ isEntitled: false, reason: "Membership could not be verified." }, 503);
          }

          const now = Date.now();
          const validPlans = new Set(["plus", "creator", "annual", "monthly"]);
          const entitledRecord = (records || []).find((sub) => {
            const end = sub.current_period_end ? new Date(sub.current_period_end).getTime() : null;
            const pausedUntil = sub.paused_until ? new Date(sub.paused_until).getTime() : null;
            const providerVerified =
              sub.status === "active" &&
              sub.provider === "razorpay" &&
              Boolean(sub.razorpay_payment_id || sub.provider_reference);
            const trustedTrial = sub.status === "trialing" && sub.provider === "internal_trial";
            return (
              validPlans.has(sub.plan) &&
              (providerVerified || trustedTrial) &&
              end !== null &&
              Number.isFinite(end) &&
              end >= now &&
              !(pausedUntil && pausedUntil > now)
            );
          });

          if (!entitledRecord) return json({ isEntitled: false, userId: auth.user.id, plan: "free", status: "none" });

          return json({
            isEntitled: true,
            userId: auth.user.id,
            plan: entitledRecord.plan,
            status: entitledRecord.status,
            current_period_end: entitledRecord.current_period_end,
            cancel_at_period_end: entitledRecord.cancel_at_period_end,
          });
        } catch (error) {
          console.error("[Entitlement check exception]:", error instanceof Error ? error.message : "Unknown error");
          return json({ isEntitled: false, reason: "Could not verify membership." }, 500);
        }
      },
    },
  },
});
