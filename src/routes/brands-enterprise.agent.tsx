import { createFileRoute } from "@tanstack/react-router";
import { BrandingAgentView } from "@/apps/brands-enterprise/components/BrandingAgentView";

export const Route = createFileRoute("/brands-enterprise/agent")({
  head: () => ({
    meta: [
      { title: "Cultural Alignment Branding Agent — EKA Brand Workspace" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: BrandingAgentView,
});
