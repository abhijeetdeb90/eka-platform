import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { analyzeUrlForPhishing } from "@/lib/security/anti-phishing";
import type { PhishingAnalysisResult } from "@/lib/security/types";
import { SafeLinkDialog } from "./SafeLinkDialog";

interface SafeNavigationContextType {
  verifyAndOpenUrl: (url: string) => boolean;
}

const SafeNavigationContext = createContext<SafeNavigationContextType>({
  verifyAndOpenUrl: () => true,
});

export function useSafeNavigation() {
  return useContext(SafeNavigationContext);
}

export function SafeNavigationProvider({ children }: { children: ReactNode }) {
  const [activeAnalysis, setActiveAnalysis] = useState<PhishingAnalysisResult | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const verifyAndOpenUrl = (url: string): boolean => {
    // Relative paths are always safe internal navigation
    if (url.startsWith("/") && !url.startsWith("//")) {
      return true;
    }

    try {
      const parsed = new URL(url);
      const isSameHost =
        parsed.hostname === window.location.hostname ||
        parsed.hostname === "localhost" ||
        parsed.hostname === "127.0.0.1";

      if (isSameHost) return true;
    } catch {
      // Malformed URL, let scanner handle
    }

    const analysis = analyzeUrlForPhishing(url);

    if (analysis.riskLevel === "LOW RISK") {
      return true;
    }

    // Flagged as SUSPICIOUS, HIGH RISK, or CRITICAL
    setActiveAnalysis(analysis);
    setDialogOpen(true);
    return false;
  };

  // Global document click delegator for any anchor tags leading to external URLs
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target || !target.href) return;

      const href = target.href;
      if (href.startsWith("http://") || href.startsWith("https://")) {
        const canProceed = verifyAndOpenUrl(href);
        if (!canProceed) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, []);

  return (
    <SafeNavigationContext.Provider value={{ verifyAndOpenUrl }}>
      {children}
      <SafeLinkDialog
        analysis={activeAnalysis}
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setActiveAnalysis(null);
        }}
      />
    </SafeNavigationContext.Provider>
  );
}
