import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/app/Avatar";
import { EkaLogo } from "@/components/brand/Logo";
import { INTENTIONS, INTERESTS } from "@/lib/eka";
import { track } from "@/lib/analytics";
import { useProfile } from "@/hooks/useProfile";
import { completeFirstWeekDay } from "@/lib/firstweek";

export const Route = createFileRoute("/_authenticated/app/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();

  const STORAGE_KEY = "eka.onboarding.progress";
  const [step, setStep] = useState(0);
  const [restored, setRestored] = useState(false);
  const [name, setName] = useState(profile?.display_name ?? "");
  const [intentions, setIntentions] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [followed, setFollowed] = useState<string[]>([]);
  const [joined, setJoined] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Restore any partly-finished onboarding so people can pick up where they left off.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          step?: number;
          name?: string;
          intentions?: string[];
          interests?: string[];
          followed?: string[];
          joined?: string[];
        };
        if (saved.name) setName(saved.name);
        if (saved.intentions) setIntentions(saved.intentions);
        if (saved.interests) setInterests(saved.interests);
        if (saved.followed) setFollowed(saved.followed);
        if (saved.joined) setJoined(saved.joined);
        if (typeof saved.step === "number") setStep(Math.min(Math.max(saved.step, 0), 3));
      }
    } catch {
      /* ignore unreadable progress */
    }
    setRestored(true);
  }, []);

  // The pre-login questionnaire already asked for a name — don't ask twice.
  useEffect(() => {
    if (!restored || step !== 0) return;
    if (profile?.display_name) {
      setName((current) => current || profile.display_name || "");
      setStep(1);
    }
  }, [restored, step, profile?.display_name]);

  useEffect(() => {
    if (!restored) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ step, name, intentions, interests, followed, joined }),
    );
  }, [restored, step, name, intentions, interests, followed, joined]);

  const { data: suggestions } = useQuery({
    queryKey: ["onboarding-suggestions"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      const [people, communities] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url, bio")
          .neq("id", auth.user?.id ?? "")
          .limit(8),
        supabase
          .from("communities")
          .select("id, name, description, member_count")
          .order("featured", { ascending: false })
          .limit(8),
      ]);
      return { people: people.data ?? [], communities: communities.data ?? [] };
    },
  });

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const finish = async () => {
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: name || null,
        intentions,
        interests,
        onboarded: true,
      })
      .eq("id", auth.user.id);
    if (!error) {
      if (followed.length)
        await supabase
          .from("follows")
          .insert(followed.map((id) => ({ follower_id: auth.user.id, following_id: id })));
      if (joined.length)
        await supabase
          .from("community_members")
          .insert(joined.map((id) => ({ community_id: id, user_id: auth.user.id })));
    }
    setSaving(false);
    if (error) {
      toast.error("We couldn't save that. Please try again.");
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    track("onboarding_complete", { interests: interests.length, follows: followed.length });
    // Day 0 of the first week is done: the path is personalised from here.
    await completeFirstWeekDay(0, intentions.join(", "));
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    await queryClient.invalidateQueries({ queryKey: ["first-week"] });
    void navigate({ to: "/app/welcome" });
  };

  const steps = [
    {
      title: "Welcome to EKA.",
      body: "One Within. One With All. A few quiet questions so your feed belongs to you.",
      content: (
        <div className="space-y-2">
          <Label htmlFor="name">What should we call you?</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      ),
      canContinue: true,
    },
    {
      title: "What brings you to EKA?",
      body: "Choose as many as you like. No religion required.",
      content: (
        <div className="flex flex-wrap gap-2">
          {INTENTIONS.map((i) => (
            <Chip
              key={i}
              label={i}
              selected={intentions.includes(i)}
              onClick={() => toggle(intentions, setIntentions, i)}
            />
          ))}
        </div>
      ),
      canContinue: intentions.length > 0,
    },
    {
      title: "What are you interested in?",
      body: "These shape your Explore page and recommendations.",
      content: (
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((i) => (
            <Chip
              key={i}
              label={i}
              selected={interests.includes(i)}
              onClick={() => toggle(interests, setInterests, i)}
            />
          ))}
        </div>
      ),
      canContinue: interests.length > 0,
    },
    {
      title: "Who would you like to follow?",
      body: "Follow a few people and join a Sangha or two — your feed starts here.",
      content: (
        <div className="space-y-5">
          <div className="space-y-2">
            {suggestions?.people.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => toggle(followed, setFollowed, p.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                  followed.includes(p.id) ? "border-primary bg-primary-soft/50" : "border-border"
                }`}
              >
                <UserAvatar profile={p} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{p.display_name ?? p.username}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    @{p.username}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {followed.includes(p.id) ? "Following" : "Follow"}
                </span>
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {suggestions?.communities.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(joined, setJoined, c.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                  joined.includes(c.id) ? "border-primary bg-primary-soft/50" : "border-border"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{c.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {c.description}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {joined.includes(c.id) ? "Joined" : "Join"}
                </span>
              </button>
            ))}
          </div>
        </div>
      ),
      canContinue: true,
    },
  ];

  const current = steps[step]!;
  const last = step === steps.length - 1;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-10">
      <EkaLogo />
      <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Step {step + 1} of {steps.length}
        </span>
        <span>{Math.round(((step + 1) / steps.length) * 100)}% complete</span>
      </div>
      <div className="mt-2 flex gap-1.5">
        {steps.map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>

      <div key={step} className="mt-10 flex-1 animate-rise">
        <h1 className="text-3xl leading-snug">{current.title}</h1>
        <p className="mt-3 text-muted-foreground">{current.body}</p>
        <div className="mt-8">{current.content}</div>
      </div>

      <div className="mt-10 flex gap-3">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <Button
          className="flex-1"
          disabled={!current.canContinue || saving}
          onClick={() => (last ? finish() : setStep(step + 1))}
        >
          {last ? "Enter EKA" : "Continue"}
        </Button>
      </div>
    </div>
  );
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2.5 text-sm transition-colors ${
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-accent"
      }`}
    >
      {label}
    </button>
  );
}
