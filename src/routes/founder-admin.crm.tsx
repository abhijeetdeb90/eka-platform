import { createFileRoute } from "@tanstack/react-router";
import { StudioEngagementCCRM } from "@/components/studio/StudioEngagementCCRM";

export const Route = createFileRoute("/founder-admin/crm")({
  head: () => ({
    meta: [
      { title: "EKA Engagement CRM & Member Lifecycle — Founder Cockpit" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: FounderCrmPage,
});

function FounderCrmPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-semibold">
          Member Lifecycle & Community Operations
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-normal text-white">
          Contemplative CRM & Lifecycle Engine
        </h2>
        <p className="text-xs text-neutral-400 font-light max-w-2xl">
          Monitor member onboarding progress, retention offers, daily rhythm check-ins, and automated email/push notifications.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-calm">
        <StudioEngagementCCRM currentRole="Founder" />
      </div>
    </div>
  );
}
