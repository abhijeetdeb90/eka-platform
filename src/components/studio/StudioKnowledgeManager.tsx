// ==============================================================================
// EKA STUDIO — CANONICAL KNOWLEDGE OBJECT & VERIFICATION MODULE (KNOW-002)
// ==============================================================================

import { useState } from "react";
import {
  BookOpen,
  Plus,
  ShieldCheck,
  History,
  FileCheck2,
  AlertTriangle,
  RotateCcw,
  Search,
  ExternalLink,
  Check,
  Sparkles,
  Layers,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  archiveKnowledgeObject,
  fetchKnowledgeObjects,
  fetchObjectVersions,
  restoreObjectVersion,
  saveKnowledgeObject,
  SEED_KNOWLEDGE_OBJECTS,
  updateVerificationStatus,
} from "@/lib/studio/knowledge-service";
import type {
  CanonicalKnowledgeObject,
  KnowledgeObjectVersion,
  PrimaryReference,
  StudioRole,
  VerificationStatus,
} from "@/lib/studio/types";

interface StudioKnowledgeManagerProps {
  currentRole: StudioRole;
  selectedId?: string;
}

export function StudioKnowledgeManager({ currentRole, selectedId }: StudioKnowledgeManagerProps) {
  const [objects, setObjects] = useState<CanonicalKnowledgeObject[]>(SEED_KNOWLEDGE_OBJECTS);
  const [activeObjectId, setActiveObjectId] = useState<string>(selectedId || objects[0]?.id || "");
  const [activeTab, setActiveTab] = useState<
    "metadata" | "provenance" | "verification" | "interpretations" | "versions"
  >("metadata");

  const [versions, setVersions] = useState<KnowledgeObjectVersion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Verification transition form
  const [nextVerStatus, setNextVerStatus] = useState<VerificationStatus>("Expert Verified");
  const [verDecision, setVerDecision] = useState<"approved" | "rejected" | "disputed">("approved");
  const [verNotes, setVerNotes] = useState("");
  const [verEvidence, setVerEvidence] = useState("");

  const activeObj = objects.find((o) => o.id === activeObjectId) || objects[0];

  const refreshList = async () => {
    const data = await fetchKnowledgeObjects({
      type: typeFilter,
      verification_status: statusFilter,
      query: searchQuery,
    });
    setObjects(data);
  };

  const handleSelectObject = async (id: string) => {
    setActiveObjectId(id);
    const v = await fetchObjectVersions(id);
    setVersions(v);
  };

  const handleCreateNew = async () => {
    const newObj: CanonicalKnowledgeObject = {
      id: "",
      title: "Untitled Knowledge Object",
      slug: `ko-${Date.now().toString(36)}`,
      summary: "",
      description: "",
      type: "Practice",
      category: "Contemplative Tradition",
      tradition: "Sanatana Dharma",
      religion_worldview: "Advaita Vedanta",
      community: "Global",
      geography: { cultural_locus: "South Asia" },
      language: { vernacular: [] },
      time_period: { continuity: "Active Living Practice" },
      sources: [],
      primary_references: [],
      evidence: [],
      citations: [],
      verification_status: "Draft",
      verification_records: [],
      community_validation: { count: 0, status: "pending", confirmations: [] },
      expert_validation: { status: "pending", reviews: [] },
      interpretation: [],
      regional_variations: [],
      confidence: 0.85,
      provenance: {
        source_type: "canonical_scripture",
        confidence_score: 0.85,
        is_ai_generated: false,
      },
      related_objects: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "draft",
      is_archived: false,
    };

    const saved = await saveKnowledgeObject(newObj, currentRole, "Initialized new canonical object");
    await refreshList();
    setActiveObjectId(saved.id);
    toast.success("New canonical Knowledge Object created.");
  };

  const handleSaveActive = async (updated: CanonicalKnowledgeObject) => {
    const saved = await saveKnowledgeObject(updated, currentRole, "Metadata edited in Studio");
    await refreshList();
    const v = await fetchObjectVersions(saved.id);
    setVersions(v);
    toast.success("Knowledge Object saved and versioned.");
  };

  const handleExecuteVerification = async () => {
    if (!verNotes.trim()) {
      toast.error("Auditable decision notes are mandatory.");
      return;
    }
    const updated = await updateVerificationStatus(
      activeObj.id,
      nextVerStatus,
      verDecision,
      verNotes,
      currentRole,
      verEvidence,
    );
    await refreshList();
    setVerNotes("");
    setVerEvidence("");
    toast.success(`Verification status updated to "${nextVerStatus}".`);
  };

  const handleRestore = async (versionNumber: number) => {
    await restoreObjectVersion(activeObj.id, versionNumber, currentRole);
    await refreshList();
    const v = await fetchObjectVersions(activeObj.id);
    setVersions(v);
    toast.success(`Successfully rolled back to version ${versionNumber}`);
  };

  const filteredObjects = objects.filter((o) => {
    if (typeFilter !== "all" && o.type !== typeFilter) return false;
    if (statusFilter !== "all" && o.verification_status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.title.toLowerCase().includes(q) ||
        o.summary.toLowerCase().includes(q) ||
        o.tradition.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-normal tracking-tight">Canonical Knowledge Objects</h2>
          <p className="text-xs text-muted-foreground">
            Strict 5-tier epistemic schema (KNOW-002), multi-source primary citations, version rollback, and 8-state verification.
          </p>
        </div>
        <Button size="sm" onClick={handleCreateNew}>
          <Plus className="mr-1.5 size-4" /> New Knowledge Object
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 4 cols: Directory List */}
        <div className="space-y-3 lg:col-span-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search traditions, texts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-input bg-background px-2 text-xs"
            >
              <option value="all">Status</option>
              <option value="Draft">Draft</option>
              <option value="Under Review">Under Review</option>
              <option value="Expert Verified">Expert Verified</option>
              <option value="Published">Published</option>
              <option value="Disputed">Disputed</option>
            </select>
          </div>

          <div className="max-h-[640px] overflow-y-auto space-y-2 pr-1">
            {filteredObjects.map((ko) => {
              const isSelected = ko.id === activeObj?.id;

              return (
                <div
                  key={ko.id}
                  onClick={() => handleSelectObject(ko.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-calm"
                      : "border-border bg-card hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="font-semibold uppercase tracking-wider text-primary">
                      {ko.type}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.2 font-medium ${
                        ko.verification_status === "Published" ||
                        ko.verification_status === "Expert Verified"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {ko.verification_status}
                    </span>
                  </div>
                  <h4 className="mt-1 font-display text-sm font-medium">{ko.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{ko.summary}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                    <span>{ko.tradition}</span>
                    <span>Confidence: {Math.round(ko.confidence * 100)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 cols: Detailed Canonical Inspector & Tabs */}
        <div className="lg:col-span-8">
          {activeObj ? (
            <div className="rounded-2xl border border-border bg-card shadow-calm overflow-hidden">
              {/* Object Header Bar */}
              <div className="border-b border-border p-6 space-y-3 bg-muted/20">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {activeObj.type}
                    </span>
                    <span className="text-xs text-muted-foreground">· {activeObj.tradition}</span>
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs font-medium">
                      Status: {activeObj.verification_status}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">ID: {activeObj.id}</div>
                </div>
                <h3 className="font-display text-2xl font-normal">{activeObj.title}</h3>
                <p className="text-xs text-muted-foreground">{activeObj.summary}</p>

                {/* Sub-Tabs Navigation */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
                  {[
                    { id: "metadata", label: "Canonical Schema" },
                    { id: "provenance", label: "Sources & Provenance" },
                    { id: "verification", label: "8-State Verification" },
                    { id: "interpretations", label: "Schools & Interpretations" },
                    { id: "versions", label: "Version History & Diff" },
                  ].map((tab) => (
                    <Button
                      key={tab.id}
                      size="sm"
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className="text-xs h-7 px-3"
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tab Contents */}
              <div className="p-6">
                {activeTab === "metadata" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Title</label>
                        <Input
                          value={activeObj.title}
                          onChange={(e) =>
                            handleSaveActive({ ...activeObj, title: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Slug</label>
                        <Input
                          value={activeObj.slug}
                          onChange={(e) =>
                            handleSaveActive({ ...activeObj, slug: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Summary</label>
                      <Textarea
                        value={activeObj.summary}
                        onChange={(e) =>
                          handleSaveActive({ ...activeObj, summary: e.target.value })
                        }
                        rows={2}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Description</label>
                      <Textarea
                        value={activeObj.description}
                        onChange={(e) =>
                          handleSaveActive({ ...activeObj, description: e.target.value })
                        }
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Category</label>
                        <Input
                          value={activeObj.category}
                          onChange={(e) =>
                            handleSaveActive({ ...activeObj, category: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Tradition</label>
                        <Input
                          value={activeObj.tradition}
                          onChange={(e) =>
                            handleSaveActive({ ...activeObj, tradition: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Worldview</label>
                        <Input
                          value={activeObj.religion_worldview}
                          onChange={(e) =>
                            handleSaveActive({ ...activeObj, religion_worldview: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Community</label>
                        <Input
                          value={activeObj.community}
                          onChange={(e) =>
                            handleSaveActive({ ...activeObj, community: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Historical Era</label>
                        <Input
                          value={activeObj.time_period.historical_era || ""}
                          onChange={(e) =>
                            handleSaveActive({
                              ...activeObj,
                              time_period: { ...activeObj.time_period, historical_era: e.target.value },
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Liturgical Language</label>
                        <Input
                          value={activeObj.language.liturgical || ""}
                          onChange={(e) =>
                            handleSaveActive({
                              ...activeObj,
                              language: { ...activeObj.language, liturgical: e.target.value },
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "provenance" && (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                        Non-Synthetic Truth Principle
                      </span>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        AI-generated text is barred from masquerading as primary scriptural provenance.
                        All citations require identifiable canonical volume, chapter, and verse references.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Primary Scriptural References ({activeObj.primary_references.length})
                      </h4>
                      <div className="space-y-2">
                        {activeObj.primary_references.map((ref, idx) => (
                          <div key={idx} className="rounded-xl border border-border p-3 space-y-1">
                            <div className="flex items-center justify-between text-xs font-medium">
                              <span>{ref.title}</span>
                              <span className="text-muted-foreground">{ref.year}</span>
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">{ref.citation}</div>
                            {ref.access_uri && (
                              <div className="text-[11px] text-primary underline">{ref.access_uri}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Citations & Textual Inscriptions ({activeObj.citations.length})
                      </h4>
                      <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
                        {activeObj.citations.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Confidence Score</label>
                        <div className="flex items-center gap-3 mt-1">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={activeObj.confidence}
                            onChange={(e) =>
                              handleSaveActive({ ...activeObj, confidence: parseFloat(e.target.value) })
                            }
                            className="w-full"
                          />
                          <span className="text-xs font-bold text-primary">
                            {Math.round(activeObj.confidence * 100)}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-xl border border-border p-3">
                        <span className="text-xs font-medium">AI Generated Flag</span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {activeObj.provenance.is_ai_generated ? "Flagged Synthetic" : "Human Authenticated"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "verification" && (
                  <div className="space-y-6">
                    {/* Verification Transition Form */}
                    <div className="rounded-2xl border border-border bg-accent/20 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display text-base font-medium">Execute Verification Decision</h4>
                        <span className="text-xs text-muted-foreground">Authorized: {currentRole}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">
                            Target Verification State
                          </label>
                          <select
                            value={nextVerStatus}
                            onChange={(e) => setNextVerStatus(e.target.value as VerificationStatus)}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                          >
                            <option value="Draft">Draft</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Community Verified">Community Verified</option>
                            <option value="Expert Verified">Expert Verified</option>
                            <option value="Source Verified">Source Verified</option>
                            <option value="Published">Published</option>
                            <option value="Disputed">Disputed</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Decision</label>
                          <select
                            value={verDecision}
                            onChange={(e) =>
                              setVerDecision(e.target.value as "approved" | "rejected" | "disputed")
                            }
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                          >
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="disputed">Disputed</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          Auditable Decision Notes (Mandatory)
                        </label>
                        <Textarea
                          value={verNotes}
                          onChange={(e) => setVerNotes(e.target.value)}
                          placeholder="Provide rationale, verified source citations, or reasons for dispute..."
                          rows={2}
                          className="mt-1 text-xs"
                        />
                      </div>

                      <Button size="sm" onClick={handleExecuteVerification}>
                        <ShieldCheck className="mr-1.5 size-4" /> Commit Verification Decision
                      </Button>
                    </div>

                    {/* Historical Verification Records */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Auditable Verification History ({activeObj.verification_records.length})
                      </h4>
                      {activeObj.verification_records.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No historical changes recorded yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {activeObj.verification_records.map((vr) => (
                            <div key={vr.id} className="rounded-xl border border-border p-3 text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-primary">{vr.who} ({vr.role})</span>
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(vr.when).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-muted-foreground">
                                Changed state to <strong>{vr.new_status}</strong> ({vr.decision})
                              </p>
                              {vr.notes && <p className="italic text-foreground">"{vr.notes}"</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "interpretations" && (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                      Multiple hermeneutic schools are preserved without erasing distinct traditions.
                    </p>
                    {activeObj.interpretation.map((item, idx) => (
                      <div key={idx} className="rounded-xl border border-border p-4 space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-primary">
                          <span>{item.school}</span>
                          {item.scholar && <span className="text-muted-foreground">{item.scholar}</span>}
                        </div>
                        <p className="text-xs text-foreground leading-relaxed">{item.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "versions" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Version History Snapshots
                      </h4>
                      <span className="text-xs text-muted-foreground">{versions.length} versions stored</span>
                    </div>

                    <div className="space-y-3">
                      {versions.map((ver) => (
                        <div key={ver.id} className="rounded-xl border border-border p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-display font-medium text-sm">
                              Version {ver.version_number} — {ver.diff_summary}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(ver.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Changed by: <strong>{ver.changed_by}</strong> · Reason: {ver.change_reason}
                          </p>
                          <div className="pt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRestore(ver.version_number)}
                              className="text-xs h-7"
                            >
                              <RotateCcw className="mr-1.5 size-3" /> Restore Version {ver.version_number}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
