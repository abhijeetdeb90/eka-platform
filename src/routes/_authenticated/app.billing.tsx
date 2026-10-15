import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, BellRing, Check, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { AppScreen } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import {
  PLANS,
  entitlementFor,
  fetchSubscription,
  formatINR,
  planFor,
  prorate,
  resumeMembership,
  scheduleCancellation,
  type PlanId,
} from "@/lib/billing";
import { track } from "@/lib/analytics";
import { useRazorpayCheckout } from "@/lib/payments/useRazorpayCheckout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/app/billing")({
  component: BillingPage,
});

function BillingPage() {
  const queryClient = useQueryClient();
  const { data: sub, isLoading: subLoading } = useQuery({ queryKey: ["subscription-row"], queryFn: fetchSubscription });
  const entitlement = entitlementFor(sub);
  const current = planFor(sub?.plan);
  const { openCheckout, loading: checkoutLoading } = useRazorpayCheckout();

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["subscription-row"] });
    await queryClient.invalidateQueries({ queryKey: ["subscription"] });
  };

  const change = async (planId: PlanId) => {
    const targetPlan = planFor(planId);
    if (planId === current.id && entitlement.active) {
      toast.info("You are already subscribed to this plan.");
      return;
    }

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      toast.error("Please sign in to change your plan.");
      return;
    }

    track("plan_change_initiated", { from: current.id, to: planId });

    openCheckout({
      amount: targetPlan.priceCents,
      currency: targetPlan.currency,
      name: `EKA ${targetPlan.name} Membership`,
      description: targetPlan.blurb,
      prefill: {
        email: auth.user.email,
        name: auth.user.user_metadata?.full_name || auth.user.user_metadata?.name || "",
      },
      notes: {
        user_id: auth.user.id,
        plan: planId,
      },
      onSuccess: async () => {
        track("plan_change_completed", { from: current.id, to: planId });
        await refresh();
        toast.success(`Your ${targetPlan.name} membership is active!`);
      },
    });
  };

  const cancel = async () => {
    await scheduleCancellation();
    track("membership_cancel_scheduled");
    await refresh();
    toast.info("Membership cancellation scheduled at the end of your billing period.");
  };

  const daysLeft = entitlement.daysToRenewal ?? 0;

  return (
    <AppScreen eyebrow="Membership" title="Billing">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-calm">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Current status</p>
        <p className="mt-2 font-display text-2xl capitalize">
          {entitlement.state.replace("_", " ")}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{entitlement.message}</p>
        <p className="mt-3 text-sm">
          {current.name} · {current.label}/{current.cadence}
          {sub?.price_cents && sub.price_cents !== current.priceCents && (
            <span className="ml-2 text-xs text-primary">
              member rate {formatINR(sub.price_cents)}
            </span>
          )}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Access is derived from your billing status every time you open EKA, so it always matches
          what you have paid — even if a payment notification arrives late or twice.
        </p>
      </section>

      {entitlement.state === "past_due" && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            A payment did not go through. Your access stays on while we retry — update your card to
            avoid interruption.
          </p>
        </div>
      )}

      {entitlement.state === "ending" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-primary-soft/40 p-5 text-sm">
          <p>{entitlement.message}</p>
          <Button
            size="sm"
            onClick={async () => {
              await resumeMembership();
              await refresh();
              toast.success("Your membership continues.");
            }}
          >
            Keep my membership
          </Button>
        </div>
      )}

      {entitlement.daysToRenewal !== null &&
        entitlement.daysToRenewal <= 7 &&
        entitlement.state !== "ending" && (
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 text-sm shadow-calm">
            <BellRing className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <p>
              Renewal reminder: your membership renews in {Math.max(0, entitlement.daysToRenewal)}{" "}
              {entitlement.daysToRenewal === 1 ? "day" : "days"}
              {entitlement.renewsOn ? ` on ${entitlement.renewsOn.toLocaleDateString()}` : ""}.
              Nothing changes unless you want it to.
            </p>
          </div>
        )}

      <section className="grid gap-3 sm:grid-cols-2">
        {PLANS.map((p) => {
          const isCurrent = p.id === current.id;
          const preview = prorate(current, p, daysLeft);
          return (
            <div
              key={p.id}
              className={`rounded-2xl border p-6 shadow-calm ${isCurrent ? "border-primary bg-primary-soft/30" : "border-border bg-card"}`}
            >
              <h2 className="font-display text-lg">{p.name}</h2>
              <p className="mt-1 font-display text-2xl">
                {p.label}
                <span className="text-sm text-muted-foreground">/{p.cadence}</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{p.blurb}</p>
              {!isCurrent && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {preview.upgrade ? "Upgrade" : "Downgrade"} now: {formatINR(preview.credit)}{" "}
                  credit for your unused {Math.max(0, daysLeft)} days, {formatINR(preview.charge)}{" "}
                  charged today.
                </p>
              )}
              <Button
                className="mt-4 w-full"
                variant={isCurrent ? "outline" : "default"}
                onClick={() => change(p.id)}
              >
                {isCurrent ? (
                  <>
                    <Check className="size-4" aria-hidden /> Current plan
                  </>
                ) : preview.upgrade ? (
                  "Upgrade"
                ) : (
                  "Switch"
                )}
              </Button>
            </div>
          );
        })}
      </section>

      <p className="text-xs text-muted-foreground">
        Secure checkout is powered by Razorpay. All transactions are cryptographically verified
        on the server before granting membership access. Real-time updates, renewals, and cancellations
        are synchronized directly with your account.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link to="/app/plus">Membership details</Link>
        </Button>
        {entitlement.active && entitlement.state !== "ending" && (
          <Button variant="ghost" onClick={cancel} className="text-destructive hover:bg-destructive/10">
            Cancel membership
          </Button>
        )}
      </div>
    </AppScreen>
  );
}
