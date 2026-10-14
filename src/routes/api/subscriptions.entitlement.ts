import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Server-Side Endpoint: Verify EKA+ Subscription Entitlement
 * GET /api/subscriptions/entitlement
 * 
 * Cryptographically verifies user's Bearer token and checks the Supabase database
 * for an active, unexpired subscription row.
 */
export const Route = createFileRoute("/api/subscriptions/entitlement")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(
              JSON.stringify({
                isEntitled: false,
                reason: "Unauthenticated. No Bearer token provided.",
              }),
              { status: 401, headers: { "Content-Type": "application/json" } }
            );
          }

          const token = authHeader.replace("Bearer ", "").trim();
          const supabaseUrl =
            process.env.SUPABASE_URL ||
            process.env.VITE_SUPABASE_URL ||
            "https://kbiutqzhcbyuseygcspe.supabase.co";
          const publishableKey =
            process.env.SUPABASE_PUBLISHABLE_KEY ||
            process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
            "sb_publishable_DKdNOtbppccL297o2_Ixkw_f2j0Rf7-";

          const client = createClient<Database>(supabaseUrl, publishableKey, {
            global: {
              headers: { Authorization: `Bearer ${token}` },
            },
            auth: { persistSession: false },
          });

          const { data: userData, error: userError } = await client.auth.getUser(token);
          if (userError || !userData?.user) {
            return new Response(
              JSON.stringify({
                isEntitled: false,
                reason: "Invalid or expired authorization token.",
              }),
              { status: 401, headers: { "Content-Type": "application/json" } }
            );
          }

          const userId = userData.user.id;

          // Query subscriptions for this verified user
          const { data: sub, error: subError } = await client
            .from("subscriptions")
            .select("plan, status, current_period_end, paused_until, cancel_at_period_end")
            .eq("user_id", userId)
            .maybeSingle();

          if (subError) {
            console.error("[Entitlement Check DB Error]:", subError);
          }

          if (!sub) {
            return new Response(
              JSON.stringify({
                isEntitled: false,
                userId,
                plan: "free",
                status: "none",
              }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            );
          }

          const now = Date.now();
          const periodEnd = sub.current_period_end ? new Date(sub.current_period_end).getTime() : null;
          const pausedUntil = sub.paused_until ? new Date(sub.paused_until).getTime() : null;

          // Is paused?
          if (pausedUntil && pausedUntil > now) {
            return new Response(
              JSON.stringify({
                isEntitled: false,
                userId,
                plan: sub.plan,
                status: "paused",
                paused_until: sub.paused_until,
              }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            );
          }

          // Active or trialing status
          const isActiveStatus = sub.status === "active" || sub.status === "trialing" || sub.status === "past_due";
          const isNotExpired = !periodEnd || periodEnd >= now;
          const isEntitledPlan =
            sub.plan === "plus" || sub.plan === "creator" || sub.plan === "annual" || sub.plan === "monthly";

          const isEntitled = Boolean(isActiveStatus && isNotExpired && isEntitledPlan);

          return new Response(
            JSON.stringify({
              isEntitled,
              userId,
              plan: sub.plan,
              status: sub.status,
              current_period_end: sub.current_period_end,
              cancel_at_period_end: sub.cancel_at_period_end,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        } catch (err: any) {
          console.error("[Entitlement check exception]:", err);
          return new Response(
            JSON.stringify({
              isEntitled: false,
              error: err.message || "Failed to verify entitlement.",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
