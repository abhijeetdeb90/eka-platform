import { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Check,
  Trash2,
  Edit3,
  Layers,
  Download,
  RotateCcw,
  PlusCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  type PictorialCard,
  type CardDimension,
  type EpistemicTier,
  addFounderCard,
  updateFounderCard,
  deleteFounderCard,
  resetFounderCardsToDefault,
} from "@/lib/founder-data";

interface FounderContentStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: PictorialCard[];
  onCardsUpdated: (updatedCards: PictorialCard[]) => void;
}

const PRESET_IMAGES = [
  { label: "Varanasi Ghats", url: "/places/varanasi.jpg" },
  { label: "Kyoto Bamboo & Temples", url: "/places/kyoto.jpg" },
  { label: "Jerusalem Ancient Stone", url: "/places/jerusalem.jpg" },
  { label: "Marrakesh Courtyard", url: "/places/marrakesh.jpg" },
  { label: "Monastery Corridor", url: "/content/monastery-corridor.jpg" },
  { label: "Reading Table & Archives", url: "/content/reading-table.jpg" },
  { label: "Ritual Brass Lamp", url: "/content/ritual-lamp.jpg" },
  { label: "Still Water at Dusk", url: "/content/still-water.jpg" },
  { label: "Communion Circle Overhead", url: "/brand/eka-circle-communion.jpg" },
  { label: "Golden Hour Gathering", url: "/brand/eka-banner-sunset.jpg" },
  { label: "AD Founder Portrait", url: "/brand/ad-founder.jpg" },
];

const DIMENSION_OPTIONS: CardDimension[] = [
  "Culture",
  "Tradition",
  "Local Knowledge",
  "Spirituality",
  "Communities",
  "Places",
  "Tourism",
  "Local Brands",
  "Creator Economy",
  "Verification",
  "Sacred Ecology",
  "Living Crafts",
  "Vernacular Dialects",
  "Calendar Rhythms",
  "Culinary Lineages",
  "Sonic Traditions",
  "Oral Epics",
  "Sacred Architecture",
  "Contemplative Science",
  "Intergenerational Sanghas",
];

const TIER_OPTIONS: EpistemicTier[] = [
  "Tier 1: Canonical Source",
  "Tier 2: Scholarly Commentary",
  "Tier 3: Lived Reflection",
  "Tier 4: Living Community Practice",
  "Tier 5: Bounded AI Synthesis",
];

export function FounderContentStudioModal({
  isOpen,
  onClose,
  cards,
  onCardsUpdated,
}: FounderContentStudioModalProps) {
  const [activeTab, setActiveTab] = useState<"create" | "manage">("create");
  const [reviewStep, setReviewStep] = useState<"draft" | "review" | "approved">("draft");

  // Form state
  const [title, setTitle] = useState("");
  const [dimension, setDimension] = useState<CardDimension>("Culture");
  const [explanation, setExplanation] = useState("");
  const [geoContext, setGeoContext] = useState("");
  const [community, setCommunity] = useState("");
  const [epistemicTier, setEpistemicTier] = useState<EpistemicTier>(
    "Tier 4: Living Community Practice",
  );
  const [sourceCitation, setSourceCitation] = useState("");
  const [image, setImage] = useState("/content/monastery-corridor.jpg");
  const [relatedKnowledge, setRelatedKnowledge] = useState("Lineage, Heritage, Oral Wisdom");
  const [isPinned, setIsPinned] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Edit target
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  // AI draft generator
  const handleGenerateAiDraft = () => {
    const drafts: Record<
      string,
      { title: string; exp: string; geo: string; comm: string; citation: string }
    > = {
      Culture: {
        title: "The Architecture of Shared Meals",
        exp: "In community kitchens like the Sikh Langar and temple Mahaprasad, eating together dissolves caste and social hierarchy into shared human presence.",
        geo: "Amritsar & Puri, India",
        comm: "Sikh Khalsa Guilds & Temple Kitchen Keepers",
        citation: "Sikh Rehat Maryada guidelines on Pangat and Langar hospitality.",
      },
      Tradition: {
        title: "The Unwritten Laws of the Sacred Grove",
        exp: "For over 800 years, no iron axe or modern weapon was permitted within village Deorais, ensuring untouched biological corridors for mountain aquifers.",
        geo: "Western Ghats, Maharashtra",
        comm: "Western Ghats Indigenous Forest Stewards",
        citation: "Ethnographic survey by Maharashtra Sacred Groves Committee.",
      },
      "Local Knowledge": {
        title: "Diagnosing Monsoons by Insect Rhythms",
        exp: "Before meteorological satellite models, farmers in the Deccan Plateau observed black ants moving eggs uphill as an accurate 48-hour torrential rain indicator.",
        geo: "Deccan Plateau, Karnataka",
        comm: "Deccan Dryland Farmer Cooperatives",
        citation: "Folkloric agricultural aphorisms documented in Dharwad agrarian records.",
      },
    };

    const draft = drafts[dimension] || drafts["Culture"]!;
    setTitle(draft.title);
    setExplanation(draft.exp);
    setGeoContext(draft.geo);
    setCommunity(draft.comm);
    setSourceCitation(draft.citation);
    setReviewStep("review");
    toast.success("AI draft generated. Please review and edit before approving.");
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !explanation.trim() || !community.trim()) {
      toast.error("Please fill in Title, Explanation, and Community.");
      return;
    }

    const tags = relatedKnowledge
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingCardId) {
      const updated = updateFounderCard(editingCardId, {
        title,
        dimension,
        explanation,
        geoContext,
        community,
        epistemicTier,
        sourceCitation,
        image,
        relatedKnowledge: tags,
        pinned: isPinned,
        featured: isFeatured,
        status: "published",
      });
      onCardsUpdated(updated);
      toast.success("Card updated and published.");
      setEditingCardId(null);
    } else {
      const created = addFounderCard({
        title,
        dimension,
        explanation,
        geoContext: geoContext || "Global Cultural Context",
        community,
        epistemicTier,
        sourceCitation: sourceCitation || "Verified via EKA Epistemic Review Board.",
        image,
        relatedKnowledge: tags.length > 0 ? tags : ["Cultural Context", "Lineage"],
        pinned: isPinned,
        featured: isFeatured,
        status: "published",
      });
      onCardsUpdated([created, ...cards]);
      toast.success("New cultural card approved and published to the feed!");
    }

    // Reset form
    setTitle("");
    setExplanation("");
    setGeoContext("");
    setCommunity("");
    setSourceCitation("");
    setRelatedKnowledge("Lineage, Heritage, Oral Wisdom");
    setReviewStep("draft");
    setActiveTab("manage");
  };

  const handleEditClick = (card: PictorialCard) => {
    setEditingCardId(card.id);
    setTitle(card.title);
    setDimension(card.dimension);
    setExplanation(card.explanation);
    setGeoContext(card.geoContext);
    setCommunity(card.community);
    setEpistemicTier(card.epistemicTier);
    setSourceCitation(card.sourceCitation || "");
    setImage(card.image);
    setRelatedKnowledge(card.relatedKnowledge.join(", "));
    setIsPinned(!!card.pinned);
    setIsFeatured(!!card.featured);
    setReviewStep("review");
    setActiveTab("create");
  };

  const handleDeleteClick = (id: string) => {
    if (confirm("Are you sure you want to remove this card from the live feed?")) {
      const updated = deleteFounderCard(id);
      onCardsUpdated(updated);
      toast.success("Card deleted.");
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset cards to default 20 launch cards? Any custom drafts will be cleared.")) {
      const res = resetFounderCardsToDefault();
      onCardsUpdated(res);
      toast.success("Reset to 20 verified launch cards.");
    }
  };

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cards, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `eka_cultural_cards_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Exported cards JSON.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border-border bg-card p-4 sm:p-8">
        <DialogHeader>
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-terracotta/40 bg-terracotta/5 text-terracotta text-xs uppercase tracking-wider"
              >
                Founder Studio
              </Badge>
              <span className="text-xs text-muted-foreground">Admin Content & Ontology Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleExportJson} className="h-8 text-xs">
                <Download className="mr-1 size-3.5" />
                <span>Export JSON</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetDefaults}
                className="h-8 text-xs text-muted-foreground"
              >
                <RotateCcw className="mr-1 size-3.5" />
                <span>Reset Defaults</span>
              </Button>
            </div>
          </div>
          <DialogTitle className="mt-2 font-display text-2xl sm:text-3xl text-foreground">
            AD × EKA Content Generation & Review Engine
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Enforce the strict EKA content principle:{" "}
            <strong>Generate → Review → Edit → Approve → Publish</strong>. No unverified synthetic
            cultural claims are published automatically.
          </DialogDescription>
        </DialogHeader>

        {/* Tab switch: Create vs Manage */}
        <div className="mt-4 flex border-b border-border/60 pb-2">
          <button
            onClick={() => {
              setActiveTab("create");
              if (!editingCardId) setEditingCardId(null);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-all ${
              activeTab === "create"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <PlusCircle className="size-4" />
            <span>{editingCardId ? "Edit Card" : "Generate & Author Card"}</span>
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-all ${
              activeTab === "manage"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="size-4" />
            <span>Manage All Live Cards ({cards.length})</span>
          </button>
        </div>

        {activeTab === "create" ? (
          <form onSubmit={handleSaveCard} className="mt-6 space-y-6">
            {/* Step Pipeline Indicator */}
            <div className="rounded-2xl border border-border/70 bg-sand/30 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Review Status:</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 font-medium ${
                    reviewStep === "approved"
                      ? "bg-forest/20 text-forest"
                      : reviewStep === "review"
                        ? "bg-saffron/30 text-amber-900"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {reviewStep.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateAiDraft}
                  className="h-8 text-xs border-primary/40 bg-primary-soft/40 text-primary"
                >
                  <Sparkles className="mr-1.5 size-3.5" />
                  <span>Generate Cultural Draft</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setReviewStep("approved")}
                  className="h-8 text-xs text-forest"
                >
                  <Check className="mr-1 size-3.5" />
                  <span>Mark Approved</span>
                </Button>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="card-title">Card Title / Proposition</Label>
                <Input
                  id="card-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. A Culture Is More Than a Festival"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="card-dimension">Cultural Dimension</Label>
                <select
                  id="card-dimension"
                  value={dimension}
                  onChange={(e) => setDimension(e.target.value as CardDimension)}
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  {DIMENSION_OPTIONS.map((dim) => (
                    <option key={dim} value={dim}>
                      {dim}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="card-tier">Epistemic Verification Level</Label>
                <select
                  id="card-tier"
                  value={epistemicTier}
                  onChange={(e) => setEpistemicTier(e.target.value as EpistemicTier)}
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                >
                  {TIER_OPTIONS.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="card-geo">Geographic / Regional Context</Label>
                <Input
                  id="card-geo"
                  value={geoContext}
                  onChange={(e) => setGeoContext(e.target.value)}
                  placeholder="e.g. Majuli, Assam & Kyoto, Japan"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="card-comm">Community / Lineage Custodian</Label>
                <Input
                  id="card-comm"
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  placeholder="e.g. Sattra Monastic Guilds"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="card-exp">Explanation / Narrative (1–3 Sentences)</Label>
                <Textarea
                  id="card-exp"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Documentary narrative describing the lived practice or empirical oral wisdom..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="card-citation">Source Citation & Provenance</Label>
                <Input
                  id="card-citation"
                  value={sourceCitation}
                  onChange={(e) => setSourceCitation(e.target.value)}
                  placeholder="e.g. Fieldwork recordings with village Vaidyas (2025-2026) / Purana reference"
                />
              </div>

              {/* Image Selector */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Featured Image (Select Preset or enter path)</Label>
                <div className="flex flex-wrap gap-2 pt-1 pb-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className={`rounded-lg px-2.5 py-1 text-xs border transition-all ${
                        image === preset.url
                          ? "border-primary bg-primary-soft/50 font-semibold text-primary"
                          : "border-border/70 bg-card text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <Input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/places/varanasi.jpg or custom URL"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="card-tags">Related Knowledge Graph Nodes (Comma Separated)</Label>
                <Input
                  id="card-tags"
                  value={relatedKnowledge}
                  onChange={(e) => setRelatedKnowledge(e.target.value)}
                  placeholder="e.g. Oral Memory, Sacred Rhythms, Anukirtana"
                />
              </div>

              <div className="flex items-center gap-6 sm:col-span-2 pt-1">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded border-border"
                  />
                  <span>Pin to top of feed</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-border"
                  />
                  <span>Mark as Featured Launch Story</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border/60 pt-5">
              {editingCardId && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditingCardId(null);
                    setTitle("");
                    setExplanation("");
                  }}
                >
                  Cancel Edit
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onClose}>
                Close Studio
              </Button>
              <Button type="submit">
                <Check className="mr-1.5 size-4" />
                <span>{editingCardId ? "Save Changes" : "Approve & Publish Card"}</span>
              </Button>
            </div>
          </form>
        ) : (
          /* Manage Tab */
          <div className="mt-6 space-y-4">
            <div className="text-xs text-muted-foreground">
              Total Live Cards: <strong>{cards.length}</strong>
            </div>

            <div className="space-y-3">
              {cards.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-3.5 transition-all hover:border-primary/40 hover:shadow-xs"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="size-14 rounded-xl object-cover border border-border/60 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-semibold text-terracotta">
                          {c.dimension}
                        </span>
                        {c.pinned && (
                          <span className="rounded bg-saffron/20 text-amber-900 px-1.5 py-0.2 text-[9px] font-bold">
                            PINNED
                          </span>
                        )}
                      </div>
                      <h4 className="font-display text-sm font-medium text-foreground truncate">
                        {c.title}
                      </h4>
                      <div className="text-xs text-muted-foreground truncate">
                        {c.community} · {c.geoContext}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(c)}
                      className="h-8 text-xs"
                    >
                      <Edit3 className="mr-1 size-3" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(c.id)}
                      className="h-8 text-xs text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
