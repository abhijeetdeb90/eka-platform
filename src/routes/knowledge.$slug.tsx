import React, { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Sparkles,
  MapPin,
  ShieldCheck,
  Send,
  HelpCircle,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getKnowledgeObjectBySlug } from "@/lib/knowledge/knowledge-graph";
import {
  retrieveEkaCulturalIntelligence,
  SUGGESTED_CULTURAL_QUERIES,
  type EkaAiRetrievalResult,
} from "@/lib/knowledge/ai-retrieval";
import { SourcePassportCard } from "@/components/knowledge/SourcePassportCard";
import { CulturalDimensionsView } from "@/components/knowledge/CulturalDimensionsView";
import { CulturalVariationSection } from "@/components/knowledge/CulturalVariationSection";
import { KnowledgeGraphVisualizer } from "@/components/knowledge/KnowledgeGraphVisualizer";
import { EkaLogo } from "@/components/brand/Logo";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { useLocalization } from "@/lib/i18n";
import { getContent } from "@/lib/knowledge/multilingual-content";

export const Route = createFileRoute("/knowledge/$slug")({
  component: KnowledgeDetailPage,
});

function KnowledgeDetailPage() {
  const { slug } = useParams({ from: "/knowledge/$slug" });
  const object = getKnowledgeObjectBySlug(slug);
  const { locale, t } = useLocalization();

  const [aiQuery, setAiQuery] = useState("");
  const [aiResult, setAiResult] = useState<EkaAiRetrievalResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const localizedData = getContent({ entity: slug, language: locale });

  if (!object) {
    return (
      <main className="min-h-screen bg-background py-20 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Cultural Entity Not Found
          </h1>
          <p className="mt-3 text-muted-foreground">
            The cultural knowledge object "{slug}" is either currently being curated or does not exist.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/knowledge">
              <Button>Browse Cultural Directory</Button>
            </Link>
            <Link to="/">
              <Button variant="outline">Return Home</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleAiAsk = (queryToUse?: string) => {
    const q = queryToUse || aiQuery;
    if (!q.trim()) return;

    setIsAiLoading(true);
    const result = retrieveEkaCulturalIntelligence(q, object.slug);
    setAiResult(result);
    setIsAiLoading(false);
  };

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Knowledge Object link copied to clipboard.");
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(
      isSaved
        ? `Removed ${object.entity} from your saved traditions.`
        : `Saved ${object.entity} to your personal cultural library.`
    );
  };

  const primaryImage =
    object.images[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop";

  return (
    <div
      data-testid="eka-knowledge-detail-page"
      className="min-h-screen bg-background text-foreground"
    >
      {/* Top Breadcrumb & Actions Bar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/" className="flex items-center transition-opacity hover:opacity-90">
              <EkaLogo size="sm" />
            </Link>
            <span className="text-muted-foreground/60 hidden sm:inline">/</span>
            <Link
              to="/knowledge"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t("nav.knowledge", "Knowledge Graph")}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <LanguageSelector variant="compact" />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Bookmark
                className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : ""}`}
              />
              <span className="hidden sm:inline">{isSaved ? t("action.saved") : t("action.save")}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 text-xs"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{t("action.share")}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/60 bg-sand/15 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* Left Narrative */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-primary/40 text-primary text-xs font-mono uppercase tracking-wider"
                >
                  {localizedData.category || object.type}
                </Badge>
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary" />
                  {localizedData.region || object.culturalDimensions.identity.regions[0]}
                </Badge>
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {localizedData.verificationStatus === "verified"
                    ? t("epistemic.verified")
                    : t("epistemic.reviewNeeded")}
                </Badge>
                {localizedData.isFallback && (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground font-mono">
                    English Canonical
                  </Badge>
                )}
              </div>

              <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                {localizedData.localizedTitle || object.entity}
              </h1>

              <p className="mt-3 font-serif text-lg sm:text-xl text-primary font-medium leading-relaxed">
                "{localizedData.localizedOneLiner || object.oneLiner}"
              </p>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                {localizedData.localizedSummary || object.summary}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => {
                    const el = document.getElementById("ai-retrieval-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-full shadow-calm bg-primary text-primary-foreground gap-2 font-medium"
                >
                  <Sparkles className="h-4 w-4" /> Ask Cultural Intelligence
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const el = document.getElementById("variations-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-full border-border/80"
                >
                  View Variations ({object.culturalVariations.length})
                </Button>
              </div>
            </div>

            {/* Right Media Frame */}
            <div className="lg:col-span-5">
              <div className="group relative overflow-hidden rounded-3xl border border-border/80 shadow-lift bg-card aspect-[4/3]">
                <img
                  src={primaryImage}
                  alt={object.entity}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-medium text-white/90 line-clamp-1">
                    {object.images[0]?.title || object.entity}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/70 font-mono">
                    Licence: {object.images[0]?.license || "CC BY-SA 4.0"} · Creator: {object.images[0]?.creator || "EKA Archive"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
        {/* Source Passport */}
        <SourcePassportCard
          passport={object.sourcePassport}
          entityName={object.entity}
        />

        {/* AI Cultural Intelligence Interactive Drawer */}
        <section
          id="ai-retrieval-section"
          data-testid="eka-ai-retrieval-box"
          className="rounded-3xl border border-primary/30 bg-gradient-to-br from-sand/20 to-sand/40 p-6 sm:p-8 shadow-calm"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                EKA Cultural Intelligence
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Ask what conventional search engines miss: lived experiences, sacred ethics, regional distinctions, and artisan lineages.
              </p>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <Input
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAiAsk((e.target as HTMLInputElement).value);
                }
              }}
              placeholder={`Ask about ${object.entity} (e.g. regional differences, authentic artisans, sacred meaning)...`}
              className="rounded-full bg-background/90 text-sm shadow-sm"
              data-testid="ai-query-input"
            />
            <Button
              onClick={() => handleAiAsk(aiQuery)}
              disabled={isAiLoading}
              className="rounded-full bg-primary text-primary-foreground shrink-0 px-5"
              data-testid="ai-submit-btn"
            >
              {isAiLoading ? "Retrieving..." : <Send className="h-4 w-4" />}
            </Button>
          </div>

          {/* Quick Prompts */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground font-medium">Try asking:</span>
            {SUGGESTED_CULTURAL_QUERIES.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setAiQuery(prompt);
                  handleAiAsk(prompt);
                }}
                className="rounded-full bg-background/80 border border-border/80 px-2.5 py-1 text-[11px] text-foreground hover:border-primary/50 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* AI Result View */}
          {aiResult && (
            <div
              data-testid="ai-result-container"
              className="mt-6 rounded-2xl border border-primary/20 bg-background/95 p-6 shadow-sm space-y-4 animate-in fade-in duration-300"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono text-primary">
                    Confidence: {Math.round(aiResult.confidence * 100)}%
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Synthesized from {aiResult.answerSections.sourcePassport.totalSources} verified sources
                  </span>
                </div>
                <Badge className="bg-emerald-600 text-white text-[11px]">
                  {aiResult.answerSections.sourcePassport.evidenceStrength} Evidence
                </Badge>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none text-foreground space-y-4">
                <div>
                  <h4 className="font-serif text-base font-bold text-foreground">
                    Core Understanding
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {aiResult.answerSections.coreUnderstanding}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                  <div className="rounded-xl bg-sand/30 p-3.5">
                    <h5 className="text-xs font-semibold text-primary uppercase tracking-wider">
                      Who Practices It & Where
                    </h5>
                    <p className="mt-1 text-xs text-foreground">
                      <strong>Communities:</strong> {aiResult.answerSections.whoPracticesAndWhere.communities.join(", ")}
                    </p>
                    <p className="mt-1 text-xs text-foreground">
                      <strong>Regions:</strong> {aiResult.answerSections.whoPracticesAndWhere.regions.join(", ")}
                    </p>
                  </div>
                  <div className="rounded-xl bg-sand/30 p-3.5">
                    <h5 className="text-xs font-semibold text-primary uppercase tracking-wider">
                      Community Meaning & Worldview
                    </h5>
                    <p className="mt-1 text-xs text-foreground">
                      "{aiResult.answerSections.communityMeaning.worldview}"
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-sand/30 p-3.5">
                  <h5 className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Authentic Living Experiences & Custodians
                  </h5>
                  <ul className="mt-1 space-y-1 text-xs text-foreground">
                    {aiResult.answerSections.authenticExperiences.map((exp, idx) => (
                      <li key={idx}>📍 {exp}</li>
                    ))}
                    {aiResult.answerSections.artisansAndCustodians.guilds.map((g, idx) => (
                      <li key={`g-${idx}`}>🛠️ Artisan Guild: {g}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Cultural Variations */}
        <div id="variations-section">
          <CulturalVariationSection
            variations={object.culturalVariations}
            entityName={object.entity}
          />
        </div>

        {/* 10 Cultural Dimensions */}
        <CulturalDimensionsView dimensions={object.culturalDimensions} />

        {/* Epistemic Claims Taxonomy */}
        <EpistemicClaimsTable claims={object.epistemicClaims} />

        {/* Knowledge Graph Connections */}
        <KnowledgeGraphVisualizer
          nodes={object.linkedGraphNodes}
          currentEntityName={object.entity}
        />

        {/* Image & Rights Verification Card */}
        <section className="rounded-2xl border border-border/80 bg-sand/20 p-5 text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-foreground">Rights & Licensing Notice:</span>
            <p className="mt-0.5">
              Images depict cultural heritage with full Wikimedia Commons licensing compliance.
              Textual schema incorporates CC0 Wikidata structures, UNESCO safeguarding dossiers, and verified community elder archives.
            </p>
          </div>
          <Link to="/copyright" className="text-primary font-medium hover:underline shrink-0">
            View EKA IP & Licensing Framework
          </Link>
        </section>
      </main>
    </div>
  );
}
