import { createFileRoute } from "@tanstack/react-router";
import { OpsRadar, type OpsTab } from "@/apps/founder-admin/components/OpsRadar";

interface OpsSearch {
  tab?: OpsTab;
}

export const Route = createFileRoute("/founder-admin/ops")({
  validateSearch: (search: Record<string, unknown>): OpsSearch => {
    const validTabs: OpsTab[] = [
      "founder",
      "system",
      "consumer-ops",
      "brand-ops",
      "telemetry",
      "agents",
      "crm",
      "investor-status",
    ];
    const requested = search["tab"] as OpsTab;
    return {
      tab: validTabs.includes(requested) ? requested : "founder",
    };
  },
  head: () => ({
    meta: [
      { title: "EKA Operations Radar — Founder Cockpit" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OpsRoutePage,
});

function OpsRoutePage() {
  const { tab } = Route.useSearch();
  return <OpsRadar initialTab={tab} />;
}
