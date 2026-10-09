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
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Users,
  HeartHandshake,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getKnowledgeObjectBySlug } from "@/lib/knowledge/knowledge-graph";
import { getTrustVerificationMeta } from "@/lib/knowledge/knowledge-object";
import {
  retrieveEkaCulturalIntelligence,
  SUGGESTED_CULTURAL_QUERIES,
  type EkaAiRetrievalResult,
} from "@/lib/knowledge/ai-retrieval";
import { SourcePassportCard } from "@/components/knowledge/SourcePassportCard";
import { CulturalDimensionsView } from "@/components/knowledge/CulturalDimensionsView";
import { CulturalVariationSection } from "@/components/knowledge/CulturalVariationSection";
import { KnowledgeGraphVisualizer } from "@/components/knowledge/KnowledgeGraphVisualizer";
import { VisualStoryViewer } from "@/components/stories/VisualStoryViewer";
import { CommunityContributionModal } from "@/components/community/CommunityContributionModal";
import { EkaLogo } from "@/components/brand/Logo";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { useLocalization } from "@/lib/i18n";
import { getContent } from "@/lib/knowledge/multilingual-content";
import { MetaTags } from "@/components/seo";
import { EkaBreadcrumb } from "@/components/navigation";

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
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [showTrustBasis, setShowTrustBasis] = useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setScrollProgress(Number((currentScrollY / scrollHeight).toFixed(4)) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const localizedData = getContent({ entity: slug, language: locale });

  if (!object) {
    return (
      <main className="min-h-screen bg-background py-20 px-4">
        <MetaTags
          title="Cultural Entity Not Found"
          description="The requested cultural knowledge object is either currently being curated or does not exist."
          noIndex={true}
        />
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

  const trustMeta = getTrustVerificationMeta(object.verificationLevel);

  const handleAiAsk = (queryToUse?: string) => {
    const q = queryToUse || aiQuery;
    if (!q.trim()) return;

    setIsAiLoading(true);
    const result = retrieveEkaCulturalIntelligence(q, object.slug);
    setAiResult(result);
    setIsAiLoading(false);

    // Smooth scroll down to the answer
    const el = document.getElementById("ai-retrieval-section");
    el?.scrollIntoView({ behavior: "smooth" });
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

  // Schema.org JSON-LD structured data for cultural entity
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Thing",
    name: object.entity,
    alternateName: object.culturalDimensions.identity.alternativeNames,
    description: object.summary,
    url: typeof window !== "undefined" ? window.location.href : `https://ekaculture.com/knowledge/${object.slug}`,
    image: primaryImage,
    locationCreated: {
      "@type": "Place",
      name: object.canonicalGeography
        ? `${object.canonicalGeography.city || ""}, ${object.canonicalGeography.state || ""}, ${object.canonicalGeography.country}`
        : object.culturalDimensions.identity.regions[0] || "Global",
    },
  };

  return (
    <div
      data-testid="eka-knowledge-detail-page"
      className="min-h-screen bg-background text-foreground"
    >
      {/* Dynamic SEO, OpenGraph & Twitter Cards */}
      <MetaTags
        title={`${object.entity} — Cultural Context, Lineage & Variations`}
        description={object.oneLiner || object.summary.slice(0, 155)}
        ogTitle={`${object.entity} | EKA Cultural Intelligence Archive`}
        ogDescription={object.summary.slice(0, 200)}
        ogImage={primaryImage}
        ogImageAlt={object.entity}
        ogType="article"
        canonicalUrl={`/knowledge/${object.slug}`}
        twitterCard="summary_large_image"
        twitterTitle={object.entity}
        twitterDescription={object.oneLiner || object.summary.slice(0, 160)}
        twitterImage={primaryImage}
        tradition={object.culturalDimensions.beliefs.religiousContext?.[0] || object.type}
        keywords={object.culturalDimensions.identity.alternativeNames}
        structuredData={jsonLdData as any}
      />

      {/* Top Navigation & Breadcrumbs Bar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div 
          className="absolute bottom-0 left-0 h-[2px] bg-terracotta z-50 transition-all duration-75" 
          style={{ width: `${scrollProgress}%` }} 
        />
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
            <Link to="/" className="flex items-center transition-opacity hover:opacity-90 shrink-0">
              <EkaLogo size="sm" />
            </Link>
            <span className="text-muted-foreground/60 hidden sm:inline">/</span>
            <Link
              to="/knowledge"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t("nav.knowledge", "Knowledge Graph")}</span>
            </Link>

            {/* Canonical Geography Breadcrumb */}
            {object.canonicalGeography && (
              <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground font-mono">
                <span className="text-muted-foreground/40">/</span>
                <span>World</span>
                <ChevronRight className="size-3 text-muted-foreground/60" />
                <span>{object.canonicalGeography.region}</span>
                <ChevronRight className="size-3 text-muted-foreground/60" />
                <span>{object.canonicalGeography.country}</span>
                {object.canonicalGeography.state && (
                  <>
                    <ChevronRight className="size-3 text-muted-foreground/60" />
                    <span className="text-foreground font-medium">{object.canonicalGeography.state}</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <LanguageSelector variant="compact" />

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsContributionModalOpen(true)}
              className="gap-1.5 text-xs border-terracotta/40 text-terracotta hover:bg-terracotta/10"
              title="Contribute living oral history or local practice"
            >
              <HeartHandshake className="size-3.5" />
              <span className="hidden sm:inline">Contribute</span>
            </Button>

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
              <span className="hidden sm:inline">{t("action.share")}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation Bar */}
      <div className="border-b border-border/40 bg-sand/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EkaBreadcrumb
            items={[
              { label: "Discover", to: "/discover" },
              { label: "Knowledge", to: "/discover" },
              { label: object.entity, active: true },
            ]}
          />
        </div>
      </div>

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
                  {object.canonicalGeography
                    ? `${object.canonicalGeography.state || object.canonicalGeography.region}, ${object.canonicalGeography.country}`
                    : localizedData.region || object.culturalDimensions.identity.regions[0]}
                </Badge>

                {/* EKA Trust & Provenance Badge with Explanatory Basis Popover */}
                <button
                  type="button"
                  onClick={() => setShowTrustBasis(!showTrustBasis)}
                  className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${trustMeta.badgeBg} ${trustMeta.badgeBorder} ${trustMeta.colorClass}`}
                  title="Click to view EKA Trust & Provenance basis"
                >
                  <ShieldCheck className="size-3" />
                  <span className="font-medium">{trustMeta.label}</span>
                  <Info className="size-2.5 opacity-70 ml-0.5" />
                </button>

                {localizedData.isFallback && (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground font-mono">
                    English Canonical
                  </Badge>
                )}
              </div>

              {/* Trust Basis Explanation Banner (Toggled on click) */}
              {showTrustBasis && (
                <div className="mt-3 rounded-2xl border border-border/80 bg-background/95 p-4 shadow-sm text-xs space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="font-mono uppercase tracking-wider text-primary font-semibold">
                      EKA Trust & Provenance Standard
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowTrustBasis(false)}
                      className="text-muted-foreground hover:text-foreground text-[11px]"
                    >
                      Close ✕
                    </button>
                  </div>
                  <p className="text-foreground leading-relaxed">
                    <strong>Verification Basis:</strong> {trustMeta.basis}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground pt-1">
                    <span>Sources Count: {object.sourcePassport.totalSources}</span>
                    {object.lastReviewed && <span>Last Reviewed: {object.lastReviewed.slice(0, 10)}</span>}
                    {object.contributor && <span>Contributor: {object.contributor}</span>}
                  </div>
                </div>
              )}

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
                {object.visualStory && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const el = document.getElementById("visual-story-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="rounded-full border-terracotta/40 text-terracotta hover:bg-terracotta/10"
                  >
                    View Visual Story ({object.visualStory.steps.length} Steps)
                  </Button>
                )}
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
                    Licence: {object.images[0]?.license || "CC BY-SA 4.0"} · Creator: {object.images[0]?.author || object.images[0]?.creator || "EKA Archive"}
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

        {/* 1. VISUAL STORY (If defined, e.g. Inside a Bengali Wedding) */}
        {object.visualStory && (
          <div id="visual-story-section" className="space-y-4">
            <VisualStoryViewer
              story={object.visualStory}
              onAskEka={(prompt) => {
                setAiQuery(prompt);
                handleAiAsk(prompt);
              }}
            />
          </div>
        )}

        {/* 2. EPISTEMIC SEPARATION: DOCUMENTED vs PERSPECTIVE */}
        {object.documentedVsPerspective && (
          <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-calm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-primary">
                    Epistemic Clarity Standard
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                  Documented Evidence vs. Community Perspectives
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  EKA rigorously separates empirical historical records from living practitioner perspectives, folk beliefs, and areas of uncertainty.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Documented */}
              <div className="rounded-2xl border border-emerald-600/30 bg-emerald-500/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <h4 className="text-xs font-mono uppercase tracking-wider font-semibold">
                    Documented by Evidence
                  </h4>
                </div>
                <ul className="space-y-1.5 text-xs text-foreground/90">
                  {object.documentedVsPerspective.documented.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600">✓</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Community Perspective */}
              <div className="rounded-2xl border border-purple-600/30 bg-purple-500/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                  <Users className="size-4 shrink-0" />
                  <h4 className="text-xs font-mono uppercase tracking-wider font-semibold">
                    Community Perspective
                  </h4>
                </div>
                <ul className="space-y-1.5 text-xs text-foreground/90">
                  {object.documentedVsPerspective.communityPerspective.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-purple-600">›</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Belief */}
              <div className="rounded-2xl border border-amber-600/30 bg-amber-500/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <BookOpen className="size-4 shrink-0" />
                  <h4 className="text-xs font-mono uppercase tracking-wider font-semibold">
                    Common Belief & Folklore
                  </h4>
                </div>
                <ul className="space-y-1.5 text-xs text-foreground/90">
                  {object.documentedVsPerspective.commonBelief.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600">★</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Editorial Interpretation */}
              <div className="rounded-2xl border border-rose-600/30 bg-rose-500/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                  <Sparkles className="size-4 shrink-0" />
                  <h4 className="text-xs font-mono uppercase tracking-wider font-semibold">
                    Editorial Interpretation
                  </h4>
                </div>
                <ul className="space-y-1.5 text-xs text-foreground/90">
                  {object.documentedVsPerspective.interpretation.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-600">✦</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Uncertain / Disputed */}
              <div className="rounded-2xl border border-stone-500/30 bg-stone-500/5 p-4 space-y-2 md:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <HelpCircle className="size-4 shrink-0" />
                  <h4 className="text-xs font-mono uppercase tracking-wider font-semibold">
                    Uncertain, Disputed or Limited Evidence
                  </h4>
                </div>
                {object.documentedVsPerspective.uncertain.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {object.documentedVsPerspective.uncertain.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-stone-500">?</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Reliable public information is limited. No active scholarly consensus disputes recorded.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 3. LIVING CULTURE & RECENT GENERATIONS */}
        {object.livingCulture && (
          <section className="rounded-3xl border border-border/80 bg-sand/15 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-terracotta font-semibold">
                  Living Culture Layer
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                  Contemporary Practice & Younger Generations
                </h3>
              </div>
              <Badge variant="outline" className="text-xs border-primary/40 text-primary">
                Living Tradition
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div className="space-y-3">
                <div className="rounded-2xl bg-card p-4 space-y-1 border border-border/60">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Who Practices It Today
                  </span>
                  <p className="text-foreground">{object.livingCulture.whoPracticesToday.join(", ")}</p>
                </div>

                <div className="rounded-2xl bg-card p-4 space-y-1 border border-border/60">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    How It Is Evolving Today
                  </span>
                  <p className="text-foreground leading-relaxed">{object.livingCulture.howChanging}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl bg-card p-4 space-y-1 border border-border/60">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Youth & Contemporary Engagement
                  </span>
                  <p className="text-foreground leading-relaxed">
                    {object.livingCulture.youngerGenerationEngagement}
                  </p>
                </div>

                <div className="rounded-2xl bg-card p-4 space-y-1 border border-border/60">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                    How People Can Experience or Support Respectfully
                  </span>
                  <ul className="space-y-1 text-muted-foreground">
                    {object.livingCulture.howPeopleCanExperienceOrSupport.map((item, idx) => (
                      <li key={idx}>🌱 {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. MEET THE KEEPERS / PRACTITIONERS */}
        {object.practitioners && object.practitioners.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
                  Meet the Keepers
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                  Living Lineage Practitioners & Guild Artisans
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {object.practitioners.map((prac) => {
                const meta = getTrustVerificationMeta(prac.verificationLevel);
                return (
                  <div
                    key={prac.id}
                    className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-serif text-base font-bold text-foreground">
                            {prac.name}
                          </h4>
                          <p className="text-xs font-mono text-terracotta">
                            {prac.practice} · {prac.community}
                          </p>
                        </div>
                        <Badge variant="outline" className={`text-[10px] ${meta.badgeColor}`}>
                          {meta.label}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {prac.story}
                      </p>

                      <div className="bg-sand/30 p-2.5 rounded-xl text-xs space-y-1">
                        <p className="text-foreground">
                          <strong>Expertise:</strong> {prac.expertise}
                        </p>
                        <p className="text-muted-foreground">
                          📍 {prac.location}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-border/60 pt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Lineage Record Corroborated</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAiQuery(`Tell me about the lineage and practice of ${prac.name} in ${object.entity}`);
                          handleAiAsk(`Tell me about the lineage and practice of ${prac.name} in ${object.entity}`);
                        }}
                        className="text-primary hover:underline font-medium"
                      >
                        Ask EKA about Keeper →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 5. CULTURAL DISCOVERY: YOU MIGHT ALSO WONDER... */}
        {object.youMightAlsoWonder && object.youMightAlsoWonder.length > 0 && (
          <section className="rounded-2xl border border-primary/20 bg-sand/20 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Compass className="size-4 text-primary" />
              <h3 className="font-serif text-lg font-bold text-foreground">
                You might also wonder...
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Follow curiosity loops rather than infinite feeds. Click any question to ask EKA:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {object.youMightAlsoWonder.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setAiQuery(q);
                    handleAiAsk(q);
                  }}
                  className="rounded-full bg-background border border-border/80 hover:border-primary/60 px-3.5 py-1.5 text-xs text-foreground hover:text-primary transition-all text-left shadow-2xs"
                >
                  › {q}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 6. AI Cultural Intelligence Interactive Drawer */}
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

        {/* 7. Cultural Variations */}
        <div id="variations-section">
          <CulturalVariationSection
            variations={object.culturalVariations}
            entityName={object.entity}
          />
        </div>

        {/* 8. 10 Cultural Dimensions */}
        <CulturalDimensionsView dimensions={object.culturalDimensions} />

        {/* 9. Knowledge Graph Connections */}
        <KnowledgeGraphVisualizer
          nodes={object.linkedGraphNodes}
          currentEntityName={object.entity}
        />

        {/* 10. Community Contribution Banner */}
        <section className="rounded-3xl border border-terracotta/30 bg-terracotta/5 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-terracotta font-semibold">
              Community Co-Creation
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
              Are you a lineage custodian or local practitioner?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Contribute oral histories, recipes, or regional variations to {object.entity}. Every submission undergoes ethical community review before archiving.
            </p>
          </div>

          <Button
            onClick={() => setIsContributionModalOpen(true)}
            className="rounded-full px-6 bg-terracotta text-white hover:bg-terracotta/90 shrink-0 gap-2"
          >
            <HeartHandshake className="size-4" />
            <span>Contribute Living Memory</span>
          </Button>
        </section>

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

      {/* Community Contribution Modal */}
      <CommunityContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => setIsContributionModalOpen(false)}
        defaultEntitySlug={object.slug}
        defaultEntityName={object.entity}
      />
    </div>
  );
}
