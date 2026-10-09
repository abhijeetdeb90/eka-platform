// ==============================================================================
// EKA FEED — CONSUMER REAL-TIME ACTIVITY & COMMUNITY FEED
// ==============================================================================
// Specification: Primary Consumer Navigation Pillar: FEED (/feed)
// Directly connects the user to living community interactions, discussions,
// creator reflections, and real-time cultural activities.
// ==============================================================================

import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { RealtimeActivityFeed } from "@/components/community/RealtimeActivityFeed";
import { Users, Sparkles, MessageSquare, Compass, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { MetaTags } from "@/components/seo";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Living Cultural Feed — EKA" },
      {
        name: "description",
        content:
          "Real-time stream of living cultural practices, verified custodian reflections, and community discussions across global traditions.",
      },
      { property: "og:title", content: "Living Cultural Feed — EKA" },
      {
        property: "og:description",
        content:
          "Explore real-time cultural interactions, elder teachings, and living traditions.",
      },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <MetaTags
        title="Living Cultural Feed"
        description="Real-time stream of living cultural practices, verified custodian reflections, and community discussions across global traditions."
        ogTitle="Living Cultural Feed — EKA"
        ogDescription="Explore real-time cultural interactions, elder teachings, and living traditions."
        ogImage="/brand/eka-banner.jpg"
        canonicalUrl="/feed"
        twitterCard="summary_large_image"
        twitterTitle="Living Cultural Feed — EKA"
        twitterDescription="Real-time stream of living cultural practices, verified custodian reflections, and community discussions."
        keywords={["community feed", "cultural reflections", "elder teachings", "living rituals", "custodians"]}
      />
      <SiteHeader />

      <main className="flex-1">
        {/* Editorial Subheader */}
        <section className="border-b border-border/40 bg-sand/15 dark:bg-charcoal-light/20 py-8 md:py-12">
          <div className="container-eka max-w-4xl">
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-mono uppercase tracking-wider text-terracotta">
                <Sparkles className="size-3" />
                <span>Living Human Pulse</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
                Community Activity Feed
              </h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl font-sans">
                Real-time updates, sacred ritual observations, artisanal craft demonstrations, and respectful inquiries shared by custodians and practitioners across global lineages.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-border/30">
              <Button asChild size="sm" className="bg-terracotta text-terracotta-foreground hover:bg-terracotta/90 rounded-full text-xs">
                <Link to="/community">
                  <Users className="mr-1.5 size-3.5" />
                  Explore Sanghas & Groups
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-full text-xs">
                <Link to="/stories">
                  <Sparkles className="mr-1.5 size-3.5" />
                  Watch Stories
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="rounded-full text-xs">
                <Link to="/ask">
                  <MessageSquare className="mr-1.5 size-3.5" />
                  Ask EKA
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Real-time Feed Core */}
        <section className="container-eka max-w-4xl py-8 md:py-12">
          <RealtimeActivityFeed />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
