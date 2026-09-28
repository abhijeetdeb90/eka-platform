import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Stripe subscription lifecycle webhook.
 *
 * Entitlement is never toggled by the client: every state change lands here,
 * is stored once (unique provider + event id) and then written to the
 * subscription row. Replays and out-of-order deliveries are safe because the
 * handler is idempotent and the app derives access from the row, not a flag.
 */
export const Route = createFileRoute("/api/public/billing/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["STRIPE_WEBHOOK_SECRET"];
        const body = await request.text();
        const header = request.headers.get("stripe-signature") ?? "";

        if (!secret) return new Response("Billing webhook is not configured", { status: 503 });
        if (!verify(header, body, secret))
          return new Response("Invalid signature", { status: 401 });

        let event: StripeEvent;
        try {
          event = JSON.parse(body) as StripeEvent;
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { error: dupe } = await supabaseAdmin.from("billing_events").insert({
          provider: "stripe",
          event_id: event.id,
          type: event.type,
          payload: event as never,
        });
        // Duplicate delivery: already recorded, nothing more to do.
        if (dupe && dupe.code === "23505") return new Response("ok (duplicate)");

        try {
          await applyEvent(supabaseAdmin, event);
          await supabaseAdmin
            .from("billing_events")
            .update({ processed_at: new Date().toISOString() })
            .eq("provider", "stripe")
            .eq("event_id", event.id);
        } catch (error) {
          console.error("billing webhook failed", event.type, error);
          await supabaseAdmin
            .from("billing_events")
            .update({ error: String(error) })
            .eq("provider", "stripe")
            .eq("event_id", event.id);
          // Non-2xx makes Stripe retry, so entitlement eventually converges.
          return new Response("processing failed", { status: 500 });
        }

        return new Response("ok");
      },
    },
  },
});

type StripeEvent = {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
};

function verify(header: string, body: string, secret: string) {
  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k ?? "", v ?? ""];
    }),
  ) as { t?: string; v1?: string };
  if (!parts.t || !parts.v1) return false;
  // Reject anything older than five minutes to block replayed deliveries.
  if (Math.abs(Date.now() / 1000 - Number(parts.t)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${parts.t}.${body}`).digest("hex");
  const a = Buffer.from(parts.v1);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function iso(seconds: unknown) {
  return typeof seconds === "number" ? new Date(seconds * 1000).toISOString() : null;
}

type AdminClient = Awaited<typeof import("@/integrations/supabase/client.server")>["supabaseAdmin"];

async function applyEvent(admin: AdminClient, event: StripeEvent) {
  const obj = event.data.object;
  const userId =
    (obj["metadata"] as Record<string, string> | undefined)?.["user_id"] ??
    (obj["client_reference_id"] as string | undefined);

  const patch: Record<string, unknown> = {};

  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.resumed": {
      const status = String(obj["status"] ?? "active");
      patch["status"] = status === "incomplete" ? "past_due" : status;
      patch["cancel_at_period_end"] = Boolean(obj["cancel_at_period_end"]);
      patch["current_period_end"] = iso(obj["current_period_end"]);
      patch["paused_until"] = obj["pause_collection"] ? iso(obj["resumes_at"]) : null;
      patch["provider"] = "stripe";
      patch["provider_customer_id"] = obj["customer"] ?? null;
      patch["provider_subscription_id"] = obj["id"] ?? null;
      patch["provider_reference"] = obj["id"] ?? null;
      const item = (
        obj["items"] as
          | { data?: { price?: { id?: string; unit_amount?: number; currency?: string } }[] }
          | undefined
      )?.data?.[0];
      if (item?.price?.id) patch["provider_price_id"] = item.price.id;
      if (typeof item?.price?.unit_amount === "number")
        patch["price_cents"] = item.price.unit_amount;
      if (item?.price?.currency) patch["currency"] = item.price.currency.toUpperCase();
      break;
    }
    case "customer.subscription.paused":
      patch["paused_until"] = iso(obj["resumes_at"]);
      patch["status"] = "paused";
      break;
    case "customer.subscription.deleted":
      patch["status"] = "canceled";
      patch["canceled_at"] = new Date().toISOString();
      patch["cancel_at_period_end"] = false;
      break;
    case "invoice.payment_failed":
      patch["status"] = "past_due";
      break;
    case "invoice.payment_succeeded":
      patch["status"] = "active";
      patch["current_period_end"] = iso(
        (obj["lines"] as { data?: { period?: { end?: number } }[] } | undefined)?.data?.[0]?.period
          ?.end,
      );
      break;
    default:
      return; // Unhandled event types are recorded but change nothing.
  }

  if (userId) {
    await admin
      .from("subscriptions")
      .update(patch as never)
      .eq("user_id", userId);
    return;
  }
  const subId = obj["id"] ?? obj["subscription"];
  if (typeof subId === "string") {
    await admin
      .from("subscriptions")
      .update(patch as never)
      .eq("provider_subscription_id", subId);
  }
}
