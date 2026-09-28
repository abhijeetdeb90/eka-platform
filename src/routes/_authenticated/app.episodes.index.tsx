import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, Mic, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppScreen, EmptyState } from "@/components/app/AppScreen";
import { UserAvatar } from "@/components/app/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TRADITIONS, createEpisode, fetchEpisodes, type Episode } from "@/lib/discover";
import { formatINR } from "@/lib/pay";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/episodes/")({
  head: () => ({
    meta: [
      { title: "Conversations, podcasts and live sessions | EKA" },
      {
        name: "description",
        content:
          "Long-form interfaith conversations: scholars, historians, festival explainers, personal stories and open questions.",
      },
    ],
  }),
  component: EpisodesIndex,
});

function EpisodesIndex() {
  const qc = useQueryClient();
  const [composing, setComposing] = useState(false);
  const { data: episodes, isLoading } = useQuery({
    queryKey: ["episodes"],
    queryFn: fetchEpisodes,
  });

  const upcoming = (episodes ?? []).filter(
    (e) => e.scheduled_at && new Date(e.scheduled_at) > new Date(),
  );
  const library = (episodes ?? []).filter((e) => !upcoming.includes(e));

  return (
    <AppScreen
      eyebrow="Discover · let me hear other perspectives"
      title="Conversations"
      action={
        <Button
          size="sm"
          variant={composing ? "ghost" : "outline"}
          onClick={() => setComposing((v) => !v)}
        >
          {composing ? (
            "Close"
          ) : (
            <>
              <Plus className="mr-1 size-4" aria-hidden /> Host one
            </>
          )}
        </Button>
      }
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        Recorded first, so nobody has to be awake at 3am for it. Scheduled sessions are announced
        here and the recording stays afterwards.
      </p>

      {composing && (
        <EpisodeComposer
          onDone={() => {
            setComposing(false);
            void qc.invalidateQueries({ queryKey: ["episodes"] });
          }}
        />
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Loading conversations…</p>}

      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-lg">Coming up</h2>
          {upcoming.map((e) => (
            <EpisodeRow key={e.id} episode={e} />
          ))}
        </section>
      )}

      {!isLoading && library.length === 0 && upcoming.length === 0 ? (
        <EmptyState
          title="No conversations yet"
          body="Host the first one — thirty minutes and a genuine question is enough."
        />
      ) : (
        <section className="space-y-3">
          {upcoming.length > 0 && <h2 className="font-display text-lg">Listen now</h2>}
          {library.map((e) => (
            <EpisodeRow key={e.id} episode={e} />
          ))}
        </section>
      )}
    </AppScreen>
  );
}

function EpisodeRow({ episode }: { episode: Episode }) {
  return (
    <Link
      to="/app/episodes/$id"
      params={{ id: episode.id }}
      className="block rounded-2xl border border-border bg-card p-5 shadow-calm transition-shadow hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            {episode.tradition} · {episode.duration_minutes} min · {episode.media_kind}
          </p>
          <h3 className="mt-1.5 font-display text-lg leading-snug">{episode.title}</h3>
        </div>
        <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[11px]">
          {episode.price_cents > 0 ? formatINR(episode.price_cents) : "Free"}
        </span>
      </div>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {episode.description}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <UserAvatar profile={episode.host} className="size-7" />
          {episode.host?.display_name ?? episode.host?.username ?? "A host"}
        </span>
        {episode.scheduled_at && (
          <span className="flex items-center gap-1.5">
            <CalendarClock className="size-3.5" aria-hidden />
            {new Date(episode.scheduled_at).toLocaleString()}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Mic className="size-3.5" aria-hidden /> {episode.rsvps} going
        </span>
      </div>
    </Link>
  );
}

function EpisodeComposer({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tradition, setTradition] = useState<string>("Universal");
  const [mediaKind, setMediaKind] = useState<"audio" | "video">("audio");
  const [mediaUrl, setMediaUrl] = useState("");
  const [minutes, setMinutes] = useState("30");
  const [scheduledAt, setScheduledAt] = useState("");
  const [price, setPrice] = useState("0");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!title.trim() || description.trim().length < 20) {
      toast.error("Give it a title and a real description.");
      return;
    }
    setBusy(true);
    try {
      await createEpisode({
        title: title.trim(),
        description: description.trim(),
        tradition,
        mediaKind,
        mediaUrl: mediaUrl.trim() || null,
        durationMinutes: Number(minutes) || 30,
        scheduledAt: scheduledAt || null,
        priceCents: Math.round((Number(price) || 0) * 100),
      });
      toast.success("Published.");
      onDone();
    } catch {
      toast.error("That didn't publish.");
    }
    setBusy(false);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-calm">
      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea
        rows={3}
        placeholder="What will you actually talk about, and who is it for?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {TRADITIONS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTradition(t)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              tradition === t
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {(["audio", "video"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setMediaKind(k)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs capitalize",
              mediaKind === k
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border",
            )}
          >
            {k}
          </button>
        ))}
      </div>
      <Input
        placeholder="Audio or video URL (leave blank for a scheduled session)"
        value={mediaUrl}
        onChange={(e) => setMediaUrl(e.target.value)}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground" htmlFor="mins">
            Minutes
          </label>
          <Input
            id="mins"
            type="number"
            min={5}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground" htmlFor="when">
            Scheduled (optional)
          </label>
          <Input
            id="when"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground" htmlFor="price">
            Price in ₹ (0 = free)
          </label>
          <Input
            id="price"
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        If you charge, EKA's platform fee is shown to buyers before they pay. You keep the rest.
      </p>
      <Button size="sm" onClick={submit} disabled={busy}>
        {busy ? "Publishing…" : "Publish"}
      </Button>
    </div>
  );
}
