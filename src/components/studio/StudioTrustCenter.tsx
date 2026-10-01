// ==============================================================================
// EKA STUDIO — TRUST, PROVENANCE, HUMAN AUTHENTICITY & DISPUTES CENTER
// ==============================================================================

import { useState } from "react";
import {
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  BookMarked,
  CheckCircle,
  XCircle,
  ExternalLink,
  Plus,
  Scale,
  Search,
  UserCheck,
  Bot,
  Sparkles,
  Activity,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { KnowledgeDispute, StudioRole } from "@/lib/studio/types";

interface StudioTrustCenterProps {
  currentRole: StudioRole;
}

interface HumanAuthenticityIncident {
  id: string;
  account_handle: string;
  profile_name: string;
  detected_vector:
    | "Synthetic Comment Farm"
    | "Automated Velocity Anomaly"
    | "LLM Hallucinated Identity"
    | "Engagement Pod Sybil";
  synthetic_confidence: number;
  sample_content: string;
  timestamp: string;
  status: "quarantined" | "banned" | "cleared_human";
}

const SEED_SOURCES = [
  {
    id: "src_rigveda_poona",
    name: "Rigveda Samhita (Critical Edition)",
    kind: "Scripture / Canon",
    author: "Vedic Risis / Vaidika Samshodhana Mandala",
    publisher: "Poona Vedic Research Institute",
    reliability: "Canonical Primary",
    tradition: "Sanatana Dharma / Vedic",
    url: "https://archive.org/details/rigveda-samhita-poona",
    notes: "Peer-reviewed critical edition collating 84 palm-leaf and birch-bark manuscripts.",
  },
  {
    id: "src_kashi_khanda",
    name: "Kashi Khanda (Skanda Purana)",
    kind: "Sacred Chronicle",
    author: "Vyasa Lineage",
    publisher: "Chowkhamba Sanskrit Series Office",
    reliability: "Canonical Primary",
    tradition: "Shaiva / Dharmic",
    url: "https://chowkhambaseries.org/kashi-khanda",
    notes: "Topographical and liturgical authority on Varanasi ghats and tirthas.",
  },
  {
    id: "src_fawaid_sijzi",
    name: "Fawa'id al-Fu'ad (Discourses of Nizamuddin Auliya)",
    kind: "Historical Chronicle",
    author: "Amir Hasan Sijzi",
    publisher: "Oxford University Press",
    reliability: "High Academic",
    tradition: "Chishti Sufism",
    url: "https://global.oup.com/academic/product/morals-for-the-heart",
    notes: "Primary 14th-century diary recording spiritual discourses and Sama assemblies.",
  },
];

const SEED_DISPUTES: KnowledgeDispute[] = [
  {
    id: "disp_01",
    knowledge_object_id: "ko_sandhya_01",
    object_title: "Evening Sandhya & Gayatri Meditation",
    filed_by: "Regional Lineage Custodian",
    reason: "Omission of Bodhayana Sutra variation for coastal communities",
    evidence: "Bodhayana Grihyasutra 2.4 prescribes distinct Arghya timings during solar eclipses.",
    status: "open",
    created_at: "2026-09-24T10:00:00Z",
  },
];

const SEED_AUTHENTICITY_INCIDENTS: HumanAuthenticityIncident[] = [
  {
    id: "bot_det_101",
    account_handle: "@mystic_soul_8829",
    profile_name: "Aura Seeker AI",
    detected_vector: "Synthetic Comment Farm",
    synthetic_confidence: 98.4,
    sample_content:
      "Great deep spiritual vibes! Blessed wisdom. Check my bio for guaranteed divine horoscope secrets!",
    timestamp: "12 mins ago",
    status: "quarantined",
  },
  {
    id: "bot_det_102",
    account_handle: "@vedic_scholar_rapid",
    profile_name: "Pandit Automated",
    detected_vector: "Automated Velocity Anomaly",
    synthetic_confidence: 94.7,
    sample_content:
      "Posted 42 comments across 18 lineage discourses in 14 seconds with zero contemplation interval.",
    timestamp: "1 hour ago",
    status: "quarantined",
  },
  {
    id: "bot_det_103",
    account_handle: "@zen_harmonizer_bot",
    profile_name: "Zen Master Synthetic",
    detected_vector: "LLM Hallucinated Identity",
    synthetic_confidence: 99.1,
    sample_content:
      "As an ordained monk of the Tibetan Golden Lotus Monastery (non-existent lineage), I advise...",
    timestamp: "3 hours ago",
    status: "banned",
  },
];

export function StudioTrustCenter({ currentRole }: StudioTrustCenterProps) {
  const [activeTab, setActiveTab] = useState<
    "human_authenticity" | "sources" | "disputes" | "levels"
  >("human_authenticity");
  const [sources, setSources] = useState(SEED_SOURCES);
  const [disputes, setDisputes] = useState<KnowledgeDispute[]>(SEED_DISPUTES);
  const [authenticityIncidents, setAuthenticityIncidents] = useState<
    HumanAuthenticityIncident[]
  >(SEED_AUTHENTICITY_INCIDENTS);

  // New source form
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceKind, setNewSourceKind] = useState("Scripture / Canon");
  const [newSourceAuthor, setNewSourceAuthor] = useState("");
  const [newSourceReliability, setNewSourceReliability] = useState("Canonical Primary");
  const [newSourceUrl, setNewSourceUrl] = useState("");

  // Dispute resolution
  const [selectedDispute, setSelectedDispute] = useState<KnowledgeDispute | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");

  const handleCreateSource = () => {
    if (!newSourceName.trim()) {
      toast.error("Source title is required.");
      return;
    }
    const created = {
      id: `src_${Date.now()}`,
      name: newSourceName.trim(),
      kind: newSourceKind,
      author: newSourceAuthor.trim() || "Unspecified",
      publisher: "Registered in Studio",
      reliability: newSourceReliability,
      tradition: "Universal",
      url: newSourceUrl.trim() || "",
      notes: "Directly catalogued in EKA Trust Center",
    };
    setSources([created, ...sources]);
    setIsAddingSource(false);
    setNewSourceName("");
    setNewSourceAuthor("");
    toast.success("Source successfully registered with provenance fingerprint.");
  };

  const handleResolveDispute = (id: string, status: "resolved" | "dismissed") => {
    if (!resolutionNotes.trim()) {
      toast.error("Adjudication notes are mandatory for auditable resolution.");
      return;
    }
    setDisputes(
      disputes.map((d) =>
        d.id === id
          ? {
              ...d,
              status,
              resolution_notes: resolutionNotes,
              resolved_by: currentRole,
              resolved_at: new Date().toISOString(),
            }
          : d,
      ),
    );
    setSelectedDispute(null);
    setResolutionNotes("");
    toast.success(`Dispute marked as ${status}.`);
  };

  const handleBanBot = (id: string, handle: string) => {
    setAuthenticityIncidents(
      authenticityIncidents.map((inc) =>
        inc.id === id ? { ...inc, status: "banned" } : inc,
      ),
    );
    toast.error(`Bot account ${handle} permanently banned. Synthetic engagement expunged.`);
  };

  const handleClearHuman = (id: string, handle: string) => {
    setAuthenticityIncidents(
      authenticityIncidents.map((inc) =>
        inc.id === id ? { ...inc, status: "cleared_human" } : inc,
      ),
    );
    toast.success(`Account ${handle} verified as authentic human. Quarantine lifted.`);
  };

  const quarantinedCount = authenticityIncidents.filter(
    (i) => i.status === "quarantined",
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-normal tracking-tight">
            Trust & Authenticity Command Center
          </h2>
          <p className="text-xs text-muted-foreground">
            Enforcing the 5-Pillar EKA Trust Architecture: Human Authenticity, Epistemic Verification, Provenance, Content Standards, and Governance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={activeTab === "human_authenticity" ? "default" : "outline"}
            onClick={() => setActiveTab("human_authenticity")}
          >
            <UserCheck className="mr-1.5 size-3.5" /> Human Authenticity & Bot Radar{" "}
            {quarantinedCount > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                {quarantinedCount}
              </span>
            )}
          </Button>
          <Button
            size="sm"
            variant={activeTab === "sources" ? "default" : "outline"}
            onClick={() => setActiveTab("sources")}
          >
            <BookMarked className="mr-1.5 size-3.5" /> Sources Registry ({sources.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === "disputes" ? "default" : "outline"}
            onClick={() => setActiveTab("disputes")}
          >
            <Scale className="mr-1.5 size-3.5" /> Disputes (
            {disputes.filter((d) => d.status === "open").length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === "levels" ? "default" : "outline"}
            onClick={() => setActiveTab("levels")}
          >
            <ShieldCheck className="mr-1.5 size-3.5" /> Trust Ladder (L0–L5)
          </Button>
        </div>
      </div>

      {/* Tab: Human Authenticity & Bot Radar */}
      {activeTab === "human_authenticity" && (
        <div className="space-y-6">
          {/* Positioning Banner */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-calm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  <UserCheck className="size-3.5" /> Human-First Community Rule
                </span>
                <h3 className="mt-2 font-display text-xl font-medium">
                  "The intelligence is artificial. The community isn't."
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  AI powers knowledge behind the scenes (verification, translation, moderation, discovery). The visible community layer stays strictly human.
                </p>
              </div>
              <div className="flex sm:flex-col items-end gap-2 text-right">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <Activity className="size-3.5 animate-pulse" /> 99.8% Human Purity
                </span>
                <span className="text-[11px] text-muted-foreground">Zero-Bot Policy: Enforced</span>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Metrics */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Monitored Ingress
              </span>
              <p className="mt-1 font-display text-2xl font-medium">28,490</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                100% human-verified sessions
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Quarantined Anomalies
              </span>
              <p className="mt-1 font-display text-2xl font-medium text-amber-500">
                {quarantinedCount}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Awaiting moderator review</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Bots Neutralized
              </span>
              <p className="mt-1 font-display text-2xl font-medium text-destructive">42</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Expunged from graph</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Synthetic Engagement
              </span>
              <p className="mt-1 font-display text-2xl font-medium text-emerald-600 dark:text-emerald-400">
                0.00%
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Zero manufactured pod activity</p>
            </div>
          </div>

          {/* The 5 Pillars of EKA Trust Architecture */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-4">
            <h3 className="font-display text-base font-medium">
              The 5 First-Class Layers of EKA Trust Architecture
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  1. Human Authenticity
                </span>
                <p className="text-xs font-semibold">Zero Bot Accounts</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Strictly human community; zero synthetic personas or manufactured engagement.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-accent/20 p-3.5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  2. Verification
                </span>
                <p className="text-xs font-semibold">Explainable L0–L5</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Transparent provenance ladder from unverified to archival benchmark.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-accent/20 p-3.5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  3. Source Provenance
                </span>
                <p className="text-xs font-semibold">Immutable Passports</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Primary manuscripts, lineage records, and digital archive citations.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-accent/20 p-3.5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  4. Content Authenticity
                </span>
                <p className="text-xs font-semibold">5-Tier Taxonomy</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Separating tradition from interpretation; zero miracle guarantees; anti-noise filter.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-accent/20 p-3.5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  5. Community Governance
                </span>
                <p className="text-xs font-semibold">Living Custodians</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Living tradition keepers, dispute arbitration, and human appeals ladder.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Bot & Synthetic Anomaly Quarantine Queue */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display text-base font-medium">
                  Synthetic Ingress & Bot Quarantine Radar
                </h3>
                <p className="text-xs text-muted-foreground">
                  Autonomous heuristic alarms triggered by velocity spikes, LLM stylistic patterns, or synthetic engagement pods.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {authenticityIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-calm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {incident.status === "banned" ? (
                        <ShieldAlert className="size-4 text-destructive" />
                      ) : (
                        <Bot className="size-4 text-amber-500" />
                      )}
                      <span className="font-display text-sm font-medium">
                        {incident.profile_name}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {incident.account_handle}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-muted-foreground">
                        Vector: {incident.detected_vector}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                          incident.status === "quarantined"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : incident.status === "banned"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {incident.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-accent/20 p-3 text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-foreground">
                      <span>Heuristic Confidence: {incident.synthetic_confidence}% Synthetic</span>
                      <span>Detected: {incident.timestamp}</span>
                    </div>
                    <p className="italic">"{incident.sample_content}"</p>
                  </div>

                  {incident.status === "quarantined" && (
                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleBanBot(incident.id, incident.account_handle)}
                      >
                        <XCircle className="mr-1.5 size-3.5" /> Terminate Bot Account
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleClearHuman(incident.id, incident.account_handle)
                        }
                      >
                        <CheckCircle2 className="mr-1.5 size-3.5" /> Clear as Verified Human
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Sources Registry */}
      {activeTab === "sources" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-base font-medium">Registered Canonical Sources</h3>
            <Button size="sm" onClick={() => setIsAddingSource(true)}>
              <Plus className="mr-1.5 size-3.5" /> Register Primary Source
            </Button>
          </div>

          {isAddingSource && (
            <div className="rounded-2xl border border-primary/30 bg-card p-5 shadow-calm space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <span className="text-xs font-semibold text-primary uppercase">
                  Register New Primary Source
                </span>
                <Button size="sm" variant="ghost" onClick={() => setIsAddingSource(false)}>
                  Cancel
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground">Source Title</label>
                  <Input
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                    placeholder="e.g. Dhammapada (Pali Canon)"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Source Kind</label>
                  <select
                    value={newSourceKind}
                    onChange={(e) => setNewSourceKind(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="Scripture / Canon">Scripture / Canon</option>
                    <option value="Historical Chronicle">Historical Chronicle</option>
                    <option value="Academic Monograph">Academic Monograph</option>
                    <option value="Epigraphical Inscription">Epigraphical Inscription</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Author / Seer / Lineage</label>
                  <Input
                    value={newSourceAuthor}
                    onChange={(e) => setNewSourceAuthor(e.target.value)}
                    placeholder="e.g. Sthavira Lineage"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Reliability Rating</label>
                  <select
                    value={newSourceReliability}
                    onChange={(e) => setNewSourceReliability(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    <option value="Canonical Primary">Canonical Primary</option>
                    <option value="High Academic">High Academic</option>
                    <option value="Living Oral Transmission">Living Oral Transmission</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Digital Archive URI</label>
                  <Input
                    value={newSourceUrl}
                    onChange={(e) => setNewSourceUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-1"
                  />
                </div>
              </div>

              <Button size="sm" onClick={handleCreateSource}>
                Save Source Entry
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sources.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-calm"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-primary uppercase text-[10px]">{s.kind}</span>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-muted-foreground">
                    {s.reliability}
                  </span>
                </div>
                <h4 className="font-display text-base font-medium">{s.name}</h4>
                <p className="text-xs text-muted-foreground">Author: {s.author}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{s.notes}</p>
                {s.url && (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline pt-1"
                  >
                    View Archive Citation <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Disputes */}
      {activeTab === "disputes" && (
        <div className="space-y-4">
          <h3 className="font-display text-base font-medium">
            Hermeneutic Conflicts & Disputes Queue
          </h3>
          <p className="text-xs text-muted-foreground">
            Community and expert challenges filed against claims, dates, or regional attributions.
          </p>

          <div className="space-y-3">
            {disputes.map((d) => (
              <div
                key={d.id}
                className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-calm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="size-4 text-amber-500" />
                    <span className="font-display text-sm font-medium">{d.object_title}</span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                      d.status === "open"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
                <p className="text-xs text-foreground font-medium">Dispute Ground: {d.reason}</p>
                <div className="rounded-xl border border-border bg-accent/20 p-3 text-xs text-muted-foreground">
                  <strong>Filed Evidence:</strong> {d.evidence}
                </div>

                {d.status === "open" ? (
                  <div className="pt-2 flex flex-col gap-2">
                    <Textarea
                      placeholder="Enter resolution determination, hermeneutic consensus, or citation update..."
                      value={selectedDispute?.id === d.id ? resolutionNotes : ""}
                      onChange={(e) => {
                        setSelectedDispute(d);
                        setResolutionNotes(e.target.value);
                      }}
                      rows={2}
                      className="text-xs"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleResolveDispute(d.id, "resolved")}
                      >
                        <CheckCircle className="mr-1.5 size-3.5" /> Uphold & Update Knowledge
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolveDispute(d.id, "dismissed")}
                      >
                        <XCircle className="mr-1.5 size-3.5" /> Dismiss Unsubstantiated
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground pt-1 border-t border-border">
                    Resolved by {d.resolved_by}: "{d.resolution_notes}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Trust Ladder */}
      {activeTab === "levels" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-4">
          <h3 className="font-display text-lg font-medium">The 6-Level Epistemic Verification Ladder</h3>
          <p className="text-xs text-muted-foreground">
            EKA rejects opaque binary badges. A claim's authority is mathematically grounded in its verifiable provenance tier.
          </p>

          <div className="space-y-3 pt-2">
            {[
              {
                lvl: 0,
                tier: "Unverified Contribution",
                desc: "Freshly submitted reflection or claim. No citations attached. Awaiting review.",
                badge: "Unverified Claim",
              },
              {
                lvl: 1,
                tier: "Source-Referenced",
                desc: "Contributor has attached at least one verifiable historical, textual, or published source.",
                badge: "Source Referenced (1)",
              },
              {
                lvl: 2,
                tier: "Community Corroborated",
                desc: "Verified members of the source community/tradition confirm the description matches living practice.",
                badge: "Community Corroborated",
              },
              {
                lvl: 3,
                tier: "Peer / Expert Endorsement",
                desc: "Accredited scholar, lineage pandit, or recognized practitioner has reviewed and signed off on accuracy.",
                badge: "Expert Reviewed",
              },
              {
                lvl: 4,
                tier: "Multi-Source Corroboration",
                desc: "Supported by ≥ 3 independent canonical or academic sources across diverse historical chronicles.",
                badge: "Canonical Tradition",
              },
              {
                lvl: 5,
                tier: "Institutional / Archive Benchmark",
                desc: "Certified by academic bodies, national archives, or recognized custodian institutions.",
                badge: "Archival Benchmark",
              },
            ].map((item) => (
              <div key={item.lvl} className="flex items-start gap-4 rounded-xl border border-border p-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-xs text-primary">
                  L{item.lvl}
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">{item.tier}</h4>
                    <span className="rounded bg-accent px-2 py-0.5 text-[10px] text-muted-foreground font-mono">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
