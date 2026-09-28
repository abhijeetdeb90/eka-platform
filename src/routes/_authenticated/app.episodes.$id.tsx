import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, Lock } from "lucide-react";
import { toast } from "sonner";
import { AppScreen, EmptyState } from "@/components/app/AppScreen";
import { UserAvatar } from "@/components/app/Avatar";
import { ReactionBar } from "@/components/app/ReactionBar";
import { ReportButton } from "@/components/app/ReportButton";
import { QuestionBoard } from "@/components/app/QuestionBoard";
import { FollowEpisode } from "@/components/app/FollowEpisode";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addEpisodeComment, fetchEpisode, toggleRsvp } from "@/lib/discover";
import { buyEpisode, checkout, formatINR, GRATITUDE_TIERS, payCreator } from "@/lib/pay";
import { usePlatformConfig } from "@/hooks/usePlatformConfig";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/_authenticated/app/episodes/$id")({
  component: EpisodePage,
});

function EpisodePage() {
  const { feePercent } = usePlatformConfig();
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const [comment, setComment] = useState("");
  const { data: profile } = useProfile();

  const { data, isLoading } = useQuery({
    queryKey: ["episode", id],
    queryFn: () => fetchEpisode(id),
  });
  const refresh = () => void qc.invalidateQueries({ queryKey: ["episode", id] });

  if (isLoading) return <AppScreen title="Conversation">Loading…</AppScreen>;
  if (!data)
    return (
      <AppScreen title="Conversation">
        <EmptyState title="Not found" body="This conversation is no longer here." />
      </AppScreen>
    );

  const { episode, chapters, comments, rsvped, purchased } = data;
  const locked = episode.price_cents > 0 && !purchased;
  const scheduled = episode.scheduled_at ? new Date(episode.scheduled_at) : null;

  const buy = async () => {
    try {
      await buyEpisode(episode.id, episode.creator_id, episode.price_cents);
      track("episode_purchase", { id: episode.id, amount: episode.price_cents });
      toast.success("Yours. Enjoy it.");
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment didn't go through.");
    }
  };

  const tip = async (amount: number) => {
    try {
      await payCreator({
        creatorId: episode.creator_id,
        amountCents: amount,
        kind: "tip",
        referenceKind: "episode",
        referenceId: episode.id,
      });
      track("tip_sent", { amount });
      toast.success("Sent, with the fee shown up front.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "That didn't send.");
    }
  };

  const postComment = async () => {
    if (!comment.trim()) return;
    await addEpisodeComment(episode.id, comment.trim());
    setComment("");
    refresh();
  };

  return (
    <AppScreen
      eyebrow={`${episode.tradition} · ${episode.duration_minutes} min`}
      title={episode.title}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <UserAvatar profile={episode.host} className="size-9" />
          <span className="truncate text-sm text-muted-foreground">
            {episode.host?.display_name ?? episode.host?.username ?? "A host"}
          </span>
        </div>
        <ReportButton targetKind="episode" targetId={episode.id} />
      </div>

      <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
        {episode.description}
      </p>

      {scheduled && scheduled > new Date() && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary-soft/25 p-5">
          <p className="flex items-center gap-2 text-sm">
            <CalendarClock className="size-4 text-primary" aria-hidden />
            Live {scheduled.toLocaleString()} · {episode.rsvps} going
          </p>
          <Button
            size="sm"
            variant={rsvped ? "outline" : "default"}
            onClick={async () => {
              await toggleRsvp(episode.id, rsvped);
              if (!rsvped) track("episode_rsvp", { id: episode.id });
              refresh();
            }}
          >
            {rsvped ? "I'm going" : "Save my place"}
          </Button>
        </div>
      )}

      {locked ? (
        <div className="space-y-3 rounded-2xl border border-border bg-card p-6 text-center shadow-calm">
          <Lock className="mx-auto size-5 text-primary" aria-hidden />
          <p className="text-sm">A paid conversation with the host.</p>
          <dl className="mx-auto max-w-xs space-y-1 text-left text-xs">
            <div className="flex justify-between gap-3">
              <dt>Host's price</dt>
              <dd>{formatINR(episode.price_cents)}</dd>
            </div>
            <div className="flex justify-between gap-3 text-muted-foreground">
              <dt>EKA platform fee · {feePercent}%</dt>
              <dd>{formatINR(checkout(episode.price_cents, "added").fee)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-border pt-1 font-medium">
              <dt>Total</dt>
              <dd>{formatINR(checkout(episode.price_cents, "added").total)}</dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground">
            The host receives their full {formatINR(episode.price_cents)}. Shown before you pay,
            never after.
          </p>
          <Button size="sm" onClick={buy}>
            Pay {formatINR(checkout(episode.price_cents, "added").total)} from my wallet
          </Button>
          <p className="text-xs text-muted-foreground">
            <Link to="/app/wallet" className="underline underline-offset-4">
              Top up your wallet
            </Link>{" "}
            first if it is empty.
          </p>
        </div>
      ) : episode.media_url ? (
        episode.media_kind === "video" ? (
          <video src={episode.media_url} controls className="w-full rounded-2xl bg-black" />
        ) : (
          <audio src={episode.media_url} controls className="w-full" />
        )
      ) : (
        <p className="text-sm text-muted-foreground">
          The recording appears here after the session.
        </p>
      )}

      {chapters.length > 0 && !locked && (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-calm">
          <h2 className="font-display text-lg">Chapters</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {chapters.map((c) => (
              <li key={c.id}>
                {Math.floor(c.starts_seconds / 60)}:{String(c.starts_seconds % 60).padStart(2, "0")}{" "}
                · {c.label}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-calm">
        <p className="text-sm">Offer gratitude</p>
        <p className="text-xs text-muted-foreground">
          Only if something here was of value to you. Nothing is expected.
        </p>
        <div className="flex flex-wrap gap-2">
          {GRATITUDE_TIERS.map((t) => (
            <Button key={t} size="sm" variant="outline" onClick={() => tip(t)}>
              {formatINR(t)}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Paid from your EKA wallet. EKA's {feePercent}% comes out of the amount you choose — offer{" "}
          {formatINR(GRATITUDE_TIERS[0])} and the host receives{" "}
          {formatINR(checkout(GRATITUDE_TIERS[0], "inclusive").creator)}.
        </p>
      </section>

      <FollowEpisode episodeId={episode.id} />

      <QuestionBoard episodeId={episode.id} isHost={profile?.id === episode.creator_id} />

      <ReactionBar
        targetKind="episode"
        targetId={episode.id}
        counts={{}}
        mine={[]}
        onChanged={refresh}
      />

      <section className="space-y-3">
        <h2 className="font-display text-lg">Continue the discussion</h2>
        <Textarea
          rows={3}
          placeholder="Ask the genuine question. Criticise ideas, never people."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button size="sm" onClick={postComment} disabled={!comment.trim()}>
          Post
        </Button>
        {comments.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <UserAvatar profile={c.author} className="size-7" />
              <span className="text-xs text-muted-foreground">
                {c.author?.display_name ?? c.author?.username ?? "A member"}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{c.body}</p>
          </div>
        ))}
      </section>
    </AppScreen>
  );
}
