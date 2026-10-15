import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { subscriptionsService } from "@/lib/payments/subscriptions.service";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

/**
 * Public plan catalogue plus authenticated, durable membership management.
 * The legacy in-memory subscription writer is intentionally not used for mutations.
 */
export const Route = createFileRoute("/api/subscriptions")({
  server: {
    handlers: {
      GET: async () => json({ success: true, plans: subscriptionsService.getPlans() }),
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
          const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
            return json({ error: "Secure membership management is not configured." }, 503);
          }

          const token = authHeader.slice("Bearer ".length).trim();
          const authClient = createClient(supabaseUrl, publishableKey, { auth: { persistSession: false } });
          const { data: auth, error: authError } = await authClient.auth.getUser(token);
          if (authError || !auth.user) return json({ error: "Your session is invalid or expired." }, 401);

          let body: { action?: string; days?: number };
          try {
            body = (await request.json()) as typeof body;
          } catch {
            return json({ error: "Invalid JSON request body." }, 400);
          }

          const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
          if (body.action === "get_user_subscriptions") {
            const { data, error } = await admin
              .from("subscriptions")
              .select("plan,status,provider,price_cents,currency,started_at,current_period_end,cancel_at_period_end,canceled_at,paused_until,created_at,updated_at")
              .eq("user_id", auth.user.id)
              .order("updated_at", { ascending: false });
            if (error) return json({ error: "Could not load your memberships." }, 500);
            return json({ success: true, subscriptions: data ?? [] });
          }

          if (["create_subscription", "upgrade_plan"].includes(body.action ?? "")) {
            return json({
              error: "This legacy in-memory subscription flow is disabled. Use the verified EKA+ checkout for purchases; plan changes are not yet available.",
            }, 409);
          }

          const { data: sub, error: readError } = await admin
            .from("subscriptions")
            .select("plan,status,current_period_end,cancel_at_period_end,paused_until")
            .eq("user_id", auth.user.id)
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (readError) {
            console.error("[subscriptions] lookup failed:", readError.message);
            return json({ error: "Could not load your membership." }, 500);
          }
          if (!sub) return json({ error: "No membership was found for this account." }, 404);

          const now = new Date();
          const periodEnd = sub.current_period_end ? new Date(sub.current_period_end) : null;
          const current = ["active", "trialing", "past_due"].includes(sub.status) &&
            (!periodEnd || periodEnd.getTime() >= now.getTime());
          if (!current) return json({ error: "Only a current membership can be changed." }, 409);

          let patch: Record<string, unknown>;
          switch (body.action) {
            case "cancel":
            case "cancel_subscription":
              patch = { cancel_at_period_end: true, canceled_at: now.toISOString(), updated_at: now.toISOString() };
              break;
            case "resume":
            case "resume_subscription":
              if (sub.status !== "active" && sub.status !== "trialing") {
                return json({ error: "Only an active membership can be resumed." }, 409);
              }
              patch = { cancel_at_period_end: false, canceled_at: null, paused_until: null, updated_at: now.toISOString() };
              break;
            case "pause":
            case "pause_subscription": {
              const days = Number(body.days);
              if (!Number.isInteger(days) || days < 1 || days > 30) {
                return json({ error: "Pause duration must be between 1 and 30 days." }, 400);
              }
              const preservedPeriodEnd = periodEnd && periodEnd.getTime() > now.getTime() ? periodEnd : now;
              patch = {
                paused_until: new Date(now.getTime() + days * 86_400_000).toISOString(),
                current_period_end: new Date(preservedPeriodEnd.getTime() + days * 86_400_000).toISOString(),
                cancel_at_period_end: false,
                canceled_at: null,
                retention_offer_applied: true,
                updated_at: now.toISOString(),
              };
              break;
            }
            default:
              return json({ error: "Unsupported membership action." }, 400);
          }

          const { error: updateError } = await admin
            .from("subscriptions")
            .update(patch)
            .eq("user_id", auth.user.id)
            .eq("plan", sub.plan);
          if (updateError) {
            console.error("[subscriptions] update failed:", updateError.message);
            return json({ error: "Membership update failed. Please try again." }, 500);
          }

          return json({ success: true, action: body.action, plan: sub.plan });
        } catch (error: any) {
          console.error("[subscriptions] request failed:", error?.message || "Unknown error");
          return json({ error: "Membership request failed." }, 500);
        }
      },
    },
  },
});
