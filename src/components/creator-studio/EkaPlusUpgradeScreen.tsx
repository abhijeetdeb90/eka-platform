import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  BarChart3,
  BookOpen,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Compass,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useRazorpayCheckout } from "@/lib/payments/useRazorpayCheckout";
import { PLUS_PRICE_PAISE } from "@/lib/constants/economics";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useMonetizationTier } from "@/lib/monetization";

interface EkaPlusUpgradeScreenProps {
  onSuccess?: () => void;
}

export function EkaPlusUpgradeScreen({ onSuccess }: EkaPlusUpgradeScreenProps) {
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();
  const { openCheckout, loading: checkoutLoading } = useRazorpayCheckout();
  const { setTier } = useMonetizationTier();

  const razorpayKeyConfigured = Boolean(
    import.meta.env.VITE_RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID
  );

  const handleSubscribe = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      toast.error("Please sign in to subscribe to EKA+.");
      return;
    }

    if (!razorpayKeyConfigured) {
      toast.error(
        "Payment gateway is not configured in this deployment. Please set VITE_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to enable live checkout."
      );
      return;
    }

    openCheckout({
      amount: PLUS_PRICE_PAISE, // 49900 paise = ₹499.00
      currency: "INR",
      name: "EKA+ Cultural Intelligence & Studio",
      description: "Monthly subscription to EKA+ (₹499/month)",
      prefill: {
        email: auth.user.email || "",
        name:
          profile?.display_name ||
          auth.user.user_metadata?.full_name ||
          auth.user.user_metadata?.name ||
          "",
      },
      notes: {
        user_id: auth.user.id,
        plan: "plus",
      },
      onSuccess: async () => {
        if (import.meta.env.DEV) setTier("plus");
        await queryClient.invalidateQueries({ queryKey: ["subscription"] });
        await queryClient.invalidateQueries({ queryKey: ["eka-plus-access"] });
        toast.success("Welcome to EKA+! Your Creator Studio is now active.");
        if (onSuccess) onSuccess();
      },
      onFailure: (err) => {
        toast.error(`Checkout failed: ${err.description || "Payment could not be completed."}`);
      },
    });
  };

  const handleInstantDemo = async () => {
    setTier("plus");
    await queryClient.invalidateQueries({ queryKey: ["subscription"] });
    await queryClient.invalidateQueries({ queryKey: ["eka-plus-access"] });
    toast.success("EKA+ Creator Studio preview mode activated!");
    if (onSuccess) onSuccess();
  };

  return (
    <div
      data-testid="creator-workspace-gate"
      className="mx-auto max-w-5xl px-4 py-8 sm:py-16 space-y-12 animate-in fade-in duration-300"
    >
      {/* 1. Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/5 text-primary text-xs font-mono uppercase tracking-wider py-1 px-3 gap-1.5"
          >
            <Lock className="size-3 inline" />
            Paid Workspace · Creator Tier
          </Badge>
          <Badge variant="outline" className="text-xs font-mono text-muted-foreground uppercase">
            Create → Publish → Analyse → Grow
          </Badge>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
          Creator Studio — Professional Workspace
        </h1>

        {/* Required Canonical Hook */}
        <p className="font-serif text-lg sm:text-2xl text-primary font-normal leading-relaxed pt-1">
          “Publish for free. Upgrade to understand your audience and grow with cultural intelligence.”
        </p>

        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
          Creator Studio is clearly positioned as a paid workspace for cultural storytellers to manage their content, track analytics, and manage monetization.
          EKA Seeker accounts can publish photos, stories, reels, carousels, and videos completely free forever.
          Upgrade to <strong>EKA+</strong> (₹499/month) to unlock the professional Creator Studio, deep audience telemetry,
          and grounded Ask EKA AI research.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/membership">
              <span>Unlock Creator Studio with EKA+ (₹499/month)</span>
              <ArrowUpRight className="size-4 ml-1.5" />
            </Link>
          </Button>
          {import.meta.env.DEV && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleInstantDemo}
              className="rounded-full"
            >
              <span>Instant Workspace Demo Preview</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. Unified Plan Card & Comparison */}
      <div className="grid gap-8 md:grid-cols-2 items-stretch max-w-4xl mx-auto">
        {/* Free Plan Reference */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs font-mono uppercase">
                EKA Seeker
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">Current Tier</span>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold text-foreground">Free Seeker</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Open cultural commons for all custodians and learners.
              </p>
            </div>

            <div className="pt-2">
              <span className="font-display text-4xl font-semibold text-foreground">₹0</span>
              <span className="text-xs text-muted-foreground ml-1.5 font-mono">forever</span>
            </div>

            <div className="border-t border-border/60 pt-4 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-foreground">
                  <strong>100% Free Publishing:</strong> Photos, reels, videos, carousels & stories
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-foreground">
                  <strong>Full Living Cultural Archive:</strong> Explore global map, traditions & places
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-foreground">
                  <strong>Personal Sanctuary:</strong> Manage your profile, saved stories & communities
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-muted-foreground">
                <span className="size-4 text-center mt-0.5 font-mono text-muted-foreground/60">—</span>
                <span>No advanced audience analytics or viewer telemetry</span>
              </div>
              <div className="flex items-start gap-2.5 text-muted-foreground">
                <span className="size-4 text-center mt-0.5 font-mono text-muted-foreground/60">—</span>
                <span>No Ask EKA AI manuscript inquiry or citation engine</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link to="/create">
                <span>Publish a Story for Free</span>
                <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* EKA+ Premium Plan Card */}
        <div className="rounded-3xl border-2 border-primary bg-card p-6 sm:p-8 flex flex-col justify-between shadow-lift relative">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-primary text-primary-foreground text-xs font-mono uppercase">
                EKA+ Unified
              </Badge>
              <span className="text-xs text-primary font-mono font-semibold">Recommended</span>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold text-foreground">EKA+ Subscription</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Contextual AI intelligence + Premium Creator Studio workspace.
              </p>
            </div>

            <div className="pt-2">
              <span className="font-display text-4xl font-bold text-primary">₹499</span>
              <span className="text-xs text-muted-foreground ml-1.5 font-mono">/month</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">Taxes included · Cancel anytime</p>
            </div>

            <div className="border-t border-border/60 pt-4 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Sparkles className="size-4 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground font-medium">
                  <strong>Creator Studio Workspace:</strong> Multi-format content management
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <BarChart3 className="size-4 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground font-medium">
                  <strong>Real Performance Analytics:</strong> True views, likes, comments, saves & followers
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <BookOpen className="size-4 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground font-medium">
                  <strong>Ask EKA AI:</strong> Source-backed research with primary manuscript citations
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Layers className="size-4 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground font-medium">
                  <strong>Research-to-Story Pipeline:</strong> One-click attach verified sources to story drafts
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="size-4 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground font-medium">
                  <strong>Monetisation Readiness:</strong> Transparent 5–10% commission accounting
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-3">
            {razorpayKeyConfigured ? (
              <Button
                onClick={handleSubscribe}
                disabled={checkoutLoading}
                className="w-full rounded-full py-6 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-calm"
              >
                <span>{checkoutLoading ? "Opening Secure Checkout…" : "Subscribe to EKA+ (₹499/mo)"}</span>
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  disabled
                  className="w-full rounded-full py-6 text-sm font-medium bg-muted text-muted-foreground cursor-not-allowed"
                >
                  <AlertCircle className="size-4 mr-2" />
                  Checkout Unavailable (Gateway Unconfigured)
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">
                  Razorpay API keys (<code>VITE_RAZORPAY_KEY_ID</code>) are not configured in this environment.
                  Simulated payments are disabled for security.
                </p>
              </div>
            )}

            <div className="text-center text-[11px] text-muted-foreground space-y-1">
              <p>Cancel anytime with zero questions asked.</p>
              <p>Subscription expiry never deletes your published cultural stories.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deep Feature Highlights */}
      <div className="rounded-3xl border border-border/80 bg-sand/15 p-8 max-w-4xl mx-auto space-y-6">
        <h3 className="font-serif text-xl font-semibold text-foreground text-center">
          What makes EKA+ Creator Studio different?
        </h3>

        <div className="grid gap-6 sm:grid-cols-3 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <BarChart3 className="size-4" />
              <span>Grounded Telemetry</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              No vanity algorithms or simulated charts. Your metrics reflect actual user views, real saves,
              and genuine community discussions recorded in the database.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <BookOpen className="size-4" />
              <span>Epistemic AI Research</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Deep cultural questions grounded in verified lineages, regional variations, and scholarly
              sources. Zero hallucination.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <ShieldCheck className="size-4" />
              <span>Stewardship Guarantee</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              You retain full ownership of your work. Content is preserved with your author attribution even
              if you pause or cancel your EKA+ subscription.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border/60 text-center">
          <Link
            to="/standards"
            className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
          >
            <span>Read the EKA Cultural Standards & Attribution Charter</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
