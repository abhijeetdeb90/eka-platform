// ==============================================================================
// EKA STUDIO — DISCOVERY, SEARCH & NAVIGATION ENGINE
// ==============================================================================

import { useState } from "react";
import {
  Search,
  Compass,
  Filter,
  Navigation,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  searchStudioEntities,
  type SearchFilterCriteria,
  type UnifiedSearchResult,
} from "@/lib/studio/search-service";
import type { NavigationMenu, StudioRole } from "@/lib/studio/types";

interface StudioDiscoverySearchProps {
  currentRole: StudioRole;
  onSelectEntity?: (type: string, id: string) => void;
}

export function StudioDiscoverySearch({ currentRole, onSelectEntity }: StudioDiscoverySearchProps) {
  const [activeTab, setActiveTab] = useState<"search" | "navigation">("search");
  const [query, setQuery] = useState("");
  const [isSemantic, setIsSemantic] = useState(false);
  const [contentType, setContentType] = useState("all");
  const [tradition, setTradition] = useState("all");
  const [verStatus, setVerStatus] = useState("all");

  const [navigationMenu, setNavigationMenu] = useState<NavigationMenu>({
    id: "nav_main_header",
    location: "header",
    title: "Main Platform Header Navigation",
    items: [
      { id: "nav_1", label: "Discover", url: "/app/explore" },
      { id: "nav_2", label: "Wisdom Graph", url: "/app/wisdom" },
      { id: "nav_3", label: "Places", url: "/app/junction" },
      { id: "nav_4", label: "Sanghas", url: "/app/sanghas" },
      { id: "nav_5", label: "Practice", url: "/app/practice" },
      { id: "nav_6", label: "Market", url: "/app/market" },
    ],
    is_active: true,
    updated_at: new Date().toISOString(),
  });

  const criteria: SearchFilterCriteria = {
    query,
    content_type: contentType,
    tradition,
    verification_status: verStatus,
    is_semantic: isSemantic,
  };

  const results = searchStudioEntities(criteria);

  const handleSaveNavigation = () => {
    toast.success("Platform header navigation saved and pushed to edge.");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-normal tracking-tight">Discovery & Navigation Control</h2>
          <p className="text-xs text-muted-foreground">
            Centralized hybrid search infrastructure (lexical & vector embeddings) and dynamic menu routing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={activeTab === "search" ? "default" : "outline"}
            onClick={() => setActiveTab("search")}
          >
            <Search className="mr-1.5 size-3.5" /> Centralized Search
          </Button>
          <Button
            size="sm"
            variant={activeTab === "navigation" ? "default" : "outline"}
            onClick={() => setActiveTab("navigation")}
          >
            <Navigation className="mr-1.5 size-3.5" /> Navigation Menus
          </Button>
        </div>
      </div>

      {activeTab === "search" ? (
        <div className="space-y-5">
          {/* Main Search Bar */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 size-5 text-muted-foreground" />
              <Input
                placeholder="Search across Knowledge Objects, Articles, Media, Places, and Taxonomy..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-11 h-12 text-sm"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Entity:</span>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                >
                  <option value="all">All Entities</option>
                  <option value="knowledge_object">Knowledge Objects</option>
                  <option value="content">Articles & Content</option>
                  <option value="media">Media Archive</option>
                  <option value="taxonomy">Taxonomy Nodes</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Tradition:</span>
                <select
                  value={tradition}
                  onChange={(e) => setTradition(e.target.value)}
                  className="rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                >
                  <option value="all">All Traditions</option>
                  <option value="Sanatana Dharma / Vedic">Sanatana Dharma / Vedic</option>
                  <option value="Chishti Sufism">Chishti Sufism</option>
                  <option value="Theravada / Mahayana / Vajrayana">Buddhism</option>
                  <option value="Folk Vedic / Regional Dharma">Folk Traditions</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Trust Tier:</span>
                <select
                  value={verStatus}
                  onChange={(e) => setVerStatus(e.target.value)}
                  className="rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                >
                  <option value="all">All Verification Tiers</option>
                  <option value="Published">Published Canon</option>
                  <option value="Expert Verified">Expert Verified</option>
                  <option value="Community Verified">Community Verified</option>
                  <option value="Source Verified">Source Verified</option>
                </select>
              </div>

              <div className="ml-auto flex items-center gap-2 text-xs font-medium">
                <span className={isSemantic ? "text-primary font-semibold" : "text-muted-foreground"}>
                  Semantic Vector Embedding
                </span>
                <input
                  type="checkbox"
                  checked={isSemantic}
                  onChange={(e) => setIsSemantic(e.target.checked)}
                  className="size-4"
                />
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>{results.length} Search Matches found</span>
              <span>Sorted by Epistemic Match Score</span>
            </div>

            {results.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                No matching entities found for this query criteria.
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((res) => (
                  <div
                    key={`${res.entity_type}_${res.id}`}
                    className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-calm sm:flex-row sm:items-center"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                          {res.entity_type.replace(/_/g, " ")}
                        </span>
                        {res.verification_status && (
                          <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] text-primary">
                            {res.verification_status}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">· Score: {res.match_score}</span>
                      </div>
                      <h4 className="font-display text-base font-medium">{res.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{res.snippet || res.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {res.tradition && (
                        <span className="text-xs text-muted-foreground hidden md:inline">
                          {res.tradition}
                        </span>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (onSelectEntity) onSelectEntity(res.entity_type, res.id);
                          toast.info(`Inspecting ${res.title}`);
                        }}
                      >
                        Inspect Entity <ArrowRight className="ml-1 size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Navigation Builder View */
        <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="font-display text-lg font-medium">Header Navigation Manager</h3>
              <p className="text-xs text-muted-foreground">
                Control the top header bar links visible across all consumer pages without editing source code.
              </p>
            </div>
            <Button size="sm" onClick={handleSaveNavigation}>
              Save Navigation Menu
            </Button>
          </div>

          <div className="space-y-3">
            {navigationMenu.items.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-muted-foreground">
                  {idx + 1}
                </span>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Input
                    value={item.label}
                    onChange={(e) => {
                      const next = [...navigationMenu.items];
                      next[idx] = { ...item, label: e.target.value };
                      setNavigationMenu({ ...navigationMenu, items: next });
                    }}
                    placeholder="Link Label"
                    className="text-xs"
                  />
                  <Input
                    value={item.url}
                    onChange={(e) => {
                      const next = [...navigationMenu.items];
                      next[idx] = { ...item, url: e.target.value };
                      setNavigationMenu({ ...navigationMenu, items: next });
                    }}
                    placeholder="Destination Route"
                    className="text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const newItem = {
                id: `nav_${Date.now()}`,
                label: "New Nav Item",
                url: "/app/explore",
              };
              setNavigationMenu({
                ...navigationMenu,
                items: [...navigationMenu.items, newItem],
              });
            }}
          >
            Add Menu Item
          </Button>
        </div>
      )}
    </div>
  );
}
