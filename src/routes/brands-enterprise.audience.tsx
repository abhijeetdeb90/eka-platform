import { createFileRoute } from "@tanstack/react-router";
import { BrandGrowthOS } from "@/components/brands/BrandGrowthOS";

export const Route = createFileRoute("/brands-enterprise/audience")({
  head: () => ({
    meta: [
      { title: "Audience Intelligence — EKA Brand Workspace" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <BrandGrowthOS initialTab="audience" />,
});
