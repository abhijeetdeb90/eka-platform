import { createFileRoute } from "@tanstack/react-router";
import { BrandsEnterpriseShell } from "@/apps/brands-enterprise/components/BrandsEnterpriseShell";
import { brandsEnterpriseBeforeLoad } from "@/apps/brands-enterprise/guards/auth-guard";

export const Route = createFileRoute("/brands-enterprise")({
  beforeLoad: async () => {
    return await brandsEnterpriseBeforeLoad();
  },
  head: () => ({
    meta: [
      { title: "EKA for Brands & Enterprise Solutions" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: BrandsEnterpriseShell,
});
