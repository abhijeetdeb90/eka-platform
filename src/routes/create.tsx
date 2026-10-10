// ==============================================================================
// EKA CREATE — LIVING CULTURAL ARCHIVE CONTRIBUTION ENGINE
// ==============================================================================
// Positioned not merely as "posting content", but as contributing to the living archive:
// CREATE → CONTRIBUTE → VERIFY / CONTEXTUALIZE → PRESERVE → DISCOVER
// Supports: Stories · Cultural Documentation · Sacred Places · Sanghas · Experiences
// ==============================================================================

import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Film,
  Image as ImageIcon,
  MessageSquare,
  MapPin,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create — Contribute to the Living Cultural Archive | EKA" },
      {
        name: "description",
        content:
          "Preserve family traditions, rituals, artisan crafts, sacred places, and oral histories. Contribute directly to the world's living cultural archive on EKA.",
      },
    ],
  }),
  component: CreateArchivePage,
});

type ContributionKind = "post" | "carousel" | "video";

function CreateArchivePage() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();

  const [activeKind, setActiveKind] = useState<ContributionKind>("post");
  const [caption, setCaption] = useState("");
  const [culture, setCulture] = useState("");
  const [place, setPlace] = useState("");
  const [topic, setTopic] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      toast.info("Please sign in to contribute to the archive");
      void navigate({ to: "/auth" });
      return;
    }

    if (!caption.trim() && !file) {
      toast.error("Please provide a caption for your contribution");
      return;
    }

    if ((activeKind === "carousel" || activeKind === "video") && !file) {
      toast.error(`Please provide a media file for your ${activeKind}`);
      return;
    }

    setSubmitting(true);
    setUploadStatus("Starting...");
    track("create_started", { kind: activeKind });

    let media_url: string | null = null;
    let uploadedFilePath: string | null = null;

    try {
      if (file) {
        const isVideo = activeKind === "video";
        const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
        const validVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];
        
        if (isVideo && !validVideoTypes.includes(file.type)) {
          toast.error("Please upload a valid video file (.mp4, .webm, .mov)");
          setSubmitting(false);
          setUploadStatus("");
          return;
        }
        if (!isVideo && !validImageTypes.includes(file.type)) {
          toast.error("Please upload a valid image file (.jpg, .png, .webp)");
          setSubmitting(false);
          setUploadStatus("");
          return;
        }
        
        const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
          toast.error(`File is too large (max ${isVideo ? '50MB' : '10MB'})`);
          setSubmitting(false);
          setUploadStatus("");
          return;
        }

        const fileExt = file.name.split('.').pop();
        const filePath = `${profile.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        uploadedFilePath = filePath;

        setUploadStatus("Uploading media...");
        
        let attempt = 0;
        let lastError = null;
        while (attempt < 3) {
          const { error } = await supabase.storage
            .from("post-media")
            .upload(filePath, file);
            
          lastError = error;
          if (!error) break;
          
          attempt++;
          if (attempt < 3) {
            setUploadStatus(`Retrying upload (attempt ${attempt + 1})...`);
            await new Promise(r => setTimeout(r, 1000 * attempt));
          }
        }

        if (lastError) {
          throw new Error("Upload failed: " + lastError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from("post-media")
          .getPublicUrl(filePath);

        media_url = publicUrlData.publicUrl;
      }

      setUploadStatus("Saving post...");
      const { data, error } = await supabase.from("posts").insert({
        author_id: profile.id,
        content: caption.trim(),
        topic: topic.trim() || "Cultural Heritage",
        tradition: culture.trim(),
        type: activeKind,
        status: "visible",
        media_url: media_url,
      });

      if (error) {
        if (uploadedFilePath) {
          await supabase.storage.from("post-media").remove([uploadedFilePath]);
        }
        throw new Error("Could not archive contribution: " + error.message);
      } else {
        toast.success("Preserved in the EKA Living Archive! Thank you for stewardship.");
        setCaption("");
        setCulture("");
        setPlace("");
        setTopic("");
        setFile(null);
        void navigate({ to: "/my-eka" });
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while preserving this contribution.");
    } finally {
      setSubmitting(false);
      setUploadStatus("");
    }
  };

  return (
    <div className="min-h-screen bg-sand/20 dark:bg-stone-950 text-foreground flex flex-col selection:bg-terracotta/20">
      <SiteHeader />

      <main id="main-content" className="flex-1 py-8 sm:py-14 space-y-8 max-w-4xl container-eka">
        {/* Header & Archival Calling */}
        <section className="text-center space-y-3">
          <Badge
            variant="outline"
            className="border-terracotta/40 text-terracotta text-xs font-mono uppercase tracking-wider mb-1"
          >
            <Sparkles className="size-3 mr-1.5 inline" />
            EKA Living Cultural Archive · Contribution Engine
          </Badge>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Contribute to the World's Living Archive
          </h1>
          <p className="font-serif text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            Every family holds rituals. Every region holds crafts. Every elder holds memories.
            Preserve human culture with verified context, source attribution, and unbroken respect.
          </p>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 max-w-2xl mx-auto flex items-center justify-between text-xs text-muted-foreground text-left">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Attribution Guarantee:</strong> Your contributions are preserved in your name, verified with community elders, and protected from commercial AI scrapping.
              </span>
            </div>
            <Link to="/standards" className="text-primary hover:underline font-medium shrink-0">
              Standards →
            </Link>
          </div>
        </section>

        {/* Contribution Type Selector */}
        <section className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            {
              id: "post" as const,
              label: "Post",
              icon: MessageSquare,
              desc: "Share a cultural reflection",
            },
            {
              id: "carousel" as const,
              label: "Carousel",
              icon: ImageIcon,
              desc: "Share multiple images",
            },
            {
              id: "video" as const,
              label: "Video",
              icon: Film,
              desc: "Share a video clip",
            },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeKind === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveKind(item.id)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                    : "border-border/70 bg-card hover:bg-accent/40 hover:border-primary/40"
                }`}
              >
                <Icon
                  className={`size-6 mb-3 ${
                    isSelected ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <div>
                  <h3 className="font-serif font-bold text-sm text-foreground">
                    {item.label}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-snug mt-1 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </section>

        {/* Contribution Form */}
        <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-calm space-y-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Media File {activeKind !== "post" && "*"}
              </label>
              <Input
                type="file"
                accept={activeKind === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}
                className="rounded-xl bg-background file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                required={activeKind !== "post"}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Caption
              </label>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Share your reflection, story, or cultural insight..."
                rows={4}
                className="rounded-xl bg-background"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Culture / Lineage
                </label>
                <Input
                  value={culture}
                  onChange={(e) => setCulture(e.target.value)}
                  placeholder="e.g., Sanatana Dharma, Zen"
                  className="rounded-xl bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Place
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder="e.g., Varanasi, India"
                    className="pl-9 rounded-xl bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Topic
              </label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Rituals, Artisan Craft, Philosophy"
                className="rounded-xl bg-background"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/60">
              <span className="text-xs text-muted-foreground font-light">
                Contributions are permanently preserved in the EKA Living Cultural Archive.
              </span>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto rounded-xl px-7 bg-gradient-to-r from-terracotta to-saffron text-white font-medium shadow-calm hover:shadow-lift"
              >
                <span>{submitting ? uploadStatus || "Publishing…" : "Publish"}</span>
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </div>
          </form>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}



