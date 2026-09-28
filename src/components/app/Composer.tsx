import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Film, ImagePlus, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { POST_TYPES } from "@/lib/eka";
import { MEDIA_BUCKET, hydratePosts, toStoredMedia, type FeedPost, type PostRow } from "@/lib/api";
import {
  ACCEPTED_MEDIA,
  ASPECTS,
  IMAGE_MAX_BYTES,
  VIDEO_MAX_BYTES,
  isVideoFile,
  prepareImage,
  type AspectKey,
} from "@/lib/media";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const aspectClass: Record<AspectKey, string> = {
  original: "",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  wide: "aspect-video",
};

export function Composer({
  communityId,
  onPosted,
}: {
  communityId?: string;
  onPosted?: () => void;
}) {
  const queryClient = useQueryClient();
  const [type, setType] = useState<string>("reflection");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [community, setCommunity] = useState(communityId ?? "");
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [aspect, setAspect] = useState<AspectKey>("original");
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const isVideo = !!file && isVideoFile(file);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const pickFile = (f: File | null) => {
    if (!f) return;
    const video = f.type.startsWith("video/");
    if (!video && !f.type.startsWith("image/")) {
      toast.error("Please choose a photo or a video.");
      return;
    }
    if (video && f.size > VIDEO_MAX_BYTES) {
      toast.error("Videos need to be under 50 MB.");
      return;
    }
    if (!video && f.size > IMAGE_MAX_BYTES) {
      toast.error("Photos need to be under 10 MB.");
      return;
    }
    if (video) setAspect("wide");
    setFile(f);
  };

  const clearMedia = () => {
    setFile(null);
    setAspect("original");
    if (fileInput.current) fileInput.current.value = "";
  };

  const { data: joined } = useQuery({
    queryKey: ["my-communities"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return [];
      const { data } = await supabase
        .from("community_members")
        .select("community_id, communities(id, name)")
        .eq("user_id", auth.user.id);
      return (data ?? []) as {
        community_id: string;
        communities: { id: string; name: string } | null;
      }[];
    },
    enabled: !communityId,
  });

  const submit = async () => {
    if (!content.trim() || busy) return;
    setBusy(true);
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setBusy(false);
      return;
    }

    let mediaValue: string | null = null;
    if (file) {
      setUploading(true);
      try {
        const upload = isVideo ? file : await prepareImage(file, aspect);
        const ext = upload.name.split(".").pop()?.toLowerCase() || (isVideo ? "mp4" : "webp");
        const path = `${auth.user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(MEDIA_BUCKET)
          .upload(path, upload, { contentType: upload.type, upsert: false });
        if (upErr) throw upErr;
        mediaValue = toStoredMedia(path);
      } catch {
        setUploading(false);
        setBusy(false);
        toast.error("That media didn't upload. Please try again.");
        return;
      }
      setUploading(false);
    }

    const { data: inserted, error } = await supabase
      .from("posts")
      .insert({
        author_id: auth.user.id,
        type,
        content: content.trim(),
        topic: topic.trim() || null,
        media_url: mediaValue,
        community_id: community || null,
      })
      .select("*")
      .single();

    setBusy(false);
    if (error || !inserted) {
      toast.error("We couldn't publish that. Please try again.");
      return;
    }

    track("post_create", { type, has_image: !!mediaValue });

    // Show the new post at the top of the feed straight away, fully hydrated
    // with tags, media, reactions and comment counts.
    try {
      const [hydrated] = await hydratePosts([inserted as unknown as PostRow]);
      if (hydrated) {
        queryClient.setQueriesData<FeedPost[]>({ queryKey: ["feed"] }, (old) =>
          old ? [hydrated, ...old.filter((p) => p.id !== hydrated.id)] : [hydrated],
        );
      }
    } catch {
      /* the invalidation below still refreshes the feed */
    }

    setContent("");
    setTopic("");
    clearMedia();
    toast.success("Shared with EKA.");
    void queryClient.invalidateQueries({ queryKey: ["feed"] });
    void queryClient.invalidateQueries({ queryKey: ["community-feed"] });
    void queryClient.invalidateQueries({ queryKey: ["my-recent-topics"] });
    onPosted?.();
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 transition-shadow duration-500 focus-within:shadow-calm sm:p-6">
      <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Share</p>
      <h2 className="mt-2 font-display text-xl leading-snug sm:text-2xl">
        What are you sitting with today?
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground" id="composer-hint">
        Share something that may help another person see differently.
      </p>

      <Label htmlFor="composer-content" className="sr-only">
        Your reflection
      </Label>
      <Textarea
        id="composer-content"
        aria-describedby="composer-hint"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Begin anywhere — a line, a question, something you noticed…"
        rows={3}
        className="mt-4 resize-none border-0 bg-transparent px-0 text-[16px] leading-relaxed shadow-none focus-visible:ring-0"
      />

      {preview && (
        <div className="mt-3">
          <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
            <div className={cn("w-full", aspectClass[aspect])}>
              {isVideo ? (
                <video
                  src={preview}
                  controls
                  playsInline
                  className={cn(
                    "w-full",
                    aspect === "original" ? "max-h-80" : "h-full object-cover",
                  )}
                />
              ) : (
                <img
                  src={preview}
                  alt="Preview of the media you attached"
                  className={cn(
                    "w-full",
                    aspect === "original" ? "max-h-80 object-contain" : "h-full object-cover",
                  )}
                />
              )}
            </div>
            <button
              type="button"
              onClick={clearMedia}
              aria-label="Remove attached media"
              className="absolute right-2 top-2 rounded-full bg-background/90 p-1.5 text-foreground shadow-calm backdrop-blur hover:bg-background"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>

          {!isVideo && (
            <fieldset className="mt-2">
              <legend className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Crop
              </legend>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {ASPECTS.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    aria-pressed={aspect === a.key}
                    onClick={() => setAspect(a.key)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition-colors",
                      aspect === a.key
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:bg-accent",
                    )}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
        </div>
      )}

      <fieldset className="mt-3">
        <legend className="sr-only">Kind of post</legend>
        <div className="flex flex-wrap gap-1.5">
          {POST_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              aria-pressed={type === t.value}
              onClick={() => setType(t.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                type === t.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-accent",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          ref={fileInput}
          type="file"
          accept={ACCEPTED_MEDIA}
          className="sr-only"
          aria-label="Attach a photo or video"
          onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInput.current?.click()}
        >
          {isVideo ? (
            <Film aria-hidden="true" className="mr-2 size-4" />
          ) : (
            <ImagePlus aria-hidden="true" className="mr-2 size-4" />
          )}
          {file ? "Change media" : "Photo or video"}
        </Button>
        {file ? (
          <span className="truncate text-xs text-muted-foreground">{file.name}</span>
        ) : (
          <span className="text-xs text-muted-foreground">Photos to 10 MB · video to 50 MB</span>
        )}
      </div>

      <div className="mt-3">
        <Label htmlFor="composer-topic" className="sr-only">
          Topic
        </Label>
        <Input
          id="composer-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic (optional) — silence, grief, gratitude…"
        />
      </div>

      {!communityId && (joined?.length ?? 0) > 0 && (
        <>
          <Label htmlFor="composer-audience" className="sr-only">
            Where to post
          </Label>
          <select
            id="composer-audience"
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
            className="mt-2 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Post to your followers</option>
            {joined?.map((m) => (
              <option key={m.community_id} value={m.community_id}>
                {m.communities?.name ?? "Circle"}
              </option>
            ))}
          </select>
        </>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {POST_TYPES.find((t) => t.value === type)?.hint}
        </p>
        <Button onClick={submit} disabled={busy || !content.trim()}>
          {(uploading || busy) && (
            <Loader2 aria-hidden="true" className="mr-2 size-4 animate-spin" />
          )}
          {uploading ? "Uploading…" : busy ? "Posting…" : "Post"}
        </Button>
      </div>
      <p aria-live="polite" className="sr-only">
        {uploading ? "Uploading your media" : busy ? "Publishing your post" : ""}
      </p>
    </div>
  );
}
