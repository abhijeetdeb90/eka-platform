import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Sparkles, Lock, BookOpen, Palette, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppScreen } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MEMBERSHIP, MONTHLY_THEMES, currentTheme } from "@/lib/membership";
import {
  EKA_ACCESS_FEATURES,
  PRODUCT_TIERS,
  CORE_PHILOSOPHY,
  useMonetizationTier,
} from "@/lib/monetization";
import { track } from "@/lib/analytics";
import { useSubscription } from "@/hooks/useProfile";
import { useRazorpayCheckout } from "@/lib/payments/useRazorpayCheckout";

export const Route = createFileRoute("/_authenticated/app/plus")({
  component: MembershipPage,
});

function MembershipPage() {
  const { data: subscription } = useSubscription();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const theme = currentTheme();
  const { tier, setTier } = useMonetizationTier();
  const { openCheckout, loading: checkoutLoading } = useRazorpayCheckout();

  const joinPlan = async (plan: "plus" | "creator") => {
    track("subscription_cta_click", { plan });
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      toast.error("Please sign in to manage membership.");
      return;
    }
    const priceCents = 49900;
    const planName = "EKA+";

    openCheckout({
      amount: priceCents,
      currency: "INR",
      name: planName,
      description: `Monthly subscription to ${planName}`,
      prefill: {
        email: auth.user.email,
        name: auth.user.user_metadata?.full_name || auth.user.user_metadata?.name || "",
      },
      notes: {
        user_id: auth.user.id,
        plan: "plus",
      },
      onSuccess: async (rzpResponse) => {
        const { error } = await supabase.from("subscriptions").upsert(
          {
            user_id: auth.user.id,
            plan: "plus",
            status: "active",
            price_cents: priceCents,
            currency: "INR",
          },
          { onConflict: "user_id,plan" },
        );
        if (error) {
          console.error("[Subscription upsert error]", error);
        }
        setTier("plus");
        track("subscription_purchase", { plan: "plus", payment_id: rzpResponse.razorpay_payment_id });
        await queryClient.invalidateQueries({ queryKey: ["subscription"] });
        toast.success(`Your ${PRODUCT_TIERS.plus.name} membership is active!`);
      },
    });
  };

  const active = subscription?.status === "active" || subscription?.status === "trialing" || tier !== "free";

  return (
    <AppScreen eyebrow="EKA Access Model" title="Go beyond the story.">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 sm:p-8 text-center space-y-3 shadow-calm">
        <Badge variant="outline" className="border-primary/40 text-primary text-xs font-mono uppercase">
          EKA Access Architecture
        </Badge>
        <h2 className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
          {CORE_PHILOSOPHY.subscriptionHook}
        </h2>
        <p className="mx-auto max-w-xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Knowledge is free. Intelligence is premium. Creation is rewarded.
          Explore the global library and publish freely. Upgrade to EKA+ when you need deep contextual intelligence, research tools, and creator studio analytics.
        </p>
      </div>

      {/* 2. Two Architecture Tiers */}
      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {/* FREE */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4 shadow-xs">
          <Badge variant="outline" className="text-[10px] font-mono uppercase">
            FREE COMMONS & PUBLISHING
          </Badge>
          <div>
            <h3 className="font-serif text-lg font-medium text-foreground">Free Seeker</h3>
            <p className="font-mono text-xs text-emerald-600 font-semibold mt-0.5">
              Discover → Read → Publish → Connect
            </p>
          </div>
          <p className="text-3xl font-semibold text-foreground font-display">₹0</p>
          <p className="text-xs text-muted-foreground">
            Free access to the cultural library, global map, social feed, and 100% free publishing.
          </p>
          <div className="border-t border-border/60 pt-3 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-foreground/90">
              <Check className="size-4 text-emerald-600 shrink-0" />
              <span>Explore global map & cultural stories</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/90">
              <Check className="size-4 text-emerald-600 shrink-0" />
              <span>Free publishing (photos, reels, videos, stories, articles)</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/90">
              <Check className="size-4 text-emerald-600 shrink-0" />
              <span>Join cultural communities & follow creators</span>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild className="w-full rounded-full text-xs mt-4">
            <Link to="/app/explore">Explore Free Library</Link>
          </Button>
        </div>

        {/* EKA+ */}
        <div className="rounded-2xl border-2 border-primary bg-card p-6 space-y-4 shadow-lift relative">
          <div className="absolute -top-3 right-6">
            <Badge className="bg-primary text-primary-foreground text-[10px] font-mono uppercase">
              UNIFIED SUBSCRIPTION
            </Badge>
          </div>
          <Badge variant="outline" className="border-primary/40 text-primary text-[10px] font-mono uppercase">
            EKA+ UNIFIED
          </Badge>
          <div>
            <h3 className="font-serif text-lg font-medium text-foreground">EKA+</h3>
            <p className="font-mono text-xs text-primary font-semibold mt-0.5">
              Ask → Understand → Research → Analytics
            </p>
          </div>
          <p className="text-3xl font-semibold text-primary font-display">
            ₹499<span className="text-xs text-muted-foreground font-mono">/mo</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Source-backed EKA AI, cross-cultural comparisons, deep research, creator analytics & Studio tools.
          </p>
          <div className="border-t border-border/60 pt-3 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-foreground/90 font-medium">
              <Sparkles className="size-4 text-saffron shrink-0" />
              <span>Ask EKA AI interactive exploration & provenance</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/90 font-medium">
              <Sparkles className="size-4 text-saffron shrink-0" />
              <span>Cross-cultural comparisons & primary manuscripts</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/90 font-medium">
              <Sparkles className="size-4 text-saffron shrink-0" />
              <span>Creator Studio workspace, advanced analytics & 85% pools</span>
            </div>
          </div>
          <Button
            size="sm"
            disabled={checkoutLoading}
            onClick={() => joinPlan("plus")}
            className="w-full rounded-full text-xs mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {checkoutLoading ? "Opening Checkout..." : tier === "plus" ? "Active Plan" : "Get EKA+ (₹499/mo)"}
          </Button>
        </div>
      </div>

      {/* 3. Canonical Feature Table */}
      <section className="space-y-3 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <h3 className="font-serif text-lg text-foreground">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border font-mono text-[11px] text-muted-foreground">
                <th className="py-2.5 px-3">Feature</th>
                <th className="py-2.5 px-3 text-center w-24">Free</th>
                <th className="py-2.5 px-3 text-center w-24 text-primary">Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {EKA_ACCESS_FEATURES.map((f) => (
                <tr key={f.id} className="hover:bg-sand/15">
                  <td className="py-2 px-3 text-foreground font-medium">{f.name}</td>
                  <td className="py-2 px-3 text-center">
                    {f.free ? <Check className="size-3.5 text-emerald-600 inline" /> : "—"}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <Check className="size-3.5 text-primary font-bold inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Active membership controls */}
      {active && (
        <div className="space-y-3 rounded-2xl border border-border bg-card p-5 text-sm shadow-calm">
          <p className="text-foreground">
            Active Tier: <strong className="uppercase font-mono text-primary">{tier}</strong>.{" "}
            <Link to="/app/dashboard" className="underline underline-offset-4 text-primary">
              See where you are in your path.
            </Link>
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="sm" variant="outline" asChild>
              <Link to="/app/billing">Billing, plan and renewal</Link>
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <Link to="/app/cancel">Cancel or pause</Link>
            </Button>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Billing is currently recording active mock settlements on your account. Cancel anytime with zero questions asked.
      </p>
    </AppScreen>
  );
}
