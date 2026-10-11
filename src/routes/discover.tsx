// ==============================================================================
// EKA BETA DISCOVER PAGE
// ==============================================================================
// Title: Explore places & practices
// Simple filters: All | Places | Practices | Crafts
// Grid of cards: image, title, location, 1-2 sentence description
// Clicking a card opens simple modal/detail view with related questions linking to Ask EKA
// Seed set: 8 items from beta-seed-data.ts
// ==============================================================================

import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, ArrowRight, X, HelpCircle } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  BETA_PLACES_OR_PRACTICES,
  BETA_ASK_QUESTIONS,
  type PlaceOrPractice,
} from "@/data/beta-seed-data";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Explore Places & Practices — EKA" },
      {
        name: "description",
        content:
          "Curated discovery of public cultural traditions, crafts, and landmarks across world cultures.",
      },
    ],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Places" | "Practices" | "Crafts">("All");
  const [selectedItem, setSelectedItem] = useState<PlaceOrPractice | null>(null);

  const categories = ["All", "Places", "Practices", "Crafts"] as const;

  const filteredItems = BETA_PLACES_OR_PRACTICES.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  const relatedQuestions = selectedItem
    ? BETA_ASK_QUESTIONS.filter((q) =>
        selectedItem.relatedQuestionIds.includes(q.id) || q.relatedItemSlug === selectedItem.slug
      )
    : [];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C45C26]/20">
      <SiteHeader />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-[1120px]">
          {/* Header */}
          <div className="mb-8 sm:mb-10 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C45C26] font-semibold">
              Curated Cultural Library
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A1A] mt-1.5">
              Explore places & practices
            </h1>
            <p className="text-sm sm:text-base text-[#5C5C5C] mt-2 leading-relaxed">
              Widely documented traditions, architectural landmarks, and craftsmanship. Select any item to learn about its history and related questions.
            </p>
          </div>

          {/* Simple Filters */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#C45C26] text-white"
                    : "border border-[#E8E2D9] bg-white text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[#F3EDE6]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards Grid: 1 -> 2 -> 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group rounded-xl border border-[#E8E2D9] bg-white p-4 flex flex-col justify-between hover:border-[#C45C26]/40 cursor-pointer transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedItem(item);
                }}
              >
                <div>
                  <div className="aspect-[16/10] w-full rounded-lg overflow-hidden bg-[#F3EDE6] mb-3">
                    <img
                      src={item.imagePath}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#5C5C5C] mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3 text-[#C45C26]" />
                      {item.location}
                    </span>
                    <span className="rounded bg-[#F3EDE6] px-2 py-0.5 text-[11px] font-medium text-[#5C5C5C]">
                      {item.category}
                    </span>
                  </div>

                  <h2 className="font-serif text-lg font-medium text-[#1A1A1A] leading-snug group-hover:text-[#C45C26] transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-sm text-[#5C5C5C] leading-relaxed mt-1.5 line-clamp-2">
                    {item.summary}
                  </p>
                </div>

                <p className="text-[11px] text-[#5C5C5C]/80 italic mt-3 pt-2 border-t border-[#E8E2D9]/60">
                  {item.imageCaption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        {selectedItem && (
          <DialogContent className="max-w-2xl bg-white border-[#E8E2D9] p-6 sm:p-8 rounded-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-2 text-left">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded bg-[#F3EDE6] px-2.5 py-0.5 text-xs font-medium text-[#5C5C5C]">
                  {selectedItem.category}
                </span>
                <span className="text-xs text-[#5C5C5C] flex items-center gap-1">
                  <MapPin className="size-3 text-[#C45C26]" />
                  {selectedItem.location}
                </span>
              </div>
              <DialogTitle className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1A1A]">
                {selectedItem.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-[#5C5C5C]">
                {selectedItem.summary}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#F3EDE6]">
                <img
                  src={selectedItem.imagePath}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-[#5C5C5C] italic">
                {selectedItem.imageCaption}
              </p>

              <div className="prose text-sm text-[#1A1A1A] leading-relaxed pt-2">
                <p>{selectedItem.body}</p>
              </div>

              {/* Related Questions linking to Ask EKA */}
              {relatedQuestions.length > 0 && (
                <div className="pt-4 border-t border-[#E8E2D9] space-y-2.5">
                  <h3 className="font-serif text-base font-medium text-[#1A1A1A] flex items-center gap-1.5">
                    <HelpCircle className="size-4 text-[#C45C26]" />
                    <span>Related Questions in Ask EKA</span>
                  </h3>
                  <div className="space-y-2">
                    {relatedQuestions.map((q) => (
                      <Link
                        key={q.id}
                        to="/ask"
                        search={{ q: q.questionText } as any}
                        className="block rounded-lg border border-[#E8E2D9] bg-[#FAF7F2] p-3 text-xs sm:text-sm text-[#1A1A1A] hover:border-[#C45C26] transition-colors"
                      >
                        <p className="font-medium text-[#1A1A1A]">{q.questionText}</p>
                        <p className="text-xs text-[#5C5C5C] mt-1">{q.answerSummary}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      <SiteFooter />
    </div>
  );
}
