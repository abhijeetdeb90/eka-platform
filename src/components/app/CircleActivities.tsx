import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarClock,
  HeartHandshake,
  Flame,
  BookOpen,
  Trophy,
  Flag,
  Users,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import {
  ACTIVITY_KINDS,
  createActivity,
  decideJoin,
  fetchCircleActivities,
  kindLabel,
  removeParticipant,
  requestJoin,
  setActivityClosed,
  setAttended,
  type ActivityKind,
  type CircleActivity,
} from "@/lib/circles";
import { reportContent, REPORT_REASONS } from "@/lib/discover";
import { UserAvatar } from "@/components/app/Avatar";
import { EmptyState } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { track } from "@/lib/analytics";

const ICON: Record<string, typeof Flame> = {
  ritual: Flame,
  story: BookOpen,
  service: HeartHandshake,
  milestone: Trophy,
};

export function CircleActivities({
  communityId,
  isMember,
}: {
  communityId: string;
  isMember: boolean;
}) {
  const queryClient = useQueryClient();
  const [kind, setKind] = useState<ActivityKind>("ritual");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [capacity, setCapacity] = useState("");
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: activities } = useQuery({
    queryKey: ["circle-activities", communityId],
    queryFn: () => fetchCircleActivities(communityId),
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["circle-activities", communityId] });

  const submit = async () => {
    if (!title.trim() || !body.trim()) return;
    setSaving(true);
    try {
      await createActivity({
        communityId,
        kind,
        title: title.trim(),
        body: body.trim(),
        startsAt: startsAt || null,
        capacity: capacity ? Number(capacity) : null,
        requiresApproval,
      });
      track("circle_activity_create", { kind });
      setTitle("");
      setBody("");
      setStartsAt("");
      setCapacity("");
      setRequiresApproval(false);
      setOpen(false);
      await refresh();
    } catch {
      toast.error("We couldn't post that just now.");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      {isMember && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          {!open ? (
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              Start something for this circle
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {ACTIVITY_KINDS.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setKind(k.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      kind === k.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    }`}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {ACTIVITY_KINDS.find((k) => k.id === kind)?.blurb}
              </p>
              <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Textarea
                placeholder="What is this, and what does taking part actually involve?"
                value={body}
                rows={4}
                onChange={(e) => setBody(e.target.value)}
              />
              {(kind === "ritual" || kind === "service") && (
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground" htmlFor="starts">
                    When does it happen?
                  </label>
                  <Input
                    id="starts"
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                  />
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground" htmlFor="cap">
                    How many people can this hold? (blank = no limit)
                  </label>
                  <Input
                    id="cap"
                    type="number"
                    min={1}
                    placeholder="e.g. 12"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </div>
                <label className="flex items-end gap-2 pb-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={requiresApproval}
                    onChange={(e) => setRequiresApproval(e.target.checked)}
                  />
                  I approve each person who asks to join
                </label>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={submit}
                  disabled={saving || !title.trim() || !body.trim()}
                >
                  {saving ? "Sharing…" : "Share with the circle"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {(activities?.length ?? 0) === 0 ? (
        <EmptyState
          title="Nothing shared yet"
          body="Circles hold shared rituals, member stories, acts of service and the milestones you reach together."
        />
      ) : (
        activities?.map((a) => <ActivityCard key={a.id} activity={a} onChanged={refresh} />)
      )}
    </div>
  );
}

function ActivityCard({
  activity: a,
  onChanged,
}: {
  activity: CircleActivity;
  onChanged: () => void;
}) {
  const [reporting, setReporting] = useState(false);
  const [managing, setManaging] = useState(false);
  const Icon = ICON[a.kind] ?? Flame;

  const join = async () => {
    try {
      const result = await requestJoin(a);
      if (result === "pending") toast.success("Asked to join. The host will decide.");
      if (result === "approved") track("circle_activity_join", {});
      await onChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "That didn't work.");
    }
  };

  const report = async (reason: string) => {
    await reportContent("circle_activity", a.id, reason, "");
    setReporting(false);
    toast.success("Reported. A person will look at this.");
  };

  const joinLabel =
    a.myStatus === "pending"
      ? "Waiting on the host"
      : a.joined
        ? "I'm in"
        : a.kind === "story"
          ? "This moved me"
          : "Take part";

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-calm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <Icon className="size-4 text-primary" aria-hidden />
          {kindLabel(a.kind)}
        </div>
        <button
          type="button"
          onClick={() => setReporting((v) => !v)}
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Report this"
        >
          <Flag className="size-4" aria-hidden />
        </button>
      </div>

      {reporting && (
        <div className="mt-3 space-y-2 rounded-xl border border-border bg-background/60 p-3">
          <p className="text-xs text-muted-foreground">Why are you reporting this?</p>
          <div className="flex flex-wrap gap-2">
            {REPORT_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => report(r)}
                className="rounded-full border border-border px-3 py-1 text-xs hover:bg-accent"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      <h3 className="mt-2 font-display text-lg">{a.title}</h3>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
        {a.body}
      </p>

      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
        {a.starts_at && (
          <span className="flex items-center gap-1.5">
            <CalendarClock className="size-4" aria-hidden />
            {new Date(a.starts_at).toLocaleString()}
          </span>
        )}
        {a.capacity !== null && (
          <span className="flex items-center gap-1.5">
            <Users className="size-4" aria-hidden />
            {a.participants} of {a.capacity} places taken
          </span>
        )}
        {a.requires_approval && <span>Host approves each person</span>}
        {a.closed && (
          <span className="flex items-center gap-1.5">
            <Lock className="size-4" aria-hidden /> Closed
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex min-w-0 items-center gap-2">
          <UserAvatar profile={a.author} className="size-8" />
          <span className="truncate text-xs text-muted-foreground">
            {a.author?.display_name ?? a.author?.username ?? "A member"} ·{" "}
            {a.participants === 0
              ? "no one yet"
              : `${a.participants} ${a.participants === 1 ? "member" : "members"} taking part`}
          </span>
        </div>
        <div className="flex shrink-0 gap-2">
          {a.isHost && (
            <Button size="sm" variant="ghost" onClick={() => setManaging((v) => !v)}>
              Manage{a.pending > 0 ? ` (${a.pending})` : ""}
            </Button>
          )}
          {a.kind !== "milestone" && !a.isHost && (
            <Button
              size="sm"
              variant={a.joined ? "outline" : "default"}
              onClick={join}
              disabled={(!a.joined && (a.closed || a.full)) || a.myStatus === "pending"}
            >
              {a.closed && !a.joined ? "Closed" : a.full && !a.joined ? "Full" : joinLabel}
            </Button>
          )}
        </div>
      </div>

      {a.isHost && managing && (
        <div className="mt-4 space-y-3 rounded-xl border border-border bg-background/60 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                await setActivityClosed(a.id, !a.closed);
                await onChanged();
              }}
            >
              {a.closed ? "Reopen" : "Close to new people"}
            </Button>
            <span className="text-xs text-muted-foreground">
              {a.pending} waiting · {a.participants} taking part
            </span>
          </div>

          {a.people.length === 0 ? (
            <p className="text-xs text-muted-foreground">No one has asked to join yet.</p>
          ) : (
            a.people.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 border-t border-border pt-3 first:border-0 first:pt-0"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <UserAvatar profile={p.profile} className="size-7" />
                  <span className="truncate text-xs">
                    {p.profile?.display_name ?? p.profile?.username ?? "Member"}
                    <span className="text-muted-foreground"> · {p.status}</span>
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {p.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={async () => {
                          await decideJoin(p.id, "approved");
                          await onChanged();
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          await decideJoin(p.id, "declined");
                          await onChanged();
                        }}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                  {p.status === "approved" && (
                    <>
                      <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={p.attended}
                          onChange={async (e) => {
                            await setAttended(p.id, e.target.checked);
                            await onChanged();
                          }}
                        />
                        Was there
                      </label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          await removeParticipant(p.id);
                          await onChanged();
                        }}
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </article>
  );
}
