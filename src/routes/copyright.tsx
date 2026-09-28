import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ShieldAlert, FileText, CheckCircle2, AlertTriangle, Scale } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/copyright")({
  head: () => ({
    meta: [
      { title: "Copyright & Intellectual Property Policy — EKA" },
      {
        name: "description",
        content:
          "EKA's Copyright Policy, Notice-and-Takedown procedure, and sacred cultural heritage stewardship charter.",
      },
      { property: "og:title", content: "EKA Copyright & Intellectual Property Policy" },
    ],
  }),
  component: CopyrightPolicyPage,
});

function CopyrightPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary-soft selection:text-foreground">
      <SiteHeader />
      <main className="container-eka mx-auto max-w-4xl px-5 py-16 lg:py-24">
        {/* Header */}
        <div className="border-b border-border/70 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            <BookOpen className="size-3.5 text-primary" />
            <span>Intellectual Property & Sacred Heritage</span>
          </div>
          <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
            Copyright & IP Policy
          </h1>
          <p className="mt-3 text-lg text-muted-foreground font-light leading-relaxed">
            Protecting original creator rights, honoring ancient traditions, and providing a
            rigorous statutory Notice-and-Takedown mechanism under Indian and international law.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>
              <strong>Version:</strong> 1.0
            </span>
            <span>·</span>
            <span>
              <strong>Effective Date:</strong> September 26, 2026
            </span>
            <span>·</span>
            <span>
              <strong>Designated Agent:</strong> Copyright Grievance Officer, EKA Knowledge Systems
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-12 space-y-12 text-sm leading-relaxed text-foreground/90">
          {/* 1. Philosophy: Stewardship of Sacred Knowledge */}
          <section className="rounded-2xl border border-border/80 bg-sand/30 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-2xl text-foreground">
              <Scale className="size-5 text-terracotta" />
              1. Cultural Heritage & Living Tradition Stewardship
            </h2>
            <p className="mt-3">
              Spiritual wisdom and sacred traditions belong to humanity and the living communities
              that nurture them. EKA respects that canonical scriptures, Vedic hymns, Buddhist
              sutras, Quranic verses, Gurbani, and traditional folk chants exist in the public
              domain or are held as sacred commons.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              No individual creator or commercial entity may claim exclusive copyright or
              proprietary ownership over ancient source scriptures or universal prayers on EKA.
              However, original translations, scholarly commentaries, contemporary musical
              arrangements, and artistic visualizations are protected intellectual property.
            </p>
          </section>

          {/* 2. Creator Rights and Platform Licensing */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl text-foreground">
              2. Ownership of User-Generated Content
            </h2>
            <p className="text-muted-foreground">
              You retain all ownership and copyright in original writings, reflections, photography,
              and audio teachings that you create and publish on EKA.
            </p>
            <div className="rounded-xl border border-border/70 bg-card p-5 text-xs text-muted-foreground space-y-2">
              <p>
                <strong className="text-foreground">License Granted to EKA:</strong> By submitting
                content publicly to EKA, you grant us a worldwide, non-exclusive, royalty-free
                license to host, display, index, format, and incorporate your contributions into our
                knowledge graph and search indices, strictly in connection with operating and
                improving EKA.
              </p>
              <p>
                <strong className="text-foreground">Creator Warranty:</strong> You represent and
                warrant that you own or possess all necessary rights, licenses, consents, and
                permissions for all media, photographs, and text you upload.
              </p>
            </div>
          </section>

          {/* 3. Statutory Notice-and-Takedown Mechanism */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl text-foreground">
              3. Notice & Takedown Procedure (IT Act 2021 & DMCA)
            </h2>
            <p className="text-muted-foreground">
              Under the Information Technology (Intermediary Guidelines and Digital Media Ethics
              Code) Rules, 2021, and Section 52 of the Indian Copyright Act, 1957, EKA maintains an
              expedited notice-and-action mechanism.
            </p>
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-calm">
              <h3 className="font-semibold text-foreground text-base">
                Filing an Infringement Notice
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">
                If you believe your copyrighted work has been copied or uploaded in a manner that
                constitutes infringement, please send a written notice to our designated Copyright
                Agent at{" "}
                <a
                  href="mailto:copyright@eka.earth"
                  className="text-terracotta underline font-medium"
                >
                  copyright@eka.earth
                </a>{" "}
                containing the following information:
              </p>
              <ol className="mt-4 space-y-2.5 list-decimal pl-5 text-xs text-muted-foreground">
                <li>
                  <strong className="text-foreground">Identification of the Work:</strong> A
                  description of the copyrighted work or sacred intellectual property that you claim
                  has been infringed, including registration details if applicable.
                </li>
                <li>
                  <strong className="text-foreground">Location on EKA:</strong> The specific URL,
                  permalink, or Content ID where the alleged infringing material is situated.
                </li>
                <li>
                  <strong className="text-foreground">Contact Information:</strong> Your full legal
                  name, physical address, telephone number, and official email address.
                </li>
                <li>
                  <strong className="text-foreground">Good Faith Statement:</strong> A statement
                  that you have a good-faith belief that the disputed use is not authorized by the
                  copyright owner, its agent, or the law.
                </li>
                <li>
                  <strong className="text-foreground">Statement of Accuracy:</strong> A statement
                  made under penalty of perjury that the information provided in your notice is
                  accurate and that you are the copyright owner or authorized to act on their
                  behalf.
                </li>
                <li>
                  <strong className="text-foreground">Signature:</strong> A physical or verifiable
                  electronic signature of the authorized person.
                </li>
              </ol>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-forest">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>
                Turnaround Guarantee: All verified takedown notices acknowledged within 24 hours and
                acted upon within 36 hours.
              </span>
            </div>
          </section>

          {/* 4. Counter-Notice & Restoration */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl text-foreground">
              4. Counter-Notice & Dispute Procedure
            </h2>
            <p className="text-muted-foreground">
              If your material has been removed due to a copyright notice and you believe this was
              done through mistake, misidentification, or under fair dealing doctrine:
            </p>
            <div className="rounded-xl border border-border/70 bg-card p-5 text-xs text-muted-foreground space-y-2">
              <p>
                You may submit a formal counter-notice to{" "}
                <a href="mailto:copyright@eka.earth" className="text-terracotta underline">
                  copyright@eka.earth
                </a>{" "}
                identifying the removed URL, confirming your consent to jurisdiction of Bengaluru
                courts, and stating under oath that the material was removed by mistake or
                constitutes legitimate commentary/scholarship.
              </p>
              <p>
                Upon receiving a valid counter-notice, EKA will forward a copy to the original
                complainant. If the complainant does not notify us of filing legal court proceedings
                within 14 business days, we may restore the removed content.
              </p>
            </div>
          </section>

          {/* 5. Repeat Infringer Policy */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl text-foreground">5. Repeat Infringer Policy</h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              In accordance with international intermediary standards, EKA enforces a strict policy
              of terminating account privileges and marketplace verification for any user or creator
              determined to be a repeat copyright infringer.
            </p>
          </section>

          {/* 6. Contact Information */}
          <section className="border-t border-border/70 pt-8">
            <h2 className="font-display text-2xl text-foreground">6. Designated Copyright Agent</h2>
            <div className="mt-4 rounded-xl border border-border/70 bg-card p-5 text-xs space-y-1.5">
              <p>
                <strong>Designation:</strong> Intellectual Property & Copyright Officer
              </p>
              <p>
                <strong>Entity:</strong> EKA Knowledge Systems Private Limited
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:copyright@eka.earth" className="text-terracotta underline">
                  copyright@eka.earth
                </a>
              </p>
              <p>
                <strong>Grievance Officer:</strong>{" "}
                <a href="mailto:grievance@eka.earth" className="text-terracotta underline">
                  grievance@eka.earth
                </a>
              </p>
              <p>
                <strong>Address:</strong> Bengaluru, Karnataka, India
              </p>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
