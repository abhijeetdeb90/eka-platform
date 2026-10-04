import { createFileRoute } from "@tanstack/react-router";
import { BrandGrowthOS } from "@/components/brands/BrandGrowthOS";

export const Route = createFileRoute("/brands-enterprise/campaigns")({
  head: () => ({
    meta: [
      { title: "Campaigns & Promotion — EKA Brand Workspace" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <BrandGrowthOS initialTab="campaigns" />,
});
