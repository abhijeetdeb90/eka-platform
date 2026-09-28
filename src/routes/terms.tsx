import { createFileRoute, Link } from "@tanstack/react-router";
import { Scale, BookCheck, ShieldAlert, Sparkles, AlertTriangle, FileText } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — EKA" },
      {
        name: "description",
        content:
          "EKA Terms of Service governing participation, knowledge authenticity, intellectual property, and community standards.",
      },
      { property: "og:title", content: "EKA Terms & Conditions" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary-soft selection:text-foreground">
      <SiteHeader />
      <main className="container-eka mx-auto max-w-4xl px-5 py-16 lg:py-24">
        {/* Header */}
        <div className="border-b border-border/70 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            <Scale className="size-3.5 text-primary" />
            <span>Platform Agreement & Knowledge Standards</span>
          </div>
          <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
            EKA Terms & Conditions
          </h1>
          <p className="mt-3 text-lg text-muted-foreground font-light leading-relaxed">
            The rules governing our sanctuary, our knowledge trust framework, creator agreements,
            and mutual responsibilities.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>
              <strong>Version:</strong> 1.0
            </span>
            <span>·</span>
            <span>
              <strong>Effective Date:</strong> September 26, 2026
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-12 space-y-12 text-sm leading-relaxed text-foreground/90">
          {/* 1. Acceptance & Eligibility */}
          <section>
            <h2 className="font-display text-2xl text-foreground">1. Eligibility & Acceptance</h2>
            <p className="mt-3">
              By accessing, browsing, or creating an account on EKA, you enter into a binding
              agreement with EKA Knowledge Systems. You represent that you are at least 18 years of
              age, or have the express verifiable consent of your parent or lawful guardian in
              accordance with applicable laws including the DPDP Act, 2023.
            </p>
          </section>

          {/* 2. CRITICAL CLAUSE: Knowledge Taxonomy & Authenticity */}
          <section className="rounded-2xl border border-primary/40 bg-sand/30 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-terracotta">
              <BookCheck className="size-4" />
              <span>Core EKA Standard</span>
            </div>
            <h2 className="mt-2 font-display text-2xl text-foreground">
              2. Knowledge Authenticity & The Five-Tier Taxonomy
            </h2>
            <p className="mt-3 text-muted-foreground">
              EKA is not a free-for-all forum of unsubstantiated claims. To preserve cultural nuance
              and respect source traditions, all contributors and creators agree to distinguish
              between different types of statements:
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-border/70 bg-card p-4">
                <span className="font-semibold text-foreground">Documented Tradition:</span>
                <p className="mt-1 text-xs text-muted-foreground">
                  Claims backed by verifiable historical, canonical, scriptural, or archaeological
                  records. Primary sources must be cited.
                </p>
              </div>

              <div className="rounded-xl border border-border/70 bg-card p-4">
                <span className="font-semibold text-foreground">Interpretation:</span>
                <p className="mt-1 text-xs text-muted-foreground">
                  A commentary or philosophical explanation of a tradition. Must be clearly
                  identified as an interpretation and cannot be asserted as universally
                  authoritative fact.
                </p>
              </div>

              <div className="rounded-xl border border-border/70 bg-card p-4">
                <span className="font-semibold text-foreground">
                  Opinion & Personal Reflection:
                </span>
                <p className="mt-1 text-xs text-muted-foreground">
                  A member's subjective lived experience or spiritual insight.
                </p>
              </div>

              <div className="rounded-xl border border-border/70 bg-card p-4">
                <span className="font-semibold text-foreground">Community Living Practice:</span>
                <p className="mt-1 text-xs text-muted-foreground">
                  Folkways, oral histories, or localized customs distinct from canonical scripture.
                </p>
              </div>

              <div className="rounded-xl border border-border/70 bg-card p-4">
                <span className="font-semibold text-foreground">AI-Assisted Synthesis:</span>
                <p className="mt-1 text-xs text-muted-foreground">
                  Machine-generated summaries, which are labeled as synthetic and require human
                  reviewer or source corroboration before achieving verified status.
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs font-medium text-destructive">
              Prohibition: Creators and members may NEVER present their personal interpretations or
              commercial offerings as exclusive, divine mandates or absolute historical consensus.
            </p>
          </section>

          {/* 3. Community Standards & Harm Prevention */}
          <section>
            <h2 className="font-display text-2xl text-foreground">
              3. Conduct & Religious Harassment
            </h2>
            <p className="mt-3">
              We uphold rigorous standards regarding speech and safety. You can read our detailed
              guidelines in the{" "}
              <Link to="/standards" className="text-terracotta underline font-medium">
                Community Standards
              </Link>
              . The following are grounds for immediate account suspension:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
              <li>
                Denigration, hostility, or hate speech targeting any faith, caste, community, sect,
                or atheist worldview.
              </li>
              <li>
                Impersonation of spiritual figures, gurus, authentic lineages, or organizations.
              </li>
              <li>Coordinated manipulation, astroturfing, fake reviews, or commercial spam.</li>
              <li>Harassment, stalking, or dox-targeting of members or tradition keepers.</li>
            </ul>
          </section>

          {/* 4. Creator Economy & Financial Integrity */}
          <section>
            <h2 className="font-display text-2xl text-foreground">
              4. Creator Economy & Payout Rules
            </h2>
            <p className="mt-3">
              Members offering packages, sacred journeys, or contemplative guidance through the EKA
              Marketplace agree to:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
              <li>
                <strong>Fair Fees:</strong> EKA deducts a standard 10% platform reinvestment fee to
                support verification infrastructure, hosting, and community moderation.
              </li>
              <li>
                <strong>Authentic Verification:</strong> Practitioners must undergo identity and
                lineage checks before unlocking paid booking packages.
              </li>
              <li>
                <strong>Zero Miracle Guarantees:</strong> Practitioners may not promise guaranteed
                material wealth, medical cures, or metaphysical outcomes.
              </li>
              <li>
                <strong>Refund Policy:</strong> If a scheduled guidance session does not occur or
                violates standards, users are entitled to a full refund within 7 working days.
              </li>
            </ul>
          </section>

          {/* 5. Intellectual Property & Copyright Notice-and-Action */}
          <section>
            <h2 className="font-display text-2xl text-foreground">
              5. Intellectual Property & Copyright Takedowns
            </h2>
            <p className="mt-3">
              You retain ownership of the original text, imagery, and audio you submit to EKA. By
              submitting content publicly, you grant EKA a non-exclusive, worldwide, royalty-free
              license to display, index, format, and structure the content within the EKA Knowledge
              Graph.
            </p>
            <div className="mt-4 rounded-xl border border-border/70 bg-card p-5 text-xs space-y-2">
              <p className="font-semibold text-foreground">
                Copyright Infringement Notice (DMCA / Copyright Act Compliance):
              </p>
              <p className="text-muted-foreground">
                If you believe your copyrighted work or sacred community documentation has been
                uploaded without authorization, please submit a written notice to{" "}
                <a href="mailto:copyright@eka.earth" className="text-terracotta underline">
                  copyright@eka.earth
                </a>{" "}
                with: (1) identification of the work, (2) the specific URL on EKA, and (3) a
                declaration of good-faith belief. We will review and act within 36 hours.
              </p>
            </div>
          </section>

          {/* 6. Governing Law & Dispute Resolution */}
          <section className="border-t border-border/70 pt-8">
            <h2 className="font-display text-2xl text-foreground">
              6. Governing Law & Jurisdiction
            </h2>
            <p className="mt-3 text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of the
              Republic of India. Any disputes arising under or in connection with these Terms shall
              be subject to the exclusive jurisdiction of the competent courts in Bengaluru,
              Karnataka, India.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
