import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  Share2,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Search,
  Filter,
  Check,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { type PictorialCard, type CardDimension } from "@/lib/founder-data";

interface PictorialFeedProps {
  cards: PictorialCard[];
  onOpenStudio?: () => void;
}

export function PictorialFeed({ cards, onOpenStudio }: PictorialFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDimension, setSelectedDimension] = useState<string>("All");
  const [savedCardIds, setSavedCardIds] = useState<Set<string>>(new Set());
  const [selectedCardForModal, setSelectedCardForModal] = useState<PictorialCard | null>(null);
  const [discussCard, setDiscussCard] = useState<PictorialCard | null>(null);
  const [discussionText, setDiscussionText] = useState("");

  // Unique dimensions list for filter tabs
  const dimensions = useMemo(() => {
    const list = Array.from(new Set(cards.map((c) => c.dimension)));
    return ["All", ...list];
  }, [cards]);

  // Filtered cards
  const filteredCards = useMemo(() => {
    return cards.filter((c) => {
      const matchesDim = selectedDimension === "All" || c.dimension === selectedDimension;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesDim;
      const matchesSearch =
        c.title.toLowerCase().includes(q) ||
        c.explanation.toLowerCase().includes(q) ||
        c.community.toLowerCase().includes(q) ||
        c.geoContext.toLowerCase().includes(q) ||
        c.relatedKnowledge.some((k) => k.toLowerCase().includes(q));
      return matchesDim && matchesSearch;
    });
  }, [cards, selectedDimension, searchQuery]);

  const handleSaveToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info("Card removed from your saved sanctuary.");
      } else {
        next.add(id);
        toast.success("Saved to your personal contemplation sanctuary.");
      }
      return next;
    });
  };

  const handleShare = async (card: PictorialCard, e: React.MouseEvent) => {
    e.stopPropagation();
    const url =
      typeof window !== "undefined" ? `${window.location.origin}/founder/ad#${card.id}` : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: `EKA — ${card.title}`,
          text: `${card.explanation} (${card.community})`,
          url,
        });
      } catch {
        // Ignored
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${card.title} — ${card.explanation} | EKA: ${url}`);
      toast.success("Card link copied to clipboard.");
    }
  };

  const handleDiscussSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionText.trim()) return;
    toast.success("Your reflection has been submitted to the community Sangha for review.");
    setDiscussCard(null);
    setDiscussionText("");
  };

  return (
    <section
      id="world-through-people"
      className="py-20 lg:py-28 border-b border-border/70 bg-background"
    >
      <div className="container-eka">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-1 text-xs tracking-[0.2em] text-terracotta uppercase">
              <span className="size-1.5 rounded-full bg-terracotta" />
              <span>Living Cultural Ingest</span>
            </div>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl text-foreground">
              EKA — The World Through Its People
            </h2>
            <p className="mt-3 text-base text-muted-foreground font-light max-w-2xl">
              Authentic documentary cards capturing cultures, living traditions, unwritten local
              knowledge, and communal memory without generic synthetic caricatures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenStudio && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenStudio}
                className="rounded-xl border-border/80 bg-card text-xs min-h-[44px]"
              >
                <Sparkles className="mr-1.5 size-3.5 text-terracotta" />
                <span>Add / Edit Cards</span>
              </Button>
            )}
            <Badge
              variant="outline"
              className="border-forest/40 bg-forest/5 text-forest text-xs py-1.5 px-3 min-h-[32px] flex items-center"
            >
              {cards.length} Launch Cards Verified
            </Badge>
          </div>
        </div>

        {/* Search & Dimension Filter Bar */}
        <div className="mt-10 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across traditions, communities, places, or knowledge tags..."
                className="pl-10 rounded-xl border-border/80 bg-card text-sm"
              />
            </div>

            <div className="text-xs text-muted-foreground">
              Showing <strong className="text-foreground">{filteredCards.length}</strong> of{" "}
              {cards.length} cards
            </div>
          </div>

          {/* Horizontal Scrolling Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
            {dimensions.map((dim) => (
              <button
                key={dim}
                data-testid={`pill-${dim}`}
                onClick={() => setSelectedDimension(dim)}
                className={`whitespace-nowrap rounded-full px-4 py-2 min-h-[44px] inline-flex items-center justify-center text-xs font-medium transition-all ${
                  selectedDimension === dim
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border/70 bg-card/70 text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                {dim}
              </button>
            ))}
          </div>
        </div>

        {/* Card Grid */}
        {filteredCards.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-border/80 p-12 text-center">
            <Layers className="mx-auto size-10 text-muted-foreground/60" />
            <h3 className="mt-3 font-display text-lg text-foreground">No matching cards found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search terms or selecting a different cultural dimension.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedDimension("All");
              }}
              className="mt-4 rounded-xl"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCards.map((card) => {
              const isSaved = savedCardIds.has(card.id);
              return (
                <div
                  key={card.id}
                  id={card.id}
                  data-testid={`card-${card.id}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedCardForModal(card)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedCardForModal(card)}
                  className="group relative flex flex-col cursor-pointer overflow-hidden rounded-3xl border border-border/80 bg-card shadow-calm transition-all duration-500 hover:border-primary/50 hover:shadow-lift"
                >
                  {/* Image Container with Badges */}
                  <div className="relative aspect-video w-full overflow-hidden bg-sand/30">
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-background/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-foreground backdrop-blur-md border border-border/60">
                        {card.dimension}
                      </span>
                      {card.pinned && (
                        <span className="rounded-full bg-saffron text-black px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                          Pinned
                        </span>
                      )}
                    </div>

                    {/* Bottom overlay in image: Geographic & Epistemic context */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/90">
                      <span className="flex items-center gap-1 font-light truncate max-w-[65%]">
                        <MapPin className="size-3 shrink-0 text-saffron" />
                        <span className="truncate">{card.geoContext}</span>
                      </span>
                      <span className="rounded-md bg-black/60 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-xs border border-white/10">
                        {card.epistemicTier.split(":")[0]}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="text-[11px] font-medium text-terracotta tracking-wider uppercase">
                      Community: {card.community}
                    </div>

                    <h3 className="mt-2 font-display text-xl font-medium text-foreground transition-colors group-hover:text-primary">
                      {card.title}
                    </h3>

                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground font-light line-clamp-3">
                      {card.explanation}
                    </p>

                    {/* Related Knowledge Graph Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {card.relatedKnowledge.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg bg-sand/50 px-2.5 py-0.5 text-[11px] font-medium text-foreground/80 border border-border/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-border/60 text-xs text-muted-foreground">
                      <span className="font-light text-[11px]">{card.date}</span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleSaveToggle(card.id, e)}
                          title={isSaved ? "Saved" : "Save card"}
                          aria-label={isSaved ? "Saved card" : "Save card"}
                          className={`rounded-lg p-2.5 min-h-[44px] min-w-[44px] inline-flex items-center justify-center transition-colors hover:bg-muted ${
                            isSaved ? "text-primary bg-primary-soft/50" : "text-muted-foreground"
                          }`}
                        >
                          <Bookmark className={`size-4 ${isSaved ? "fill-current" : ""}`} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDiscussCard(card);
                          }}
                          title="Discuss in Sangha"
                          aria-label="Discuss in Sangha"
                          className="rounded-lg p-2.5 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <MessageCircle className="size-4" />
                        </button>
                        <button
                          onClick={(e) => handleShare(card, e)}
                          title="Share card"
                          aria-label="Share card"
                          className="rounded-lg p-2.5 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Share2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Detail Modal */}
      <Dialog
        open={!!selectedCardForModal}
        onOpenChange={(open) => !open && setSelectedCardForModal(null)}
      >
        {selectedCardForModal && (
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-border bg-card p-4 sm:p-8">
            <DialogHeader>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs uppercase tracking-wider">
                    {selectedCardForModal.dimension}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {selectedCardForModal.epistemicTier}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-3 text-terracotta" />
                  <span>{selectedCardForModal.geoContext}</span>
                </div>
              </div>
              <DialogTitle className="mt-3 font-display text-2xl sm:text-3xl text-foreground">
                {selectedCardForModal.title}
              </DialogTitle>
              <DialogDescription className="text-xs uppercase tracking-wider text-terracotta font-medium mt-1">
                Lineage / Community Custodian: {selectedCardForModal.community}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-5">
              <div className="overflow-hidden rounded-2xl border border-border/70 max-h-72 w-full">
                <img
                  src={selectedCardForModal.image}
                  alt={selectedCardForModal.title}
                  className="size-full object-cover"
                />
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Documentary Narrative & Context
                </h4>
                <p className="mt-2 text-base leading-relaxed text-foreground font-light">
                  {selectedCardForModal.explanation}
                </p>
              </div>

              {selectedCardForModal.sourceCitation && (
                <div className="rounded-xl border border-border/70 bg-sand/30 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-forest">
                    <ShieldCheck className="size-4" />
                    <span>Verified Source & Provenance Record</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground font-light leading-relaxed">
                    {selectedCardForModal.sourceCitation}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Linked Knowledge Graph Nodes
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCardForModal.relatedKnowledge.map((node) => (
                    <span
                      key={node}
                      className="rounded-lg border border-border/80 bg-card px-3 py-1 text-xs font-medium text-foreground"
                    >
                      {node}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border/60 pt-4">
                <div className="text-xs text-muted-foreground">
                  Published under the EKA Epistemic Stewardship Charter
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Button
                    variant="outline"
                    data-testid="close-card-modal-btn"
                    onClick={() => setSelectedCardForModal(null)}
                    className="min-h-[44px]"
                  >
                    Close Details
                  </Button>
                  <Button asChild className="min-h-[44px]">
                    <Link to="/join">Explore Full Graph</Link>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Discuss in Sangha Dialog */}
      <Dialog open={!!discussCard} onOpenChange={(open) => !open && setDiscussCard(null)}>
        {discussCard && (
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border-border bg-card p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                Contemplative Inquiry: {discussCard.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Join the respectful inquiry with the {discussCard.community} circle. No flame wars,
                no dogma.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleDiscussSubmit} className="mt-4 space-y-4">
              <div className="rounded-xl border border-border/60 bg-sand/20 p-3 text-xs text-muted-foreground">
                "{discussCard.explanation}"
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Your Reflection or Clarifying Inquiry
                </label>
                <Textarea
                  value={discussionText}
                  onChange={(e) => setDiscussionText(e.target.value)}
                  placeholder="Share how this practice is observed in your region or ask a respectful question..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDiscussCard(null)}
                  className="min-h-[44px]"
                >
                  Cancel
                </Button>
                <Button type="submit" className="min-h-[44px]">
                  Submit Inquiry
                </Button>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
