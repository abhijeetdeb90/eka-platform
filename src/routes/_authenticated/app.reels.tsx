import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Info, Plus, Timer } from "lucide-react";
import { toast } from "sonner";
import { AppScreen, EmptyState } from "@/components/app/AppScreen";
import { UserAvatar } from "@/components/app/Avatar";
import { ReactionBar } from "@/components/app/ReactionBar";
import { ReportButton } from "@/components/app/ReportButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  NORMS,
  TRADITIONS,
  createReel,
  fetchReels,
  recordView,
  uploadReelFile,
  type Reel,
} from "@/lib/discover";
import { track } from "@/lib/analytics";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/reels")({
  head: () => ({
    meta: [
      { title: "Reels — a glimpse into how people live their beliefs | EKA" },
      {
        name: "description",
        content:
          "Short cultural and religious clips with context first: festivals, rituals, food, music and the people who keep them.",
      },
    ],
  }),
  component: ReelsScreen,
});

function ReelsScreen() {
  const qc = useQueryClient();
  const { data: profile } = useProfile();
  const [composing, setComposing] = useState(false);
  const viewerTradition = profile?.interests?.[0] ?? null;

  const { data: reels, isLoading } = useQuery({
    queryKey: ["reels", viewerTradition],
    queryFn: () => fetchReels(viewerTradition),
  });

  const refresh = () => void qc.invalidateQueries({ queryKey: ["reels"] });

  return (
    <AppScreen
      eyebrow="Discover · give me a glimpse"
      title="Reels"
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
              <Plus className="mr-1 size-4" aria-hidden /> Share
            </>
          )}
        </Button>
      }
    >
      <section className="rounded-2xl border border-border bg-primary-soft/25 p-5">
        <p className="text-sm">Different beliefs. Different cultures. One human community.</p>
        <ul className="mt-3 grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
          {NORMS.map((n) => (
            <li key={n}>· {n}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          What travels here is what people finish, save and learn from — never what makes them
          angriest.
        </p>
      </section>

      {composing && (
        <ReelComposer
          onDone={() => {
            setComposing(false);
            refresh();
          }}
        />
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Gathering clips…</p>}

      {!isLoading && (reels?.length ?? 0) === 0 && (
        <EmptyState
          title="No clips yet"
          body="Share thirty to ninety seconds of something you actually do — a festival, a table, a song, a room."
        />
      )}

      {reels?.map((reel) => (
        <ReelCard key={reel.id} reel={reel} onChanged={refresh} />
      ))}
    </AppScreen>
  );
}

function ReelCard({ reel, onChanged }: { reel: Reel; onChanged: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [revealed, setRevealed] = useState(!reel.sensitive);

  const onEnded = () => {
    void recordView(reel.id, reel.duration_seconds, true);
    track("reel_complete", { reelId: reel.id });
  };
  const onPause = () => {
    const seconds = videoRef.current?.currentTime ?? 0;
    if (seconds > 2) void recordView(reel.id, seconds, false);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-calm">
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="flex min-w-0 items-center gap-2">
          <UserAvatar profile={reel.creator} className="size-9" />
          <div className="min-w-0">
            <p className="truncate text-sm">
              {reel.creator?.display_name ?? reel.creator?.username ?? "A member"}
            </p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {reel.tradition}
            </p>
          </div>
        </div>
        <ReportButton targetKind="reel" targetId={reel.id} />
      </div>

      <div className="relative bg-foreground/5">
        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="flex aspect-[9/12] w-full flex-col items-center justify-center gap-2 p-8 text-center"
          >
            <Info className="size-5 text-primary" aria-hidden />
            <span className="text-sm">This one needs context first</span>
            <span className="max-w-sm text-xs text-muted-foreground">{reel.context_note}</span>
            <span className="mt-2 text-xs underline underline-offset-4">Watch anyway</span>
          </button>
        ) : reel.media_kind === "embed" ? (
          <iframe
            src={reel.playbackUrl}
            title={reel.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full"
          />
        ) : (
          <video
            ref={videoRef}
            src={reel.playbackUrl}
            controls
            playsInline
            preload="metadata"
            onEnded={onEnded}
            onPause={onPause}
            className="max-h-[70vh] w-full bg-black object-contain"
          />
        )}
      </div>

      <div className="space-y-3 p-4">
        <h2 className="font-display text-lg leading-snug">{reel.title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{reel.context_note}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Timer className="size-3.5" aria-hidden /> {reel.duration_seconds}s
          </span>
          {reel.completions > 0 && <span>{reel.completions} watched it through</span>}
          {reel.topic_slug && (
            <Link
              to="/app/discover/$slug"
              params={{ slug: reel.topic_slug }}
              className="underline underline-offset-4"
            >
              Understand this properly
            </Link>
          )}
        </div>
        <ReactionBar
          targetKind="reel"
          targetId={reel.id}
          counts={reel.reactions}
          mine={reel.mine}
          onChanged={onChanged}
        />
      </div>
    </article>
  );
}

function ReelComposer({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<"upload" | "embed">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [embed, setEmbed] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [tradition, setTradition] = useState<string>("Universal");
  const [duration, setDuration] = useState("60");
  const [sensitive, setSensitive] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!title.trim() || note.trim().length < 20) {
      toast.error("Context is required — at least a sentence explaining what we are seeing.");
      return;
    }
    setBusy(true);
    try {
      let mediaUrl = embed.trim();
      if (mode === "upload") {
        if (!file) throw new Error("Choose a clip.");
        mediaUrl = await uploadReelFile(file);
      }
      await createReel({
        title: title.trim(),
        contextNote: note.trim(),
        tradition,
        mediaKind: mode,
        mediaUrl,
        durationSeconds: Math.min(Number(duration) || 60, 300),
        sensitive,
      });
      track("reel_create", { tradition, mode });
      toast.success("Shared.");
      onDone();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "That didn't upload.");
    }
    setBusy(false);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-calm">
      <div className="flex gap-2">
        {(["upload", "embed"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs",
              mode === m ? "border-primary bg-primary text-primary-foreground" : "border-border",
            )}
          >
            {m === "upload" ? "Upload a clip" : "Link a video"}
          </button>
        ))}
      </div>

      {mode === "upload" ? (
        <Input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      ) : (
        <Input placeholder="Embed URL" value={embed} onChange={(e) => setEmbed(e.target.value)} />
      )}

      <Input
        placeholder="Title — what is happening here?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        rows={3}
        placeholder="Context. Why do people do this? Who does it, and where? Say it plainly."
        value={note}
        onChange={(e) => setNote(e.target.value)}
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
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          type="number"
          min={10}
          max={300}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={sensitive}
            onChange={(e) => setSensitive(e.target.checked)}
          />
          Show my context note before it plays
        </label>
      </div>
      <Button size="sm" onClick={submit} disabled={busy}>
        {busy ? "Sharing…" : "Share"}
      </Button>
    </div>
  );
}
