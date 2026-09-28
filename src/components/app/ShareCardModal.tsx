import { useState } from "react";
import { Copy, Check, MessageSquare, Share2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProvenanceBadge } from "@/components/app/ProvenanceBadge";
import { EkaLogo } from "@/components/brand/Logo";
import type { FeedPost } from "@/lib/api";

interface ShareCardModalProps {
  post: FeedPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareCardModal({ post, open, onOpenChange }: ShareCardModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/app/p/${post.id}?ref=community_share`
      : `https://eka.earth/app/p/${post.id}`;

  const authorName = post.author?.display_name || "A Tradition Keeper";
  const communityName = post.community?.name || post.topic || "Living Tradition";
  const shareText = `“${post.content.slice(0, 160)}${post.content.length > 160 ? "..." : ""}”\n\n— Documented by ${authorName} (${communityName}) on EKA: The Living Cultural Archive.\n\nRead the full tradition and add your community's version here:\n${shareUrl}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Story link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const shareNative = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${post.topic || "Sacred Tradition"} — EKA`,
          text: `Documented by ${authorName} on EKA — The Living Cultural Archive:`,
          url: shareUrl,
        });
      } catch {
        /* user dismissed */
      }
    } else {
      copyLink();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border border-border/80 bg-background/95 p-6 shadow-lift backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">
            Share this Cultural Story
          </DialogTitle>
        </DialogHeader>

        {/* Visual Share Card Preview */}
        <div className="relative mt-2 overflow-hidden rounded-2xl border border-border/80 bg-sand/30 p-6 shadow-calm">
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
            <EkaLogo className="scale-90 origin-left" />
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
              Living Archive
            </span>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <ProvenanceBadge
                kind={
                  (post as { provenance?: string }).provenance ??
                  (post.type === "reading" ? "documented" : "community")
                }
              />
              {post.topic && (
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  {post.topic}
                </span>
              )}
            </div>

            <p className="mt-3 font-display text-base leading-relaxed text-foreground line-clamp-4">
              “{post.content}”
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
              <span>
                Documented by <strong className="text-foreground">{authorName}</strong>
              </span>
              <span>{communityName}</span>
            </div>
          </div>
        </div>

        {/* Sharing Action Buttons */}
        <div className="mt-5 space-y-2.5">
          <Button
            onClick={shareWhatsApp}
            className="w-full rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-xs"
          >
            <MessageSquare className="mr-2 size-4" /> Share on WhatsApp
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={copyLink} variant="outline" className="rounded-xl">
              {copied ? (
                <Check className="mr-1.5 size-4 text-forest" />
              ) : (
                <Copy className="mr-1.5 size-4" />
              )}
              {copied ? "Copied" : "Copy Link"}
            </Button>
            <Button onClick={shareNative} variant="secondary" className="rounded-xl">
              <Share2 className="mr-1.5 size-4" /> Other Apps
            </Button>
          </div>
        </div>

        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Every share preserves a living tradition and brings new seekers to the archive.
        </p>
      </DialogContent>
    </Dialog>
  );
}
