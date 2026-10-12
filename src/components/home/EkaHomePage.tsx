// ==============================================================================
// EKA HOMEPAGE
// ==============================================================================
// 1. Flagship Cinematic Hero Banner: ONE WORLD. BILLIONS OF STORIES.
// 2. Stories from the World (Short-form video reels & visual highlights rail)
// 3. Category-First Discovery & Knowledge Objects + Living Reflection
// 4. How EKA Works (Discover → Learn → Ask EKA)
// ==============================================================================

import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass, HelpCircle, MapPin, Sparkles, BookOpen, Layers, Feather, Radio } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { EKADynamicBanner } from "@/components/home/EKADynamicBanner";
import { HomeStoriesSection } from "@/components/home/HomeStoriesSection";
import { ExploreByCulturalCategory } from "@/components/home/ExploreByCulturalCategory";
import { CompareCulturesSection } from "@/components/home/CompareCulturesSection";
import { CulturalPrinciplesSection } from "@/components/home/CulturalPrinciplesSection";
import { TwoDoorwaysSection } from "@/components/home/TwoDoorwaysSection";
import { DestinationLineageSection } from "@/components/home/DestinationLineageSection";
import { FamilyHeritageCtaBanner } from "@/components/home/FamilyHeritageCtaBanner";
import { BETA_PLACES_OR_PRACTICES } from "@/data/beta-seed-data";
import { useProfile } from "@/hooks/useProfile";

export function EkaHomePage() {
  const { data: profile } = useProfile();
  const featured = BETA_PLACES_OR_PRACTICES.slice(0, 6);

  const categories = [
    {
      title: "Living Traditions",
      desc: "Festivals, community gatherings, and living rites of passage",
      count: "Documented",
      link: "/discover",
      tag: "Practices",
      icon: Sparkles,
      color: "border-amber-200 bg-amber-50/40 text-amber-900",
    },
    {
      title: "Master Crafts & Guilds",
      desc: "Centuries-old metalwork, textiles, clay sculpture, and stonework",
      count: "GI Verified",
      link: "/discover",
      tag: "Crafts",
      icon: Layers,
      color: "border-orange-200 bg-orange-50/40 text-orange-900",
    },
    {
      title: "Sacred Geography",
      desc: "Historic river ghats, monastic sanctuaries, and cultural landscapes",
      count: "World Heritage",
      link: "/discover",
      tag: "Places",
      icon: MapPin,
      color: "border-stone-200 bg-stone-50/40 text-stone-900",
    },
    {
      title: "Oral Lore & Perspectives",
      desc: "Living memory, culinary hearths, and ancestral philosophies",
      count: "Community",
      link: "/feed",
      tag: "Feed",
      icon: BookOpen,
      color: "border-emerald-200 bg-emerald-50/40 text-emerald-900",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C45C26]/20">
      <SiteHeader />

      <main className="flex-1">
        {/* Curated thin notification strip */}
        <div className="border-b border-[#E8E2D9] bg-[#F3EDE6]/60 py-2 px-4 text-center">
          <p className="text-xs text-[#5C5C5C]">
            Curated cultural places, practices, and community stories • Real people & authentic lineages
          </p>
        </div>

        {/* 1. Flagship Cinematic Dynamic Banner: ONE WORLD. BILLIONS OF STORIES. */}
        <section className="mx-auto max-w-[1120px] px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
          <EKADynamicBanner />
        </section>

        {/* 2. Stories from the World (9:16 Video Highlights & Reels) */}
        <section className="border-b border-[#E8E2D9] bg-white/60">
          <HomeStoriesSection />
        </section>

        {/* 3. Explore by Cultural Category (12-Card Dimensions Grid from Stitch Design) */}
        <ExploreByCulturalCategory className="border-b border-[#E8E2D9] bg-white" />

        {/* 4. Explore Places & Practices + Daily Living Reflection */}
        <section className="py-10 sm:py-16 px-4 sm:px-6 bg-[#FAF7F2]">
          <div className="mx-auto max-w-[1120px]">
            {/* Main Discovery Columns Grid: 2/3 Content, 1/3 Daily Reflection Widget */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Category Cards & Featured Documentation */}
              <div className="lg:col-span-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1A1A] tracking-tight">
                      Explore Places & Living Practices
                    </h2>
                    <p className="text-sm text-[#5C5C5C] mt-1">
                      Curated cultural knowledge objects, verified regional crafts, and ancient landmarks.
                    </p>
                  </div>
                  <Link
                    to="/discover"
                    className="text-sm font-medium text-[#C45C26] hover:text-[#A34A1F] flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                  >
                    <span>View all</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>

                {/* 4 Category-First Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((c) => {
                    const Icon = c.icon;
                    return (
                      <Link
                        key={c.title}
                        to={c.link as any}
                        className={`group p-5 rounded-2xl border transition-all duration-300 hover:shadow-sm hover:border-[#C45C26]/40 ${c.color}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="size-9 rounded-xl bg-white/80 shadow-xs flex items-center justify-center text-[#C45C26]">
                            <Icon className="size-5" />
                          </div>
                          <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/70">
                            {c.count}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-medium text-[#1A1A1A] group-hover:text-[#C45C26] transition-colors">
                          {c.title}
                        </h3>
                        <p className="text-xs text-[#5C5C5C] mt-1.5 leading-relaxed">
                          {c.desc}
                        </p>
                      </Link>
                    );
                  })}
                </div>

                {/* Featured Documentation 2-col subset */}
                <div className="pt-4 border-t border-[#E8E2D9]">
                  <h3 className="font-serif text-xl font-medium text-[#1A1A1A] mb-4">
                    Documented Cultural Objects
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {featured.slice(0, 4).map((item) => (
                      <Link
                        key={item.id}
                        to="/discover"
                        className="group rounded-2xl border border-[#E8E2D9] bg-white p-4 flex flex-col justify-between hover:border-[#C45C26]/40 transition-colors shadow-xs"
                      >
                        <div>
                          <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#F3EDE6] mb-3">
                            <img
                              src={item.imagePath}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-[#5C5C5C] mb-1.5">
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              <MapPin className="size-3 text-[#C45C26]" />
                              {item.location}
                            </span>
                            <span className="rounded bg-[#F3EDE6] px-2 py-0.5 text-[10px] font-medium text-[#5C5C5C]">
                              {item.category}
                            </span>
                          </div>
                          <h4 className="font-serif text-base font-medium text-[#1A1A1A] group-hover:text-[#C45C26] transition-colors leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-xs text-[#5C5C5C] leading-relaxed mt-1 line-clamp-2">
                            {item.summary}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Daily Living Reflection & Community Actions */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Daily Cultural Reflection Widget */}
                <div className="rounded-2xl border border-amber-200/80 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold tracking-widest text-[#C45C26]">
                      <Sparkles className="size-3.5" />
                      Daily Reflection
                    </span>
                    <span className="text-[11px] font-mono text-[#5C5C5C]">
                      Today
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-lg sm:text-xl font-medium text-[#1A1A1A] leading-snug">
                      "What is a family ritual or tradition you carry that grounds your everyday life?"
                    </h3>
                    <p className="text-xs text-[#5C5C5C] leading-relaxed">
                      EKA invites personal reflections and community memories alongside documented public traditions.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E8E2D9]">
                    <Button
                      asChild
                      className="w-full rounded-xl bg-[#C45C26] hover:bg-[#A34A1F] text-white text-xs font-medium py-2.5 shadow-none transition-colors"
                    >
                      <Link to="/create">
                        <Feather className="size-3.5 mr-1.5" />
                        <span>Share Your Reflection</span>
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Community Living Feed Quick Portal */}
                <div className="rounded-2xl border border-[#E8E2D9] bg-white p-6 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5C5C5C]">
                    <Radio className="size-3.5 text-[#C45C26]" />
                    <span>Real-Time Activity</span>
                  </div>
                  <h4 className="font-serif text-base font-medium text-[#1A1A1A]">
                    Live Community Feed
                  </h4>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed">
                    Read unvarnished reflections, artisan demonstrations, and cultural questions from verified contributors.
                  </p>
                  <Link
                    to="/feed"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C45C26] hover:underline pt-1"
                  >
                    <span>Open community feed</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>

                {/* Ask EKA Inquiries Starter */}
                <div className="rounded-2xl border border-[#E8E2D9] bg-white p-6 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5C5C5C]">
                    <HelpCircle className="size-3.5 text-[#C45C26]" />
                    <span>Inquiry Engine</span>
                  </div>
                  <h4 className="font-serif text-base font-medium text-[#1A1A1A]">
                    Curious about a tradition?
                  </h4>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed">
                    Ask questions and read factual historical explanations grounded in living cultural history.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-xl border-[#E8E2D9] bg-white hover:bg-[#F3EDE6] text-[#1A1A1A] text-xs font-medium py-2.5 transition-colors"
                  >
                    <Link to="/ask">
                      <span>Explore Inquiries</span>
                    </Link>
                  </Button>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 5. Compare Cultures (Different cultures, similar human questions) */}
        <CompareCulturesSection />

        {/* 6. Two Doorways (Explore Living Culture vs Find Your People) */}
        <TwoDoorwaysSection />

        {/* 7. Built on principles that protect human warmth */}
        <CulturalPrinciplesSection />

        {/* 8. Explore by Destination & Lineage */}
        <DestinationLineageSection />

        {/* 9. Your Story Belongs Here (Record Family Heritage Banner) */}
        <FamilyHeritageCtaBanner />

        {/* 10. How It Works (3 Steps) */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white border-t border-[#E8E2D9]">
          <div className="mx-auto max-w-[1120px]">
            <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1A1A] tracking-tight">
                How EKA Works
              </h2>
              <p className="text-sm text-[#5C5C5C] mt-2">
                Designed for calm, focused cultural understanding and authentic human sharing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] p-6 space-y-3">
                <span className="font-mono text-xs font-semibold text-[#C45C26]">01</span>
                <h3 className="font-serif text-lg font-medium text-[#1A1A1A]">Watch & Discover</h3>
                <p className="text-sm text-[#5C5C5C] leading-relaxed">
                  Experience short-form visual stories, regional crafts, and living rites of passage from around the world.
                </p>
              </div>

              <div className="rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] p-6 space-y-3">
                <span className="font-mono text-xs font-semibold text-[#C45C26]">02</span>
                <h3 className="font-serif text-lg font-medium text-[#1A1A1A]">Inquire with Context</h3>
                <p className="text-sm text-[#5C5C5C] leading-relaxed">
                  Understand why traditions exist through factual context notes and verified provenance without algorithmic noise.
                </p>
              </div>

              <div className="rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] p-6 space-y-3">
                <span className="font-mono text-xs font-semibold text-[#C45C26]">03</span>
                <h3 className="font-serif text-lg font-medium text-[#1A1A1A]">Contribute & Connect</h3>
                <p className="text-sm text-[#5C5C5C] leading-relaxed">
                  Share your own family rituals, artisan crafts, and memories to help build a living global archive.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
