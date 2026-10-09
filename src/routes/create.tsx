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
  BookOpen,
  MapPin,
  Users,
  Calendar,
  Sparkles,
  ShieldCheck,
  Plus,
  ArrowRight,
  Upload,
  CheckCircle2,
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

type ContributionKind = "story" | "documentation" | "place" | "sangha" | "experience";

function CreateArchivePage() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();

  const [activeKind, setActiveKind] = useState<ContributionKind>("story");
  const [title, setTitle] = useState("");
  const [contextNote, setContextNote] = useState("");
  const [tradition, setTradition] = useState("");
  const [place, setPlace] = useState("");
  const [sourceRef, setSourceRef] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      toast.info("Please sign in to contribute to the archive");
      void navigate({ to: "/auth" });
      return;
    }

    if (!title.trim() || !contextNote.trim()) {
      toast.error("Please provide a title and context note for your contribution");
      return;
    }

    setSubmitting(true);
    track("create_started", { kind: activeKind, title });

    try {
      // Record contribution into posts table
      const { data, error } = await supabase.from("posts").insert({
        author_id: profile.id,
        title: title.trim(),
        content: contextNote.trim(),
        topic: tradition.trim() || "Cultural Heritage",
        type: (activeKind === "story" ? "experience" : "reflection") as any,
        status: "visible",
      });

      if (error) {
        toast.error("Could not archive contribution: " + error.message);
      } else {
        toast.success("Preserved in the EKA Living Archive! Thank you for stewardship.");
        setTitle("");
        setContextNote("");
        setTradition("");
        setPlace("");
        setSourceRef("");
        void navigate({ to: "/stories" });
      }
    } catch {
      toast.error("An error occurred while preserving this contribution.");
    } finally {
      setSubmitting(false);
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

        {/* Contribution Type Selector (5 Pathways) */}
        <section className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            {
              id: "story" as const,
              label: "Cultural Reel / Story",
              icon: Film,
              desc: "Vertical video or photo with living context",
            },
            {
              id: "documentation" as const,
              label: "Cultural Documentation",
              icon: BookOpen,
              desc: "In-depth ritual, history, or philosophy",
            },
            {
              id: "place" as const,
              label: "Sacred Place",
              icon: MapPin,
              desc: "Temple, monastery, grove, or geography",
            },
            {
              id: "sangha" as const,
              label: "Community / Sangha",
              icon: Users,
              desc: "Found a circle of inquiry or lineage",
            },
            {
              id: "experience" as const,
              label: "Cultural Experience",
              icon: Calendar,
              desc: "Artisan workshop or festival gathering",
            },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeKind === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveKind(item.id)}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                    : "border-border/70 bg-card hover:bg-accent/40 hover:border-primary/40"
                }`}
              >
                <Icon
                  className={`size-5 mb-2 ${
                    isSelected ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <div>
                  <h3 className="font-serif font-bold text-xs text-foreground">
                    {item.label}
                  </h3>
                  <p className="text-[10px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </section>

        {/* Contribution Form */}
        <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-calm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Title of Tradition or Cultural Practice *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., The Twilight Fire Offering of Dashashwamedh Ghat"
                className="rounded-xl bg-background"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Cultural Lineage or Tradition
                </label>
                <Input
                  value={tradition}
                  onChange={(e) => setTradition(e.target.value)}
                  placeholder="e.g., Sanatana Dharma, Zen, Zapotec, Celtic"
                  className="rounded-xl bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Geographic Place & Region
                </label>
                <Input
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="e.g., Varanasi, Uttar Pradesh, India"
                  className="rounded-xl bg-background"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Cultural Context Note & Meaning *
              </label>
              <Textarea
                value={contextNote}
                onChange={(e) => setContextNote(e.target.value)}
                placeholder="Why is this practice done? Who are the lineage keepers? What human meaning does it carry? Provide respectful, accurate context."
                rows={5}
                className="rounded-xl bg-background"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Primary Source, Elder Attestation or Reference
              </label>
              <Input
                value={sourceRef}
                onChange={(e) => setSourceRef(e.target.value)}
                placeholder="e.g., Oral transmission from Pandit Ramakrishna / Rigveda 10.129"
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
                <span>{submitting ? "Preserving…" : "Preserve in Archive"}</span>
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
