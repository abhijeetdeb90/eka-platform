// ==============================================================================
// EKA BETA HOMEPAGE
// ==============================================================================
// Calm, editorial, modern. Not mystical, not startup-gradient.
// - Header (SiteHeader): Logo + BETA badge, Nav, English, Join button
// - Hero: Single column on mobile; headline + one subline + two CTAs max
// - Optional thin strip: "Curated cultural places and practices for learning"
// - 3-6 featured cards: image, title, 1-line description, location — link to Discover
// - Short "How it works" (3 steps): Discover → Learn a little → Ask EKA
// - Footer (SiteFooter): essential cookies only, no ad tracking
// ==============================================================================

import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass, HelpCircle, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { BETA_PLACES_OR_PRACTICES } from "@/data/beta-seed-data";

export function EkaHomePage() {
  const featured = BETA_PLACES_OR_PRACTICES.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C45C26]/20">
      <SiteHeader />

      <main className="flex-1">
        {/* Curated thin notification strip */}
        <div className="border-b border-[#E8E2D9] bg-[#F3EDE6]/60 py-2 px-4 text-center">
          <p className="text-xs text-[#5C5C5C]">
            Curated cultural places and practices for learning • Beta release
          </p>
        </div>

        {/* Hero Section */}
        <section className="py-12 sm:py-20 md:py-24 px-4 sm:px-6">
          <div className="mx-auto max-w-[1120px] text-center sm:text-left">
            <div className="max-w-3xl space-y-4">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#1A1A1A] leading-[1.1]">
                Don't just scroll the world. <br className="hidden sm:inline" />
                <span className="text-[#C45C26]">Understand it.</span>
              </h1>
              <p className="text-lg sm:text-xl text-[#5C5C5C] leading-relaxed max-w-2xl font-normal">
                Curated stories of traditions, architectural landmarks, and craftsmanship from around the world.
              </p>

              {/* Two CTAs Max */}
              <div className="pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <Button
                  asChild
                  className="rounded-full bg-[#C45C26] hover:bg-[#A34A1F] text-white px-6 py-3 text-sm font-medium shadow-none transition-colors"
                >
                  <Link to="/discover" className="inline-flex items-center gap-2">
                    <span>Explore Places & Practices</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-[#E8E2D9] bg-white hover:bg-[#F3EDE6] text-[#1A1A1A] px-6 py-3 text-sm font-medium shadow-none transition-colors"
                >
                  <Link to="/ask" className="inline-flex items-center gap-2">
                    <HelpCircle className="size-4 text-[#5C5C5C]" />
                    <span>Ask a Question</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Places & Practices Grid */}
        <section className="py-10 sm:py-16 px-4 sm:px-6 border-t border-[#E8E2D9] bg-white">
          <div className="mx-auto max-w-[1120px]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1A1A] tracking-tight">
                  Featured Places & Practices
                </h2>
                <p className="text-sm text-[#5C5C5C] mt-1">
                  A starter selection of widely documented living traditions and cultural crafts.
                </p>
              </div>
              <Link
                to="/discover"
                className="text-sm font-medium text-[#C45C26] hover:text-[#A34A1F] flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <span>View all places</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((item) => (
                <Link
                  key={item.id}
                  to="/discover"
                  className="group rounded-xl border border-[#E8E2D9] bg-white p-4 flex flex-col justify-between hover:border-[#C45C26]/40 transition-colors"
                >
                  <div>
                    {/* 16:10 aspect image */}
                    <div className="aspect-[16/10] w-full rounded-lg overflow-hidden bg-[#F3EDE6] mb-3">
                      <img
                        src={item.imagePath}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </div>
                    {/* Caption + location under image */}
                    <div className="flex items-center justify-between text-xs text-[#5C5C5C] mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3 text-[#C45C26]" />
                        {item.location}
                      </span>
                      <span className="rounded bg-[#F3EDE6] px-2 py-0.5 text-[11px] font-medium text-[#5C5C5C]">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-medium text-[#1A1A1A] leading-snug group-hover:text-[#C45C26] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#5C5C5C] leading-relaxed mt-1.5 line-clamp-2">
                      {item.summary}
                    </p>
                  </div>
                  <p className="text-[11px] text-[#5C5C5C]/80 italic mt-3 pt-2 border-t border-[#E8E2D9]/60">
                    {item.imageCaption}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works (3 Steps) */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 bg-[#FAF7F2] border-t border-[#E8E2D9]">
          <div className="mx-auto max-w-[1120px]">
            <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1A1A] tracking-tight">
                How EKA Works
              </h2>
              <p className="text-sm text-[#5C5C5C] mt-2">
                Designed for calm, focused cultural learning without algorithm loops.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-[#E8E2D9] bg-white p-6 space-y-3">
                <span className="font-mono text-xs font-semibold text-[#C45C26]">01</span>
                <h3 className="font-serif text-lg font-medium text-[#1A1A1A]">Discover</h3>
                <p className="text-sm text-[#5C5C5C] leading-relaxed">
                  Browse documented public cultural rituals, regional foodways, and traditional artisan crafts.
                </p>
              </div>

              <div className="rounded-xl border border-[#E8E2D9] bg-white p-6 space-y-3">
                <span className="font-mono text-xs font-semibold text-[#C45C26]">02</span>
                <h3 className="font-serif text-lg font-medium text-[#1A1A1A]">Learn a Little</h3>
                <p className="text-sm text-[#5C5C5C] leading-relaxed">
                  Read concise, factual explanations with context notes and clear location references.
                </p>
              </div>

              <div className="rounded-xl border border-[#E8E2D9] bg-white p-6 space-y-3">
                <span className="font-mono text-xs font-semibold text-[#C45C26]">03</span>
                <h3 className="font-serif text-lg font-medium text-[#1A1A1A]">Ask EKA</h3>
                <p className="text-sm text-[#5C5C5C] leading-relaxed">
                  Inquire into why traditions exist and explore factual historical answers grounded in reliable context.
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
