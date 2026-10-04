import { createFileRoute } from "@tanstack/react-router";
import { SystemMapOps } from "@/apps/founder-admin/components/SystemMapOps";

export const Route = createFileRoute("/founder-admin/system")({
  head: () => ({
    meta: [
      { title: "EKA Master System Map & Subsystem Diagnostics — Founder Cockpit" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SystemMapOps,
});
