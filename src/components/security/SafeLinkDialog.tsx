import { useState } from "react";
import {
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PhishingAnalysisResult } from "@/lib/security";

interface SafeLinkDialogProps {
  analysis: PhishingAnalysisResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SafeLinkDialog({ analysis, isOpen, onClose }: SafeLinkDialogProps) {
  const [overrideConfirmed, setOverrideConfirmed] = useState(false);

  if (!analysis) return null;

  const { riskLevel, domain, url, explanation, reasons } = analysis;

  const isCritical = riskLevel === "CRITICAL";
  const isHigh = riskLevel === "HIGH RISK";
  const isSuspicious = riskLevel === "SUSPICIOUS";

  const handleProceed = () => {
    if (isCritical) return; // Hard block: zero bypass
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl border-border bg-card p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`flex size-11 items-center justify-center rounded-xl ${
                isCritical
                  ? "bg-destructive/15 text-destructive"
                  : isHigh
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  : "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"
              }`}
            >
              {isCritical ? (
                <ShieldX className="size-6" />
              ) : isHigh ? (
                <ShieldAlert className="size-6" />
              ) : (
                <AlertTriangle className="size-6" />
              )}
            </div>
            <div>
              <DialogTitle className="font-display text-lg font-semibold text-foreground">
                {isCritical
                  ? "Malicious Link Blocked"
                  : isHigh
                  ? "High Risk Website Warning"
                  : "External Website Caution"}
              </DialogTitle>
              <Badge
                variant="outline"
                className={`mt-1 font-mono text-[10px] uppercase tracking-wider ${
                  isCritical
                    ? "border-destructive/40 bg-destructive/10 text-destructive"
                    : isHigh
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                }`}
              >
                {riskLevel}
              </Badge>
            </div>
          </div>

          <DialogDescription className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {explanation.whatHappened}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-3 rounded-xl border border-border/80 bg-muted/40 p-3.5 text-xs">
          <div>
            <span className="font-semibold text-foreground">Destination:</span>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground break-all">{domain}</p>
          </div>

          <div>
            <span className="font-semibold text-foreground">Why it was flagged:</span>
            <p className="mt-0.5 text-muted-foreground">{explanation.whyFlagged}</p>
          </div>

          <div>
            <span className="font-semibold text-foreground">Recommended safety step:</span>
            <p className="mt-0.5 text-muted-foreground">{explanation.safeNextStep}</p>
          </div>
        </div>

        {isHigh && (
          <label className="flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5 text-xs text-amber-700 dark:text-amber-300">
            <input
              type="checkbox"
              checked={overrideConfirmed}
              onChange={(e) => setOverrideConfirmed(e.target.checked)}
              className="mt-0.5 rounded border-border"
            />
            <span>
              I understand the risks of credential phishing on lookalike sites and wish to bypass this protection.
            </span>
          </label>
        )}

        <DialogFooter className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            <ArrowLeft className="mr-1.5 size-4" />
            Stay in EKA Sanctuary
          </Button>

          {!isCritical && (
            <Button
              variant={isHigh ? "destructive" : "default"}
              disabled={isHigh && !overrideConfirmed}
              onClick={handleProceed}
              className="rounded-xl"
            >
              Continue to External Site
              <ExternalLink className="ml-1.5 size-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
