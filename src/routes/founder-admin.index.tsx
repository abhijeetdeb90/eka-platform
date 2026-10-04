import { createFileRoute } from "@tanstack/react-router";
import { FounderCockpit } from "@/apps/founder-admin/components/FounderCockpit";

export const Route = createFileRoute("/founder-admin/")({
  head: () => ({
    meta: [
      { title: "EKA Founder Cockpit — Executive Command" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: FounderCockpit,
});
