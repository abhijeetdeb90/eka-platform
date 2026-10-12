// ==============================================================================
// ACCESSIBILITY STATEMENT — EKA
// ==============================================================================

import { createFileRoute } from "@tanstack/react-router";
import { Eye, CheckCircle2, ShieldCheck, Heart } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility Statement — EKA" },
      {
        name: "description",
        content: "EKA's commitment to digital accessibility, inclusive design, and WCAG 2.1 AA conformance.",
      },
      { property: "og:title", content: "EKA Accessibility Statement" },
    ],
  }),
  component: AccessibilityPage,
});

function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] selection:bg-[#C45C26]/20">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-16 lg:py-20">
        <div className="border-b border-[#E8E2D9] pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E2D9] bg-white px-3.5 py-1 text-xs uppercase tracking-wider text-[#C45C26] font-mono">
            <Eye className="size-3.5" />
            <span>Inclusive Design & Universal Access</span>
          </div>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#1A1A1A]">
            Accessibility Statement
          </h1>
          <p className="mt-2 text-base text-[#5C5C5C] leading-relaxed">
            EKA is built on the conviction that human cultural knowledge belongs to everyone. We are committed to providing a digital platform that is accessible to all individuals, including people with sensory, motor, and cognitive disabilities.
          </p>
        </div>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#1A1A1A]">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-medium text-[#1A1A1A]">1. Conformance Standards</h2>
            <p className="text-[#5C5C5C]">
              We strive to adhere to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA criteria. These international guidelines specify best practices for making web content accessible to a broader audience, including users of screen readers, screen magnifiers, speech recognition software, and alternative input devices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-medium text-[#1A1A1A]">2. Implemented Accessibility Measures</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-[#E8E2D9] bg-white p-4 space-y-2">
                <div className="flex items-center gap-2 font-medium text-[#1A1A1A]">
                  <CheckCircle2 className="size-4 text-[#C45C26]" />
                  <span>Semantic HTML & ARIA</span>
                </div>
                <p className="text-xs text-[#5C5C5C]">
                  Clear landmark roles, accessible form labels, live announcement regions, and modal dialog focus traps.
                </p>
              </div>

              <div className="rounded-xl border border-[#E8E2D9] bg-white p-4 space-y-2">
                <div className="flex items-center gap-2 font-medium text-[#1A1A1A]">
                  <CheckCircle2 className="size-4 text-[#C45C26]" />
                  <span>Keyboard Operability</span>
                </div>
                <p className="text-xs text-[#5C5C5C]">
                  Full navigation support using Tab, Enter, Space, and Escape keys, with visible focus indicators throughout.
                </p>
              </div>

              <div className="rounded-xl border border-[#E8E2D9] bg-white p-4 space-y-2">
                <div className="flex items-center gap-2 font-medium text-[#1A1A1A]">
                  <CheckCircle2 className="size-4 text-[#C45C26]" />
                  <span>Color Contrast & Typography</span>
                </div>
                <p className="text-xs text-[#5C5C5C]">
                  Calm editorial palette meeting 4.5:1 contrast ratios on body copy and 3:1 on large display headings.
                </p>
              </div>

              <div className="rounded-xl border border-[#E8E2D9] bg-white p-4 space-y-2">
                <div className="flex items-center gap-2 font-medium text-[#1A1A1A]">
                  <CheckCircle2 className="size-4 text-[#C45C26]" />
                  <span>Reduced Motion & Touch Targets</span>
                </div>
                <p className="text-xs text-[#5C5C5C]">
                  Honors prefers-reduced-motion OS preferences and provides 44px minimum touch targets on mobile viewports.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl font-medium text-[#1A1A1A]">3. Continuous Testing & Feedback</h2>
            <p className="text-[#5C5C5C]">
              We continually evaluate our user journeys using automated accessibility linters and real assistive technologies. If you encounter any barriers or have suggestions for improving accessibility on EKA, please reach out to our team at{" "}
              <a href="mailto:accessibility@eka.earth" className="text-[#C45C26] underline font-medium">
                accessibility@eka.earth
              </a>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
