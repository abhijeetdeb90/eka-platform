import { createFileRoute } from "@tanstack/react-router";
import { PlatformFinanceOps } from "@/apps/founder-admin/components/PlatformFinanceOps";

export const Route = createFileRoute("/founder-admin/finance")({
  head: () => ({
    meta: [
      { title: "EKA Settlements & Platform Finance — Founder Cockpit" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PlatformFinanceOps,
});
