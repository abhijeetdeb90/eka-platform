import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  BookOpen,
  Compass,
  Share2,
  Scroll,
  ShieldCheck,
  MapPin,
  Users,
  Search,
  Bookmark,
  ChevronRight,
  ExternalLink,
  Layers,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  askEkaKnowledge,
  PRESET_INQUIRIES,
  type AskEkaKnowledgeResult,
  type PrimarySource,
  type RegionalVariation,
} from "@/lib/ai-knowledge";
import { track } from "@/lib/analytics";
import { useMonetizationTier, CORE_PHILOSOPHY } from "@/lib/monetization";

interface AskEkaDrawerProps {
  initialQuery?: string;
  onClose?: () => void;
  inline?: boolean;
}

export function AskEkaDrawer({
  initialQuery = "Sacred Harvest & Equinox Celebrations",
  onClose,
  inline = false,
}: AskEkaDrawerProps) {
  const { canUseIntelligence, setTier } = useMonetizationTier();
  const [query, setQuery] = useState(initialQuery);
  const [selectedInquiry, setSelectedInquiry] = useState<string>("what_is");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AskEkaKnowledgeResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>("explanation");
  const [saved, setSaved] = useState(false);

  // Initialize or execute query
  const handleQuery = async (customQuery?: string, inquiryType?: string) => {
    const q = customQuery !== undefined ? customQuery : query;
    const type = inquiryType || selectedInquiry;
    setLoading(true);
    track("ask_eka_query", { query: q, inquiryType: type });
    try {
      const res = await askEkaKnowledge(q, type);
      setResult(res);
      setSaved(false);
    } catch {
      toast.error("Could not retrieve knowledge right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToPassport = () => {
    setSaved(true);
    track("ask_eka_save_passport", { tradition: result?.traditionName });
    toast.success("Saved to your Wisdom Passport. You can reference this lineage anytime.");
  };

  return (
    <div
      className={
        inline
          ? "w-full rounded-2xl border border-primary/20 bg-card p-6 shadow-calm"
          : "fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm sm:p-6"
      }
    >
      <div
        className={
          inline
            ? "space-y-6"
            : "relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8"
        }
      >
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="size-4" aria-hidden />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Ask EKA {!canUseIntelligence && <Lock className="inline size-3.5 text-saffron ml-1" />}
              </span>
              {!canUseIntelligence ? (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-terracotta">
                  EKA+ Intelligence
                </span>
              ) : (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                  Interactive Knowledge Layer
                </span>
              )}
            </div>
            <h2 className="font-display text-2xl">
              Contextual Living Wisdom & Cross-Cultural Graph
            </h2>
            <p className="text-xs text-muted-foreground">
              Source → Context → AI Explanation → Related Knowledge. Grounded in verified primary
              lineages.
            </p>
            {!canUseIntelligence && (
              <p className="text-xs font-serif text-primary italic pt-0.5">
                "{CORE_PHILOSOPHY.subscriptionHook}"
              </p>
            )}
          </div>

          {!inline && onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>

        {/* Preset Question Chips */}
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Ask anything or select a core inquiry:
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_INQUIRIES.map((inq) => {
              const isActive = selectedInquiry === inq.id;
              return (
                <button
                  key={inq.id}
                  type="button"
                  onClick={() => {
                    setSelectedInquiry(inq.id);
                    void handleQuery(query, inq.id);
                  }}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card hover:border-primary/50 text-foreground"
                  }`}
                >
                  {inq.id === "what_is" && <BookOpen className="size-3.5" />}
                  {inq.id === "origin" && <Compass className="size-3.5" />}
                  {inq.id === "regional_variations" && <Share2 className="size-3.5" />}
                  {inq.id === "sources" && <Scroll className="size-3.5" />}
                  <span>{inq.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search / Topic Input Bar */}
        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" aria-hidden />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleQuery();
              }}
              placeholder="e.g. Harvest rituals, Sandhya twilight meditation, Bhakti poetry..."
              className="pl-9 text-sm"
            />
          </div>
          <Button onClick={() => void handleQuery()} disabled={loading} className="gap-2">
            {loading ? (
              "Exploring…"
            ) : (
              <>
                <span>Ask EKA</span>
                <ChevronRight className="size-4" />
              </>
            )}
          </Button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>Popular topics:</span>
          <button
            type="button"
            onClick={() => {
              setQuery("Sacred Harvest & Equinox Celebrations");
              void handleQuery("Sacred Harvest & Equinox Celebrations");
            }}
            className="rounded-md bg-muted px-2 py-0.5 hover:text-foreground"
          >
            🌾 Spring Harvest (Baisakhi / Vishu / Bihu)
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("Sandhya Contemplative Twilight Meditation");
              void handleQuery("Sandhya Contemplative Twilight Meditation");
            }}
            className="rounded-md bg-muted px-2 py-0.5 hover:text-foreground"
          >
            🌅 Twilight Sandhya & Gayatri
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("Bhakti Movement & Sacred Vernacular Poetry");
              void handleQuery("Bhakti Movement & Sacred Vernacular Poetry");
            }}
            className="rounded-md bg-muted px-2 py-0.5 hover:text-foreground"
          >
            🎶 Bhakti Poetry & Communitarian Song
          </button>
        </div>

        {/* Structured 4-Stage Knowledge Output */}
        {result && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-primary font-semibold">
                  Active Tradition
                </p>
                <h3 className="font-display text-xl">{result.traditionName}</h3>
                <p className="text-xs text-muted-foreground">
                  {result.context.originRegion} · {result.context.historicalEra}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={saved ? "secondary" : "outline"}
                  onClick={handleSaveToPassport}
                  className="gap-1.5 text-xs"
                >
                  <Bookmark className="size-3.5" />
                  <span>{saved ? "Saved in Passport" : "Save to Passport"}</span>
                </Button>
              </div>
            </div>

            {/* 4-Stage Pipeline Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="explanation" className="text-xs">
                  <Sparkles className="mr-1.5 size-3.5" />
                  <span>AI Explanation</span>
                </TabsTrigger>
                <TabsTrigger value="sources" className="text-xs">
                  <Scroll className="mr-1.5 size-3.5" />
                  <span>Primary Sources ({result.sources.length})</span>
                </TabsTrigger>
                <TabsTrigger value="context" className="text-xs">
                  <Compass className="mr-1.5 size-3.5" />
                  <span>Cultural Context</span>
                </TabsTrigger>
                <TabsTrigger value="graph" className="text-xs">
                  <Layers className="mr-1.5 size-3.5" />
                  <span>Cross-Cultural Graph</span>
                </TabsTrigger>
              </TabsList>

              {/* 1. AI Explanation */}
              <TabsContent
                value="explanation"
                className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-calm"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-display text-lg">Synthesized Understanding</h4>
                    {result.aiExplanation.poweredBy && (
                      <span className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] font-medium text-primary">
                        <Sparkles className="size-3" />
                        {result.aiExplanation.poweredBy}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90 font-medium">
                    {result.aiExplanation.summary}
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {result.aiExplanation.deepExplanation}
                  </div>
                </div>


                <div className="rounded-xl border border-border/80 bg-muted/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Philosophical Underpinning
                  </p>
                  <p className="mt-1 text-xs text-foreground/80 leading-relaxed">
                    {result.aiExplanation.philosophicalUnderpinning}
                  </p>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground">
                  <ShieldCheck className="size-4 shrink-0 text-primary mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Non-Sectarian Guarantee: </span>
                    {result.aiExplanation.nuanceNotes}
                  </div>
                </div>
              </TabsContent>

              {/* 2. Primary Sources & Lineages */}
              <TabsContent value="sources" className="space-y-4">
                <div className="space-y-3">
                  {result.sources.map((src: PrimarySource) => (
                    <div
                      key={src.id}
                      className="rounded-2xl border border-border bg-card p-5 shadow-calm space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">
                              {src.title}
                            </span>
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                              {src.language}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {src.canonicalText} · {src.era} · Citation:{" "}
                            <code className="font-mono">{src.citationRef}</code>
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                          <ShieldCheck className="size-3.5" />
                          <span>Trust Score: {src.trustScore}%</span>
                        </div>
                      </div>

                      {src.originalExcerpt && (
                        <blockquote className="rounded-lg border-l-2 border-primary bg-primary/5 px-3 py-2 font-serif text-xs italic text-foreground/90">
                          "{src.originalExcerpt}"
                        </blockquote>
                      )}

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Translation / Core Verse: </strong>
                        {src.translationExcerpt}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/50 pt-2">
                        <span>
                          Verified by: <strong>{src.verifierName}</strong> ({src.verifierRole})
                        </span>
                        <span className="text-primary hover:underline cursor-pointer flex items-center gap-1">
                          Canonical Archive ID: {src.id} <ExternalLink className="size-2.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* 3. Cultural & Historical Context */}
              <TabsContent
                value="context"
                className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-calm"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Origin Region
                    </p>
                    <p className="text-sm font-medium">{result.context.originRegion}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Historical Era
                    </p>
                    <p className="text-sm font-medium">{result.context.historicalEra}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Preservation Status
                    </p>
                    <p className="text-sm font-medium capitalize text-emerald-600 flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      {result.context.preservationStatus} Living Tradition
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Seasonal Timing
                    </p>
                    <p className="text-sm font-medium">{result.context.seasonalTiming}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Custodian Communities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.context.custodianCommunities.map((c, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Sacred Places & Geographies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.context.sacredPlaces.map((p, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs"
                      >
                        <MapPin className="size-3 text-primary" />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* 4. Cross-Cultural Knowledge Graph */}
              <TabsContent value="graph" className="space-y-6">
                {/* Node Connection Schema: Tradition -> Region -> Community -> Ritual -> Place */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-calm">
                  <p className="text-xs uppercase tracking-wider text-primary font-semibold">
                    Core Lineage Graph Architecture
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                    <div className="rounded-xl border border-border bg-card p-3 text-center min-w-[120px]">
                      <span className="text-[10px] text-muted-foreground uppercase block">
                        Tradition
                      </span>
                      <span className="font-semibold text-foreground">
                        {result.crossCulturalGraph.primaryNode.tradition}
                      </span>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                    <div className="rounded-xl border border-border bg-card p-3 text-center min-w-[120px]">
                      <span className="text-[10px] text-muted-foreground uppercase block">
                        Region
                      </span>
                      <span className="font-semibold text-foreground">
                        {result.crossCulturalGraph.primaryNode.region}
                      </span>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                    <div className="rounded-xl border border-border bg-card p-3 text-center min-w-[120px]">
                      <span className="text-[10px] text-muted-foreground uppercase block">
                        Community
                      </span>
                      <span className="font-semibold text-foreground">
                        {result.crossCulturalGraph.primaryNode.community}
                      </span>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                    <div className="rounded-xl border border-border bg-card p-3 text-center min-w-[120px]">
                      <span className="text-[10px] text-muted-foreground uppercase block">
                        Ritual
                      </span>
                      <span className="font-semibold text-foreground">
                        {result.crossCulturalGraph.primaryNode.ritual}
                      </span>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                    <div className="rounded-xl border border-border bg-card p-3 text-center min-w-[120px]">
                      <span className="text-[10px] text-muted-foreground uppercase block">
                        Place
                      </span>
                      <span className="font-semibold text-foreground">
                        {result.crossCulturalGraph.primaryNode.place}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Regional Variations Cards */}
                <div>
                  <h4 className="font-display text-base">
                    Cross-Regional Manifestations & Shared Roots
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    How this single tradition branches across diverse geographies and communities:
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {result.crossCulturalGraph.connections.map(
                      (v: RegionalVariation, i: number) => (
                        <div
                          key={i}
                          className="rounded-2xl border border-border bg-card p-5 shadow-calm space-y-3 transition-all hover:border-primary/40"
                        >
                          <div className="flex items-center justify-between border-b border-border/60 pb-2">
                            <span className="font-semibold text-sm">{v.regionalName}</span>
                            <span className="text-xs text-muted-foreground font-medium">
                              {v.region}
                            </span>
                          </div>
                          <div className="space-y-1.5 text-xs text-muted-foreground">
                            <p>
                              <strong className="text-foreground">Community:</strong> {v.community}
                            </p>
                            <p>
                              <strong className="text-foreground">Distinct Ritual:</strong>{" "}
                              {v.distinctRitual}
                            </p>
                            <p className="flex items-center gap-1.5">
                              <MapPin className="size-3 text-primary" />
                              <span>{v.geographicalPlace}</span>
                            </p>
                          </div>
                          <p className="text-xs text-foreground/85 border-t border-border/50 pt-2 italic">
                            {v.culturalSignificance}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Historical Lineage Chain */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-calm">
                  <h5 className="font-display text-sm">Historical Lineage Progression</h5>
                  <div className="mt-3 space-y-2">
                    {result.crossCulturalGraph.lineageChain.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {idx + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Actionable Next Steps: Sanghas & Verified Guides */}
            <div className="grid gap-4 sm:grid-cols-2 border-t border-border pt-6">
              {/* Related Sanghas */}
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  <h4 className="font-display text-sm">Related Community Circles</h4>
                </div>
                <div className="space-y-2">
                  {result.relatedSanghas.map((s) => (
                    <Link
                      key={s.slug}
                      to="/app/sanghas/$slug"
                      params={{ slug: s.slug }}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-2.5 text-xs hover:bg-accent transition-all"
                    >
                      <span className="font-medium text-foreground">{s.name}</span>
                      <span className="text-muted-foreground">{s.membersCount} members</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Verified Guides */}
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  <h4 className="font-display text-sm">Verified Lineage Guides</h4>
                </div>
                <div className="space-y-2">
                  {result.verifiedGuides.map((g) => (
                    <Link
                      key={g.slug}
                      to="/app/market/$slug"
                      params={{ slug: g.slug }}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-2.5 text-xs hover:bg-accent transition-all"
                    >
                      <div>
                        <p className="font-medium text-foreground">{g.name}</p>
                        <p className="text-[11px] text-muted-foreground">{g.specialty}</p>
                      </div>
                      <span className="text-primary font-semibold">★ {g.rating}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
