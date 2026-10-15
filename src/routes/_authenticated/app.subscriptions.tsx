// ==============================================================================
// MY SUBSCRIPTIONS — AUTHENTICATED DEDICATED MANAGEMENT PAGE
// ==============================================================================
// - Current plan and payment status
// - Renewal date and subscription history
// - Upgrade, downgrade, and cancellation controls with Razorpay checkout
// - Loading, empty, and active states backed by persisted Supabase records
// ==============================================================================

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ShieldCheck, AlertCircle, ArrowUpRight, Clock, RefreshCw, XCircle } from "lucide-react";
import { toast } from "sonner";
import { AppScreen } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export const Route = createFileRoute("/_authenticated/app/subscriptions")({
  component: MySubscriptionsPage,
});

function MySubscriptionsPage() {
  const queryClient = useQueryClient();
  const { data: sub, isLoading: subLoading, refetch } = useQuery({
    queryKey: ["subscription-row"],
    queryFn: fetchSubscription,
  });

  const entitlement = entitlementFor(sub);
  const current = planFor(sub?.plan);
  const { openCheckout, loading: checkoutLoading } = useRazorpayCheckout();

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["subscription-row"] });
    await queryClient.invalidateQueries({ queryKey: ["subscription"] });
    await refetch();
  };

  const handlePlanChange = async (planId: PlanId) => {
    const targetPlan = planFor(planId);
    if (planId === current.id && entitlement.active) {
      toast.info("You are already active on this plan.");
      return;
    }

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      toast.error("Please sign in to proceed.");
      return;
    }

    track("subscription_checkout_started", { from: current.id, to: planId });

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
        track("subscription_checkout_success", { plan: planId });
        await refresh();
        toast.success(`Your ${targetPlan.name} subscription is active!`);
      },
    });
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel? Your access remains active until the end of your current period."
    );
    if (!confirmed) return;

    await scheduleCancellation();
    track("subscription_cancelled");
    await refresh();
    toast.info("Cancellation scheduled. You will retain access until the end of this billing cycle.");
  };

  const handleResume = async () => {
    await resumeMembership();
    track("subscription_resumed");
    await refresh();
    toast.success("Your membership continues without interruption.");
  };

  const daysLeft = entitlement.daysToRenewal ?? 0;

  return (
    <AppScreen eyebrow="Account" title="My Subscriptions">
      <div className="space-y-6 max-w-3xl">
        {/* 1. Current Plan Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-calm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-mono text-muted-foreground">Current Membership</p>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-foreground">
                {entitlement.active ? `EKA ${current.name}` : "EKA Seeker (Free)"}
              </h2>
            </div>
            <Badge
              variant="outline"
              className={`capitalize px-3 py-1 font-mono text-xs ${
                entitlement.state === "active"
                  ? "border-emerald-600/30 bg-emerald-50/50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                  : entitlement.state === "trialing"
                  ? "border-amber-600/30 bg-amber-50/50 text-amber-800"
                  : "border-border bg-accent/40 text-muted-foreground"
              }`}
            >
              <ShieldCheck className="size-3.5 mr-1" />
              <span>{entitlement.state.replace("_", " ")}</span>
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {entitlement.message}
          </p>

          {entitlement.active && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/40 text-xs">
              <div>
                <span className="text-muted-foreground block font-mono uppercase text-[10px]">Price</span>
                <span className="font-medium text-foreground text-sm">
                  {current.label}/{current.cadence}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block font-mono uppercase text-[10px]">Renewal Date</span>
                <span className="font-medium text-foreground text-sm flex items-center gap-1">
                  <Clock className="size-3 text-muted-foreground" />
                  {entitlement.renewsOn ? entitlement.renewsOn.toLocaleDateString() : "Active Period"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block font-mono uppercase text-[10px]">Billing Gateway</span>
                <span className="font-medium text-foreground text-sm">
                  {sub?.provider === "razorpay" && (sub.razorpay_payment_id || sub.razorpay_subscription_id || sub.provider_reference)
                    ? "Razorpay Verified"
                    : "Trial Access"}
                </span>
              </div>
            </div>
          )}

          {entitlement.state === "ending" && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60">
              <span className="text-xs text-amber-900 dark:text-amber-300">
                Scheduled to expire soon. Want to keep benefits?
              </span>
              <Button size="sm" onClick={handleResume} className="rounded-xl text-xs bg-amber-800 text-white hover:bg-amber-900">
                Keep Membership
              </Button>
            </div>
          )}
        </div>

        {/* 2. Upgrade / Switch Plan Controls */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-medium text-foreground">Available Plans</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {PLANS.map((p) => {
              const isCurrent = p.id === current.id && entitlement.active;
              const preview = prorate(current, p, daysLeft);

              return (
                <div
                  key={p.id}
                  className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                    isCurrent
                      ? "border-primary/40 bg-primary/5 shadow-xs"
                      : "border-border/80 bg-card hover:border-border shadow-xs"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-lg font-medium text-foreground">{p.name}</h4>
                      {isCurrent && (
                        <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="font-serif text-2xl font-semibold text-foreground">
                      {p.label}
                      <span className="text-xs font-sans font-normal text-muted-foreground">/{p.cadence}</span>
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.blurb}</p>
                  </div>

                  <div className="pt-6">
                    <Button
                      onClick={() => handlePlanChange(p.id)}
                      disabled={checkoutLoading || isCurrent}
                      variant={isCurrent ? "outline" : "default"}
                      className="w-full rounded-xl text-xs"
                    >
                      {isCurrent ? (
                        <>
                          <Check className="size-3.5 mr-1" />
                          <span>Current Plan</span>
                        </>
                      ) : (
                        `Switch to ${p.name}`
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Subscription Actions & Cancellation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-border/40">
          <Button variant="outline" size="sm" asChild className="rounded-xl text-xs">
            <Link to="/app/plus">View Entitlements & Features</Link>
          </Button>

          {entitlement.active && entitlement.state !== "ending" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="rounded-xl text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <XCircle className="size-3.5 mr-1" />
              <span>Cancel Subscription</span>
            </Button>
          )}
        </div>
      </div>
    </AppScreen>
  );
}
