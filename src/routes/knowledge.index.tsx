import React, { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Filter,
  Network,
  ShieldCheck,
  Sparkles,
  Compass,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getAllKnowledgeObjects,
  searchKnowledgeGraph,
} from "@/lib/knowledge/knowledge-graph";
import { knowledgeObjectToCard } from "@/lib/knowledge/card-generator";
import { EkaBaseCard } from "@/components/discovery/EkaBaseCard";
import type { EkaDiscoveryCard } from "@/lib/homepage-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/knowledge/")({
  component: KnowledgeDirectoryPage,
});

const TYPE_FILTERS = [
  { id: "all", label: "All Traditions" },
  { id: "festival", label: "Festivals" },
  { id: "craft", label: "Crafts & Metallurgy" },
  { id: "tradition", label: "Living Traditions" },
  { id: "place", label: "Sacred Geography" },
  { id: "community", label: "Indigenous Communities" },
  { id: "culture", label: "Riverine & Island Cultures" },
];

function KnowledgeDirectoryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [inspectedCard, setInspectedCard] = useState<EkaDiscoveryCard | null>(null);

  const allObjects = useMemo(() => getAllKnowledgeObjects(), []);

  const filteredObjects = useMemo(() => {
    let list = allObjects;

    if (searchQuery.trim()) {
      list = searchKnowledgeGraph(searchQuery);
    }

    if (selectedType !== "all") {
      list = list.filter((item) => item.type === selectedType);
    }

    return list;
  }, [allObjects, searchQuery, selectedType]);

  const cards = useMemo(() => {
    return filteredObjects.map(knowledgeObjectToCard);
  }, [filteredObjects]);

  const totalVariationsCount = useMemo(() => {
    return allObjects.reduce((acc, o) => acc + o.culturalVariations.length, 0);
  }, [allObjects]);

  const totalSourcesCount = useMemo(() => {
    return allObjects.reduce((acc, o) => acc + o.sourcePassport.totalSources, 0);
  }, [allObjects]);

  return (
    <div
      data-testid="eka-knowledge-directory-page"
      className="min-h-screen bg-background text-foreground"
    >
      {/* Top Bar */}
      <header className="border-b border-border/80 bg-background/90 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-primary">
                EKA
              </span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Cultural Knowledge Graph
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/admin/knowledge">
              <Button variant="outline" size="sm" className="rounded-full text-xs gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Admin Operations Center</span>
                <span className="sm:hidden">Admin</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Directory Hero */}
      <section className="border-b border-border/60 bg-sand/15 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge
            variant="outline"
            className="border-primary/40 text-primary text-xs font-mono uppercase tracking-wider mb-3"
          >
            The Trusted Intelligence Layer
          </Badge>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Cultural Knowledge Graph
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Discover living traditions, master crafts, and sacred places structured across 10 cultural
            dimensions, documented variations, and verified legal provenance.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-border/60 bg-card p-3.5 shadow-sm">
              <span className="block text-2xl font-bold text-foreground">
                {allObjects.length}
              </span>
              <span className="text-xs text-muted-foreground">Canonical Entities</span>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-3.5 shadow-sm">
              <span className="block text-2xl font-bold text-foreground">
                {totalVariationsCount}
              </span>
              <span className="text-xs text-muted-foreground">Documented Variations</span>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-3.5 shadow-sm">
              <span className="block text-2xl font-bold text-foreground">
                {totalSourcesCount}
              </span>
              <span className="text-xs text-muted-foreground">Verified Sources</span>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-3.5 shadow-sm">
              <span className="block text-2xl font-bold text-emerald-600">
                100%
              </span>
              <span className="text-xs text-muted-foreground">CC & Open Provenance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Directory Area */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Search & Filter Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by culture, craft, region, or variation..."
              className="rounded-full pl-10 pr-4 text-sm bg-card shadow-sm"
              data-testid="knowledge-search-input"
            />
          </div>

          <div className="flex overflow-x-auto pb-2 scrollbar-none gap-1.5">
            {TYPE_FILTERS.map((f) => (
              <Button
                key={f.id}
                variant={selectedType === f.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(f.id)}
                className={`rounded-full text-xs shrink-0 ${
                  selectedType === f.id ? "bg-primary text-primary-foreground" : "border-border/80"
                }`}
                data-testid={`filter-${f.id}`}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong>{cards.length}</strong> cultural knowledge entities
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-primary hover:underline font-medium"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Cards Grid */}
        <div
          data-testid="knowledge-card-grid"
          className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cards.map((card) => (
            <EkaBaseCard
              key={card.id}
              card={card}
              onInspect={(c) => {
                navigate({ to: c.linkTo });
              }}
            />
          ))}
        </div>

        {cards.length === 0 && (
          <div className="py-16 text-center rounded-3xl border border-dashed border-border bg-sand/10">
            <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="mt-3 font-serif text-lg font-bold text-foreground">
              No matching cultural traditions found
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your search terms or filter selections.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
              }}
              className="mt-4 rounded-full"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </main>

      {/* Inspect Modal (Radix Dialog safe wrapper) */}
      <Dialog open={!!inspectedCard} onOpenChange={(open) => !open && setInspectedCard(null)}>
        <DialogContent className="max-w-lg rounded-3xl p-6">
          {inspectedCard && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {inspectedCard.categoryBadge}
                  </Badge>
                  {inspectedCard.verified && (
                    <span className="text-xs text-emerald-600 font-medium">✓ Verified</span>
                  )}
                </div>
                <DialogTitle className="font-serif text-xl text-foreground mt-2">
                  {inspectedCard.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {inspectedCard.sourceCitation}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-3">
                <img
                  src={inspectedCard.image}
                  alt={inspectedCard.title}
                  className="rounded-2xl h-48 w-full object-cover"
                />
                <p className="text-sm text-foreground leading-relaxed">
                  {inspectedCard.fullExplanation}
                </p>
                <div className="pt-2 flex justify-end">
                  <Link to={inspectedCard.linkTo}>
                    <Button className="rounded-full gap-1.5 text-xs">
                      View Full Knowledge Object <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
