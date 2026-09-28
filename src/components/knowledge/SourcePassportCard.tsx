import React, { useState } from "react";
import { ShieldCheck, ExternalLink, BookOpen, Landmark, Users, FileText, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SourcePassport, SourcePassportItem } from "@/lib/knowledge/knowledge-object";

interface SourcePassportCardProps {
  passport: SourcePassport;
  entityName: string;
  className?: string;
}

export function SourcePassportCard({
  passport,
  entityName,
  className = "",
}: SourcePassportCardProps) {
  const getTierIcon = (type: SourcePassportItem["type"]) => {
    switch (type) {
      case "scripture":
      case "archive":
        return <BookOpen className="h-4 w-4 text-amber-600" />;
      case "institutional_dossier":
        return <Landmark className="h-4 w-4 text-emerald-600" />;
      case "community_oral":
        return <Users className="h-4 w-4 text-primary" />;
      default:
        return <FileText className="h-4 w-4 text-blue-600" />;
    }
  };

  const isStrong = passport.evidenceStrength === "Strong";

  return (
    <Dialog>
      <div
        data-testid="eka-source-passport"
        className={`rounded-2xl border border-primary/20 bg-card p-5 shadow-calm backdrop-blur-sm transition-all hover:border-primary/40 ${className}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif text-base font-semibold text-foreground">
                  Source Passport
                </h4>
                <Badge
                  variant={isStrong ? "default" : "secondary"}
                  className={`text-xs ${
                    isStrong
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-amber-600 hover:bg-amber-700 text-white"
                  }`}
                >
                  {passport.evidenceStrength} Evidence
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Corroborated across {passport.totalSources} verified sources with legal provenance
              </p>
            </div>
          </div>

          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-primary/30 text-xs font-medium hover:bg-primary/5 cursor-pointer"
              data-testid="view-sources-btn"
            >
              View Sources ({passport.totalSources})
            </Button>
          </DialogTrigger>
        </div>

        {/* Tier Badges Breakdown */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-xl bg-sand/40 p-2.5 text-center">
            <span className="block text-lg font-bold text-foreground">
              {passport.breakdown.primary}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              Primary / Archives
            </span>
          </div>
          <div className="rounded-xl bg-sand/40 p-2.5 text-center">
            <span className="block text-lg font-bold text-foreground">
              {passport.breakdown.institutional}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              Institutional / UNESCO
            </span>
          </div>
          <div className="rounded-xl bg-sand/40 p-2.5 text-center">
            <span className="block text-lg font-bold text-foreground">
              {passport.breakdown.reference}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              Open Reference (CC)
            </span>
          </div>
          <div className="rounded-xl bg-sand/40 p-2.5 text-center">
            <span className="block text-lg font-bold text-foreground">
              {passport.breakdown.community}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              Community Oral
            </span>
          </div>
        </div>

        {/* Sources Modal */}
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <DialogTitle className="font-serif text-xl sm:text-2xl text-foreground">
                Source Passport: {entityName}
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground">
              Every factual assertion, variation, and image in EKA is bounded by verifiable
              provenance, open licensing, or community elder consensus.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="rounded-xl bg-emerald-500/10 p-3.5 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Unattributed Scraping Guarantee:</strong> Content is synthesized from
                licensed datasets (Wikidata CC0, Wikimedia Commons, UNESCO dossiers, GI registries,
                and registered community elders) with attribution.
              </span>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Documented Sources & Citations
              </h5>
              {passport.sourcesList.map((source, index) => (
                <div
                  key={source.id || index}
                  className="rounded-xl border border-border/80 bg-background/80 p-3.5 transition-colors hover:border-primary/40"
                  data-testid={`source-item-${source.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0 rounded-lg bg-sand/50 p-1.5">
                        {getTierIcon(source.type)}
                      </div>
                      <div>
                        <h6 className="text-sm font-semibold text-foreground">
                          {source.title}
                        </h6>
                        <p className="mt-0.5 text-xs text-muted-foreground font-mono">
                          {source.citationOrUrl}
                        </p>
                        {source.verifiedBy && (
                          <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                            ✓ Verified by: {source.verifiedBy}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {source.license}
                      </Badge>
                      {source.citationOrUrl.startsWith("http") && (
                        <a
                          href={source.citationOrUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                        >
                          Verify <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground flex justify-between items-center">
              <span>Last reviewed by EKA Knowledge Council</span>
              <span className="font-mono">{passport.lastReviewedDate}</span>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
