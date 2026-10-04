import { createFileRoute } from "@tanstack/react-router";
import { CreatorRiskOps } from "@/apps/founder-admin/components/CreatorRiskOps";

export const Route = createFileRoute("/founder-admin/risk")({
  head: () => ({
    meta: [
      { title: "EKA Creator Risk & Fraud Center — Founder Cockpit" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CreatorRiskOps,
});
