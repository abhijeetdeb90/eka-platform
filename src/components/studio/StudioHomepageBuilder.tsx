// ==============================================================================
// EKA STUDIO — VISUAL DATA-DRIVEN HOMEPAGE BUILDER MODULE
// ==============================================================================

import { useState } from "react";
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Calendar,
  Sparkles,
  LayoutTemplate,
  Grid,
  GalleryHorizontal,
  Columns,
  List,
  CreditCard,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  deleteHomepageSection,
  duplicateHomepageSection,
  fetchHomepageSections,
  HOMEPAGE_DATA_SOURCES,
  HOMEPAGE_LAYOUTS,
  reorderHomepageSections,
  resolveSectionCards,
  saveHomepageSection,
  SEED_HOMEPAGE_SECTIONS,
  toggleSectionVisibility,
} from "@/lib/studio/homepage-service";
import { SEED_KNOWLEDGE_OBJECTS } from "@/lib/studio/knowledge-service";
import type { HomepageLayout, HomepageSection, StudioRole } from "@/lib/studio/types";

interface StudioHomepageBuilderProps {
  currentRole: StudioRole;
}

export function StudioHomepageBuilder({ currentRole }: StudioHomepageBuilderProps) {
  const [sections, setSections] = useState<HomepageSection[]>(SEED_HOMEPAGE_SECTIONS);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(sections[0]?.id || null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];

  const refreshSections = async () => {
    const data = await fetchHomepageSections();
    setSections(data);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    if (!moved) return;
    newSections.splice(targetIndex, 0, moved);

    const reorderedIds = newSections.map((s) => s.id);
    const updated = await reorderHomepageSections(reorderedIds, currentRole);
    setSections(updated);
    toast.success("Section layout reordered.");
  };

  const handleCreateSection = async () => {
    const newSec = await saveHomepageSection(
      {
        title: "New Discovery Section",
        subtitle: "Curated cultural knowledge and living practices",
        layout: "grid",
        data_source: "featured_knowledge",
        config: { limit: 3, cta_text: "Explore", cta_link: "/app/explore" },
        selected_ids: [],
        sort_order: sections.length + 1,
        is_visible: true,
      },
      currentRole,
    );
    await refreshSections();
    setActiveSectionId(newSec.id);
    toast.success("New section added to homepage.");
  };

  const handleDuplicate = async (id: string) => {
    const dup = await duplicateHomepageSection(id, currentRole);
    await refreshSections();
    setActiveSectionId(dup.id);
    toast.success(`Duplicated: ${dup.title}`);
  };

  const handleDelete = async (id: string) => {
    if (sections.length <= 1) {
      toast.error("Homepage requires at least one active section.");
      return;
    }
    await deleteHomepageSection(id, currentRole);
    await refreshSections();
    setActiveSectionId(sections.filter((s) => s.id !== id)[0]?.id || null);
    toast.warning("Homepage section deleted.");
  };

  const handleToggleVisible = async (id: string, visible: boolean) => {
    await toggleSectionVisibility(id, visible, currentRole);
    await refreshSections();
    toast.info(`Section is now ${visible ? "visible" : "hidden"}`);
  };

  const handleSaveActive = async (updated: HomepageSection) => {
    await saveHomepageSection(updated, currentRole);
    await refreshSections();
    toast.success("Section configuration saved.");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-normal tracking-tight">Homepage Manager</h2>
          <p className="text-xs text-muted-foreground">
            Configure, reorder, and bind dynamic cultural data sources to the consumer homepage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isPreviewMode ? "default" : "outline"}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="mr-1.5 size-4" /> {isPreviewMode ? "Exit Preview" : "Live Consumer Preview"}
          </Button>
          <Button size="sm" onClick={handleCreateSection}>
            <Plus className="mr-1.5 size-4" /> Add Section
          </Button>
        </div>
      </div>

      {isPreviewMode ? (
        /* Dynamic Consumer Homepage Preview Canvas */
        <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-12 max-w-5xl mx-auto">
          <div className="border-b border-border/80 pb-4 text-center">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Live Dynamic Consumer Canvas Preview
            </span>
            <p className="mt-1 text-xs text-muted-foreground">
              This layout is rendered dynamically from Studio without modifying frontend code.
            </p>
          </div>

          {sections
            .filter((s) => s.is_visible)
            .map((section) => {
              const cards = resolveSectionCards(section);

              return (
                <section key={section.id} className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      {section.config.badge && (
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                          {section.config.badge}
                        </span>
                      )}
                      <h3 className="font-display text-2xl font-normal">{section.title}</h3>
                      {section.subtitle && (
                        <p className="text-xs text-muted-foreground max-w-xl">{section.subtitle}</p>
                      )}
                    </div>
                    {section.config.cta_text && (
                      <span className="text-xs font-medium text-primary hover:underline cursor-pointer">
                        {section.config.cta_text} →
                      </span>
                    )}
                  </div>

                  {section.layout === "hero" ? (
                    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-amber-500/10 via-card to-background p-8">
                      <div className="max-w-xl space-y-3">
                        <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs text-primary font-medium">
                          Canonical Living Heritage
                        </span>
                        <h2 className="font-display text-3xl font-medium tracking-tight">
                          {cards[0]?.title || section.title}
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {cards[0]?.summary || section.subtitle}
                        </p>
                        <div className="pt-2">
                          <Button size="sm">{section.config.cta_text || "Explore Tradition"}</Button>
                        </div>
                      </div>
                    </div>
                  ) : section.layout === "grid" ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {cards.map((c) => (
                        <div
                          key={c.id}
                          className="rounded-2xl border border-border bg-card p-5 space-y-2.5 shadow-calm"
                        >
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>{c.type}</span>
                            <span className="text-primary font-medium">{c.verification_status}</span>
                          </div>
                          <h4 className="font-display text-lg font-medium">{c.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{c.summary}</p>
                          <div className="text-[11px] text-muted-foreground pt-1">
                            Tradition: <strong>{c.tradition}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Carousel or Rail view */
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {cards.map((c) => (
                        <div
                          key={c.id}
                          className="min-w-[280px] rounded-2xl border border-border bg-card p-4 space-y-2 shadow-calm"
                        >
                          <span className="text-[10px] text-muted-foreground uppercase">{c.type}</span>
                          <h4 className="font-display text-base font-medium">{c.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{c.summary}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
        </div>
      ) : (
        /* Management & Visual Builder Two-Column Grid */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Reorderable Sections List (5 cols) */}
          <div className="space-y-3 lg:col-span-5">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-1">
              Active Sections Order ({sections.length})
            </div>

            <div className="space-y-2">
              {sections.map((section, index) => {
                const isSelected = section.id === activeSection?.id;

                return (
                  <div
                    key={section.id}
                    onClick={() => setActiveSectionId(section.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-calm"
                        : "border-border bg-card hover:border-border/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-muted-foreground">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-medium">{section.title}</h4>
                          <p className="text-[11px] text-muted-foreground">
                            {section.layout} · {section.data_source}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={index === 0}
                          onClick={() => handleMove(index, "up")}
                          className="size-7 p-0"
                          title="Move up"
                        >
                          <ArrowUp className="size-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={index === sections.length - 1}
                          onClick={() => handleMove(index, "down")}
                          className="size-7 p-0"
                          title="Move down"
                        >
                          <ArrowDown className="size-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleVisible(section.id, !section.is_visible)}
                          className="size-7 p-0 text-muted-foreground"
                          title={section.is_visible ? "Hide" : "Show"}
                        >
                          {section.is_visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Section Detail Inspector (7 cols) */}
          <div className="lg:col-span-7">
            {activeSection ? (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="font-display text-lg font-medium">Inspect Section Configuration</h3>
                    <p className="text-xs text-muted-foreground">ID: {activeSection.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDuplicate(activeSection.id)}
                    >
                      <Copy className="mr-1.5 size-3.5" /> Duplicate
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(activeSection.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Section Title</label>
                    <Input
                      value={activeSection.title}
                      onChange={(e) => {
                        setActiveSectionId(activeSection.id);
                        handleSaveActive({ ...activeSection, title: e.target.value });
                      }}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Subtitle / Explainer</label>
                    <Input
                      value={activeSection.subtitle || ""}
                      onChange={(e) =>
                        handleSaveActive({ ...activeSection, subtitle: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Visual Layout</label>
                      <select
                        value={activeSection.layout}
                        onChange={(e) =>
                          handleSaveActive({
                            ...activeSection,
                            layout: e.target.value as HomepageLayout,
                          })
                        }
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {HOMEPAGE_LAYOUTS.map((l) => (
                          <option key={l.value} value={l.value}>
                            {l.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Data Source</label>
                      <select
                        value={activeSection.data_source}
                        onChange={(e) =>
                          handleSaveActive({
                            ...activeSection,
                            data_source: e.target.value as HomepageSection["data_source"],
                          })
                        }
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {HOMEPAGE_DATA_SOURCES.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">CTA Button Label</label>
                      <Input
                        value={activeSection.config.cta_text || ""}
                        onChange={(e) =>
                          handleSaveActive({
                            ...activeSection,
                            config: { ...activeSection.config, cta_text: e.target.value },
                          })
                        }
                        className="mt-1"
                        placeholder="e.g. Explore"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">CTA Destination Link</label>
                      <Input
                        value={activeSection.config.cta_link || ""}
                        onChange={(e) =>
                          handleSaveActive({
                            ...activeSection,
                            config: { ...activeSection.config, cta_link: e.target.value },
                          })
                        }
                        className="mt-1"
                        placeholder="e.g. /app/explore"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-border p-4">
                    <div>
                      <span className="text-sm font-medium">Visible to Consumers</span>
                      <p className="text-xs text-muted-foreground">
                        Toggle to immediately publish or withdraw this section from the live frontend.
                      </p>
                    </div>
                    <Switch
                      checked={activeSection.is_visible}
                      onCheckedChange={(checked) => handleToggleVisible(activeSection.id, checked)}
                    />
                  </div>

                  {/* Curated Knowledge Selection */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Attached Knowledge Objects ({activeSection.selected_ids.length})
                    </label>
                    <div className="max-h-48 overflow-y-auto space-y-1.5 rounded-xl border border-border p-3">
                      {SEED_KNOWLEDGE_OBJECTS.map((ko) => {
                        const isIncluded = activeSection.selected_ids.includes(ko.id);
                        return (
                          <label
                            key={ko.id}
                            className="flex items-center justify-between text-xs p-1.5 hover:bg-accent/40 rounded cursor-pointer"
                          >
                            <span>
                              {ko.title} ({ko.type})
                            </span>
                            <input
                              type="checkbox"
                              checked={isIncluded}
                              onChange={(e) => {
                                const nextIds = e.target.checked
                                  ? [...activeSection.selected_ids, ko.id]
                                  : activeSection.selected_ids.filter((i) => i !== ko.id);
                                handleSaveActive({ ...activeSection, selected_ids: nextIds });
                              }}
                              className="size-4"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border text-xs text-muted-foreground">
                Select a section to inspect
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
