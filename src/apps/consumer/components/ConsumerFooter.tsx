// ==============================================================================
// CONSUMER APPLICATION — SITE FOOTER
// ==============================================================================
// Clean, consumer-focused public footer.
// Strictly consumer discovery, community, trust & safety, and company information.
// Zero internal tools, zero investor leaks, zero enterprise dashboard exposure.
// ==============================================================================

import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUp, ShieldCheck } from "lucide-react";
import { EkaLogo } from "@/components/brand/Logo";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { useSmoothScroll } from "@/components/motion/SmoothScrollProvider";
import { FOOTER_IA_CONFIG, EKA_BRAND } from "@/config/navigation";
import { FooterLocalDiscovery } from "@/components/site/FooterLocalDiscovery";

export function ConsumerFooter() {
  const { scrollTo } = useSmoothScroll();

  return (
    <footer className="relative border-t border-border/70 bg-sand/30">
      {/* 1. Local & Cultural Discovery Layer */}
      <FooterLocalDiscovery />

      {/* 2. Primary Footer Directory Grid */}
      <div className="border-t border-border/60 py-16 lg:py-20">
        <div className="container-eka">
          {/* Main Content Grid */}
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-12">
            {/* Brand Column */}
            <div className="space-y-4 sm:col-span-2 md:col-span-3 lg:col-span-6 xl:col-span-4 pr-0 xl:pr-8">
              <EkaLogo size="lg" withTagline />
              <p className="text-sm font-medium text-foreground/90">
                {EKA_BRAND.supportingStatement}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground font-light">
                Built on provenance, verified human traditions, ethical stewardship, and the open
                wisdom of humanity. No synthetic cultures, no algorithmic homogenisation.
              </p>
              <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span>Respecting Personal Privacy & Cultural Heritage Rights</span>
              </div>
            </div>

            {/* Structured IA Directory Columns (4 Clean Consumer Columns) */}
            <div className="sm:col-span-2 md:col-span-3 lg:col-span-6 xl:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
              {/* Explore Column */}
              <div>
                <h4 className="font-display text-xs font-bold uppercase tracking-[0.16em] text-foreground">
                  {FOOTER_IA_CONFIG.explore?.title || "Explore"}
                </h4>
                <ul className="mt-4 space-y-2.5 text-xs">
                  {FOOTER_IA_CONFIG.explore?.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to as any}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* For Column */}
              <div>
                <h4 className="font-display text-xs font-bold uppercase tracking-[0.16em] text-foreground">
                  {FOOTER_IA_CONFIG.for?.title || "For"}
                </h4>
                <ul className="mt-4 space-y-2.5 text-xs">
                  {FOOTER_IA_CONFIG.for?.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to as any}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Column */}
              <div>
                <h4 className="font-display text-xs font-bold uppercase tracking-[0.16em] text-foreground">
                  {FOOTER_IA_CONFIG.trust?.title || "Trust"}
                </h4>
                <ul className="mt-4 space-y-2.5 text-xs">
                  {FOOTER_IA_CONFIG.trust?.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to as any}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h4 className="font-display text-xs font-bold uppercase tracking-[0.16em] text-foreground">
                  {FOOTER_IA_CONFIG.company?.title || "Company"}
                </h4>
                <ul className="mt-4 space-y-2.5 text-xs">
                  {FOOTER_IA_CONFIG.company?.links.map((l) => (
                    <li key={l.label}>
                      {l.to.startsWith("mailto:") ? (
                        <a
                          href={l.to}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          to={l.to as any}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Compliance & Grievance Notice Strip */}
          <div className="mt-14 border-t border-border/50 pt-6">
            <p className="text-[11px] leading-relaxed text-muted-foreground/80">
              <strong>Legal & Grievance Notice:</strong> For personal data rights, content grievances,
              or copyright notices, contact our Grievance Desk at{" "}
              <a href="mailto:grievance@eka.earth" className="text-terracotta underline font-medium">
                grievance@eka.earth
              </a>
              . Non-medical disclaimer: Practices, discussions, and reflections on EKA are educational
              and contemplative in nature and do not substitute for professional medical, psychological,
              financial, or legal advice.
            </p>
          </div>

          {/* Bottom Bar: Copyright + Language Selector + Scroll To Top */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:flex-row">
            <div className="flex flex-wrap items-center gap-4">
              <p>&copy; {new Date().getFullYear()} EKA Cultural Knowledge Systems. One Within · One With All.</p>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSelector variant="footer" />

              <button
                onClick={() => scrollTo(0)}
                className="group flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3.5 py-1.5 text-xs text-muted-foreground shadow-xs transition-all hover:border-primary/50 hover:text-foreground"
                aria-label="Return to top"
              >
                <span>Return to top</span>
                <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
