import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Lock,
  Sparkles,
  Check,
  Minus,
  ArrowRight,
  Globe,
  BookOpen,
  Layers,
  Lightbulb,
  Compass,
  Palette,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  EKA_ACCESS_FEATURES,
  PRODUCT_TIERS,
  CORE_PHILOSOPHY,
  useMonetizationTier,
  type MonetizationTier,
} from "@/lib/monetization";
import { toast } from "sonner";

export interface IntelligencePaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  target?: {
    title: string;
    location?: string;
    initialQuestion?: string;
    preloadedSummary?: string;
  } | null;
  onUnlocked?: () => void;
}

export function IntelligencePaywallModal({
  isOpen,
  onClose,
  target,
  onUnlocked,
}: IntelligencePaywallModalProps) {
  const { tier, setTier } = useMonetizationTier();

  const handleSimulateUnlock = (tierToSimulate: MonetizationTier = "plus") => {
    setTier(tierToSimulate);
    toast.success(`EKA+ simulated preview enabled! Intelligence unlocked.`);
    onClose();
    if (onUnlocked) onUnlocked();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-3xl max-h-[92vh] overflow-y-auto p-0 rounded-3xl border border-border/80 bg-background shadow-2xl text-foreground scrollbar-thin"
        data-testid="intelligence-paywall-modal"
      >
        {/* Header with Illuminated Lock */}
        <div className="relative border-b border-border/60 bg-sand/15 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary text-xs font-mono uppercase tracking-wider gap-1.5"
            >
              <Lock className="size-3 text-saffron" />
              <span>EKA Intelligence Layer</span>
            </Badge>

            <span className="text-[11px] font-mono text-terracotta font-medium">
              EKA Access Model
            </span>
          </div>

          <DialogTitle className="font-serif text-2xl sm:text-4xl font-normal text-foreground">
            Ask EKA <Lock className="inline size-6 text-saffron align-middle ml-1" />
          </DialogTitle>

          <p className="font-serif text-lg sm:text-xl text-primary font-normal mt-1 italic">
            Understand more with EKA AI
          </p>

          <DialogDescription className="mt-3 text-sm sm:text-base text-foreground font-serif leading-relaxed font-light">
            {CORE_PHILOSOPHY.subscriptionHook}
          </DialogDescription>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Contextual Story Teaser if available */}
          {target && (
            <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4 sm:p-5 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-primary">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Compass className="size-3.5 text-saffron" />
                  Context: {target.title} {target.location ? `· ${target.location}` : ""}
                </span>
                <span className="text-muted-foreground">Locked Inquiry</span>
              </div>

              {target.initialQuestion && (
                <p className="font-serif text-base sm:text-lg font-medium text-foreground italic">
                  "{target.initialQuestion}"
                </p>
              )}

              <p className="text-xs text-muted-foreground leading-relaxed">
                EKA AI synthesizes verified primary lineages, temple architecture geometries,
                oral traditions, and cross-cultural parallels for this story.
              </p>
            </div>
          )}

          {/* The Important Distinction Callout */}
          <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-terracotta font-semibold block">
              {CORE_PHILOSOPHY.title}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <BookOpen className="size-4 text-emerald-600" />
                  <span>Knowledge is free.</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our global cultural map, living stories, traditions, places, and communities are
                  open to everyone.
                </p>
              </div>

              <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                  <Sparkles className="size-4 text-saffron" />
                  <span>Intelligence is paid.</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  EKA AI inquiry, cross-cultural comparisons, personalized learning, and deep primary
                  research.
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                  <Palette className="size-4 text-primary" />
                  <span>Creation is paid.</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Creator Studio workspace, rich publishing tools, qualified analytics, and revenue
                  share.
                </p>
              </div>
            </div>
          </div>

          {/* 3-Tier Product Architecture Banner */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Product Architecture Tiers
              </span>
              <span className="text-[11px] font-mono text-primary">Discover → Understand → Build</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-2xl border border-border/70 bg-sand/15 p-4 space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
                  FREE
                </span>
                <p className="font-serif font-medium text-foreground text-sm">
                  Discover → Read → Explore → Follow
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Cultural database & illuminated global map
                </p>
              </div>

              <div className="rounded-2xl border border-primary/50 bg-primary/10 p-4 space-y-1 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase font-bold text-primary">
                    EKA+ (₹299/mo)
                  </span>
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 bg-primary text-primary-foreground">
                    Recommended
                  </Badge>
                </div>
                <p className="font-serif font-medium text-foreground text-sm">
                  Ask → Understand → Compare → Research
                </p>
                <p className="text-muted-foreground text-[11px]">
                  EKA AI, comparisons & primary sources
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-sand/15 p-4 space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
                  CREATOR (₹799/mo)
                </span>
                <p className="font-serif font-medium text-foreground text-sm">
                  Create → Publish → Analyse → Grow
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Creator Studio workspace & publishing suite
                </p>
              </div>
            </div>
          </div>

          {/* Canonical Feature Comparison Table */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold block">
              EKA Access Model Matrix
            </span>

            <div className="rounded-2xl border border-border/80 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/40 font-mono text-[11px] text-muted-foreground">
                    <th className="py-2.5 px-4 font-semibold">Feature</th>
                    <th className="py-2.5 px-4 text-center font-semibold w-24">Free</th>
                    <th className="py-2.5 px-4 text-center font-semibold w-24 text-primary">Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {EKA_ACCESS_FEATURES.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-sand/10 transition-colors ${
                        item.category.includes("Intelligence") ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="py-2 px-4 text-foreground font-medium flex items-center justify-between">
                        <span>{item.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">
                          {item.category.split(" ")[0]}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-center">
                        {item.free ? (
                          <Check className="size-4 text-emerald-600 inline" />
                        ) : (
                          <span className="text-muted-foreground font-mono">—</span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <Check className="size-4 text-primary font-bold inline" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Conversion Actions & Live Preview Toggle */}
          <div className="pt-2 border-t border-border/60 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                asChild
                className="w-full sm:flex-1 rounded-full text-xs sm:text-sm h-11 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-calm"
              >
                <Link to="/membership">
                  <Sparkles className="size-4 text-saffron" />
                  <span>Subscribe to EKA+ (₹299/month)</span>
                  <ArrowRight className="size-4 ml-auto" />
                </Link>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleSimulateUnlock("plus")}
                className="w-full sm:w-auto rounded-full text-xs h-11 gap-1.5 border-primary/40 text-primary hover:bg-primary/5"
                title="Instant preview for test/demo purposes"
              >
                <span>Preview EKA+ Now</span>
              </Button>

              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full sm:w-auto rounded-full text-xs h-11 text-muted-foreground"
              >
                <span>Continue Reading Free Stories</span>
              </Button>
            </div>

            <p className="text-[11px] text-center text-muted-foreground">
              Knowledge is always free. Cancel subscriptions anytime with zero questions asked.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
