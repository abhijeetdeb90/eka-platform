// ==============================================================================
// EKA LIVING CULTURAL ATLAS — EDITORIAL STORY DRAWER / MODAL
// ==============================================================================
// Seamless transition from MAP -> STORY.
// Features hero photography, lineage keepers, living status, verified provenance,
// and contextual "Ask EKA about this place" interaction.
// ==============================================================================

import React from "react";
import { Link } from "@tanstack/react-router";
import {
  X,
  MapPin,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Users,
  Compass,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  type AtlasCulturalObject,
  ATLAS_CATEGORIES,
} from "@/lib/cultural-intelligence/cultural-atlas-data";

interface AtlasStoryDrawerProps {
  object: AtlasCulturalObject | null;
  isOpen: boolean;
  onClose: () => void;
  onAskEka?: (target: {
    title: string;
    location?: string;
    category?: string;
    initialQuestion?: string;
    preloadedSummary?: string;
  }) => void;
}

export function AtlasStoryDrawer({
  object,
  isOpen,
  onClose,
  onAskEka,
}: AtlasStoryDrawerProps) {
  if (!object) return null;

  const categoryMeta =
    ATLAS_CATEGORIES.find((c) => c.id === object.category) || ATLAS_CATEGORIES[0]!;

  const handleAskEkaClick = () => {
    if (onAskEka) {
      onAskEka({
        title: object.title,
        location: `${object.stateOrDistrict}, ${object.country}`,
        category: categoryMeta.label,
        initialQuestion: object.curiosityQuestion,
        preloadedSummary: object.storySummary,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl text-foreground max-h-[90vh] flex flex-col">
        {/* 1. Header Media Banner */}
        <div className="relative aspect-[16/9] w-full bg-muted/40 overflow-hidden shrink-0">
          <img
            src={object.heroImage}
            alt={object.title}
            className="w-full h-full object-cover object-center select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close story drawer"
            className="absolute top-4 right-4 size-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-colors border border-white/20"
          >
            <X className="size-4" />
          </button>

          {/* Category & Location Badges */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-white">
            <div className="flex items-center gap-2">
              <span
                style={{ backgroundColor: categoryMeta.accentColor }}
                className="px-2.5 py-1 rounded-full text-[10.5px] font-mono uppercase tracking-wider text-white font-semibold shadow-xs"
              >
                {categoryMeta.shortLabel}
              </span>
              <span className="flex items-center gap-1 text-xs text-white/90 font-medium bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                <MapPin className="size-3 text-terracotta" />
                <span>{object.stateOrDistrict}, {object.country}</span>
              </span>
            </div>

            {object.livingStatus.isActiveNow && (
              <span className="flex items-center gap-1.5 text-[10.5px] font-mono text-amber-200 bg-amber-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/30">
                <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Living Practice Active</span>
              </span>
            )}
          </div>
        </div>

        {/* 2. Scrollable Narrative Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Title & Headline Question */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground font-medium">
              {object.subTitle}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {object.title}
            </h2>
            <p className="font-serif text-base sm:text-lg font-medium text-terracotta leading-snug">
              “{object.curiosityQuestion}”
            </p>
          </div>

          {/* Story Narrative */}
          <div className="space-y-3 text-sm text-foreground/85 leading-relaxed font-light">
            <p className="text-base font-normal text-foreground leading-relaxed">
              {object.oneLiner}
            </p>
            <p>{object.storySummary}</p>
            <p className="pt-1 text-xs text-muted-foreground bg-accent/30 p-3.5 rounded-xl border border-border/60">
              <strong>Cultural Context:</strong> {object.culturalContext}
            </p>
          </div>

          {/* Lineage & Keepers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                <Users className="size-3.5 text-primary" />
                <span>Keepers & Lineage</span>
              </div>
              <p className="text-xs font-semibold text-foreground">{object.keeper.name}</p>
              <p className="text-[11px] text-muted-foreground">{object.keeper.role} · {object.keeper.community}</p>
            </div>

            <div className="p-3.5 rounded-2xl border border-border/70 bg-card/60 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                <Clock className="size-3.5 text-terracotta" />
                <span>Continuity & Season</span>
              </div>
              <p className="text-xs font-semibold text-foreground">{object.livingStatus.unbrokenYears}</p>
              <p className="text-[11px] text-muted-foreground">{object.livingStatus.activeSeasonOrTime}</p>
            </div>
          </div>

          {/* Provenance and Trust Strip */}
          <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <ShieldCheck className="size-4 text-forest shrink-0" />
              <span>Verified EKA Canon · {object.sourcesCount} Documented Sources</span>
            </div>
            <span className="font-mono text-[11px]">ID: {object.knowledgeObjectId}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {object.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10.5px] font-mono px-2 py-0.5">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* 3. Action Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={handleAskEkaClick}
              className="rounded-full text-xs gap-1.5 border-terracotta/40 hover:bg-terracotta/10 text-terracotta"
            >
              <Sparkles className="size-3.5" />
              <span>Ask EKA about this place</span>
            </Button>

            <Link
              to="/knowledge/$slug"
              params={{ slug: object.slug }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
            >
              <span>Explore Full Knowledge Object</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
