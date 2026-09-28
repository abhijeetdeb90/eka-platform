import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Cookie, Check, Shield, Save } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie & Tracking Policy — EKA" },
      {
        name: "description",
        content: "EKA's transparent cookie policy and privacy preference management center.",
      },
      { property: "og:title", content: "EKA Cookie & Tracking Policy" },
    ],
  }),
  component: CookiesPage,
});

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = "eka_cookie_consent_v1";

export function getSavedCookiePreferences(): CookiePreferences {
  if (typeof window === "undefined") return { necessary: true, analytics: false, marketing: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fallback */
  }
  return { necessary: true, analytics: false, marketing: false };
}

function CookiesPage() {
  const [prefs, setPrefs] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    setPrefs(getSavedCookiePreferences());
  }, []);

  const savePreferences = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    toast.success("Cookie preferences saved successfully");
  };

  const acceptAll = () => {
    const all = { necessary: true, analytics: true, marketing: true };
    setPrefs(all);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    toast.success("All cookies accepted");
  };

  const rejectOptional = () => {
    const onlyNecessary = { necessary: true, analytics: false, marketing: false };
    setPrefs(onlyNecessary);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(onlyNecessary));
    toast.success("Optional cookies declined");
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary-soft selection:text-foreground">
      <SiteHeader />
      <main className="container-eka mx-auto max-w-4xl px-5 py-16 lg:py-24">
        {/* Header */}
        <div className="border-b border-border/70 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            <Cookie className="size-3.5 text-primary" />
            <span>Transparency & Tracking Controls</span>
          </div>
          <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
            Cookie Policy & Preferences
          </h1>
          <p className="mt-3 text-lg text-muted-foreground font-light leading-relaxed">
            We reject predatory data brokers and invasive advertising trackers. Control exactly what
            runs in your browser.
          </p>
        </div>

        {/* Interactive Preferences Center */}
        <div className="mt-12 rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-calm">
          <h2 className="font-display text-2xl text-foreground">Manage Your Consent</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We provide unbundled consent options without dark patterns. Choose your preferences
            below:
          </p>

          <div className="mt-8 space-y-6 divide-y divide-border/60">
            {/* Category 1: Strictly Necessary */}
            <div className="pt-6 first:pt-0 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground text-base">
                    Strictly Necessary Cookies
                  </h3>
                  <span className="rounded-full bg-forest/10 text-forest border border-forest/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                    Always Active
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Required for core platform security, authenticating session tokens via Supabase,
                  preventing cross-site request forgery, and recording your consent preferences.
                </p>
              </div>
              <Switch
                checked={true}
                disabled
                aria-label="Strictly necessary cookies always enabled"
              />
            </div>

            {/* Category 2: Performance & Analytics */}
            <div className="pt-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground text-base">Analytics & Performance</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Collects aggregated, non-personally identifiable metrics on page load speeds,
                  route errors, and general feature adoption so we can optimize performance.
                </p>
              </div>
              <Switch
                checked={prefs.analytics}
                onCheckedChange={(val) => setPrefs({ ...prefs, analytics: val })}
                aria-label="Toggle analytics cookies"
              />
            </div>

            {/* Category 3: External Media & Third-Party Embeds */}
            <div className="pt-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground text-base">
                  Media & Third-Party Functionality
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Allows third-party video players, sacred music embeds, and map widgets to load
                  directly inside knowledge cards.
                </p>
              </div>
              <Switch
                checked={prefs.marketing}
                onCheckedChange={(val) => setPrefs({ ...prefs, marketing: val })}
                aria-label="Toggle external media cookies"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border/60 pt-6">
            <Button onClick={savePreferences} className="rounded-xl shadow-xs">
              <Save className="mr-1.5 size-4" /> Save Preferences
            </Button>
            <Button onClick={rejectOptional} variant="outline" className="rounded-xl">
              Reject All Optional
            </Button>
            <Button onClick={acceptAll} variant="secondary" className="rounded-xl">
              Accept All
            </Button>
          </div>
        </div>

        {/* Detailed Explanation */}
        <div className="mt-14 space-y-6 text-sm text-muted-foreground">
          <h2 className="font-display text-2xl text-foreground">Why We Respect Your Privacy</h2>
          <p>
            Many social platforms deploy tracking pixels that monitor your browsing behavior across
            the web to sell targeted ads. EKA has{" "}
            <strong>zero commercial advertising pixels</strong> and does not sell or lease user data
            to third-party data brokers.
          </p>
          <p>
            For any queries regarding our tracking policies, please email{" "}
            <a href="mailto:privacy@eka.earth" className="text-terracotta underline">
              privacy@eka.earth
            </a>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
