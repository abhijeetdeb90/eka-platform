import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FounderHero } from "@/components/founder/FounderHero";
import { AboutEkaVisualSection } from "@/components/founder/AboutEkaVisualSection";
import { PictorialFeed } from "@/components/founder/PictorialFeed";
import { FounderStoriesFeed } from "@/components/founder/FounderStoriesFeed";
import { FounderContentStudioModal } from "@/components/founder/FounderContentStudioModal";
import {
  INITIAL_PICTORIAL_CARDS,
  getStoredFounderCards,
  type PictorialCard,
} from "@/lib/founder-data";

export const Route = createFileRoute("/founder/ad")({
  head: () => ({
    meta: [
      { title: "AD — Founder of EKA | The Civilizational Intelligence Layer" },
      {
        name: "description",
        content:
          "AD is building EKA: the trusted intelligence layer for the world's cultures, communities and local knowledge — connecting authentic wisdom, people, places, traditions, creators and communities.",
      },
      { property: "og:title", content: "AD — Founder of EKA" },
      {
        property: "og:description",
        content:
          "Building the trusted intelligence layer for the world's cultures, communities and local knowledge.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:image", content: "/brand/ad-founder.jpg" },
      { property: "og:image:alt", content: "AD — Founder of EKA holding a field notebook" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/brand/ad-founder.jpg" },
    ],
  }),
  component: FounderAdPage,
});

function FounderAdPage() {
  const [cards, setCards] = useState<PictorialCard[]>(INITIAL_PICTORIAL_CARDS);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Hydrate from localStorage if user has made custom edits
  useEffect(() => {
    setCards(getStoredFounderCards());
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary-soft selection:text-foreground">
      <SiteHeader />
      <main id="main-content">
        {/* 1. Founder Profile Hero: AD Bio, Vision, Initiatives, Follow & Connect */}
        <FounderHero onOpenStudio={() => setIsStudioOpen(true)} />

        {/* 2. Auto-Generated "About EKA" Section: 7-Stage Pipeline & 13 Connection Domains */}
        <AboutEkaVisualSection />

        {/* 3. Pre-Generated Pictorial Content: "EKA — The World Through Its People" (20+ Cards) */}
        <PictorialFeed cards={cards} onOpenStudio={() => setIsStudioOpen(true)} />

        {/* 4. Founder-Led Visual Stories: "From the Founder" (10 Strategic Principles) */}
        <FounderStoriesFeed />

        {/* 5. Founder Content Studio Modal (Admin / Creator Control) */}
        <FounderContentStudioModal
          isOpen={isStudioOpen}
          onClose={() => setIsStudioOpen(false)}
          cards={cards}
          onCardsUpdated={(updated) => setCards(updated)}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
