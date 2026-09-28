import React from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, MapPin, Sparkles, ArrowRight, BookOpen, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { EkaDiscoveryCard } from "@/lib/homepage-data";

interface DeepKnowledgeModalProps {
  card: EkaDiscoveryCard | null;
  onClose: () => void;
}

export function DeepKnowledgeModal({ card, onClose }: DeepKnowledgeModalProps) {
  return (
    <Dialog open={!!card} onOpenChange={(open) => !open && onClose()}>
      {card && (
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-border bg-card p-5 sm:p-8">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs uppercase tracking-wider">
                {card.categoryBadge}
              </Badge>
              {card.verified && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-forest">
                  <ShieldCheck className="size-3.5" />
                  <span>Epistemic Source Verified</span>
                </span>
              )}
            </div>

            {card.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3 text-terracotta" />
                <span>{card.location}</span>
              </div>
            )}
          </div>

          <DialogTitle className="mt-3 font-display text-2xl sm:text-3xl text-foreground">
            {card.title}
          </DialogTitle>

          {card.community && (
            <DialogDescription className="text-xs uppercase tracking-wider text-terracotta font-medium mt-1">
              Lineage / Community Custodian: {card.community}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="mt-4 space-y-5">
          {/* Main Visual */}
          <div className="overflow-hidden rounded-2xl border border-border/70 max-h-72 w-full">
            <img src={card.image} alt={card.title} className="size-full object-cover" />
          </div>

          {/* Premise & Full Narrative */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Core Epistemic Premise
            </h4>
            <p className="mt-1.5 font-display text-base sm:text-lg font-normal text-foreground">
              "{card.oneLiner}"
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground font-light">
              {card.fullExplanation}
            </p>
          </div>

          {/* Verification Record */}
          {card.sourceCitation && (
            <div className="rounded-xl border border-border/70 bg-sand/30 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-forest">
                <ShieldCheck className="size-4" />
                <span>Source Provenance & Community Verification</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground font-light leading-relaxed">
                {card.sourceCitation}
              </p>
            </div>
          )}

          {/* Linked Knowledge Graph Nodes */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Linked Human Context Graph Nodes
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {card.knowledgeTags.map((node) => (
                <span
                  key={node}
                  className="rounded-lg border border-border/80 bg-sand/30 px-3 py-1 text-xs font-medium text-foreground"
                >
                  {node}
                </span>
              ))}
            </div>
          </div>

          {/* Progressive Disclosure Path */}
          <div className="rounded-2xl border border-border/60 bg-card p-3.5 text-xs text-muted-foreground">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">
              Deep Knowledge Exploration Path:
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-foreground">
              <span className="rounded bg-sand/50 px-2 py-0.5">Discover</span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded bg-sand/50 px-2 py-0.5">Card</span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded bg-sand/50 px-2 py-0.5">Story</span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded bg-sand/50 px-2 py-0.5">Knowledge</span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded bg-primary text-primary-foreground px-2 py-0.5">
                Deep Knowledge Graph
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-border/60 pt-4">
            <div className="text-xs text-muted-foreground">
              Published under the EKA Epistemic Stewardship Charter
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button
                variant="outline"
                data-testid="close-deep-knowledge-modal"
                onClick={onClose}
                className="min-h-[44px]"
              >
                Close Details
              </Button>
              <Button asChild className="min-h-[44px]">
                <Link to={card.linkTo} onClick={onClose}>
                  <span>Explore Full Story</span>
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
      )}
    </Dialog>
  );
}
