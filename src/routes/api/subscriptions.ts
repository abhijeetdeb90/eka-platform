import { createFileRoute } from "@tanstack/react-router";
import { subscriptionsService } from "@/lib/payments/subscriptions.service";
import { requireServerAuth, resolveActingUserId, assertServerRole } from "@/lib/auth/access-control";

/**
 * EKA Subscriptions API: Plans, Recurring Subscriptions, Upgrades & Cancellations
 * GET plans is public. All mutating actions require auth and bind user_id
 * to the authenticated principal (admins may act on behalf of others).
 */
export const Route = createFileRoute("/api/subscriptions")({
  server: {
    handlers: {
      GET: async () => {
        const plans = subscriptionsService.getPlans();
        return new Response(JSON.stringify({ success: true, plans }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },

      POST: async ({ request }) => {
        try {
          const auth = await requireServerAuth(request);
          if (!auth.ok) {
            return new Response(JSON.stringify({ error: auth.error }), {
              status: auth.status,
              headers: { "Content-Type": "application/json" },
            });
          }

          const body = (await request.json()) as Record<string, unknown>;
          const action = (body["action"] as string) ?? "create_subscription";

          switch (action) {
            case "create_subscription": {
              const target = resolveActingUserId(
                auth.userId,
                auth.roles,
                body["user_id"] as string | undefined
              );
              if (!target.ok) {
                return new Response(JSON.stringify({ error: target.error }), {
                  status: target.status,
                  headers: { "Content-Type": "application/json" },
                });
              }

              const planId = body["plan_id"] as string;
              const customerName = body["customer_name"] as string;
              const customerEmail = body["customer_email"] as string;
              if (!planId || !customerName || !customerEmail) {
                return new Response(
                  JSON.stringify({ error: "plan_id, customer_name, and customer_email are required" }),
                  { status: 400, headers: { "Content-Type": "application/json" } }
                );
              }
              const customerPhone = body["customer_phone"] as string | undefined;
              const gstin = body["gstin"] as string | undefined;

              const subscription = await subscriptionsService.createSubscription({
                user_id: target.userId,
                plan_id: planId,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
                gstin,
              });

              return new Response(JSON.stringify({ success: true, subscription }), {
                status: 201,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "cancel_subscription":
            case "pause_subscription":
            case "resume_subscription":
            case "upgrade_plan": {
              if (body["user_id"] && body["user_id"] !== auth.userId) {
                const admin = await assertServerRole(request, ["admin", "super_admin", "founder"]);
                if (!admin.ok) {
                  return new Response(JSON.stringify({ error: "Forbidden: cannot modify another user's subscription" }), {
                    status: 403,
                    headers: { "Content-Type": "application/json" },
                  });
                }
              }

              const subId = body["subscription_id"] as string;
              if (!subId) {
                return new Response(JSON.stringify({ error: "subscription_id is required" }), {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                });
              }

              if (action === "cancel_subscription") {
                const cancelAtPeriodEnd = (body["cancel_at_period_end"] as boolean) ?? true;
                const subscription = await subscriptionsService.cancelSubscription(subId, cancelAtPeriodEnd);
                return new Response(JSON.stringify({ success: true, subscription }), {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                });
              }
              if (action === "pause_subscription") {
                const subscription = await subscriptionsService.pauseSubscription(subId);
                return new Response(JSON.stringify({ success: true, subscription }), {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                });
              }
              if (action === "resume_subscription") {
                const subscription = await subscriptionsService.resumeSubscription(subId);
                return new Response(JSON.stringify({ success: true, subscription }), {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                });
              }
              const newPlanId = body["new_plan_id"] as string;
              if (!newPlanId) {
                return new Response(JSON.stringify({ error: "new_plan_id is required" }), {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                });
              }
              const subscription = await subscriptionsService.upgradePlan({
                subscription_id: subId,
                new_plan_id: newPlanId,
              });
              return new Response(JSON.stringify({ success: true, subscription }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "get_user_subscriptions": {
              const target = resolveActingUserId(
                auth.userId,
                auth.roles,
                body["user_id"] as string | undefined
              );
              if (!target.ok) {
                return new Response(JSON.stringify({ error: target.error }), {
                  status: target.status,
                  headers: { "Content-Type": "application/json" },
                });
              }
              const subscriptions = subscriptionsService.getSubscriptionsByUser(target.userId);
              return new Response(JSON.stringify({ success: true, subscriptions }), {
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
