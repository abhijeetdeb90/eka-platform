import { createFileRoute } from "@tanstack/react-router";
import {
  requireServerAuth,
  resolveActingUserId,
  assertServerRole,
} from "@/lib/auth/access-control";

/** Public catalog — kept inline so GET never depends on payment provider modules. */
const PUBLIC_PLANS = [
  {
    id: "monthly",
    code: "EKA_PATRON_MONTHLY",
    name: "Monthly EKA+ Membership",
    description:
      "Full access to cultural intelligence, AI exploration, Creator Studio, and community circles.",
    amount_minor: 49900,
    currency: "INR",
    cadence: "monthly",
    period_days: 30,
    is_active: true,
    features: ["cultural_library", "ai_exploration", "community_circles"],
  },
  {
    id: "quarterly",
    code: "EKA_PATRON_QUARTERLY",
    name: "Quarterly Patron Membership",
    description: "Seasonal rhythm alignment with seasonal workshops and heritage previews.",
    amount_minor: 79900,
    currency: "INR",
    cadence: "quarterly",
    period_days: 90,
    is_active: true,
    features: ["cultural_library", "seasonal_workshops", "heritage_previews"],
  },
  {
    id: "annual",
    code: "EKA_PATRON_ANNUAL",
    name: "Annual Patron Membership",
    description: "Full annual cycle of the twelve themes with VIP invitations.",
    amount_minor: 299000,
    currency: "INR",
    cadence: "annual",
    period_days: 365,
    is_active: true,
    features: ["full_annual_cycle", "vip_invitations", "peace_fund_patron"],
  },
  {
    id: "creator_pro",
    code: "EKA_CREATOR_PRO",
    name: "Creator Studio Pro",
    description: "Master Artisan Workspace with Epistemic Tier tagging & priority settlements.",
    amount_minor: 49900,
    currency: "INR",
    cadence: "monthly",
    period_days: 30,
    is_active: true,
    features: ["artisan_studio", "epistemic_tags", "priority_settlement"],
  },
  {
    id: "brand_growth",
    code: "EKA_BRAND_GROWTH",
    name: "Brand Growth OS",
    description: "Trend Radar, Brand Brain AI, Autopilot campaigns and verified creator matching.",
    amount_minor: 999900,
    currency: "INR",
    cadence: "monthly",
    period_days: 30,
    is_active: true,
    features: ["trend_radar", "brand_brain_ai", "creator_marketplace"],
  },
] as const;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": status === 200 ? "public, max-age=60" : "no-store",
    },
  });
}

/**
 * EKA Subscriptions API
 * GET — public plan catalog
 * POST — auth required; user_id bound to caller (admins may act for others)
 */
export const Route = createFileRoute("/api/subscriptions")({
  server: {
    handlers: {
      GET: async () => {
        try {
          return json({ success: true, plans: PUBLIC_PLANS });
        } catch (error) {
          return json({ success: false, error: String(error), plans: [] }, 500);
        }
      },

      POST: async ({ request }) => {
        try {
          const auth = await requireServerAuth(request);
          if (!auth.ok) {
            return json({ error: auth.error }, auth.status);
          }

          // Lazy-load service so GET never pulls provider / node:crypto graph
          const { subscriptionsService } = await import("@/lib/payments/subscriptions.service");

          const body = (await request.json()) as Record<string, unknown>;
          const action = (body["action"] as string) ?? "create_subscription";

          switch (action) {
            case "create_subscription": {
              const target = resolveActingUserId(
                auth.userId,
                auth.roles,
                body["user_id"] as string | undefined,
              );
              if (!target.ok) {
                return json({ error: target.error }, target.status);
              }

              const planId = body["plan_id"] as string;
              const customerName = body["customer_name"] as string;
              const customerEmail = body["customer_email"] as string;
              if (!planId || !customerName || !customerEmail) {
                return json(
                  { error: "plan_id, customer_name, and customer_email are required" },
                  400,
                );
              }

              const subscription = await subscriptionsService.createSubscription({
                user_id: target.userId,
                plan_id: planId,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: body["customer_phone"] as string | undefined,
                gstin: body["gstin"] as string | undefined,
              });

              return json({ success: true, subscription }, 201);
            }

            case "cancel_subscription":
            case "pause_subscription":
            case "resume_subscription":
            case "upgrade_plan": {
              if (body["user_id"] && body["user_id"] !== auth.userId) {
                const admin = await assertServerRole(request, [
                  "admin",
                  "super_admin",
                  "founder",
                ]);
                if (!admin.ok) {
                  return json(
                    { error: "Forbidden: cannot modify another user's subscription" },
                    403,
                  );
                }
              }

              const subId = body["subscription_id"] as string;
              if (!subId) {
                return json({ error: "subscription_id is required" }, 400);
              }

              if (action === "cancel_subscription") {
                const cancelAtPeriodEnd = (body["cancel_at_period_end"] as boolean) ?? true;
                const subscription = await subscriptionsService.cancelSubscription(
                  subId,
                  cancelAtPeriodEnd,
                );
                return json({ success: true, subscription });
              }
              if (action === "pause_subscription") {
                const subscription = await subscriptionsService.pauseSubscription(subId);
                return json({ success: true, subscription });
              }
              if (action === "resume_subscription") {
                const subscription = await subscriptionsService.resumeSubscription(subId);
                return json({ success: true, subscription });
              }

              const newPlanId = body["new_plan_id"] as string;
              if (!newPlanId) {
                return json({ error: "new_plan_id is required" }, 400);
              }
              const subscription = await subscriptionsService.upgradePlan({
                subscription_id: subId,
                new_plan_id: newPlanId,
              });
              return json({ success: true, subscription });
            }

            case "get_user_subscriptions": {
              const target = resolveActingUserId(
                auth.userId,
                auth.roles,
                body["user_id"] as string | undefined,
              );
              if (!target.ok) {
                return json({ error: target.error }, target.status);
              }
              const subscriptions = subscriptionsService.getSubscriptionsByUser(target.userId);
              return json({ success: true, subscriptions });
            }

            default:
              return json({ error: `Unknown action: ${action}` }, 400);
          }
        } catch (error) {
          return json({ error: String(error) }, 400);
        }
      },
    },
  },
});
