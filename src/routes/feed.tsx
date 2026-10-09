// ==============================================================================
// EKA FEED — CONSUMER REAL-TIME ACTIVITY & COMMUNITY FEED
// ==============================================================================
// Specification: Primary Consumer Navigation Pillar: FEED (/feed)
// Directly connects the user to living community interactions, discussions,
// creator reflections, and real-time cultural activities.
// ==============================================================================

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { 
  Users, Sparkles, MessageSquare, Compass, ShieldCheck, 
  Heart, MessageCircle, Share2, Bookmark, UserPlus, 
  MapPin, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { MetaTags } from "@/components/seo";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

interface FeedPostProps {
  id: string;
  avatar: string;
  name: string;
  identity: string;
  time: string;
  location?: string;
  content: React.ReactNode;
  verifiedHuman?: boolean;
}

function FeedPost({ avatar, name, identity, time, location, content, verifiedHuman }: FeedPostProps) {
  return (
    <article className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-calm space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full overflow-hidden bg-accent shrink-0">
            {avatar ? (
              <img src={avatar} alt={name} className="size-full object-cover" />
            ) : (
              <div className="size-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                {name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-serif font-bold text-base text-foreground">
                {name}
              </h4>
              {verifiedHuman && (
                <div 
                  className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                  title="Strict Human Provenance Confirmed"
                >
                  <ShieldCheck className="size-3" />
                  <span>Verified Human</span>
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span>{identity}</span>
              <span>·</span>
              <span>{time}</span>
            </div>
            {location && (
              <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="size-3" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-full">
          <span className="sr-only">More options</span>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.12132 8.625 12.5 8.625C11.87868 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.87868 6.375 12.5 6.375C13.12132 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </Button>
      </div>

      {/* Content */}
      <div className="text-sm text-foreground/90 font-sans leading-relaxed">
        {content}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-terracotta rounded-full">
            <Heart className="size-4" />
            <span className="text-xs">Like</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-primary rounded-full">
            <MessageCircle className="size-4" />
            <span className="text-xs">Comment</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-primary rounded-full">
            <Share2 className="size-4" />
            <span className="text-xs">Share</span>
          </Button>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-primary rounded-full">
            <Bookmark className="size-4" />
            <span className="text-xs hidden sm:inline">Save</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs rounded-full">
            <UserPlus className="size-3.5" />
            <span>Follow</span>
          </Button>
        </div>
      </div>
    </article>
  );
}

function FeedPage() {
  const [activeTab, setActiveTab] = useState("foryou");

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
                <Link to="/ask" search={{ q: "" } as any}>
                  <MessageSquare className="mr-1.5 size-3.5" />
                  Ask EKA
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Real-time Feed Core */}
        <section className="container-eka max-w-2xl py-8 md:py-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-card border border-border/70 p-1 rounded-2xl flex w-full mb-6">
              <TabsTrigger value="foryou" className="rounded-xl text-sm flex-1">
                For You
              </TabsTrigger>
              <TabsTrigger value="following" className="rounded-xl text-sm flex-1">
                Following
              </TabsTrigger>
            </TabsList>

            <TabsContent value="foryou" className="space-y-6">
              <FeedPost 
                id="post-1"
                avatar=""
                name="Debabrata Pal"
                identity="Hereditary Clay Sculptor, 5th Gen"
                time="3m ago"
                location="Kolkata, Bengal"
                verifiedHuman={true}
                content={
                  <div className="space-y-3">
                    <p className="font-bold">Chokkhudan Ritual: The Painting of the Third Eye</p>
                    <p>At dawn of Mahalaya, the senior sculptors at Kumartuli enter deep fasting before drawing the divine gaze (Chokkhudan). Sacred clay gathered from the Ganga riverbed and temple thresholds is now consecrated for the public pandals.</p>
                  </div>
                }
              />
              <FeedPost 
                id="post-2"
                avatar=""
                name="Sunita Bishnoi"
                identity="Sacred Grove Custodian"
                time="38m ago"
                location="Thar Desert, Rajasthan"
                verifiedHuman={true}
                content={
                  <div className="space-y-3">
                    <p className="font-bold">Why does water retain purity longer beneath sacred Khejri tree roots?</p>
                    <p>Elder Ramchandra ji noted in our village council that the microclimate under centuries-old Prosopis cineraria preserves deep well water table levels. Documenting this observation with botanical references in our open archive.</p>
                  </div>
                }
              />
            </TabsContent>
            
            <TabsContent value="following" className="space-y-6">
              <FeedPost 
                id="post-3"
                avatar=""
                name="Ketan Salvi"
                identity="Master Ikat Weaver"
                time="1h ago"
                location="Patan, Gujarat"
                verifiedHuman={true}
                content={
                  <div className="space-y-3">
                    <p className="font-bold">New 8-month Patan Patola Loom Mounting</p>
                    <p>Our family has set up the handloom for the classic Navratna pattern. Every single warp and weft silk thread has undergone 7 rounds of resist-dyeing with madder root and indigo. Weaving progresses at 8 inches per day.</p>
                  </div>
                }
              />
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

