import { createFileRoute } from "@tanstack/react-router";
import { KnowledgeOps } from "@/apps/founder-admin/components/KnowledgeOps";

export const Route = createFileRoute("/founder-admin/knowledge")({
  head: () => ({
    meta: [
      { title: "EKA Epistemic & Knowledge Ops — Founder Cockpit" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: KnowledgeOps,
});
