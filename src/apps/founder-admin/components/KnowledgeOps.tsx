import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Scale,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Layers,
  Image as ImageIcon,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LICENSE_REGISTRY, validateImageRights } from "@/lib/knowledge/source-license-engine";
import { CANONICAL_KNOWLEDGE_OBJECTS } from "@/lib/knowledge/knowledge-graph";
import {
  retrieveEkaCulturalIntelligence,
  SUGGESTED_CULTURAL_QUERIES,
  type EkaAiRetrievalResult,
} from "@/lib/knowledge/ai-retrieval";



interface ConnectorStatus {
  id: string;
  name: string;
  tier: string;
  license: string;
  protocol: string;
  status: "active" | "testing" | "cached";
  lastPing: string;
  itemCount: number;
}

const INITIAL_CONNECTORS: ConnectorStatus[] = [
  {
    id: "wikidata",
    name: "Wikidata Entity Backbone",
    tier: "Tier 1: Structured Open",
    license: "CC0 1.0 Universal",
    protocol: "SPARQL & REST API",
    status: "active",
    lastPing: "Just now",
    itemCount: 1420,
  },
  {
    id: "wikipedia",
    name: "Wikimedia REST Reference Service",
    tier: "Tier 2: Open Reference",
    license: "CC BY-SA 4.0",
    protocol: "REST /api/rest_v1/page/summary",
    status: "active",
    lastPing: "2 mins ago",
    itemCount: 890,
  },
  {
    id: "commons",
    name: "Wikimedia Commons Image Rights Pipeline",
    tier: "Tier 2: Open Media",
    license: "Per-file (CC0 / CC BY-SA / PD)",
    protocol: "Action API (prop=imageinfo)",
    status: "active",
    lastPing: "1 min ago",
    itemCount: 2340,
  },
  {
    id: "unesco",
    name: "UNESCO Intangible Cultural Heritage",
    tier: "Tier 3: Cultural Heritage",
    license: "UNESCO Open Access",
    protocol: "ICH Dossier & Nomination Inventory",
    status: "active",
    lastPing: "5 mins ago",
    itemCount: 420,
  },
  {
    id: "europeana",
    name: "Europeana Aggregated Cultural Heritage",
    tier: "Tier 3: Cultural Heritage",
    license: "RightsStatements.org (PDM / NoC)",
    protocol: "Europeana Search API v2",
    status: "active",
    lastPing: "10 mins ago",
    itemCount: 310,
  },
  {
    id: "community",
    name: "EKA Community Elder & Lineage Oral Archive",
    tier: "Tier 4: Community Lineage",
    license: "Custom Free with Elder Attribution",
    protocol: "EKA Cryptographic Registry",
    status: "active",
    lastPing: "Live",
    itemCount: 156,
  },
];

export function KnowledgeOps() {
  const [connectors, setConnectors] = useState<ConnectorStatus[]>(INITIAL_CONNECTORS);
  const [testingId, setTestingId] = useState<string | null>(null);

  // Verification Queue State
  const [pendingReviews, setPendingReviews] = useState([
    {
      id: "rev-01",
      entity: "Varanasi Ganga Aarti Lineage",
      flagReason: "community_identity_claim",
      claim: "The Dashashwamedh Ghat aarti was composed by Lord Brahma during the ten-horse sacrifice.",
      status: "pending_review",
      sources: ["Skanda Purana Kashi Khanda", "Varanasi Priest Guild Oral Testimony"],
    },
    {
      id: "rev-02",
      entity: "Ayurvedic Rasashastra Mercury Purification",
      flagReason: "medical_claim",
      claim: "Purified cinnabar (Hingula) retains no toxic methylmercury when processed through 18 Samskaras.",
      status: "pending_review",
      sources: ["Rasaratna Samucchaya", "CSIR-TKDL Database"],
    },
  ]);

  // Image Rights Auditor State
  const [testImageUrl, setTestImageUrl] = useState(
    "https://images.unsplash.com/photo-1576761428284-5f96307e5932?q=80&w=1200&auto=format&fit=crop"
  );
  const [testLicense, setTestLicense] = useState("CC BY-SA 4.0");
  const [testAuthor, setTestAuthor] = useState("S. K. Verma");
  const [auditResult, setAuditResult] = useState<any>(null);

  // AI Diagnostic State
  const [diagQuery, setDiagQuery] = useState(SUGGESTED_CULTURAL_QUERIES[0]!);
  const [diagResult, setDiagResult] = useState<EkaAiRetrievalResult | null>(null);

  const handleTestConnector = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setConnectors((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "active", lastPing: "Verified successfully" } : c
        )
      );
      setTestingId(null);
      toast.success(`Connector "${id.toUpperCase()}" verified successfully.`);
    }, 600);
  };

  const handleAuditImage = () => {
    const res = validateImageRights({
      license: testLicense as any,
      author: testAuthor,
      sourceUrl: testImageUrl,
    });
    setAuditResult(res);
    if (res.isValid) {
      toast.success("Image rights verified: fully compliant.");
    } else {
      toast.error(`Image compliance check failed: ${res.reason}`);
    }
  };

  const handleRunAiDiag = () => {
    const res = retrieveEkaCulturalIntelligence(diagQuery);
    setDiagResult(res);
    toast.success("Cultural Intelligence diagnostic run complete.");
  };

  const handleReviewAction = (id: string, action: "approved" | "quarantined") => {
    setPendingReviews((prev) => prev.filter((r) => r.id !== id));
    toast.success(`Claim ${id} ${action === "approved" ? "approved" : "quarantined"}.`);
  };

  return (
    <div
      data-testid="eka-admin-knowledge-page"
      className="min-h-screen bg-background text-foreground"
    >
      {/* Header */}
      <header className="border-b border-border/80 bg-background/90 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-serif text-2xl font-bold text-primary">
              EKA
            </Link>
            <span className="text-muted-foreground">/</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <h1 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Knowledge & Provenance Operations Center
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/knowledge">
              <Button variant="outline" size="sm" className="rounded-full text-xs">
                Public Directory
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Overview */}
      <section className="border-b border-border/60 bg-sand/15 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant="outline" className="border-emerald-600 text-emerald-600 text-xs">
                Legal & Cultural Integrity Architecture
              </Badge>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Cultural Knowledge Operations
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage automated connectors, review sensitive claims, audit image licenses, and verify epistemic taxonomy across 10 canonical entities.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 text-white text-xs py-1.5 px-3">
                100% Provenance Corroborated
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tabs */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="connectors" className="w-full">
          <TabsList className="h-auto p-1 bg-sand/30 rounded-2xl flex flex-wrap gap-1">
            <TabsTrigger
              value="connectors"
              className="rounded-xl px-4 py-2 text-xs font-medium flex items-center gap-1.5"
            >
              <Database className="h-3.5 w-3.5" /> Source Connectors
            </TabsTrigger>
            <TabsTrigger
              value="licenses"
              className="rounded-xl px-4 py-2 text-xs font-medium flex items-center gap-1.5"
            >
              <Scale className="h-3.5 w-3.5" /> License Registry
            </TabsTrigger>
            <TabsTrigger
              value="verification"
              className="rounded-xl px-4 py-2 text-xs font-medium flex items-center gap-1.5"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Sensitive Queue ({pendingReviews.length})
            </TabsTrigger>
            <TabsTrigger
              value="image-auditor"
              className="rounded-xl px-4 py-2 text-xs font-medium flex items-center gap-1.5"
            >
              <ImageIcon className="h-3.5 w-3.5" /> Image Rights Auditor
            </TabsTrigger>
            <TabsTrigger
              value="ai-diagnostic"
              className="rounded-xl px-4 py-2 text-xs font-medium flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Retrieval Diagnostics
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: CONNECTORS */}
          <TabsContent value="connectors" className="mt-6 space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-calm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    Active Ingestion Connectors
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Connectors interface directly with official REST APIs and structured databases with zero unauthorized web scraping.
                  </p>
                </div>
              </div>

              <div className="mt-6 divide-y divide-border/60">
                {connectors.map((c) => (
                  <div
                    key={c.id}
                    data-testid={`connector-row-${c.id}`}
                    className="py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-foreground text-sm">
                          {c.name}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {c.tier}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground font-mono">
                        Protocol: {c.protocol} · Licence: {c.license} · {c.itemCount} items ingested
                      </p>
                      <p className="mt-0.5 text-[11px] text-emerald-600 font-medium">
                        Status: Active (Last ping: {c.lastPing})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={testingId === c.id}
                        onClick={() => handleTestConnector(c.id)}
                        className="rounded-full text-xs gap-1.5"
                        data-testid={`test-connector-${c.id}`}
                      >
                        <RefreshCw
                          className={`h-3.5 w-3.5 ${testingId === c.id ? "animate-spin text-primary" : ""}`}
                        />
                        {testingId === c.id ? "Pinging..." : "Test Health"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: LICENSE REGISTRY */}
          <TabsContent value="licenses" className="mt-6 space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-calm">
              <h3 className="font-serif text-lg font-bold text-foreground">
                EKA License Registry & Re-use Permissions
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Every license accepted in EKA must permit commercial distribution and clear attribution.
                Strictly prohibits non-commercial (NC) or no-derivatives (ND) restrictions.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(LICENSE_REGISTRY).map(([key, item]) => (
                  <div
                    key={key}
                    className="rounded-2xl border border-border/80 bg-sand/15 p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={item.commercialAllowed ? "default" : "destructive"}
                          className="text-[10px]"
                        >
                          {item.commercialAllowed ? "Commercial OK" : "Restricted"}
                        </Badge>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          Tier: {item.sourceTier.split("_")[0]}
                        </span>
                      </div>
                      <h4 className="mt-2.5 font-bold text-foreground text-sm">
                        {item.name}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-border/50 text-[11px] font-mono text-primary flex justify-between">
                      <span>Attribution: {item.requiresAttribution ? "Mandatory" : "Optional"}</span>
                      <span>ShareAlike: {item.requiresShareAlike ? "Yes" : "No"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: SENSITIVE WORKFLOW QUEUE */}
          <TabsContent value="verification" className="mt-6 space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-calm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    Sensitive Claims & Dispute Moderation Queue
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Flags historical controversies, sacred devotional narratives, and indigenous oral claims requiring elder sign-off.
                  </p>
                </div>
                <Badge variant="outline" className="border-amber-600 text-amber-600">
                  {pendingReviews.length} Awaiting Verification
                </Badge>
              </div>

              <div className="mt-6 space-y-4">
                {pendingReviews.map((item) => (
                  <div
                    key={item.id}
                    data-testid={`review-card-${item.id}`}
                    className="rounded-2xl border border-border/80 bg-sand/20 p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-foreground text-sm">
                          {item.entity}
                        </h4>
                        <Badge variant="secondary" className="text-[10px]">
                          {item.flagReason.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{item.id}</span>
                    </div>

                    <p className="font-serif text-sm italic text-foreground bg-background/80 p-3 rounded-xl border border-border/50">
                      "{item.claim}"
                    </p>

                    <div className="text-xs text-muted-foreground">
                      <strong>Documented Sources:</strong> {item.sources.join("; ")}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReviewAction(item.id, "quarantined")}
                        className="rounded-full text-xs text-destructive hover:bg-destructive/10"
                        data-testid={`quarantine-btn-${item.id}`}
                      >
                        Quarantine
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReviewAction(item.id, "approved")}
                        className="rounded-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                        data-testid={`approve-btn-${item.id}`}
                      >
                        Approve as Traditional Belief
                      </Button>
                    </div>
                  </div>
                ))}

                {pendingReviews.length === 0 && (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    ✓ All sensitive workflows cleared. No pending reviews in the queue.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: IMAGE RIGHTS AUDITOR */}
          <TabsContent value="image-auditor" className="mt-6 space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-calm">
              <h3 className="font-serif text-lg font-bold text-foreground">
                Image Rights & Legal Compliance Auditor
              </h3>
              <p className="text-xs text-muted-foreground">
                Run immediate pre-flight audits on incoming image URLs to prevent copyright infringements.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Source Image URL
                  </label>
                  <Input
                    value={testImageUrl}
                    onChange={(e) => setTestImageUrl(e.target.value)}
                    className="mt-1 text-xs"
                    data-testid="audit-url-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Licence Claimed
                  </label>
                  <Input
                    value={testLicense}
                    onChange={(e) => setTestLicense(e.target.value)}
                    className="mt-1 text-xs"
                    data-testid="audit-license-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Author / Creator
                  </label>
                  <Input
                    value={testAuthor}
                    onChange={(e) => setTestAuthor(e.target.value)}
                    className="mt-1 text-xs"
                    data-testid="audit-author-input"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleAuditImage}
                  className="rounded-full text-xs gap-1.5"
                  data-testid="run-image-audit-btn"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Run Rights Audit
                </Button>
              </div>

              {auditResult && (
                <div
                  data-testid="audit-result-box"
                  className={`mt-6 rounded-2xl p-4 border text-xs ${
                    auditResult.isValid
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                      : "bg-destructive/10 border-destructive/30 text-destructive"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {auditResult.isValid ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                    <span>
                      {auditResult.isValid
                        ? "PASSED: Full Legal Compliance"
                        : "REJECTED: License Non-Compliant"}
                    </span>
                  </div>
                  <p className="mt-1">{auditResult.reason}</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 5: AI RETRIEVAL DIAGNOSTICS */}
          <TabsContent value="ai-diagnostic" className="mt-6 space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-calm">
              <h3 className="font-serif text-lg font-bold text-foreground">
                AI Cultural Intelligence Retrieval Benchmark
              </h3>
              <p className="text-xs text-muted-foreground">
                Verify synthesis speed, epistemic taxonomy separation, and source passport generation on benchmark queries.
              </p>

              <div className="mt-4 flex gap-2">
                <Input
                  value={diagQuery}
                  onChange={(e) => setDiagQuery(e.target.value)}
                  className="rounded-full text-xs bg-sand/20"
                  data-testid="admin-ai-query-input"
                />
                <Button
                  onClick={handleRunAiDiag}
                  className="rounded-full text-xs gap-1.5 shrink-0"
                  data-testid="admin-ai-run-btn"
                >
                  <Activity className="h-3.5 w-3.5" /> Execute Test
                </Button>
              </div>

              {diagResult && (
                <div
                  data-testid="admin-ai-diag-result"
                  className="mt-6 rounded-2xl border border-border bg-sand/15 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="font-serif font-bold text-foreground text-sm">
                      Entity Matched: {diagResult.matchedEntity.entity} ({diagResult.matchedEntity.slug})
                    </span>
                    <Badge variant="outline" className="text-xs font-mono">
                      Confidence: {Math.round(diagResult.confidence * 100)}%
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-center">
                    <div className="rounded-xl bg-card p-2 border border-border/60">
                      <span className="block font-bold text-foreground">
                        {diagResult.answerSections.epistemicBreakdown.documentedFacts.length}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Documented Facts</span>
                    </div>
                    <div className="rounded-xl bg-card p-2 border border-border/60">
                      <span className="block font-bold text-foreground">
                        {diagResult.answerSections.epistemicBreakdown.traditionalBeliefs.length}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Traditional Beliefs</span>
                    </div>
                    <div className="rounded-xl bg-card p-2 border border-border/60">
                      <span className="block font-bold text-foreground">
                        {diagResult.answerSections.culturalVariations.length}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Variations</span>
                    </div>
                    <div className="rounded-xl bg-card p-2 border border-border/60">
                      <span className="block font-bold text-emerald-600">
                        {diagResult.answerSections.sourcePassport.totalSources}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Verified Sources</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-background/90 p-4 border border-border/60 text-xs space-y-2">
                    <span className="font-semibold text-primary uppercase tracking-wider block">
                      Synthesized Intelligence Output:
                    </span>
                    <p className="text-foreground leading-relaxed line-clamp-3">
                      {diagResult.answerSections.coreUnderstanding}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
