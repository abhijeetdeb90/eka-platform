import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Film, ImagePlus, Layers, Loader2, Plus, X } from "lucide-react";
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
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [aspect, setAspect] = useState<AspectKey>("original");
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const isVideo = files.length === 1 && Boolean(files[0] && isVideoFile(files[0]));

  useEffect(() => {
    if (files.length === 0) {
      setPreviews([]);
      return;
    }
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [files]);

  const handleFilesSelected = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    const newFiles = Array.from(selectedFiles);

    const hasVideo = newFiles.some((f) => f.type.startsWith("video/"));
    if (hasVideo) {
      if (newFiles.length > 1 || files.length > 0) {
        toast.info("Videos are uploaded individually.");
      }
      const vid = newFiles.find((f) => f.type.startsWith("video/"))!;
      if (vid.size > VIDEO_MAX_BYTES) {
        toast.error("Videos need to be under 50 MB.");
        return;
      }
      clearMedia();
      setFiles([vid]);
      setAspect("wide");
      setActiveIndex(0);
      return;
    }

    const validImages = newFiles.filter((f) => {
      if (!f.type.startsWith("image/")) {
        toast.error(`"${f.name}" is not a recognized photo or video.`);
        return false;
      }
      if (f.size > IMAGE_MAX_BYTES) {
        toast.error(`"${f.name}" exceeds the 10 MB photo limit.`);
        return false;
      }
      return true;
    });

    if (validImages.length === 0) return;
    if (validImages.length > 1 || files.length > 0) {
      toast.info("One photo or one video per post is supported right now. Multi-photo carousels are disabled until gallery storage is added.");
    }
    setFiles([validImages[0]]);
    setAspect("original");
    setActiveIndex(0);
  };

  const removeFile = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    if (activeIndex >= next.length) {
      setActiveIndex(Math.max(0, next.length - 1));
    }
    if (next.length === 0) {
      clearMedia();
    }
  };

  const clearMedia = () => {
    setFiles([]);
    setPreviews([]);
    setActiveIndex(0);
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
    const hasText = content.trim().length > 0 || topic.trim().length > 0;
    const hasMedia = files.length > 0;
    if (!(hasText || hasMedia) || busy) return;
    setBusy(true);
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setBusy(false);
      return;
    }

    let mediaValue: string | null = null;
    if (files.length > 0) {
      setUploading(true);
      try {
        if (isVideo && files[0]) {
          const upload = files[0];
          const ext = upload.name.split(".").pop()?.toLowerCase() || "mp4";
          const path = `${auth.user.id}/${crypto.randomUUID()}.${ext}`;
          const { error: upErr } = await supabase.storage
            .from(MEDIA_BUCKET)
            .upload(path, upload, { contentType: upload.type, upsert: false });
          if (upErr) throw upErr;
          mediaValue = toStoredMedia(path);
        } else {
          const uploadedPaths = await Promise.all(
            files.map(async (file) => {
              const upload = await prepareImage(file, aspect);
              const ext = upload.name.split(".").pop()?.toLowerCase() || "webp";
              const path = `${auth.user.id}/${crypto.randomUUID()}.${ext}`;
              const { error: upErr } = await supabase.storage
                .from(MEDIA_BUCKET)
                .upload(path, upload, { contentType: upload.type, upsert: false });
              if (upErr) throw upErr;
              return toStoredMedia(path);
            }),
          );
          mediaValue = uploadedPaths[0] ?? null;
        }
      } catch {
        setUploading(false);
        setBusy(false);
        toast.error("That media didn't upload. Please try again.");
        return;
      }
      setUploading(false);
    }

    const finalContent = content.trim() || topic.trim() || "Shared reflection";

    const { data: inserted, error } = await supabase
      .from("posts")
      .insert({
        author_id: auth.user.id,
        type,
        content: finalContent,
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

    track("post_create", { type, has_image: !!mediaValue, is_carousel: files.length > 1 });

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

  const currentPreview = previews[activeIndex] ?? null;

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 transition-shadow duration-500 focus-within:shadow-calm sm:p-6">
      <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Share</p>
      <h2 className="mt-2 font-display text-xl leading-snug sm:text-2xl">
        What's on your mind?
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground" id="composer-hint">
        Share a cultural story, photo, video, tradition, craft or memory. Free for all seekers.
      </p>

      <Label htmlFor="composer-content" className="sr-only">
        Your reflection
      </Label>
      <Textarea
        id="composer-content"
        aria-describedby="composer-hint"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Begin anywhere Ã¢â‚¬â€ a line, a question, something you noticed…"
        rows={3}
        className="mt-4 resize-none border-0 bg-transparent px-0 text-[16px] leading-relaxed shadow-none focus-visible:ring-0"
      />

      {currentPreview && (
        <div className="mt-3 space-y-3">
          {/* Main Media Preview Frame */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
            <div className={cn("w-full", aspectClass[aspect])}>
              {isVideo ? (
                <video
                  src={currentPreview}
                  controls
                  playsInline
                  className={cn(
                    "w-full",
                    aspect === "original" ? "max-h-80" : "h-full object-cover",
                  )}
                />
              ) : (
                <img
                  src={currentPreview}
                  alt={`Preview slide ${activeIndex + 1} of ${previews.length}`}
                  className={cn(
                    "w-full",
                    aspect === "original" ? "max-h-80 object-contain" : "h-full object-cover",
                  )}
                />
              )}
            </div>

            {/* Carousel Slide Count Pill */}
            {previews.length > 1 && (
              <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-calm backdrop-blur">
                <Layers className="size-3 text-primary" />
                <span>
                  {activeIndex + 1} of {previews.length}
                </span>
              </div>
            )}

            {/* Slide Navigation Arrows */}
            {previews.length > 1 && (
              <>
                {activeIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveIndex((i) => i - 1)}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-1.5 text-foreground shadow-calm backdrop-blur hover:bg-background transition-transform active:scale-95"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                )}
                {activeIndex < previews.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveIndex((i) => i + 1)}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-1.5 text-foreground shadow-calm backdrop-blur hover:bg-background transition-transform active:scale-95"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                )}
              </>
            )}

            {/* Clear All Media Button */}
            <button
              type="button"
              onClick={clearMedia}
              aria-label="Remove attached media"
              className="absolute right-2 top-2 rounded-full bg-background/90 p-1.5 text-foreground shadow-calm backdrop-blur hover:bg-background"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>

          {/* Carousel Thumbnails Strip */}
          {!isVideo && previews.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {previews.map((url, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "group relative size-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
                    activeIndex === idx
                      ? "border-primary shadow-sm ring-2 ring-primary/20"
                      : "border-border/70 opacity-70 hover:opacity-100",
                  )}
                  onClick={() => setActiveIndex(idx)}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="size-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1 text-[9px] font-semibold text-white">
                    {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    aria-label={`Remove photo ${idx + 1}`}
                    className="absolute right-0.5 top-0.5 rounded-full bg-background/90 p-0.5 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}


            </div>
          )}

          {/* Crop Ratio Options */}
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
          aria-label="Attach photos, story carousel, or video"
          onChange={(e) => {
            handleFilesSelected(e.target.files);
            if (e.target) e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInput.current?.click()}
        >
          {isVideo ? (
            <Film aria-hidden="true" className="mr-2 size-4" />
          ) : files.length > 1 ? (
            <Layers aria-hidden="true" className="mr-2 size-4 text-primary" />
          ) : (
            <ImagePlus aria-hidden="true" className="mr-2 size-4" />
          )}
          {files.length === 0
            ? "Photo, story or video"
            : isVideo
              ? "Change video"
              : files.length > 1
                ? `${files.length} Photos in Carousel`
                : "1 Photo (Tap to replace)"}
        </Button>
        {files.length > 0 ? (
          <span className="truncate text-xs text-muted-foreground">
            {isVideo
              ? files[0]?.name || "Video"
              : `${files.length} photo${files.length > 1 ? "s" : ""} selected · Free for all seekers`}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">One photo to 10 MB or one video to 50 MB per post</span>
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
          placeholder="Topic (optional) Ã¢â‚¬â€ silence, grief, gratitude…"
        />
      </div>



      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {POST_TYPES.find((t) => t.value === type)?.hint}
        </p>
        <Button onClick={submit} disabled={busy || !(content.trim() || topic.trim() || files.length > 0)}>
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


