import { createFileRoute } from "@tanstack/react-router";
import { BrandGrowthOS } from "@/components/brands/BrandGrowthOS";

export const Route = createFileRoute("/brands-enterprise/")({
  head: () => ({
    meta: [
      { title: "EKA Brand Growth OS — Dashboard" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <BrandGrowthOS initialTab="dashboard" />,
});
