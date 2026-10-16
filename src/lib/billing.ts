import { supabase } from "@/integrations/supabase/client";
import { currentUserId } from "@/lib/api";
import { PLUS_PRICE_PAISE, PLUS_ANNUAL_PAISE } from "@/lib/constants/economics";

/** One membership, two billing cadences. ₹499/month is the unified EKA+ price. */
export const PLANS = [
  {
    id: "monthly",
    name: "Monthly",
    priceCents: PLUS_PRICE_PAISE,
    currency: "INR",
    label: "₹499",
    cadence: "month",
    periodDays: 30,
    blurb:
      "Full access to cultural library, Ask EKA AI, primary sources, and the premium Creator Studio workspace.",
  },
  {
    id: "annual",
    name: "Annual",
    priceCents: PLUS_ANNUAL_PAISE,
    currency: "INR",
    label: "₹4,990",
    cadence: "year",
    periodDays: 365,
    blurb: "Two months on us. Full annual cycle of the twelve themes, Ask EKA AI, and Creator Studio.",
  },
] as const;

/**
 * EKA Platform Commission Model:
 * 5–10% platform commission on services, bookings, transactions, and commercial activity.
 */
export const PLATFORM_COMMISSION = {
  servicesRatePercent: 5.0, // 5% platform commission on services, consultations, bookings, workshops
  marketplaceRatePercent: 10.0, // 10% on physical items, ritual kits, and commercial transactions
  calculatePayout: (amountCents: number, category: "services" | "marketplace" = "services") => {
    const rate = category === "marketplace" ? 0.1 : 0.05;
    const commissionCents = Math.round(amountCents * rate);
    const creatorCents = amountCents - commissionCents;
    return { rate, ratePercent: rate * 100, commissionCents, creatorCents };
  },
} as const;

export type PlanId = (typeof PLANS)[number]["id"];

export function planFor(id: string | null | undefined) {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

export function formatINR(cents: number) {
  return `₹${(cents / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export type SubscriptionRow = {
  id: string;
  plan: string;
  status: string;
  started_at: string | null;
  expires_at: string | null;
  cancel_at_period_end: boolean | null;
  current_period_end: string | null;
  canceled_at: string | null;
  paused_until: string | null;
  retention_offer_applied: boolean | null;
  price_cents: number | null;
  currency: string | null;
  provider?: string | null;
  provider_reference?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_subscription_id?: string | null;
};

export type Entitlement = {
  active: boolean;
  state: "none" | "trialing" | "active" | "ending" | "paused" | "past_due" | "canceled";
  renewsOn: Date | null;
  daysToRenewal: number | null;
  message: string;
};

/**
 * Access is always derived from billing state, never stored as a separate flag,
 * so a webhook that lands late or twice can never leave access out of sync.
 */
export function entitlementFor(sub: SubscriptionRow | null | undefined): Entitlement {
  if (!sub) {
    return {
      active: false,
      state: "none",
      renewsOn: null,
      daysToRenewal: null,
      message: "No membership yet.",
    };
  }
  const providerVerified =
    sub.provider === "razorpay" &&
    Boolean(sub.razorpay_payment_id || sub.razorpay_subscription_id || sub.provider_reference);
  const serverTrialVerified = sub.status === "trialing" && sub.provider === "internal_trial";
  if (!providerVerified && !serverTrialVerified) {
    return {
      active: false,
      state: "none",
      renewsOn: null,
      daysToRenewal: null,
      message: "Membership could not be verified by the payment provider. Complete checkout to activate EKA+.",
    };
  }

  const now = Date.now();
  const periodEnd = sub.current_period_end ? new Date(sub.current_period_end) : null;
  const pausedUntil = sub.paused_until ? new Date(sub.paused_until) : null;
  const days = periodEnd ? Math.ceil((periodEnd.getTime() - now) / 86_400_000) : null;

  if (pausedUntil && pausedUntil.getTime() > now) {
    return {
      active: false,
      state: "paused",
      renewsOn: pausedUntil,
      daysToRenewal: Math.ceil((pausedUntil.getTime() - now) / 86_400_000),
      message: `Paused. Everything is kept and waiting until ${pausedUntil.toLocaleDateString()}.`,
    };
  }
  if (sub.status === "past_due") {
    return {
      active: true,
      state: "past_due",
      renewsOn: periodEnd,
      daysToRenewal: days,
      message: "A payment did not go through. Access stays on while we retry.",
    };
  }
  if (sub.status === "canceled" && (!periodEnd || periodEnd.getTime() < now)) {
    return {
      active: false,
      state: "canceled",
      renewsOn: null,
      daysToRenewal: null,
      message: "Membership ended.",
    };
  }
  if (sub.cancel_at_period_end) {
    return {
      active: true,
      state: "ending",
      renewsOn: periodEnd,
      daysToRenewal: days,
      message: periodEnd
        ? `Ending on ${periodEnd.toLocaleDateString()}. Your journeys and reflections stay saved.`
        : "Ending at the end of this period.",
    };
  }
  if (sub.status === "trialing") {
    return {
      active: true,
      state: "trialing",
      renewsOn: periodEnd,
      daysToRenewal: days,
      message: periodEnd
        ? `Your first renewal is ${periodEnd.toLocaleDateString()}.`
        : "Trial in progress.",
    };
  }
  if (sub.status === "active") {
    return {
      active: true,
      state: "active",
      renewsOn: periodEnd,
      daysToRenewal: days,
      message: periodEnd ? `Renews on ${periodEnd.toLocaleDateString()}.` : "Active.",
    };
  }
  return {
    active: false,
    state: "none",
    renewsOn: null,
    daysToRenewal: null,
    message: "No active membership.",
  };
}

/**
 * Verified entitlement check for EKA+ (₹499/mo).
 * Includes Ask EKA AI and cultural research features, plus the premium Creator Studio workspace.
 * Preserves access for active subscribers on plus, creator (legacy), or annual plans.
 */
export function isEkaPlusEntitled(sub: SubscriptionRow | null | undefined): boolean {
  if (!sub) return false;
  const ent = entitlementFor(sub);
  if (!ent.active) return false;
  const plan = sub.plan?.toLowerCase() || "";
  return plan === "plus" || plan === "creator" || plan === "annual" || plan === "monthly";
}

/** Stripe-style proration: unused time on the old plan credits the new one. */
export function prorate(
  current: { priceCents: number; periodDays: number },
  next: { priceCents: number; periodDays: number },
  daysLeft: number,
) {
  const clamped = Math.max(0, Math.min(daysLeft, current.periodDays));
  const credit = Math.round((current.priceCents / current.periodDays) * clamped);
  const charge = Math.max(0, next.priceCents - credit);
  return { credit, charge, upgrade: next.priceCents > current.priceCents };
}

export async function fetchSubscription(): Promise<SubscriptionRow | null> {
  const uid = await currentUserId();
  if (!uid) return null;
  const { data } = await supabase
    .from("subscriptions")
    .select(
      "id, plan, status, started_at, expires_at, cancel_at_period_end, current_period_end, canceled_at, paused_until, retention_offer_applied, price_cents, currency, provider, provider_reference, razorpay_payment_id, razorpay_subscription_id",
    )
    .eq("user_id", uid)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as SubscriptionRow) ?? null;
}

async function mutateMembership(action: string, extra: Record<string, unknown> = {}) {
  const { data, error } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (error || !token) throw new Error("Please sign in again to manage your membership.");

  const response = await fetch("/api/subscriptions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action, ...extra }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Membership update failed.");
  return result;
}

/** Membership activation is server-only and follows server-verified payment confirmation. */
export async function setPlan(_planId: PlanId): Promise<void> {
  throw new Error("Memberships can only be activated after server-verified payment.");
}

export async function scheduleCancellation() {
  const subscription = await fetchSubscription();
  if (!subscription) throw new Error("No subscription was found for this account.");
  return mutateMembership("cancel_subscription", {
    subscription_id: subscription.id,
    cancel_at_period_end: true,
  });
}

export async function resumeMembership() {
  const subscription = await fetchSubscription();
  if (!subscription) throw new Error("No subscription was found for this account.");
  return mutateMembership("resume_subscription", { subscription_id: subscription.id });
}

export async function pauseMembership(_days: number): Promise<void> {
  throw new Error("Subscription pause is unavailable until the server supports a defined pause duration.");
}

export async function applyDiscount(_percent: number): Promise<void> {
  throw new Error("Membership discounts require a server-authorized offer and cannot be applied from the client.");
}
