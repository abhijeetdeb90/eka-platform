import { createFileRoute } from "@tanstack/react-router";
import { subscriptionsService } from "@/lib/payments/subscriptions.service";

/**
 * EKA Subscriptions API: Plans, Recurring Subscriptions, Upgrades & Cancellations
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
          const body = (await request.json()) as Record<string, unknown>;
          const action = (body["action"] as string) ?? "create_subscription";

          switch (action) {
            case "create_subscription": {
              const userId = body["user_id"] as string;
              const planId = body["plan_id"] as string;
              const customerName = body["customer_name"] as string;
              const customerEmail = body["customer_email"] as string;
              const customerPhone = body["customer_phone"] as string | undefined;
              const gstin = body["gstin"] as string | undefined;

              const subscription = await subscriptionsService.createSubscription({
                user_id: userId,
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

            case "cancel_subscription": {
              const subId = body["subscription_id"] as string;
              const cancelAtPeriodEnd = (body["cancel_at_period_end"] as boolean) ?? true;
              const subscription = await subscriptionsService.cancelSubscription(subId, cancelAtPeriodEnd);

              return new Response(JSON.stringify({ success: true, subscription }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "pause_subscription": {
              const subId = body["subscription_id"] as string;
              const subscription = await subscriptionsService.pauseSubscription(subId);

              return new Response(JSON.stringify({ success: true, subscription }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "resume_subscription": {
              const subId = body["subscription_id"] as string;
              const subscription = await subscriptionsService.resumeSubscription(subId);

              return new Response(JSON.stringify({ success: true, subscription }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }

            case "upgrade_plan": {
              const subId = body["subscription_id"] as string;
              const newPlanId = body["new_plan_id"] as string;
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
              const userId = body["user_id"] as string;
              const subscriptions = subscriptionsService.getSubscriptionsByUser(userId);

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
