import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Lock, FileText, UserCheck, EyeOff, AlertCircle, HelpCircle } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy & DPDP Notice — EKA" },
      {
        name: "description",
        content:
          "EKA's Privacy Policy, Data Protection Charter, and Indian Digital Personal Data Protection (DPDP) Act compliance disclosures.",
      },
      { property: "og:title", content: "EKA Privacy Policy & Data Protection Charter" },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary-soft selection:text-foreground">
      <SiteHeader />
      <main className="container-eka mx-auto max-w-4xl px-5 py-16 lg:py-24">
        {/* Header */}
        <div className="border-b border-border/70 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            <Shield className="size-3.5 text-forest" />
            <span>Privacy & Data Protection Charter</span>
          </div>
          <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
            EKA Privacy Policy
          </h1>
          <p className="mt-3 text-lg text-muted-foreground font-light leading-relaxed">
            How we protect your inner life, honor data minimization, and uphold compliance with
            India’s Digital Personal Data Protection (DPDP) Act, 2023 & DPDP Rules, 2025.
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
              <strong>Data Fiduciary:</strong> EKA Knowledge Systems Private Limited (in formation)
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-12 space-y-12 text-sm leading-relaxed text-foreground/90">
          {/* 1. Core Commitment */}
          <section className="rounded-2xl border border-border/80 bg-sand/30 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-2xl text-foreground">
              <Lock className="size-5 text-terracotta" />
              1. The EKA Privacy Principle: Sanctuary for the Inner Life
            </h2>
            <p className="mt-3">
              EKA is designed as a structured knowledge system and contemplative sanctuary. We
              believe your spiritual, philosophical, and personal reflections deserve the highest
              ethical stewardship.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-card p-4">
                <p className="font-medium text-foreground">Separation of Data</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your identity/account credentials are strictly isolated from your spiritual
                  preferences and private journal entries.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card p-4">
                <p className="font-medium text-foreground">No Mandatory Sensitive Profiling</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  We never make religion, caste, lineage, or spiritual affiliation mandatory to
                  explore EKA or create an account.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Business Identity & Data Fiduciary */}
          <section>
            <h2 className="font-display text-2xl text-foreground">
              2. Data Fiduciary & Business Identity
            </h2>
            <p className="mt-3">
              Under the Digital Personal Data Protection Act, 2023 (DPDP Act), the{" "}
              <strong>Data Fiduciary</strong> responsible for determining the purposes and means of
              processing personal data is:
            </p>
            <div className="mt-4 rounded-xl border border-border/70 bg-card p-5 space-y-1 text-xs">
              <p>
                <strong>Entity Name:</strong> EKA Knowledge Systems Private Limited (or designated
                Operating Entity)
              </p>
              <p>
                <strong>Address:</strong> Bengaluru, Karnataka, India
              </p>
              <p>
                <strong>Support & Privacy Desk:</strong>{" "}
                <a href="mailto:privacy@eka.earth" className="text-terracotta underline">
                  privacy@eka.earth
                </a>
              </p>
              <p>
                <strong>Grievance Officer:</strong> Grievance Redressal Desk (
                <a href="mailto:grievance@eka.earth" className="text-terracotta underline">
                  grievance@eka.earth
                </a>
                {" "}· During beta preview: inquiries can also be submitted directly via in-app settings or support)
              </p>
            </div>
          </section>

          {/* 3. Data We Collect & Data Minimization */}
          <section>
            <h2 className="font-display text-2xl text-foreground">
              3. Categories of Data Collected
            </h2>
            <p className="mt-3">
              We practice strict <strong>data minimization</strong>. We collect only what is
              strictly necessary to deliver each distinct feature:
            </p>
            <ul className="mt-4 list-disc pl-5 space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Basic Account Data:</strong> Email address,
                encrypted authentication identifiers (via Google OAuth or secure email magic links),
                username, and display name.
              </li>
              <li>
                <strong className="text-foreground">Voluntary Cultural Context:</strong> Optional
                traditions, practices, or learning themes you select to customize your study feed.
                You may reset or erase these at any time.
              </li>
              <li>
                <strong className="text-foreground">Member Contributions:</strong> Posts, comments,
                reflections, citations, and questions you choose to publish publicly in Circles or
                feeds.
              </li>
              <li>
                <strong className="text-foreground">Private Practice Logs:</strong> Private journal
                entries, sadhana tracker check-ins, and fasting observances, stored with strict
                user-level access controls.
              </li>
              <li>
                <strong className="text-foreground">Technical & Session Metadata:</strong> Device
                screen resolution, operating system, and essential session security cookies to
                protect against account takeover.
              </li>
            </ul>
          </section>

          {/* 4. Purpose of Processing & Legal Basis */}
          <section>
            <h2 className="font-display text-2xl text-foreground">
              4. Purpose of Collection & Legal Basis
            </h2>
            <p className="mt-3">
              We process personal data based on{" "}
              <strong>explicit, informed affirmative consent</strong> and legitimate operational
              requirements:
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-border/70">
              <table className="w-full text-left text-xs">
                <thead className="bg-sand/40 border-b border-border/70 text-foreground font-medium">
                  <tr>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Data Used</th>
                    <th className="p-3">Legal Basis (DPDP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="p-3 font-medium">Account Access & Authentication</td>
                    <td className="p-3 text-muted-foreground">Email, auth token, username</td>
                    <td className="p-3">Contractual necessity & Consent</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Feed Customization & Sacred Calendar</td>
                    <td className="p-3 text-muted-foreground">
                      Voluntary traditions, saved themes
                    </td>
                    <td className="p-3">Explicit Affirmative Consent</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Content Verification & Trust Audits</td>
                    <td className="p-3 text-muted-foreground">
                      Published citations, contributor ID
                    </td>
                    <td className="p-3">Legitimate Interest / Public Trust</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Community Safety & Anti-Harassment</td>
                    <td className="p-3 text-muted-foreground">Report logs, moderator actions</td>
                    <td className="p-3">Legal obligation & Platform safety</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Artificial Intelligence & Boundary Disclosures */}
          <section className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-2xl text-foreground">
              <EyeOff className="size-5 text-saffron" />
              5. AI Privacy Boundary & Training Policy
            </h2>
            <p className="mt-3">
              EKA utilizes AI for linguistic translation, knowledge graph contextualization, and
              wisdom indexing. We enforce strict boundaries:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
              <li>
                <strong>No Private Data in Training:</strong> Your private journal entries,
                confidential messages, and unshared drafts are NEVER sent to third-party model
                providers for training.
              </li>
              <li>
                <strong>Zero PII in Prompts:</strong> Semantic queries are sanitized to strip
                personal identifiers before being processed by retrieval engines.
              </li>
              <li>
                <strong>Auditability:</strong> AI-generated summaries are transparently marked as
                synthetic and subject to source provenance validation.
              </li>
            </ul>
          </section>

          {/* 6. Children's Data Safeguards */}
          <section>
            <h2 className="font-display text-2xl text-foreground">
              6. Children’s Personal Data Protection
            </h2>
            <p className="mt-3">
              In accordance with Section 9 of the DPDP Act, 2023, EKA does not knowingly process
              personal data of individuals under the age of 18 without verifiable consent from their
              parent or lawful guardian. We do not engage in targeted behavioral advertising or
              tracking directed at children.
            </p>
          </section>

          {/* 7. Data Principal Rights */}
          <section>
            <h2 className="font-display text-2xl text-foreground">
              7. Your Rights under the DPDP Act
            </h2>
            <p className="mt-3">
              As a Data Principal, you have statutory rights that can be exercised directly from
              your profile settings or by contacting our Grievance Desk:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-card p-4">
                <p className="font-semibold text-foreground">Right to Access</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Request a machine-readable summary of all personal data held about you.
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card p-4">
                <p className="font-semibold text-foreground">Right to Correction & Erasure</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Correct inaccurate data or request complete deletion of your account and private
                  records.
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card p-4">
                <p className="font-semibold text-foreground">Right to Withdraw Consent</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Revoke optional personalization or notification permissions with the same ease as
                  granting them.
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card p-4">
                <p className="font-semibold text-foreground">Right of Grievance Redressal</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Escalate unresolved concerns to our Grievance Officer and subsequently the Data
                  Protection Board of India.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Medical & Spiritual Outcomes Disclaimer */}
          <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
            <h2 className="flex items-center gap-2 font-display text-xl text-foreground">
              <AlertCircle className="size-5 text-destructive" />
              8. Non-Medical & Non-Guaranteed Spiritual Outcomes Disclaimer
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              EKA is an educational, cultural, and spiritual exploration platform. The practices,
              discussions, meditations, and traditional rituals shared on EKA do NOT constitute
              professional medical, psychiatric, financial, or legal advice. EKA and its creators
              make no guarantees regarding physical healing, financial prosperity, or divine
              intervention.
            </p>
          </section>

          {/* 8.1 Data Retention Schedule */}
          <section className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-2xl text-foreground">
              <FileText className="size-5 text-primary" />
              8.1 Data Retention Schedule
            </h2>
            <p className="mt-3 text-muted-foreground text-xs">
              We retain personal data strictly as long as necessary to provide platform services, maintain trust and provenance, and satisfy statutory tax and compliance obligations:
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-border/70">
              <table className="w-full text-left text-xs">
                <thead className="bg-sand/40 border-b border-border/70 text-foreground font-semibold">
                  <tr>
                    <th className="p-3">Data Category</th>
                    <th className="p-3">Retention Window & Policy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-muted-foreground">
                  <tr>
                    <td className="p-3 font-medium text-foreground">Active Account & Profile</td>
                    <td className="p-3">Retained while account remains active and in good standing.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Account Deletion Request</td>
                    <td className="p-3">Soft-deleted for 14 days, permanently hard-deleted within 30 days. Backups roll off within 35 days.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Private Reflections & Journals</td>
                    <td className="p-3">100% user-controlled. Deleted immediately on request; never used for analytics or AI training.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Published Knowledge & Traditions</td>
                    <td className="p-3">Attribution may be anonymised on deletion; canonical citations and provenance remain in the knowledge graph.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Financial Ledger & Invoices</td>
                    <td className="p-3">8 years in compliance with applicable Indian tax and financial accounting regulations.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Auth & Security Logs</td>
                    <td className="p-3">12 months for threat detection and audit validation.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Analytics & Behavioral Telemetry</td>
                    <td className="p-3">14 months raw; pseudonymised after 90 days; subject to explicit consent choices.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Moderation & Enforcement Records</td>
                    <td className="p-3">24 months to maintain safety and address repeat violations.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Platform Audit Log</td>
                    <td className="p-3">Append-only for 3 years; actor identities pseudonymised upon account deletion.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 9. Grievance Redressal Officer */}
          <section className="border-t border-border/70 pt-8">
            <h2 className="font-display text-2xl text-foreground">
              9. Grievance Redressal Mechanism
            </h2>
            <p className="mt-2 text-muted-foreground">
              If you have any questions or complaints regarding the processing of your personal
              data, please contact:
            </p>
            <div className="mt-4 rounded-xl border border-border/70 bg-card p-5 text-xs space-y-1">
              <p>
                <strong>Grievance Officer:</strong> Compliance & Data Protection Officer
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:grievance@eka.earth" className="text-terracotta underline">
                  grievance@eka.earth
                </a>
              </p>
              <p>
                <strong>Response Timeline:</strong> Acknowledgement within 48 hours; resolution
                within 30 days as prescribed by law.
              </p>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
