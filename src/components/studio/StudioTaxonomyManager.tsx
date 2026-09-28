// ==============================================================================
// EKA STUDIO — HIERARCHICAL TAXONOMY MANAGER MODULE (KNOW-003)
// ==============================================================================

import { useState } from "react";
import {
  FolderTree,
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
  MapPin,
  Compass,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  buildTaxonomyTree,
  deleteTaxonomyNode,
  fetchTaxonomyTree,
  saveTaxonomyNode,
  SEED_TAXONOMY_NODES,
} from "@/lib/studio/taxonomy-service";
import type { StudioRole, TaxonomyNode } from "@/lib/studio/types";

interface StudioTaxonomyManagerProps {
  currentRole: StudioRole;
}

export function StudioTaxonomyManager({ currentRole }: StudioTaxonomyManagerProps) {
  const [flatNodes, setFlatNodes] = useState<TaxonomyNode[]>(SEED_TAXONOMY_NODES);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(["tax_culture", "tax_south_asia", "tax_india", "tax_traditions", "tax_intangible"]),
  );
  const [selectedNode, setSelectedNode] = useState<TaxonomyNode | null>(null);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildKind, setNewChildKind] = useState<TaxonomyNode["kind"]>("tradition");

  const tree = buildTaxonomyTree(flatNodes);

  const toggleExpand = (id: string) => {
    const next = new Set(expandedNodes);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedNodes(next);
  };

  const handleSaveNode = async () => {
    if (!selectedNode || !selectedNode.name) {
      toast.error("Node name is required.");
      return;
    }
    const saved = await saveTaxonomyNode(selectedNode, currentRole);
    setFlatNodes((prev) => prev.map((n) => (n.id === saved.id ? saved : n)));
    setSelectedNode(saved);
    toast.success("Taxonomy node updated.");
  };

  const handleAddChild = async (parentId: string | null) => {
    if (!newChildName.trim()) {
      toast.error("Please enter a name for the new node.");
      return;
    }

    const newNode = await saveTaxonomyNode(
      {
        parent_id: parentId,
        name: newChildName.trim(),
        kind: newChildKind,
        description: `Taxonomy branch under ${selectedNode?.name || "root"}`,
        meta: {},
      },
      currentRole,
    );

    setFlatNodes((prev) => [...prev, newNode]);
    if (parentId) {
      setExpandedNodes((prev) => new Set([...prev, parentId]));
    }
    setNewChildName("");
    setIsAddingChild(false);
    setSelectedNode(newNode);
    toast.success(`Created taxonomy node: ${newNode.name}`);
  };

  const handleDeleteNode = async (id: string) => {
    await deleteTaxonomyNode(id, currentRole);
    setFlatNodes((prev) => prev.filter((n) => n.id !== id && n.parent_id !== id));
    if (selectedNode?.id === id) setSelectedNode(null);
    toast.warning("Taxonomy node and descendants removed.");
  };

  const renderTreeNodes = (nodes: TaxonomyNode[], level = 0) => {
    return (
      <div className="space-y-1">
        {nodes.map((node) => {
          const hasChildren = node.children && node.children.length > 0;
          const isExpanded = expandedNodes.has(node.id);
          const isSelected = selectedNode?.id === node.id;

          return (
            <div key={node.id} className="space-y-1">
              <div
                onClick={() => setSelectedNode(node)}
                className={`group flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-accent/50 text-foreground"
                }`}
                style={{ paddingLeft: `${level * 18 + 10}px` }}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(node.id);
                      }}
                      className="size-4 shrink-0 hover:opacity-80"
                    >
                      {isExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                    </button>
                  ) : (
                    <span className="size-4 shrink-0" />
                  )}
                  <span className="truncate">{node.name}</span>
                  <span
                    className={`ml-1 rounded px-1.5 py-0.2 text-[9px] uppercase ${
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-accent text-muted-foreground"
                    }`}
                  >
                    {node.kind}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node);
                      setIsAddingChild(true);
                    }}
                    className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                    title="Add sub-branch"
                  >
                    <Plus className="size-3" />
                  </button>
                </div>
              </div>

              {hasChildren && isExpanded && renderTreeNodes(node.children!, level + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-normal tracking-tight">Hierarchical Taxonomy Engine</h2>
          <p className="text-xs text-muted-foreground">
            Dynamic, non-hardcoded taxonomy organizing cultures, traditions, living customs, and sacred geography.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setSelectedNode(null);
            setIsAddingChild(true);
          }}
        >
          <Plus className="mr-1.5 size-4" /> Add Root Branch
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left 6 cols: Visual Tree Viewer */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-calm space-y-4 lg:col-span-6">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Taxonomy Hierarchy
            </span>
            <span className="text-xs text-muted-foreground">{flatNodes.length} Total Nodes</span>
          </div>

          <div className="max-h-[560px] overflow-y-auto pr-1">
            {renderTreeNodes(tree)}
          </div>
        </div>

        {/* Right 6 cols: Node Inspector & Creator */}
        <div className="space-y-6 lg:col-span-6">
          {isAddingChild ? (
            <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-calm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-display text-base font-medium">
                  {selectedNode ? `Add Child under "${selectedNode.name}"` : "Add Root Taxonomy Branch"}
                </h3>
                <Button size="sm" variant="ghost" onClick={() => setIsAddingChild(false)}>
                  Cancel
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Branch Name</label>
                  <Input
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="e.g. Maharashtra, Folk, Sacred Music"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Taxonomy Kind</label>
                  <select
                    value={newChildKind}
                    onChange={(e) => setNewChildKind(e.target.value as TaxonomyNode["kind"])}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="culture">Culture</option>
                    <option value="tradition">Tradition</option>
                    <option value="geography">Geography</option>
                    <option value="heritage">Heritage</option>
                    <option value="practice">Practice</option>
                    <option value="lifestyle">Lifestyle</option>
                  </select>
                </div>

                <Button size="sm" onClick={() => handleAddChild(selectedNode ? selectedNode.id : null)}>
                  Create Node
                </Button>
              </div>
            </div>
          ) : null}

          {selectedNode ? (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-display text-lg font-medium">{selectedNode.name}</h3>
                  <p className="text-xs text-muted-foreground">Node ID: {selectedNode.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddingChild(true)}
                  >
                    <Plus className="mr-1.5 size-3.5" /> Add Sub-Node
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteNode(selectedNode.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Name</label>
                  <Input
                    value={selectedNode.name}
                    onChange={(e) => setSelectedNode({ ...selectedNode, name: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">URL Slug</label>
                  <Input
                    value={selectedNode.slug}
                    onChange={(e) => setSelectedNode({ ...selectedNode, slug: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Category Kind</label>
                  <select
                    value={selectedNode.kind}
                    onChange={(e) =>
                      setSelectedNode({
                        ...selectedNode,
                        kind: e.target.value as TaxonomyNode["kind"],
                      })
                    }
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="culture">Culture</option>
                    <option value="tradition">Tradition</option>
                    <option value="geography">Geography</option>
                    <option value="heritage">Heritage</option>
                    <option value="practice">Practice</option>
                    <option value="lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Description & Provenance</label>
                  <Textarea
                    value={selectedNode.description || ""}
                    onChange={(e) =>
                      setSelectedNode({ ...selectedNode, description: e.target.value })
                    }
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div className="pt-2">
                  <Button size="sm" onClick={handleSaveNode}>
                    Save Node Changes
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border text-xs text-muted-foreground">
              Select a taxonomy node in the tree to inspect or edit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
