import { Link } from "@tanstack/react-router";
import { ArrowUp, Sparkles, ShieldCheck } from "lucide-react";
import { EkaLogo } from "@/components/brand/Logo";
import { useSmoothScroll } from "@/components/motion/SmoothScrollProvider";

const exploreLinks = [
  { to: "/discover", label: "Discover Traditions" },
  { to: "/stories", label: "1 Billion Stories" },
  { to: "/learn", label: "Knowledge Codex" },
  { to: "/observe", label: "Sacred Calendar" },
] as const;

const trustLinks = [
  { to: "/standards", label: "Community Standards" },
  { to: "/give", label: "Give & Transparency" },
  { to: "/create", label: "Creator Studio" },
  { to: "/membership", label: "Sanctuary Membership" },
] as const;

const brandLinks = [
  { to: "/brands", label: "Brand Workspace" },
  { to: "/campaigns", label: "Campaigns & Promotion" },
  { to: "/audience", label: "Audience Intelligence" },
  { to: "/enterprise", label: "Enterprise Solutions" },
] as const;

const legalLinks = [
  { to: "/privacy", label: "Privacy Policy (DPDP)" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/refund", label: "Refund & Cancellation" },
  { to: "/copyright", label: "Copyright & IP" },
  { to: "/cookies", label: "Cookie Preferences" },
] as const;

export function SiteFooter() {
  const { scrollTo } = useSmoothScroll();

  return (
    <footer className="relative border-t border-border/70 bg-sand/30 py-16 lg:py-20">
      <div className="container-eka grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand Column */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <EkaLogo withTagline />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground font-light">
            A trusted sanctuary for the inner life, welcoming all traditions and seeking universal
            truth. Built on provenance, source attribution, and ethical stewardship.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-forest" />
            <span>Digital Personal Data Protection (DPDP) Act, 2023 Compliant</span>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            Explore & Lore
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {exploreLinks.map((l) => (
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

        {/* Trust & Community */}
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            Community
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {trustLinks.map((l) => (
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

        {/* Brands & Ecosystem */}
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            Brands & Enterprise
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {brandLinks.map((l) => (
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

        {/* Legal & Governance */}
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
            Legal & Privacy
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {legalLinks.map((l) => (
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

      {/* Bottom Bar */}
      <div className="container-eka mt-6 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:flex-row">
        <p>&copy; {new Date().getFullYear()} EKA Knowledge Systems. One Within · One With All.</p>

        <button
          onClick={() => scrollTo(0)}
          className="group flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3.5 py-1.5 text-xs text-muted-foreground shadow-xs transition-all hover:border-primary/50 hover:text-foreground"
          aria-label="Scroll back to top"
        >
          <span>Return to top</span>
          <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  );
}
