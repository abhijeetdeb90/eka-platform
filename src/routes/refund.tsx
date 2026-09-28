import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ReceiptText,
  RefreshCw,
  Clock,
  AlertTriangle,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund & Cancellation Policy — EKA" },
      {
        name: "description",
        content:
          "EKA's transparent Refund, Cancellation and Payment Dispute Policy for subscriptions, marketplace bookings, and physical ritual objects.",
      },
      { property: "og:title", content: "EKA Refund & Cancellation Policy" },
      {
        property: "og:description",
        content:
          "Clear, honest cancellation and refund terms complying with Indian consumer protection regulations.",
      },
    ],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary-soft selection:text-foreground">
      <SiteHeader />
      <main className="container-eka mx-auto max-w-4xl px-5 py-16 lg:py-24">
        {/* Header */}
        <div className="border-b border-border/70 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            <ReceiptText className="size-3.5 text-primary" />
            <span>Commercial & Consumer Protection</span>
          </div>
          <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
            Refund & Cancellation Policy
          </h1>
          <p className="mt-3 text-lg text-muted-foreground font-light leading-relaxed">
            Transparent commercial terms, fair cancellation windows, and consumer protections
            aligned with the Consumer Protection (E-Commerce) Rules, 2020.
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
              <strong>Operating Entity:</strong> EKA Knowledge Systems Private Limited (in
              formation)
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-12 space-y-12 text-sm leading-relaxed text-foreground/90">
          {/* 1. Core Commitment */}
          <section className="rounded-2xl border border-border/80 bg-sand/30 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-2xl text-foreground">
              <ShieldCheck className="size-5 text-forest" />
              1. Our Fair Commerce Commitment
            </h2>
            <p className="mt-3">
              EKA is built upon trust, transparency, and spiritual integrity. We reject dark
              patterns, hidden cancellation fees, trapped recurring billing, and deceptive
              marketing. If our services or offerings fail to meet documented standards, we provide
              straightforward recourse and refund procedures.
            </p>
          </section>

          {/* 2. Digital Memberships (EKA Plus) */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl text-foreground">
              2. Digital Memberships (EKA Plus)
            </h2>
            <p className="text-muted-foreground">
              Our recurring digital membership provides access to daily practices, structured
              journeys, monthly contemplative themes, and private community circles.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-card p-5">
                <h3 className="font-semibold text-foreground text-base">One-Click Cancellation</h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  You may cancel your membership at any time directly through your account billing
                  settings. There are no mandatory exit questionnaires, cancellation penalties, or
                  required customer support calls.
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card p-5">
                <h3 className="font-semibold text-foreground text-base">
                  48-Hour Renewal Cooling-Off
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  If your subscription auto-renews and you did not intend to renew, contact{" "}
                  <a href="mailto:billing@eka.earth" className="text-terracotta underline">
                    billing@eka.earth
                  </a>{" "}
                  within 48 hours of the charge without logging active usage during that period for
                  a full 100% refund.
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              When cancelled mid-cycle, you maintain full access until the end of your prepaid
              billing period, after which your card will never be charged again.
            </p>
          </section>

          {/* 3. Practitioner Marketplace & Consultations */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl text-foreground">
              3. Marketplace Bookings & Guided Sessions
            </h2>
            <p className="text-muted-foreground">
              For 1-on-1 consultations, astrology readings, puja services, or meditation guidance
              booked through verified practitioners on EKA:
            </p>
            <div className="overflow-hidden rounded-xl border border-border/70">
              <table className="w-full text-left text-xs">
                <thead className="bg-sand/40 border-b border-border/70 text-foreground font-medium">
                  <tr>
                    <th className="p-3">Cancellation Timing</th>
                    <th className="p-3">Refund Amount</th>
                    <th className="p-3">Terms & Conditions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="p-3 font-medium">&gt; 24 hours before session</td>
                    <td className="p-3 text-forest font-semibold">100% Refund</td>
                    <td className="p-3 text-muted-foreground">
                      Full refund credited to source account immediately.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">4 – 24 hours before session</td>
                    <td className="p-3 text-saffron font-semibold">50% Refund</td>
                    <td className="p-3 text-muted-foreground">
                      Compensates the practitioner for reserved calendar time.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">&lt; 4 hours or No-Show</td>
                    <td className="p-3 text-destructive font-semibold">0% (Non-refundable)</td>
                    <td className="p-3 text-muted-foreground">
                      Except in verified emergency or medical distress.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Practitioner Missed Session</td>
                    <td className="p-3 text-forest font-semibold">100% Refund + Credit</td>
                    <td className="p-3 text-muted-foreground">
                      Immediate full refund or free reschedule with platform apology credit.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-5 text-xs text-muted-foreground">
              <strong className="text-foreground">Authenticity & Quality Disputes:</strong> If a
              practitioner makes unverified medical claims, promises guaranteed supernatural cures,
              or violates our{" "}
              <Link to="/standards" className="text-terracotta underline">
                Community Standards
              </Link>
              , submit a report within 48 hours of the session. Following admin review, a 100%
              refund will be granted and the practitioner subjected to disciplinary suspension.
            </div>
          </section>

          {/* 4. Physical Goods (Ritual Kits & Objects) */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl text-foreground">
              4. Physical Objects & Ritual Kits
            </h2>
            <p className="text-muted-foreground">
              When purchasing handcrafted ritual items, brass lamps, or meditation props:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-muted-foreground">
              <li>
                <strong className="text-foreground">7-Day Return Window:</strong> You may return
                unused, unopened items in original packaging within 7 days of verified delivery.
              </li>
              <li>
                <strong className="text-foreground">Damaged in Transit:</strong> If an object
                arrives cracked, broken, or defective, email photos to{" "}
                <a href="mailto:support@eka.earth" className="text-terracotta underline">
                  support@eka.earth
                </a>{" "}
                within 48 hours of delivery. We will immediately dispatch a free replacement or
                issue a 100% full refund including shipping.
              </li>
              <li>
                <strong className="text-foreground">Consumable Goods:</strong> Unsealed incense,
                sacred oils, camphor, or holy water cannot be returned for sanitary and ritual
                purity considerations unless delivered damaged or defective.
              </li>
            </ul>
          </section>

          {/* 5. Processing Timelines & Modes */}
          <section className="space-y-4">
            <h2 className="font-display text-2xl text-foreground">
              5. Processing Timelines & Payment Methods
            </h2>
            <p className="text-muted-foreground">
              All approved refunds are initiated through our authorized payment gateways (Stripe,
              Razorpay, or UPI):
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border/70 bg-card p-4 text-center">
                <Clock className="mx-auto size-5 text-muted-foreground" />
                <p className="mt-2 font-semibold text-foreground text-xs">UPI Payments</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  1 to 2 business days directly to VPA
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card p-4 text-center">
                <Clock className="mx-auto size-5 text-muted-foreground" />
                <p className="mt-2 font-semibold text-foreground text-xs">Netbanking</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  3 to 5 business days per bank schedules
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card p-4 text-center">
                <Clock className="mx-auto size-5 text-muted-foreground" />
                <p className="mt-2 font-semibold text-foreground text-xs">Credit & Debit Cards</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  5 to 7 business days per card network
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Refunds are strictly remitted back to the original source payment instrument to
              prevent fraud and money laundering.
            </p>
          </section>

          {/* 6. Contact & Escalation */}
          <section className="border-t border-border/70 pt-8">
            <h2 className="font-display text-2xl text-foreground">
              6. Billing Help & Dispute Escalation
            </h2>
            <p className="mt-2 text-muted-foreground">
              If you have any questions regarding an invoice, pending charge, or refund request:
            </p>
            <div className="mt-4 rounded-xl border border-border/70 bg-card p-5 text-xs space-y-1.5">
              <p>
                <strong>Billing Support:</strong>{" "}
                <a href="mailto:billing@eka.earth" className="text-terracotta underline">
                  billing@eka.earth
                </a>
              </p>
              <p>
                <strong>Consumer Grievance Desk:</strong>{" "}
                <a href="mailto:grievance@eka.earth" className="text-terracotta underline">
                  grievance@eka.earth
                </a>
              </p>
              <p>
                <strong>Statutory Escalation Timeline:</strong> All billing disputes acknowledged
                within 24 hours and investigated within 7 business days.
              </p>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
