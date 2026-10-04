// ==============================================================================
// CONSUMER APPLICATION — SITE FOOTER
// ==============================================================================
// Public consumer-only footer shell.
// Prominent EKA branding, localized legal notices, and visible Language Selector.
// ==============================================================================

import { Link } from "@tanstack/react-router";
import { ArrowUp, ShieldCheck } from "lucide-react";
import { EkaLogo } from "@/components/brand/Logo";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { useLocalization } from "@/lib/i18n";
import { useSmoothScroll } from "@/components/motion/SmoothScrollProvider";
import {
  CONSUMER_FOOTER_EXPLORE,
  CONSUMER_FOOTER_COMMUNITY,
  CONSUMER_FOOTER_LEGAL,
} from "../config/navigation";

export function ConsumerFooter() {
  const { scrollTo } = useSmoothScroll();
  const { t } = useLocalization();

  return (
    <footer className="relative border-t border-border/70 bg-sand/30 py-16 lg:py-20">
      <div className="container-eka grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand Column */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <EkaLogo size="lg" withTagline />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground font-light">
            A trusted sanctuary for the inner life and global cultural intelligence, welcoming all
            traditions and seeking universal truth. Built on provenance, source attribution, and
            ethical stewardship.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-forest" />
            <span>Digital Personal Data Protection (DPDP) Act, 2023 Compliant</span>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            {t("nav.explore")} & Lore
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CONSUMER_FOOTER_EXPLORE.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Community & Sanctuary */}
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            {t("nav.communities")}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CONSUMER_FOOTER_COMMUNITY.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal & Privacy */}
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            Legal & Privacy
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CONSUMER_FOOTER_LEGAL.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Compliance & Grievance Notice Strip */}
      <div className="container-eka mt-12 border-t border-border/50 pt-6">
        <p className="text-[11px] leading-relaxed text-muted-foreground/80">
          <strong>Legal & Grievance Notice:</strong> For personal data rights, content grievances,
          or copyright notices, contact our Grievance Desk at{" "}
          <a href="mailto:grievance@eka.earth" className="text-terracotta underline">
            grievance@eka.earth
          </a>
          . Non-medical disclaimer: Practices, discussions, and reflections on EKA are educational
          and contemplative in nature and do not substitute for professional medical, psychological,
          financial, or legal advice.
        </p>
      </div>

      {/* Bottom Bar: Copyright + Language Selector + Scroll To Top */}
      <div className="container-eka mt-6 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:flex-row">
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
    </footer>
  );
}
