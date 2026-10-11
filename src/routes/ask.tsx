// ==============================================================================
// EKA BETA ASK EKA PAGE
// ==============================================================================
// Simple search input: "What are you curious about?"
// 6-8 starter questions (short, factual)
// Answer pattern for beta:
//   - Short explanation (original paraphrase)
//   - "Widely documented practice / place"
//   - Optional "Things to be aware of" (respect, context)
//   - Link back to related Discover cards when relevant
// No role-play as a custodian or claims of secret knowledge.
// ==============================================================================

import { useState } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { Search, HelpCircle, ArrowRight, BookOpen, AlertCircle, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BETA_ASK_QUESTIONS,
  BETA_PLACES_OR_PRACTICES,
  type AskQuestionItem,
} from "@/data/beta-seed-data";

export const Route = createFileRoute("/ask")({
  validateSearch: (search: Record<string, unknown>): { q?: string; mode?: string } => ({
    q: (search["q"] as string) ?? "",
    mode: (search["mode"] as string) ?? "canon",
  }),
  head: () => ({
    meta: [
      { title: "Ask EKA — Cultural Inquiries & Starter Questions" },
      {
        name: "description",
        content: "Ask cultural questions and explore factual answers grounded in widely documented traditions.",
      },
    ],
  }),
  component: AskEkaPage,
});

function AskEkaPage() {
  const searchParams = useSearch({ from: "/ask" });
  const [query, setQuery] = useState(searchParams.q || "");
  const [selectedQuestion, setSelectedQuestion] = useState<AskQuestionItem | null>(() => {
    if (searchParams.q) {
      const match = BETA_ASK_QUESTIONS.find((item) =>
        item.questionText.toLowerCase().includes(searchParams.q.toLowerCase())
      );
      return match || BETA_ASK_QUESTIONS[0];
    }
    return BETA_ASK_QUESTIONS[0];
  });

  const filteredQuestions = query.trim()
    ? BETA_ASK_QUESTIONS.filter(
        (q) =>
          q.questionText.toLowerCase().includes(query.toLowerCase()) ||
          q.answerSummary.toLowerCase().includes(query.toLowerCase()) ||
          q.category.toLowerCase().includes(query.toLowerCase())
      )
    : BETA_ASK_QUESTIONS;

  const relatedPractice = selectedQuestion?.relatedItemSlug
    ? BETA_PLACES_OR_PRACTICES.find((p) => p.slug === selectedQuestion.relatedItemSlug)
    : null;

  const handleSelectQuestion = (q: AskQuestionItem) => {
    setSelectedQuestion(q);
    setQuery("");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C45C26]/20">
      <SiteHeader />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-[1120px]">
          {/* Header */}
          <div className="max-w-2xl mb-8 sm:mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C45C26] font-semibold">
              Curious Inquiry
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A1A] mt-1.5">
              Ask EKA
            </h1>
            <p className="text-sm sm:text-base text-[#5C5C5C] mt-2 leading-relaxed">
              Inquire into why cultural traditions exist, how crafts are made, and what practices signify across different communities.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mb-10">
            <div className="relative flex items-center">
              <Search className="absolute left-4 size-4 text-[#5C5C5C] pointer-events-none" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you curious about? (e.g. why diyas, tea ceremony...)"
                className="h-12 pl-11 pr-4 rounded-lg border-[#E8E2D9] bg-white text-sm text-[#1A1A1A] placeholder:text-[#5C5C5C]/70 focus-visible:ring-1 focus-visible:ring-[#C45C26]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 text-xs text-[#5C5C5C] hover:text-[#1A1A1A]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Starter Questions List */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="font-serif text-base font-medium text-[#1A1A1A]">
                  Starter Questions ({filteredQuestions.length})
                </span>
                <span className="text-xs text-[#5C5C5C]">Factual seed set</span>
              </div>

              <div className="space-y-2">
                {filteredQuestions.map((q) => {
                  const isSelected = selectedQuestion?.id === q.id;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleSelectQuestion(q)}
                      className={`w-full text-left rounded-xl p-4 border transition-colors ${
                        isSelected
                          ? "border-[#C45C26] bg-white shadow-xs"
                          : "border-[#E8E2D9] bg-white/70 hover:bg-white hover:border-[#E8E2D9]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="rounded bg-[#F3EDE6] px-2 py-0.5 text-[11px] font-medium text-[#5C5C5C]">
                          {q.category}
                        </span>
                        {isSelected && (
                          <span className="text-xs font-medium text-[#C45C26]">Viewing</span>
                        )}
                      </div>
                      <p className="font-serif text-sm sm:text-base font-medium text-[#1A1A1A] leading-snug">
                        {q.questionText}
                      </p>
                    </button>
                  );
                })}

                {filteredQuestions.length === 0 && (
                  <div className="rounded-xl border border-dashed border-[#E8E2D9] p-6 text-center text-sm text-[#5C5C5C]">
                    No questions found matching "{query}". Try a broader keyword like "tea", "lamps", or "mirror".
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Selected Question & Structured Answer */}
            <div className="lg:col-span-7">
              {selectedQuestion ? (
                <div className="rounded-2xl border border-[#E8E2D9] bg-white p-6 sm:p-8 space-y-6">
                  {/* Category & Status */}
                  <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-4">
                    <span className="rounded bg-[#F3EDE6] px-2.5 py-1 text-xs font-medium text-[#5C5C5C]">
                      {selectedQuestion.category}
                    </span>
                    <span className="text-xs font-mono text-[#5C5C5C]">
                      Curated explanation
                    </span>
                  </div>

                  {/* Question Title */}
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1A1A] leading-snug">
                    {selectedQuestion.questionText}
                  </h2>

                  {/* Short Explanation (Summary) */}
                  <div className="rounded-xl bg-[#FAF7F2] border border-[#E8E2D9] p-4 text-sm font-medium text-[#1A1A1A] leading-relaxed">
                    {selectedQuestion.answerSummary}
                  </div>

                  {/* Full Body Context */}
                  <div className="text-sm text-[#1A1A1A] leading-relaxed space-y-3 font-normal">
                    <p>{selectedQuestion.answerBody}</p>
                  </div>

                  {/* Documentation Note */}
                  <div className="pt-2 text-xs text-[#5C5C5C] flex items-center gap-2 border-t border-[#E8E2D9]">
                    <BookOpen className="size-3.5 text-[#C45C26] shrink-0" />
                    <span>Reference basis: {selectedQuestion.sourcesNote}</span>
                  </div>

                  {/* Optional: Things to be aware of */}
                  {selectedQuestion.contextNote && (
                    <div className="rounded-xl bg-[#F3EDE6]/80 p-4 text-xs text-[#5C5C5C] space-y-1">
                      <div className="flex items-center gap-1.5 font-medium text-[#1A1A1A]">
                        <AlertCircle className="size-3.5 text-[#C45C26]" />
                        <span>Cultural respect note</span>
                      </div>
                      <p>{selectedQuestion.contextNote}</p>
                    </div>
                  )}

                  {/* Link back to related Discover item */}
                  {relatedPractice && (
                    <div className="pt-4 border-t border-[#E8E2D9]">
                      <div className="rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[11px] font-mono uppercase text-[#C45C26] font-semibold">
                            Related Discover Item
                          </span>
                          <h4 className="font-serif text-base font-medium text-[#1A1A1A]">
                            {relatedPractice.title}
                          </h4>
                          <p className="text-xs text-[#5C5C5C]">{relatedPractice.location}</p>
                        </div>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="rounded-full border-[#E8E2D9] bg-white text-[#1A1A1A] hover:bg-[#F3EDE6] text-xs font-medium shrink-0"
                        >
                          <Link to="/discover">
                            <span>View in Discover</span>
                            <ArrowRight className="size-3.5 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white p-12 text-center text-sm text-[#5C5C5C]">
                  Select a starter question from the list to view its cultural explanation.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
