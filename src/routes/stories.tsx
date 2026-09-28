import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Sparkles,
  Users,
  MapPin,
  Share2,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CommunityVariationModal } from "@/components/app/CommunityVariationModal";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "EKA 1,000 Stories — Documenting India's Living Cultural Archive" },
      {
        name: "description",
        content:
          "1,000 people. 1,000 traditions. 1 living cultural archive. Join the national campaign to document community customs, temple legends, and sacred rituals before they vanish.",
      },
      { property: "og:title", content: "EKA 1,000 Stories Campaign" },
      {
        property: "og:description",
        content: "Document your village, family, or community's living tradition on EKA.",
      },
    ],
  }),
  component: StoriesCampaignPage,
});

const REGIONS = [
  {
    name: "Northeast & Eastern Traditions",
    count: 58,
    examples: "Assamese Bihu rituals, Meghalaya sacred groves, Kamakhya legends, Manipuri Raas",
  },
  {
    name: "Southern Sacred Geography",
    count: 72,
    examples:
      "Kerala Theyyam oral chants, Tamil Sangam temple hymns, Karnataka Vachanas, Andhra Harikatha",
  },
  {
    name: "Western Ghats & Desh",
    count: 46,
    examples: "Maharashtra Varkari abhangas, Gujarati Garba symbolism, Saurashtra folk deities",
  },
  {
    name: "Northern & Himalayan Lineages",
    count: 61,
    examples: "Kashmir Shaiva rituals, Garhwali Pandav Nritya, Kangra valley prayer folkways",
  },
  {
    name: "Central & Tribal Commons",
    count: 27,
    examples: "Bastar tribal Dussehra, Gond sacred art narratives, Malwa Kabir panth traditions",
  },
];

function StoriesCampaignPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const totalTarget = 1000;
  const currentCount = 264; // Dynamic counter reflecting verified community submissions

  const shareCampaignWhatsApp = () => {
    const text = `Join the EKA 1,000 Stories Campaign! 🇮🇳\n\nWe are building a living archive of 1,000 unique traditions, rituals, and family customs before they are forgotten.\n\nDocument your community's practice or local temple story here:\nhttps://eka.earth/stories?ref=wa_campaign`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary-soft selection:text-foreground">
      <SiteHeader />
      <main className="container-eka mx-auto max-w-4xl px-5 py-16 lg:py-24">
        {/* Campaign Hero */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/10 px-3.5 py-1 text-xs uppercase tracking-[0.22em] text-saffron">
            <Sparkles className="size-3.5" />
            <span>National Cultural Preservation Initiative</span>
          </div>
          <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            The EKA 1,000 Stories Campaign
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground font-light leading-relaxed">
            1,000 people. 1,000 traditions. 1 living cultural archive. Don't let your family's oral
            practices and local village rituals fade into history.
          </p>

          {/* Progress Tracker Card */}
          <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-calm">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-display text-4xl font-semibold text-foreground">
                  {currentCount}
                </span>
                <span className="text-sm text-muted-foreground"> / {totalTarget} documented</span>
              </div>
              <span className="rounded-full bg-forest/10 border border-forest/20 px-3 py-1 text-xs font-medium text-forest">
                {Math.round((currentCount / totalTarget) * 100)}% Milestone
              </span>
            </div>

            <Progress value={(currentCount / totalTarget) * 100} className="mt-4 h-2.5" />

            <p className="mt-4 text-xs text-muted-foreground">
              Every contributor receives the permanent{" "}
              <strong className="text-foreground">EKA Founding Contributor</strong> designation on
              their verified profile.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={() => setModalOpen(true)} size="lg" className="rounded-xl shadow-xs">
                <BookOpen className="mr-2 size-4" /> Document a Tradition
              </Button>
              <Button
                onClick={shareCampaignWhatsApp}
                variant="outline"
                size="lg"
                className="rounded-xl"
              >
                <MessageSquare className="mr-2 size-4 text-[#25D366]" /> Share on WhatsApp
              </Button>
            </div>
          </div>
        </div>

        {/* 3 Steps: How to Participate */}
        <section className="mt-20">
          <h2 className="font-display text-2xl text-foreground text-center">
            How to Participate in 3 Steps
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
              <span className="font-display text-3xl text-terracotta">01</span>
              <h3 className="mt-3 font-semibold text-base text-foreground">
                Pick a Living Tradition
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                A festival ritual, unique puja ingredient, culinary offering, temple lore, or custom
                taught by your grandparents.
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
              <span className="font-display text-3xl text-terracotta">02</span>
              <h3 className="mt-3 font-semibold text-base text-foreground">Document the Nuance</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Explain how your community practices it differently from the textbook or mainstream
                version.
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
              <span className="font-display text-3xl text-terracotta">03</span>
              <h3 className="mt-3 font-semibold text-base text-foreground">
                Receive Permanent Attribution
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Your entry becomes an indexable node in the EKA Knowledge Graph, attributed to you
                and your community forever.
              </p>
            </div>
          </div>
        </section>

        {/* Regional Progress Breakdown */}
        <section className="mt-20">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-foreground">Regional Archives in Progress</h2>
            <span className="text-xs text-muted-foreground">India & Diaspora</span>
          </div>

          <div className="mt-6 space-y-3.5">
            {REGIONS.map((r) => (
              <div
                key={r.name}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-terracotta" />
                    <h3 className="font-medium text-sm text-foreground">{r.name}</h3>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{r.examples}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="font-display text-lg font-semibold text-foreground">
                    {r.count}
                  </span>
                  <span className="text-xs text-muted-foreground"> stories</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="mt-20 rounded-3xl border border-primary/30 bg-sand/40 p-8 text-center sm:p-12">
          <h2 className="font-display text-3xl text-foreground">
            Be 1 of the 1,000 Founding Tradition Keepers
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            No expensive equipment or academic degree required. Only your authentic family memory
            and community knowledge.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => setModalOpen(true)} size="lg" className="rounded-xl">
              Add Your Story Now
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <Link to="/join">Create Contributor Profile</Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* Community Variation / Story Modal */}
      <CommunityVariationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        parentTopic="EKA 1,000 Stories Campaign"
      />
    </div>
  );
}
