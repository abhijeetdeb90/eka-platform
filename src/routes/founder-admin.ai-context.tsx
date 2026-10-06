import { createFileRoute } from "@tanstack/react-router";
import { AiContextHealthOps } from "@/apps/founder-admin/components/AiContextHealthOps";

export const Route = createFileRoute("/founder-admin/ai-context")({
  head: () => ({
    meta: [
      { title: "AI Context Health & Token Telemetry (1M Guard) — Founder Cockpit" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AiContextHealthOps,
});
