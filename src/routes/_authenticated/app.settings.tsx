import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppScreen } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ACCOUNT_TYPES, INTERESTS } from "@/lib/eka";
import { TONES } from "@/lib/ai.functions";
import { useProfile } from "@/hooks/useProfile";
import { AGE_BRACKETS, LANGUAGES, PATHS, PREFER_NOT_TO_SAY } from "@/lib/join";
import { cn } from "@/lib/utils";
import { SecuritySettingsTab } from "@/components/app/settings/SecuritySettingsTab";

export const Route = createFileRoute("/_authenticated/app/settings")({
  component: Settings,
});

function Settings() {
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [accountType, setAccountType] = useState<string>("personal");
  const [interests, setInterests] = useState<string[]>([]);
  const [tone, setTone] = useState<string>("gentle");
  const [ageBracket, setAgeBracket] = useState("");
  const [region, setRegion] = useState("");
  const [language, setLanguage] = useState("");
  const [religion, setReligion] = useState("");
  const [background, setBackground] = useState("");
  const [contextBusy, setContextBusy] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setName(profile.display_name ?? "");
    setUsername(profile.username ?? "");
    setBio(profile.bio ?? "");
    setAvatar(profile.avatar_url ?? "");
    setAccountType(profile.account_type);
    setInterests(profile.interests ?? []);
    setTone(profile.reflection_tone ?? "gentle");
    setAgeBracket(profile.age_bracket ?? "");
    setRegion(profile.region ?? "");
    setLanguage(profile.language ?? "");
    setReligion(profile.religion ?? "");
    setBackground(profile.community_background ?? "");
  }, [profile]);

  const saveContext = async (clear = false) => {
    if (!profile) return;
    setContextBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        age_bracket: clear ? null : ageBracket || null,
        region: clear ? null : region || null,
        language: clear ? null : language || null,
        religion: clear ? null : religion || null,
        community_background: clear ? null : background || null,
      })
      .eq("id", profile.id);
    setContextBusy(false);
    if (error) {
      toast.error("Could not save that just now.");
      return;
    }
    if (clear) {
      setReligion("");
      setBackground("");
    }
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    toast.success(clear ? "Optional context cleared." : "Saved.");
  };

  const save = async () => {
    if (!profile) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: name || null,
        username: username
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, ""),
        bio: bio || null,
        avatar_url: avatar || null,
        account_type: accountType,
        interests,
        reflection_tone: tone,
      })
      .eq("id", profile.id);
    setBusy(false);
    if (error) {
      toast.error("That username may already be taken.");
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    toast.success("Profile updated.");
    void navigate({ to: "/app/me" });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    void navigate({ to: "/" });
  };

  return (
    <AppScreen eyebrow="Your account" title="Settings">
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-calm">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatar">Profile image URL</Label>
          <Input id="avatar" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Account type</Label>
          <div className="flex flex-wrap gap-2">
            {ACCOUNT_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setAccountType(t)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm capitalize transition-colors",
                  accountType === t
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-accent",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Interests</Label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  setInterests((prev) =>
                    prev.includes(i) ? prev.filter((v) => v !== i) : [...prev, i],
                  )
                }
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                  interests.includes(i)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-accent",
                )}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Reflection tone</Label>
          <p className="text-xs text-muted-foreground">
            How the reflection companion speaks to you. It only ever works from your own prompts,
            journal entries and journey reflections — never from anything you did not write.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {TONES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id)}
                className={cn(
                  "rounded-xl border p-3 text-left transition-colors",
                  tone === t.id
                    ? "border-primary bg-primary-soft/30"
                    : "border-border hover:bg-accent",
                )}
              >
                <span className="text-sm">{t.label}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{t.blurb}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border/70 bg-parchment/40 p-4">
          <p className="text-sm">Reminders and Sacred Moments</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Notification channels, quiet hours, and how many moments belong in your day.
          </p>
          <Link
            to="/app/reminders"
            className="mt-2 inline-block text-sm underline underline-offset-4"
          >
            Open reminder settings
          </Link>
        </div>
        <Button onClick={save} disabled={busy}>
          Save
        </Button>
      </div>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-calm">
        <div>
          <h2 className="font-display text-lg">Where you are joining from</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Used to shape what you see. The last two fields are optional and are never used in
            moderation decisions.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Age bracket</Label>
          <div className="flex flex-wrap gap-2">
            {AGE_BRACKETS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setAgeBracket(ageBracket === b ? "" : b)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  ageBracket === b
                    ? "border-primary bg-primary-soft/30"
                    : "border-border hover:bg-accent",
                )}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Country or region</Label>
          <Input
            id="region"
            maxLength={60}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Language preference</Label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLanguage(language === l ? "" : l)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  language === l
                    ? "border-primary bg-primary-soft/30"
                    : "border-border hover:bg-accent",
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Religion or path — optional</Label>
          <div className="flex flex-wrap gap-2">
            {[...PATHS, PREFER_NOT_TO_SAY].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setReligion(religion === p || p === PREFER_NOT_TO_SAY ? "" : p)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  religion === p
                    ? "border-primary bg-primary-soft/30"
                    : "border-border hover:bg-accent",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="background">Community or cultural background — optional</Label>
          <Input
            id="background"
            maxLength={80}
            value={background}
            onChange={(e) => setBackground(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => saveContext(false)} disabled={contextBusy}>
            Save
          </Button>
          <Button variant="ghost" onClick={() => saveContext(true)} disabled={contextBusy}>
            Clear optional context
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          <Link to="/standards" className="underline underline-offset-4">
            Read the Community Standards
          </Link>
          {profile?.standards_accepted_at
            ? ` · agreed ${new Date(profile.standards_accepted_at).toLocaleDateString()}`
            : ""}
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-calm">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Sanctuary Security & Privacy (DPDP 2023)</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage your account protection, two-factor authentication, active devices, and statutory privacy controls.
          </p>
        </div>
        <SecuritySettingsTab />
      </section>

      <Button variant="outline" onClick={signOut}>
        Sign out
      </Button>
      <section className="rounded-2xl border border-border bg-card/60 p-5">
        <p className="text-sm">Something of yours hidden or paused?</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Auto-hiding is fast, so it is reversible. Appeal it and a person returns a stated outcome.
        </p>
        <Link
          to="/app/appeal"
          className="mt-3 inline-block text-sm text-primary underline underline-offset-4"
        >
          Appeal a moderation decision
        </Link>
      </section>
    </AppScreen>
  );
}
