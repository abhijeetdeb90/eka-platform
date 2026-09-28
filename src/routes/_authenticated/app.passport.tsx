import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppScreen, EmptyState, Panel } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useFeatureFlag } from "@/hooks/useFlags";
import { Input } from "@/components/ui/input";
import {
  SECTION_LABEL,
  createPassportShare,
  deletePassportShare,
  deletePassportSharing,
  fetchMyPassport,
  fetchPassportSettings,
  fetchPassportShares,
  newShareSlug,
  passportToText,
  renamePassportShare,
  restorePassportShare,
  revokePassportShare,
  savePassportSettings,
  updateShareSections,
  type PassportSection,
} from "@/lib/passport";
import { track } from "@/lib/analytics";

/* --------------------------------------------------------- share links ------
 * Each link stands alone: its own name, its own sections, its own revoke
 * switch. Editing or revoking one never touches another.
 * -------------------------------------------------------------------------- */

const ALL_SECTIONS = Object.keys(SECTION_LABEL) as PassportSection[];

function emptySections(): Record<PassportSection, boolean> {
  return ALL_SECTIONS.reduce(
    (acc, key) => ({ ...acc, [key]: false }),
    {} as Record<PassportSection, boolean>,
  );
}

function ShareLinks() {
  const queryClient = useQueryClient();
  const { data: shares } = useQuery({
    queryKey: ["passport-shares"],
    queryFn: fetchPassportShares,
  });
  const [label, setLabel] = useState("");

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["passport-shares"] });

  async function run(action: Promise<{ error: unknown } | void>, ok: string) {
    const result = await action;
    const error =
      result && "error" in result ? (result.error as { message?: string } | null) : null;
    if (error) {
      toast.error(error.message ?? "That did not work");
      return;
    }
    await refresh();
    toast.success(ok);
  }

  return (
    <Panel
      title="Share links"
      meta={shares?.length ? `${shares.length} link${shares.length === 1 ? "" : "s"}` : "None yet"}
    >
      <p className="text-sm text-muted-foreground">
        Make a separate link for each person or purpose. Choose what each one shows, and turn any of
        them off on its own.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Name this link — e.g. For my teacher"
          className="max-w-xs"
          aria-label="Name for the new share link"
        />
        <Button
          size="sm"
          onClick={async () => {
            await run(createPassportShare(label, emptySections()), "Link created");
            track("passport_share_created", {});
            setLabel("");
          }}
        >
          Create link
        </Button>
      </div>

      {(shares ?? []).length === 0 ? (
        <p className="mt-4 text-xs text-muted-foreground">
          No links yet. Nothing of yours is visible to anyone.
        </p>
      ) : (
        <ul className="mt-5 space-y-4">
          {(shares ?? []).map((share) => {
            const url = `${window.location.origin}/passport/${share.slug}`;
            const revoked = Boolean(share.revoked_at);
            return (
              <li key={share.id} className="rounded-xl border border-border/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Input
                    defaultValue={share.label}
                    className="max-w-xs"
                    aria-label={`Name for ${share.label}`}
                    onBlur={(e) => {
                      if (e.target.value.trim() === share.label) return;
                      void run(renamePassportShare(share.id, e.target.value), "Renamed");
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {revoked ? "Revoked" : "Live"} · seen {share.view_count} time
                    {share.view_count === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {ALL_SECTIONS.map((key) => (
                    <label key={key} className="flex items-center justify-between gap-4 text-sm">
                      <span>{SECTION_LABEL[key]}</span>
                      <Switch
                        checked={Boolean(share.sections[key])}
                        disabled={revoked}
                        onCheckedChange={(on) =>
                          void run(
                            updateShareSections(share.id, { ...share.sections, [key]: on }),
                            on ? "Section added to this link" : "Section hidden from this link",
                          )
                        }
                        aria-label={`Show ${SECTION_LABEL[key]} on ${share.label}`}
                      />
                    </label>
                  ))}
                </div>

                {!revoked && (
                  <p className="mt-3 break-all rounded-lg border border-border/60 p-3 text-xs">
                    {url}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {!revoked && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        void window.navigator.clipboard.writeText(url);
                        toast.success("Link copied");
                      }}
                    >
                      Copy link
                    </Button>
                  )}
                  {revoked ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => void run(restorePassportShare(share.id), "Link is live again")}
                    >
                      Turn back on
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        await run(revokePassportShare(share.id), "Link revoked");
                        track("passport_share_revoked", {});
                      }}
                    >
                      Revoke
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => void run(deletePassportShare(share.id), "Link deleted")}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

export const Route = createFileRoute("/_authenticated/app/passport")({
  head: () => ({
    meta: [
      { title: "Your Wisdom Passport | EKA" },
      {
        name: "description",
        content:
          "A private, lifelong record of the practices, traditions, journeys and teachers you have explored on EKA. Yours to keep, share or delete.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Your Wisdom Passport | EKA" },
      {
        property: "og:description",
        content: "A private record of your spiritual exploration on EKA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PassportPage,
});

function PassportPage() {
  const enabled = useFeatureFlag("wisdom_passport_enabled");
  const queryClient = useQueryClient();
  const { data: passport, isLoading } = useQuery({
    queryKey: ["wisdom-passport"],
    queryFn: fetchMyPassport,
    enabled,
  });
  const { data: settings } = useQuery({
    queryKey: ["passport-settings"],
    queryFn: fetchPassportSettings,
    enabled,
  });

  const [shareEnabled, setShareEnabled] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);
  const [sections, setSections] = useState<Record<PassportSection, boolean> | null>(null);

  useEffect(() => {
    if (!settings) return;
    setShareEnabled(settings.share_enabled);
    setSlug(settings.share_slug);
    setSections(settings.sections);
  }, [settings]);

  if (!enabled) {
    return (
      <AppScreen title="Wisdom Passport">
        <EmptyState
          title="Not open yet"
          body="The Wisdom Passport is still being prepared. It will appear here when it is ready."
        />
      </AppScreen>
    );
  }

  if (isLoading || !passport || !sections) {
    return (
      <AppScreen title="Wisdom Passport">
        <Panel>Gathering your record…</Panel>
      </AppScreen>
    );
  }

  const nothingYet =
    passport.practices === 0 &&
    passport.reflections === 0 &&
    passport.journeys_started === 0 &&
    passport.circles === 0;

  async function persist(next: {
    share_enabled: boolean;
    share_slug: string | null;
    sections: Record<PassportSection, boolean>;
  }) {
    const { error } = await savePassportSettings(next);
    if (error) {
      toast.error(error.message);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["passport-settings"] });
    toast.success("Saved");
  }

  const shareUrl = slug ? `${window.location.origin}/passport/${slug}` : null;

  return (
    <AppScreen
      eyebrow="Yours to keep"
      title="Wisdom Passport"
      action={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const blob = new Blob([passportToText(passport)], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "eka-wisdom-passport.txt";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export
        </Button>
      }
    >
      <p className="text-sm text-muted-foreground">
        A record of what you explored — never a score, never a ranking. It is private until you
        decide otherwise.
      </p>

      {nothingYet ? (
        <EmptyState
          title="Not enough data yet"
          body="Practise, reflect or join a circle and your passport begins to fill."
        />
      ) : (
        <>
          <Panel
            title="Your record"
            meta={
              passport.since ? `Since ${new Date(passport.since).toLocaleDateString()}` : undefined
            }
          >
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                ["Practices", passport.practices],
                ["Traditions", passport.traditions.length],
                ["Journeys completed", passport.journeys_completed],
                ["Sessions", passport.sessions],
                ["Circles", passport.circles],
                ["Reflections", passport.reflections],
                ["Observations", passport.observations],
                ["Path tokens", passport.tokens],
              ].map(([label, value]) => (
                <div
                  key={label as string}
                  className="rounded-xl border border-border/60 p-3 text-foreground"
                >
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 font-display text-xl">{value}</dd>
                </div>
              ))}
            </dl>
            {passport.traditions.length > 0 && (
              <p className="mt-4 text-xs">Traditions explored: {passport.traditions.join(", ")}</p>
            )}
          </Panel>

          {passport.practice_breakdown.length > 0 && (
            <Panel title="Practices">
              <ul className="space-y-1">
                {passport.practice_breakdown.map((p) => (
                  <li key={p.label}>
                    {p.label}
                    {p.tradition ? ` · ${p.tradition}` : ""} — {p.count}
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {passport.journey_list.length > 0 && (
            <Panel title="Journeys">
              <ul className="space-y-1">
                {passport.journey_list.map((j) => (
                  <li key={j.title}>
                    {j.title}
                    {j.completed ? " — completed" : ""}
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </>
      )}

      <ShareLinks />

      <Panel title="Your original link" meta={shareEnabled ? "Live" : "Off"}>
        <div className="flex items-center justify-between gap-4">
          <p>The single link you made earlier. New links below are independent of it.</p>
          <Switch
            checked={shareEnabled}
            onCheckedChange={(on) => {
              const nextSlug = on ? (slug ?? newShareSlug()) : slug;
              setShareEnabled(on);
              setSlug(nextSlug);
              track("passport_share_toggle", { on });
              void persist({ share_enabled: on, share_slug: nextSlug, sections });
            }}
            aria-label="Enable the original shareable passport link"
          />
        </div>

        {shareEnabled && (
          <div className="mt-4 space-y-2">
            {(Object.keys(SECTION_LABEL) as PassportSection[]).map((key) => (
              <label key={key} className="flex items-center justify-between gap-4 text-sm">
                <span>{SECTION_LABEL[key]}</span>
                <Switch
                  checked={sections[key]}
                  onCheckedChange={(on) => {
                    const next = { ...sections, [key]: on };
                    setSections(next);
                    void persist({ share_enabled: shareEnabled, share_slug: slug, sections: next });
                  }}
                  aria-label={`Show ${SECTION_LABEL[key]} on the original link`}
                />
              </label>
            ))}
          </div>
        )}

        {shareEnabled && shareUrl && (
          <div className="mt-4 space-y-2">
            <p className="break-all rounded-lg border border-border/60 p-3 text-xs">{shareUrl}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  void navigator.clipboard.writeText(shareUrl);
                  toast.success("Link copied");
                }}
              >
                Copy link
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const next = newShareSlug();
                  setSlug(next);
                  void persist({ share_enabled: true, share_slug: next, sections });
                  toast.success("A new link was created. The old one no longer works.");
                }}
              >
                Replace link
              </Button>
            </div>
          </div>
        )}

        <Button
          size="sm"
          variant="ghost"
          className="mt-4 text-destructive"
          onClick={async () => {
            await deletePassportSharing();
            setShareEnabled(false);
            setSlug(null);
            await queryClient.invalidateQueries({ queryKey: ["passport-settings"] });
            toast.success("Sharing removed");
          }}
        >
          Delete sharing settings
        </Button>
      </Panel>
    </AppScreen>
  );
}
