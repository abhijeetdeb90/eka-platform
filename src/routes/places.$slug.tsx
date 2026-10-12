// ==============================================================================
// EKA BETA PLACE DETAIL PAGE (/places/$slug)
// ==============================================================================
// - Hero image with 16:9 aspect ratio and verified cultural photography
// - Country · Region badges & cultural heritage classification
// - Description + "Why it matters" deep context
// - Related cultural practices, crafts & traditions
// - Community stories & posts tagged to this place
// - Sticky "Ask EKA about this place" CTA on mobile, embedded on desktop
// - "Share your experience / reflection" publishing CTA
// ==============================================================================

import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  MapPin,
  Sparkles,
  ArrowLeft,
  Share2,
  Bookmark,
  HelpCircle,
  Feather,
  CheckCircle2,
  Compass,
  Layers,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BETA_PLACES_OR_PRACTICES,
  BETA_ASK_QUESTIONS,
  type PlaceOrPractice,
} from "@/data/beta-seed-data";
import { PostCard } from "@/components/app/PostCard";
import { toast } from "sonner";

export const Route = createFileRoute("/places/$slug")({
  head: ({ params }) => {
    const item = BETA_PLACES_OR_PRACTICES.find((p) => p.slug === params.slug);
    const title = item ? `${item.title} — ${item.regionOrState}, ${item.country} | EKA` : "Cultural Place | EKA";
    const description = item ? item.summary : "Explore living cultural traditions, sacred geography, and community stories on EKA.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: PlaceDetailPage,
});

function PlaceDetailPage() {
  const { slug } = useParams({ from: "/places/$slug" });
  const [isSaved, setIsSaved] = useState(false);

  // Locate the cultural place object from verified seed data
  const place = BETA_PLACES_OR_PRACTICES.find((p) => p.slug === slug);

  // Fallback if not found
  if (!place) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] flex flex-col font-sans">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#E8E2D9] p-8 text-center space-y-4 shadow-xs">
            <div className="size-12 rounded-full bg-[#F3EDE6] flex items-center justify-center mx-auto text-[#C45C26]">
              <Compass className="size-6" />
            </div>
            <h1 className="font-serif text-2xl font-medium text-[#1A1A1A]">Place Not Found</h1>
            <p className="text-sm text-[#5C5C5C]">
              We couldn't locate a documented cultural place for "{slug}". Explore our living places and practices directory.
            </p>
            <div className="pt-2">
              <Button asChild className="rounded-xl bg-[#C45C26] hover:bg-[#A34A1F] text-white">
                <Link to="/discover">
                  <ArrowLeft className="size-4 mr-2" />
                  <span>Return to Discover</span>
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // Related questions for this place
  const relatedQuestions = BETA_ASK_QUESTIONS.filter(
    (q) => place.relatedQuestionIds.includes(q.id) || q.relatedItemSlug === place.slug
  );

  // Related practices or nearby cultural entities
  const relatedPractices = BETA_PLACES_OR_PRACTICES.filter(
    (p) => p.slug !== place.slug && (p.country === place.country || p.regionOrState === place.regionOrState)
  ).slice(0, 3);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: place.title,
          text: place.summary,
          url: window.location.href,
        });
        return;
      } catch {
        // User cancelled or share failed
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved places" : "Saved to your cultural collection!");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C45C26]/20">
      <SiteHeader />

      <main className="flex-1 py-6 sm:py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-8">
          
          {/* Back Nav & Actions */}
          <div className="flex items-center justify-between">
            <Link
              to="/discover"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5C5C5C] hover:text-[#1A1A1A] transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Discover</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleSave}
                className={`p-2 rounded-xl border transition-colors ${
                  isSaved
                    ? "border-[#C45C26] bg-[#C45C26]/10 text-[#C45C26]"
                    : "border-[#E8E2D9] bg-white text-[#5C5C5C] hover:text-[#1A1A1A]"
                }`}
                title={isSaved ? "Saved" : "Save Place"}
                aria-label="Save Place"
              >
                <Bookmark className={`size-4 ${isSaved ? "fill-[#C45C26]" : ""}`} />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl border border-[#E8E2D9] bg-white text-[#5C5C5C] hover:text-[#1A1A1A] transition-colors"
                title="Share Place"
                aria-label="Share Place"
              >
                <Share2 className="size-4" />
              </button>
            </div>
          </div>

          {/* Place Hero Card */}
          <article className="overflow-hidden rounded-3xl border border-[#E8E2D9] bg-white shadow-xs">
            {/* 16:9 Hero Image */}
            <div className="relative aspect-video w-full overflow-hidden bg-[#F3EDE6]">
              <img
                src={place.imagePath}
                alt={place.imageCaption || place.title}
                className="size-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-amber-300 font-semibold drop-shadow">
                  <MapPin className="size-3" />
                  {place.regionOrState}, {place.country}
                </span>
                <p className="text-xs text-white/90 drop-shadow line-clamp-1 italic mt-0.5">
                  {place.imageCaption}
                </p>
              </div>
            </div>

            {/* Place Header & Metadata */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-[#F3EDE6] text-[#C45C26] font-medium border-0">
                    {place.category}
                  </Badge>
                  {place.subCategory && (
                    <Badge variant="outline" className="border-[#E8E2D9] text-[#5C5C5C] font-normal text-xs">
                      {place.subCategory}
                    </Badge>
                  )}
                  <span className="text-xs text-[#5C5C5C] flex items-center gap-1 ml-auto">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    Verified Stewardship
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A1A]">
                  {place.title}
                </h1>
                <p className="font-mono text-xs text-[#5C5C5C] flex items-center gap-1">
                  <MapPin className="size-3.5 text-[#C45C26]" />
                  <span>{place.location}</span>
                </p>
              </div>

              {/* Summary Lead */}
              <p className="text-base sm:text-lg text-[#1A1A1A] font-medium leading-relaxed bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E2D9]">
                {place.summary}
              </p>

              {/* "Why It Matters" Section */}
              <div className="space-y-2 pt-2 border-t border-[#E8E2D9]">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[#C45C26] font-semibold">
                  Why It Matters & Living Continuity
                </h2>
                <div className="prose text-sm text-[#1A1A1A] leading-relaxed space-y-3 font-normal">
                  <p className="leading-relaxed whitespace-pre-line">{place.body}</p>
                </div>
              </div>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-[#E8E2D9]">
                <Button
                  asChild
                  className="rounded-full bg-[#C45C26] hover:bg-[#A34A1F] text-white px-6 py-2.5 text-sm font-medium shadow-xs"
                >
                  <Link
                    to="/ask"
                    search={{ q: `What makes ${place.title} culturally significant in ${place.regionOrState}?` } as any}
                  >
                    <Sparkles className="size-4 mr-1.5" />
                    <span>Ask EKA About This Place</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-[#E8E2D9] bg-white text-[#1A1A1A] hover:bg-[#F3EDE6] px-6 py-2.5 text-sm font-medium"
                >
                  <Link to="/create">
                    <Feather className="size-4 mr-1.5" />
                    <span>Share Your Experience</span>
                  </Link>
                </Button>
              </div>
            </div>
          </article>

          {/* Related Cultural Inquiries / Ask EKA */}
          {relatedQuestions.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1A1A1A] flex items-center gap-2">
                  <HelpCircle className="size-5 text-[#C45C26]" />
                  <span>Cultural Inquiries & Questions</span>
                </h3>
                <Link
                  to="/ask"
                  search={{ q: place.title } as any}
                  className="text-xs font-medium text-[#C45C26] hover:underline flex items-center gap-1"
                >
                  <span>Explore Ask EKA</span>
                  <ChevronRight className="size-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedQuestions.map((q) => (
                  <Link
                    key={q.id}
                    to="/ask"
                    search={{ q: q.questionText } as any}
                    className="group rounded-2xl border border-[#E8E2D9] bg-white p-5 hover:border-[#C45C26]/40 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <span className="rounded bg-[#F3EDE6] px-2 py-0.5 text-[10px] font-medium text-[#C45C26]">
                        {q.category}
                      </span>
                      <h4 className="font-serif text-base font-medium text-[#1A1A1A] group-hover:text-[#C45C26] transition-colors leading-snug">
                        {q.questionText}
                      </h4>
                      <p className="text-xs text-[#5C5C5C] line-clamp-2 leading-relaxed">
                        {q.answerSummary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E8E2D9]/60 flex items-center justify-between text-[11px] text-[#5C5C5C]">
                      <span>Verified Citation</span>
                      <span className="text-[#C45C26] font-medium flex items-center gap-0.5">
                        Ask EKA <ChevronRight className="size-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related Living Practices in this Region */}
          {relatedPractices.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1A1A1A] flex items-center gap-2">
                  <Layers className="size-5 text-[#C45C26]" />
                  <span>Related Regional Traditions</span>
                </h3>
                <Link to="/discover" className="text-xs font-medium text-[#C45C26] hover:underline flex items-center gap-1">
                  <span>View directory</span>
                  <ChevronRight className="size-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedPractices.map((practice) => (
                  <Link
                    key={practice.id}
                    to="/places/$slug"
                    params={{ slug: practice.slug }}
                    className="group rounded-2xl border border-[#E8E2D9] bg-white p-3.5 hover:border-[#C45C26]/40 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F3EDE6] mb-2.5">
                        <img
                          src={practice.imagePath}
                          alt={practice.title}
                          className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#5C5C5C] uppercase block truncate">
                        {practice.regionOrState}, {practice.country}
                      </span>
                      <h4 className="font-serif text-sm font-medium text-[#1A1A1A] group-hover:text-[#C45C26] transition-colors truncate mt-0.5">
                        {practice.title}
                      </h4>
                      <p className="text-xs text-[#5C5C5C] line-clamp-2 mt-1">
                        {practice.summary}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Community Stories & Reflections Tagged to This Place */}
          <section className="space-y-4 pt-4 border-t border-[#E8E2D9]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1A1A1A]">
                  Community Stories & Field Notes
                </h3>
                <p className="text-xs text-[#5C5C5C] mt-0.5">
                  Firsthand cultural perspectives and documented living practices from this region.
                </p>
              </div>
              <Button asChild size="sm" variant="outline" className="rounded-full border-[#E8E2D9] text-xs">
                <Link to="/create">
                  <Feather className="size-3 mr-1" />
                  <span>Add story</span>
                </Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-8 text-center space-y-3">
              <p className="font-serif text-base font-medium text-[#1A1A1A]">
                Be the first to share a reflection from {place.title}
              </p>
              <p className="text-xs text-[#5C5C5C] max-w-md mx-auto leading-relaxed">
                Have you observed this living tradition or visited this cultural landmark? Share your photography, field notes, or oral history.
              </p>
              <Button asChild size="sm" className="rounded-full bg-[#C45C26] hover:bg-[#A34A1F] text-white text-xs px-5">
                <Link to="/create">
                  Share Your Story
                </Link>
              </Button>
            </div>
          </section>

          {/* Sticky Mobile CTA: Ask EKA about this place */}
          <div className="sm:hidden fixed bottom-16 inset-x-4 z-30">
            <Button
              asChild
              className="w-full h-12 rounded-2xl bg-[#C45C26] hover:bg-[#A34A1F] text-white font-medium text-sm shadow-lg flex items-center justify-center gap-2"
            >
              <Link
                to="/ask"
                search={{ q: `What makes ${place.title} culturally significant in ${place.regionOrState}?` } as any}
              >
                <Sparkles className="size-4" />
                <span>Ask EKA About {place.title.split(" ")[0]}</span>
              </Link>
            </Button>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
