import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Camera, Info, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { EkaLogo } from "@/components/brand/Logo";
import { AGREEMENT_TEXT, LADDER } from "@/lib/standards";
import { track } from "@/lib/analytics";
import {
  AGE_BRACKETS,
  LANGUAGES,
  PATHS,
  PREFER_NOT_TO_SAY,
  PURPOSES,
  emptyAnswers,
  loadAnswers,
  saveAnswers,
  step1Schema,
  step3Schema,
  type JoinAnswers,
} from "@/lib/join";

export const Route = createFileRoute("/join")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Join EKA — A Few Questions Before You Begin" },
      {
        name: "description",
        content:
          "Tell us how to shape your EKA: who you are, what you are here for, and the community standards we all keep.",
      },
      { property: "og:title", content: "Join EKA" },
      { property: "og:description", content: "One within. One with all." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JoinPage,
});

const STEPS = ["About you", "Context", "Purpose", "Standards"];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
        active
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function JoinPage() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [answers, setAnswers] = useState<JoinAnswers>(emptyAnswers);
  const [restored, setRestored] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app" });
    });
    setAnswers(loadAnswers());
    setRestored(true);
    track("join_started");
  }, [navigate]);

  useEffect(() => {
    if (restored) saveAnswers(answers);
  }, [restored, answers]);

  const set = <K extends keyof JoinAnswers>(key: K, value: JoinAnswers[K]) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const step = Math.min(Math.max(answers.step, 0), 3);
  const goto = (next: number) => {
    setError(null);
    setAnswers((prev) => ({ ...prev, step: next }));
  };

  const togglePurpose = (key: string) =>
    setAnswers((prev) => ({
      ...prev,
      purposes: prev.purposes.includes(key)
        ? prev.purposes.filter((p) => p !== key)
        : [...prev.purposes, key],
    }));

  const pickPhoto = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Please choose an image under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set("photoDataUrl", String(reader.result));
    reader.readAsDataURL(file);
  };

  const next = () => {
    if (step === 0) {
      const parsed = step1Schema.safeParse(answers);
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Please complete this step.");
        return;
      }
    }
    if (step === 2) {
      const parsed = step3Schema.safeParse(answers);
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Please complete this step.");
        return;
      }
    }
    track("join_step_completed", { step: step + 1 });
    goto(step + 1);
  };

  const finish = () => {
    if (!answers.standardsAccepted) {
      setError("You need to agree to the Community Standards to continue.");
      return;
    }
    if (!answers.termsAccepted) {
      setError(
        "You need to accept the Terms & Conditions and acknowledge the Privacy Policy to continue.",
      );
      return;
    }
    if (!answers.ageConfirmed) {
      setError(
        "You must confirm you are at least 18 years of age (or have parental/guardian consent).",
      );
      return;
    }
    saveAnswers({ ...answers, acceptedAt: new Date().toISOString(), step: 3 });
    track("standards_accepted");
    navigate({ to: "/auth" });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-14">
      <Link to="/">
        <EkaLogo />
      </Link>

      <div className="mt-8">
        <Progress value={((step + 1) / STEPS.length) * 100} className="h-1.5" />
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </p>
      </div>

      <div className="mt-8 flex-1 animate-rise">
        {step === 0 && (
          <section className="space-y-5">
            <div>
              <h1 className="font-display text-3xl leading-snug">First, the basics</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Only what we need to greet you properly and show you the right rooms.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name or display name</Label>
              <Input
                id="name"
                maxLength={60}
                value={answers.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Age bracket</Label>
              <div className="flex flex-wrap gap-2">
                {AGE_BRACKETS.map((b) => (
                  <Chip
                    key={b}
                    active={answers.ageBracket === b}
                    onClick={() => set("ageBracket", b)}
                  >
                    {b}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Country or region</Label>
              <Input
                id="region"
                maxLength={60}
                placeholder="India, Kerala"
                value={answers.region}
                onChange={(e) => set("region", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Language preference</Label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <Chip key={l} active={answers.language === l} onClick={() => set("language", l)}>
                    {l}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Profile photo — optional</Label>
              <div className="flex items-center gap-3">
                {answers.photoDataUrl ? (
                  <img
                    src={answers.photoDataUrl}
                    alt="Your chosen profile photo"
                    className="size-14 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid size-14 place-items-center rounded-full border border-dashed border-border text-muted-foreground">
                    <Camera className="size-5" aria-hidden />
                  </span>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => pickPhoto(e.target.files?.[0])}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                >
                  {answers.photoDataUrl ? "Change" : "Add a photo"}
                </Button>
                {answers.photoDataUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => set("photoDataUrl", null)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                It uploads once your account exists. Skipping is fine.
              </p>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-5">
            <div>
              <h1 className="font-display text-3xl leading-snug">Your context</h1>
              <p className="mt-2 flex gap-2 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
                <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span>
                  This information is optional and should only be provided if you are comfortable
                  sharing it. It helps us show you conversations and traditions you may care about.
                  It is never used in moderation decisions, and you can change or clear it any time
                  in Settings.
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <Label>Religion or path — optional</Label>
              <div className="flex flex-wrap gap-2">
                {[...PATHS, PREFER_NOT_TO_SAY].map((p) => (
                  <Chip
                    key={p}
                    active={answers.religion === p}
                    onClick={() => set("religion", answers.religion === p ? "" : p)}
                  >
                    {p}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="background">Community or cultural background — optional</Label>
              <Input
                id="background"
                maxLength={80}
                placeholder="However you would describe it"
                value={
                  answers.communityBackground === PREFER_NOT_TO_SAY
                    ? ""
                    : answers.communityBackground
                }
                onChange={(e) => set("communityBackground", e.target.value)}
              />
              <button
                type="button"
                onClick={() => set("communityBackground", PREFER_NOT_TO_SAY)}
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Prefer not to say
              </button>
            </div>

            <Button type="button" variant="ghost" onClick={next}>
              Skip this step
            </Button>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-5">
            <div>
              <h1 className="font-display text-3xl leading-snug">What brings you to EKA?</h1>
              <p className="mt-2 text-sm text-muted-foreground">Choose as many as are true.</p>
            </div>

            <div className="grid gap-2">
              {PURPOSES.map((p) => {
                const active = answers.purposes.includes(p.key);
                return (
                  <button
                    key={p.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => togglePurpose(p.key)}
                    className={`rounded-2xl border p-4 text-left transition-colors ${
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    <span className="font-medium">{p.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{p.note}</span>
                  </button>
                );
              })}
            </div>

            {answers.purposes.includes("other") && (
              <div className="space-y-2">
                <Label htmlFor="other">In your own words</Label>
                <Input
                  id="other"
                  maxLength={140}
                  value={answers.purposeOther}
                  onChange={(e) => set("purposeOther", e.target.value)}
                />
              </div>
            )}
          </section>
        )}

        {step === 3 && (
          <section className="space-y-5">
            <div>
              <h1 className="font-display text-3xl leading-snug">Community Standards Agreement</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                One agreement, kept by everyone here. Read it before you join, not after.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
              <ShieldCheck className="size-5 text-primary" aria-hidden />
              <p className="mt-3 text-sm leading-relaxed">{AGREEMENT_TEXT}</p>
            </div>

            <div className="rounded-2xl border border-border p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                If something goes wrong
              </p>
              <ol className="mt-3 space-y-2 text-sm">
                {LADDER.map((rung, i) => (
                  <li key={rung.step} className="flex gap-3">
                    <span className="text-muted-foreground">{i + 1}</span>
                    <span>
                      <span className="font-medium">{rung.step}</span>
                      <span className="block text-xs text-muted-foreground">{rung.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-xs text-muted-foreground">
                Every step can be appealed from inside EKA and is reviewed by a person.{" "}
                <Link to="/standards" className="underline underline-offset-4">
                  Read the full standards
                </Link>
                .
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card p-4">
                <Checkbox
                  id="standardsAccepted"
                  checked={answers.standardsAccepted}
                  onCheckedChange={(v) => set("standardsAccepted", v === true)}
                  aria-label="I understand and agree to EKA's Community Standards"
                />
                <span className="text-sm">
                  I agree to uphold{" "}
                  <Link to="/standards" className="text-primary underline underline-offset-4">
                    EKA's Community Standards
                  </Link>
                  .
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card p-4">
                <Checkbox
                  id="termsAccepted"
                  checked={answers.termsAccepted}
                  onCheckedChange={(v) => set("termsAccepted", v === true)}
                  aria-label="I accept EKA's Terms and Conditions and acknowledge the Privacy Policy"
                />
                <span className="text-sm">
                  I accept EKA's{" "}
                  <Link to="/terms" className="text-primary underline underline-offset-4">
                    Terms & Conditions
                  </Link>{" "}
                  and acknowledge the{" "}
                  <Link to="/privacy" className="text-primary underline underline-offset-4">
                    Privacy Policy
                  </Link>{" "}
                  (DPDP Act, 2023).
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card p-4">
                <Checkbox
                  id="ageConfirmed"
                  checked={answers.ageConfirmed}
                  onCheckedChange={(v) => set("ageConfirmed", v === true)}
                  aria-label="I confirm I am 18 years of age or older"
                />
                <span className="text-sm">
                  I confirm that I am at least 18 years of age (or have verifiable parental /
                  guardian consent).
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/70 bg-card/60 p-4">
                <Checkbox
                  id="marketingOptIn"
                  checked={answers.marketingOptIn}
                  onCheckedChange={(v) => set("marketingOptIn", v === true)}
                  aria-label="Optional: Subscribe to quiet weekly wisdom digests"
                />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Optional:</strong> Receive quiet weekly
                  contemplative reflections and announcements. (Unchecked by default; withdraw
                  consent anytime).
                </span>
              </label>
            </div>
          </section>
        )}

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={() => goto(step - 1)}>
            <ArrowLeft className="mr-1.5 size-4" aria-hidden /> Back
          </Button>
        ) : (
          <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground">
            Already have an account? Sign in
          </Link>
        )}
        {step < 3 ? (
          <Button type="button" onClick={next}>
            Continue
          </Button>
        ) : (
          <Button type="button" onClick={finish}>
            Agree and create account
          </Button>
        )}
      </div>
    </div>
  );
}
