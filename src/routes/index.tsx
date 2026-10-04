// ==============================================================================
// EKA CONSUMER PLATFORM — LIVING GATEWAY TO THE WORLD'S CULTURES
// ==============================================================================
// "ONE WITHIN. ONE WITH ALL."
// "ONE WORLD. BILLIONS OF STORIES."
// 1. Dynamic Editorial Banner Canvas with Curiosity-Driven Auto-Rotation
// 2. Persistent, Non-Aggressive Login Panel with Google Auth & Authenticated State
// 3. Living World Visual & Interactive Curiosity Discovery Loop
// 4. Seven-Screen Narrative Scroll Experience & Real Community Stewards
// 5. Creator Invitation: "Your Story Belongs Here"
// ==============================================================================

import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EKADynamicBanner } from "@/components/home/EKADynamicBanner";
import { EKAHomeAuthPanel } from "@/components/home/EKAHomeAuthPanel";
import { LivingWorldVisual } from "@/components/home/LivingWorldVisual";
import { DiscoveryJourney } from "@/components/home/DiscoveryJourney";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EKA — One World. Billions of Stories. Living Cultural Discovery" },
      {
        name: "description",
        content:
          "Discover traditions, sacred places, living crafts, and festivals across the world through real human stories. One Within. One With All.",
      },
      { property: "og:title", content: "EKA — ONE WORLD. BILLIONS OF STORIES." },
      {
        property: "og:description",
        content: "A living gateway to the world's cultures, communities, and local knowledge.",
      },
      { property: "og:image", content: "/brand/eka-banner-sunset.jpg" },
    ],
  }),
  component: EkaHomePage,
});

function EkaHomePage() {
  const handleScrollToWorld = () => {
    const el = document.getElementById("living-world");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-sand/20 dark:bg-stone-950 text-foreground flex flex-col selection:bg-terracotta/20">
      {/* 1. Primary Site Navigation Header */}
      <SiteHeader />

      <main id="main-content" className="flex-1 space-y-16 sm:space-y-24 pb-20">
        {/* ==================================================================== */}
        {/* 1. HERO — DYNAMIC EDITORIAL CANVAS & PERSISTENT LOGIN PANEL */}
        {/* ==================================================================== */}
        <section className="container-eka pt-6 sm:pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left / Main Area: Living Editorial Dynamic Banner */}
            <div className="lg:col-span-8 flex">
              <EKADynamicBanner
                onExploreWorld={handleScrollToWorld}
                className="h-full"
              />
            </div>

            {/* Right Area: Persistent, Calm Login Panel */}
            <div className="lg:col-span-4 flex">
              <EKAHomeAuthPanel className="w-full h-full" />
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 2. LIVING WORLD VISUAL — INTERACTIVE MAP & CURIOSITY LOOP */}
        {/* ==================================================================== */}
        <section className="container-eka">
          <LivingWorldVisual />
        </section>

        {/* ==================================================================== */}
        {/* 3. SCROLL EXPERIENCE & DISCOVERY JOURNEY */}
        {/* ==================================================================== */}
        <DiscoveryJourney />
      </main>

      {/* 4. Global Site Footer */}
      <SiteFooter />
    </div>
  );
}
