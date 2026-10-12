// ==============================================================================
// MODERN SLAVERY & HUMAN RIGHTS STATEMENT — EKA
// ==============================================================================

import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, HeartHandshake, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/modern-slavery")({
  head: () => ({
    meta: [
      { title: "Modern Slavery & Ethical Sourcing Statement — EKA" },
      {
        name: "description",
        content: "EKA's anti-slavery, fair labor, and ethical artisan supply chain commitments.",
      },
      { property: "og:title", content: "EKA Modern Slavery Statement" },
    ],
  }),
  component: ModernSlaveryPage,
});

function ModernSlaveryPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] selection:bg-[#C45C26]/20">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-16 lg:py-20">
        <div className="border-b border-[#E8E2D9] pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E2D9] bg-white px-3.5 py-1 text-xs uppercase tracking-wider text-[#C45C26] font-mono">
            <ShieldCheck className="size-3.5" />
            <span>Human Rights & Ethical Stewardship</span>
          </div>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A1A]">
            Modern Slavery & Ethical Labor Statement
          </h1>
          <p className="mt-2 text-base text-[#5C5C5C] leading-relaxed">
            EKA is dedicated to upholding the highest standards of human dignity, fair compensation, and ethical conduct across all operations, community initiatives, and artisan relationships.
          </p>
        </div>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#1A1A1A]">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-medium text-[#1A1A1A]">1. Zero Tolerance for Forced Labor</h2>
            <p className="text-[#5C5C5C]">
              We maintain a strict zero-tolerance policy regarding modern slavery, human trafficking, child exploitation, and forced or bonded labor of any kind. This policy applies universally across our software operations, content contributors, and commercial partnerships.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-medium text-[#1A1A1A]">2. Artisan Guilds & Fair Compensation</h2>
            <p className="text-[#5C5C5C]">
              Traditional crafts and artisanal techniques represent the living heritage of human civilization. When featuring or partnering with traditional craft guilds (e.g. metal mirror casters, natural weavers, woodcarvers), EKA insists on transparent attribution, direct economic dignity, and non-exploitative working conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-medium text-[#1A1A1A]">3. Supply Chain Due Diligence</h2>
            <div className="rounded-xl border border-[#E8E2D9] bg-white p-5 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-[#C45C26] shrink-0 mt-0.5" />
                <p className="text-xs text-[#5C5C5C]">
                  <strong>Supplier Screening:</strong> We vet technology vendors and physical partners to ensure compliance with international labor conventions (ILO standards) and national labor regulations.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-[#C45C26] shrink-0 mt-0.5" />
                <p className="text-xs text-[#5C5C5C]">
                  <strong>Whistleblower & Grievance Desk:</strong> Any individual can report suspected ethical violations, modern slavery risks, or labor exploitation directly to our ethics desk without fear of reprisal.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-medium text-[#1A1A1A]">4. Reporting & Inquiries</h2>
            <p className="text-[#5C5C5C]">
              If you have questions regarding this statement or wish to report an ethical concern, please email our compliance team at{" "}
              <a href="mailto:ethics@eka.earth" className="text-[#C45C26] underline font-medium">
                ethics@eka.earth
              </a>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
