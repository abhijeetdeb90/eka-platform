// ==============================================================================
// EKA STUDIO — FIRST-CLASS KNOWLEDGE GRAPH MODULE (KNOW-004)
// ==============================================================================

import { useState, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Network,
  Plus,
  Trash2,
  Edit2,
  Search,
  ShieldAlert,
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  convertToGraphFlow,
  deleteRelationship,
  fetchRelationships,
  GRAPH_PREDICATES,
  saveRelationship,
  SEED_RELATIONSHIPS,
} from "@/lib/studio/graph-service";
import type { GraphPredicate, KnowledgeRelationship, StudioRole } from "@/lib/studio/types";

interface StudioKnowledgeGraphProps {
  currentRole: StudioRole;
}

export function StudioKnowledgeGraph({ currentRole }: StudioKnowledgeGraphProps) {
  const [relationships, setRelationships] = useState<KnowledgeRelationship[]>(SEED_RELATIONSHIPS);
  const [selectedRel, setSelectedRel] = useState<KnowledgeRelationship | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeView, setActiveView] = useState<"visual" | "table">("visual");

  const [filterPredicate, setFilterPredicate] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // New relationship state
  const [fromTitle, setFromTitle] = useState("");
  const [fromType, setFromType] = useState("PERSON");
  const [predicate, setPredicate] = useState<GraphPredicate>("ASSOCIATED_WITH");
  const [toTitle, setToTitle] = useState("");
  const [toType, setToType] = useState("TRADITION");
  const [confidence, setConfidence] = useState(0.95);
  const [provNotes, setProvNotes] = useState("");

  const refreshList = async () => {
    const data = await fetchRelationships({
      predicate: filterPredicate,
      query: searchQuery,
    });
    setRelationships(data);
  };

  const handleCreate = async () => {
    if (!fromTitle.trim() || !toTitle.trim()) {
      toast.error("Source and Target entity titles are required.");
      return;
    }

    const saved = await saveRelationship(
      {
        from_id: fromTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
        from_type: fromType,
        from_title: fromTitle.trim(),
        predicate,
        to_id: toTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
        to_type: toType,
        to_title: toTitle.trim(),
        confidence,
        provenance: { source: provNotes.trim() },
        notes: provNotes.trim(),
      },
      currentRole,
    );

    await refreshList();
    setIsCreating(false);
    setFromTitle("");
    setToTitle("");
    setProvNotes("");
    toast.success("First-class relationship registered in graph.");
  };

  const handleDelete = async (id: string) => {
    await deleteRelationship(id, currentRole);
    await refreshList();
    if (selectedRel?.id === id) setSelectedRel(null);
    toast.warning("Knowledge graph relationship deleted.");
  };

  const filteredRelationships = useMemo(() => {
    return relationships.filter((r) => {
      if (filterPredicate !== "all" && r.predicate !== filterPredicate) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          r.from_title?.toLowerCase().includes(q) ||
          r.to_title?.toLowerCase().includes(q) ||
          r.predicate.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [relationships, filterPredicate, searchQuery]);

  const flowGraph = useMemo(() => {
    return convertToGraphFlow(filteredRelationships);
  }, [filteredRelationships]);

  const [nodes, , onNodesChange] = useNodesState(flowGraph.nodes);
  const [edges, , onEdgesChange] = useEdgesState(flowGraph.edges);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-normal tracking-tight">
            First-Class Knowledge Graph (KNOW-004)
          </h2>
          <p className="text-xs text-muted-foreground">
            Relationships are first-class entities with directional semantic predicates, confidence scores, and auditable provenance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-border bg-card p-0.5 flex text-xs">
            <button
              type="button"
              onClick={() => setActiveView("visual")}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeView === "visual" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Visual Graph
            </button>
            <button
              type="button"
              onClick={() => setActiveView("table")}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeView === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Relationship Matrix
            </button>
          </div>
          <Button size="sm" onClick={() => setIsCreating(true)}>
            <Plus className="mr-1.5 size-4" /> Add Relationship
          </Button>
        </div>
      </div>

      {/* Creation Modal / Banner */}
      {isCreating && (
        <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-calm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-display text-base font-medium">Create First-Class Semantic Edge</h3>
            <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* From Node */}
            <div className="space-y-2 rounded-xl border border-border p-4 bg-accent/10">
              <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                Source Entity
              </span>
              <div>
                <label className="text-xs text-muted-foreground">Entity Name / Title</label>
                <Input
                  value={fromTitle}
                  onChange={(e) => setFromTitle(e.target.value)}
                  placeholder="e.g. Sage Vishwamitra"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Entity Class</label>
                <select
                  value={fromType}
                  onChange={(e) => setFromType(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  <option value="PERSON">PERSON</option>
                  <option value="TRADITION">TRADITION</option>
                  <option value="FESTIVAL">FESTIVAL</option>
                  <option value="COMMUNITY">COMMUNITY</option>
                  <option value="PLACE">PLACE</option>
                  <option value="BUSINESS">BUSINESS</option>
                  <option value="CREATOR">CREATOR</option>
                  <option value="SOURCE">SOURCE</option>
                </select>
              </div>
            </div>

            {/* Predicate */}
            <div className="space-y-2 rounded-xl border border-primary/20 p-4 bg-primary/5">
              <span className="text-[10px] font-semibold uppercase text-primary">
                Directional Predicate
              </span>
              <div>
                <label className="text-xs text-muted-foreground">Predicate Relationship</label>
                <select
                  value={predicate}
                  onChange={(e) => setPredicate(e.target.value as GraphPredicate)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold text-primary"
                >
                  {GRAPH_PREDICATES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label} ({p.value})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Confidence ({Math.round(confidence * 100)}%)</label>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.01"
                  value={confidence}
                  onChange={(e) => setConfidence(parseFloat(e.target.value))}
                  className="w-full mt-2"
                />
              </div>
            </div>

            {/* To Node */}
            <div className="space-y-2 rounded-xl border border-border p-4 bg-accent/10">
              <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                Target Entity
              </span>
              <div>
                <label className="text-xs text-muted-foreground">Entity Name / Title</label>
                <Input
                  value={toTitle}
                  onChange={(e) => setToTitle(e.target.value)}
                  placeholder="e.g. Evening Sandhya"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Entity Class</label>
                <select
                  value={toType}
                  onChange={(e) => setToType(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  <option value="TRADITION">TRADITION</option>
                  <option value="PLACE">PLACE</option>
                  <option value="GEOGRAPHY">GEOGRAPHY</option>
                  <option value="PILGRIMAGE">PILGRIMAGE</option>
                  <option value="KNOWLEDGE">KNOWLEDGE</option>
                  <option value="COMMUNITY">COMMUNITY</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Provenance & Textual Citation</label>
            <Textarea
              value={provNotes}
              onChange={(e) => setProvNotes(e.target.value)}
              placeholder="Cite canonical scripture, historical chronicle, or living lineage..."
              rows={2}
              className="mt-1 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreate}>
              Confirm & Connect
            </Button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search nodes, entities, or predicates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
        <select
          value={filterPredicate}
          onChange={(e) => setFilterPredicate(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-xs"
        >
          <option value="all">All Predicates</option>
          {GRAPH_PREDICATES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {activeView === "visual" ? (
        /* Visual Graph Canvas using @xyflow/react */
        <div className="relative h-[620px] rounded-2xl border border-border bg-card shadow-calm overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
          >
            <Background gap={16} size={1} />
            <Controls />
            <MiniMap
              nodeStrokeColor="#78716c"
              nodeColor="#e7e5e4"
              className="rounded-xl border border-border"
            />
          </ReactFlow>

          {/* Legend Overlay */}
          <div className="absolute bottom-4 left-4 rounded-xl border border-border/80 bg-background/90 p-3 backdrop-blur text-[11px] space-y-1 shadow-calm">
            <div className="font-semibold text-muted-foreground uppercase tracking-wider text-[9px]">
              Entity Classes
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-orange-500" /> PERSON / CREATOR
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-purple-500" /> TRADITION
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" /> PLACE / GEO
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-pink-500" /> FESTIVAL
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-yellow-500" /> SOURCE
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-cyan-500" /> BUSINESS
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Relationship Matrix Table */
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-calm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3.5">Source Entity</th>
                <th className="p-3.5">Predicate</th>
                <th className="p-3.5">Target Entity</th>
                <th className="p-3.5">Confidence</th>
                <th className="p-3.5">Provenance Source</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredRelationships.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-accent/20">
                  <td className="p-3.5">
                    <div className="font-medium text-foreground">{r.from_title}</div>
                    <span className="rounded bg-accent px-1.5 py-0.2 text-[9px] uppercase text-muted-foreground">
                      {r.from_type}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {r.predicate}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-foreground">{r.to_title}</div>
                    <span className="rounded bg-accent px-1.5 py-0.2 text-[9px] uppercase text-muted-foreground">
                      {r.to_type}
                    </span>
                  </td>
                  <td className="p-3.5 text-xs font-mono font-medium text-muted-foreground">
                    {Math.round(r.confidence * 100)}%
                  </td>
                  <td className="p-3.5 text-xs text-muted-foreground max-w-xs truncate">
                    {r.provenance.source || r.notes || "Recorded"}
                  </td>
                  <td className="p-3.5 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(r.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
