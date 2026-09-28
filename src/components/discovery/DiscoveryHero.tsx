import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Compass,
  Lock,
  Mail,
  User,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { HERO_HEADLINES, TODAY_ON_EKA, type EkaDiscoveryCard } from "@/lib/homepage-data";

interface DiscoveryHeroProps {
  onInspectCard: (card: EkaDiscoveryCard) => void;
}

export function DiscoveryHero({ onInspectCard }: DiscoveryHeroProps) {
  const navigate = useNavigate();
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Auth panel state
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userSession, setUserSession] = useState<{
    email?: string | undefined;
    name?: string | undefined;
  } | null>(null);

  // Check if session exists
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const user = data.session.user;
        const meta = user.user_metadata as Record<string, unknown> | undefined;
        const metaName =
          typeof meta?.["display_name"] === "string" ? meta["display_name"] : undefined;
        setUserSession({
          email: user.email ?? undefined,
          name: metaName ?? user.email?.split("@")[0] ?? "Member",
        });
      }
    });
  }, []);

  // Headline rotation timer (every 4.5s)
  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % HERO_HEADLINES.length);
      setActiveCardIndex((prev) => (prev + 1) % TODAY_ON_EKA.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please provide both email and password.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (authMode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back to EKA.");
        navigate({ to: "/app" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created! Welcome to EKA.");
        navigate({ to: "/join" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPreviewCard = TODAY_ON_EKA[activeCardIndex] ?? TODAY_ON_EKA[0]!;

  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-gradient-to-b from-card/80 via-sand/20 to-background pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-28">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-saffron/15 via-terracotta/10 to-transparent blur-3xl"
      />

      <div className="container-eka">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr] lg:gap-14 items-center">
          {/* Left Column: Rotating Headline, Positioning & Animated Card Preview */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-3.5 py-1 text-xs tracking-[0.2em] text-terracotta uppercase shadow-xs">
              <span className="size-1.5 rounded-full bg-terracotta" />
              <span>Cultural Intelligence · Living Memory</span>
            </div>

            {/* Rotating Headline with smooth crossfade */}
            <div className="min-h-[110px] sm:min-h-[140px] flex items-center">
              <h1
                key={headlineIndex}
                className="font-display text-3xl leading-[1.12] sm:text-5xl lg:text-6xl text-foreground transition-all duration-700 animate-in fade-in slide-in-from-bottom-2"
              >
                {HERO_HEADLINES[headlineIndex]}
              </h1>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed max-w-xl">
              EKA is the trusted intelligence layer for human culture, sacred traditions, and
              localized living wisdom — connecting authentic people, places, lineages and living
              practices into an open, verifiable human context graph.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                asChild
                size="lg"
                className="min-h-[48px] rounded-xl px-6 text-sm shadow-calm"
              >
                <Link to="/stories">
                  <Compass className="mr-1.5 size-4" />
                  <span>Explore the Sanctuary</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-h-[48px] rounded-xl border-border/80 bg-card/80 px-5 text-sm"
              >
                <Link to="/founder/ad">
                  <span>Read the Founder Vision</span>
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
            </div>

            {/* Live Floating Cultural Card Preview */}
            <div className="pt-4">
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-2.5 flex items-center gap-1.5">
                <Sparkles className="size-3 text-terracotta" />
                <span>Now Illuminating on EKA:</span>
              </div>

              <div
                onClick={() => onInspectCard(currentPreviewCard)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-3.5 sm:p-4 shadow-calm backdrop-blur-xs transition-all duration-500 hover:border-primary/50 hover:shadow-lift max-w-lg"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-xl border border-border/60">
                    <img
                      src={currentPreviewCard.image}
                      alt={currentPreviewCard.title}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-terracotta">
                        {currentPreviewCard.categoryBadge}
                      </span>
                      <span className="size-1 rounded-full bg-border" />
                      <span className="text-[10px] text-forest flex items-center gap-0.5">
                        <CheckCircle2 className="size-2.5" />
                        <span>Verified</span>
                      </span>
                    </div>
                    <h4 className="mt-1 font-display text-sm sm:text-base font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {currentPreviewCard.title}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground font-light line-clamp-1">
                      {currentPreviewCard.oneLiner}
                    </p>
                  </div>
                  <div className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors pr-1">
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Authentication / Instant Entry Panel */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative overflow-hidden rounded-3xl border border-border/90 bg-card p-6 sm:p-8 shadow-lift">
              {userSession ? (
                /* Already Signed In state */
                <div className="text-center space-y-4 py-4">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                    <ShieldCheck className="size-7" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground">
                    Welcome back, {userSession.name || "Practitioner"}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light">
                    Your personal practice records, saved cultural cards, and Sangha inquiries are
                    ready.
                  </p>
                  <div className="pt-2 flex flex-col gap-2.5">
                    <Button asChild size="lg" className="w-full min-h-[48px] rounded-xl">
                      <Link to="/app">
                        <span>Enter Sanctuary Dashboard</span>
                        <ArrowRight className="ml-1.5 size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="rounded-xl">
                      <Link to="/membership">View Membership (₹299/mo)</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                /* Interactive Sign In / Join Form */
                <div>
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-1.5 bg-sand/50 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setAuthMode("signin")}
                        className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                          authMode === "signin"
                            ? "bg-card text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Sign in
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMode("signup")}
                        className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                          authMode === "signup"
                            ? "bg-card text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Join EKA
                      </button>
                    </div>

                    <span className="text-[11px] text-muted-foreground">Free Entry</span>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-display text-xl sm:text-2xl text-foreground">
                      {authMode === "signin"
                        ? "Enter Your Cultural Sanctuary"
                        : "Begin Your Living Memory Journey"}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground font-light">
                      {authMode === "signin"
                        ? "Access verified cultural cards, saved wisdom, and living Sanghas."
                        : "Connect with authentic lineages, master crafts, and respectful inquiries."}
                    </p>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="mt-5 space-y-3.5">
                    {authMode === "signup" && (
                      <div className="space-y-1">
                        <Label htmlFor="hero-name" className="text-xs">
                          Your Name or Pen Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            id="hero-name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="e.g. Dr. Raghav / Ananya"
                            className="pl-9 rounded-xl border-border/80 h-10 text-sm"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <Label htmlFor="hero-email" className="text-xs">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="hero-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@heritage.org"
                          className="pl-9 rounded-xl border-border/80 h-10 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="hero-password" className="text-xs">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="hero-password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pl-9 rounded-xl border-border/80 h-10 text-sm"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full min-h-[44px] rounded-xl text-sm font-medium mt-2 shadow-calm"
                    >
                      {isSubmitting
                        ? "Opening Sanctuary..."
                        : authMode === "signin"
                          ? "Sign in to EKA"
                          : "Create EKA Account"}
                    </Button>
                  </form>

                  <div className="mt-4 pt-4 border-t border-border/60 text-center">
                    <p className="text-xs text-muted-foreground">
                      No spam, no outrage algorithms.{" "}
                      <Link
                        to="/join"
                        className="text-foreground underline underline-offset-4 decoration-primary/50 hover:text-primary"
                      >
                        Learn about EKA Membership
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
