import React from "react";
import { CheckCircle2, HelpCircle, AlertCircle, Scale, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EpistemicClaim, EpistemicClassification } from "@/lib/knowledge/knowledge-object";

interface EpistemicClaimsTableProps {
  claims: EpistemicClaim[];
  className?: string;
}

export function EpistemicClaimsTable({
  claims,
  className = "",
}: EpistemicClaimsTableProps) {
  if (!claims || claims.length === 0) return null;

  const getEpistemicBadge = (type: EpistemicClassification) => {
    switch (type) {
      case "DOCUMENTED":
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px]">
            Documented Fact
          </Badge>
        );
      case "SOURCE_SUPPORTED":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-[10px]">
            Scholarly Supported
          </Badge>
        );
      case "COMMUNITY_REPORTED":
        return (
          <Badge className="bg-purple-600 hover:bg-purple-700 text-white text-[10px]">
            Community Oral
          </Badge>
        );
      case "TRADITIONAL_BELIEF":
        return (
          <Badge className="bg-amber-600 hover:bg-amber-700 text-white text-[10px]">
            Traditional Belief
          </Badge>
        );
      case "INTERPRETATION":
        return (
          <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px]">
            Philosophical Reading
          </Badge>
        );
      case "DISPUTED":
        return (
          <Badge variant="destructive" className="text-[10px]">
            Disputed Account
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[10px]">
            Unverified
          </Badge>
        );
    }
  };

  const getStatusIcon = (status: EpistemicClaim["verificationStatus"]) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />;
      case "community_dispute":
        return <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />;
      default:
        return <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0" />;
    }
  };

  return (
    <div
      data-testid="eka-epistemic-taxonomy"
      className={`rounded-3xl border border-border/80 bg-card p-6 shadow-calm sm:p-8 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Scale className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Epistemic Taxonomy: Facts vs. Traditions
            </h3>
            <Badge variant="outline" className="text-xs">
              EKA Epistemic Engine
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            EKA separates historical & archaeological records from revered sacred traditions and
            philosophical interpretations — respecting belief while maintaining scholarly rigor.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {claims.map((claim) => (
          <div
            key={claim.claimId}
            data-testid={`claim-${claim.claimId}`}
            className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-sand/10 p-4 transition-colors hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getStatusIcon(claim.verificationStatus)}</div>
              <div>
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {claim.statement}
                </p>
                {claim.notes && (
                  <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {claim.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 self-end sm:self-auto">
              <span className="text-[11px] font-mono text-muted-foreground">
                {Math.round(claim.confidence * 100)}% conf.
              </span>
              {getEpistemicBadge(claim.epistemicType)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
