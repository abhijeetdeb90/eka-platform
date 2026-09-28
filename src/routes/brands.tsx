// ==============================================================================
// EKA GROWTH OS — BRANDS REALM (/brands)
// ==============================================================================
// Meta Ads Manager + GA4 + CRM + AI Strategy Layer for Brands on EKA
// Mental Model: "Here is what your audience is doing, why it matters,
// what you should do next, and then let me execute it."
// ==============================================================================

import { createFileRoute } from "@tanstack/react-router";
import { BrandGrowthOS, type BrandTab } from "@/components/brands/BrandGrowthOS";

interface BrandsSearch {
  tab?: BrandTab;
}

export const Route = createFileRoute("/brands")({
  validateSearch: (search: Record<string, unknown>): BrandsSearch => {
    const validTabs: BrandTab[] = [
      "dashboard",
      "campaigns",
      "audience",
      "promote",
      "analytics",
      "crm",
      "strategy",
      "agent",
    ];
    const requested = search.tab as BrandTab;
    return {
      tab: validTabs.includes(requested) ? requested : "dashboard",
    };
  },
  head: () => ({
    meta: [
      { title: "EKA Growth OS for Brands — Meta Ads + GA4 + CRM + AI Strategy" },
      {
        name: "description",
        content:
          "Run your brand's growth on EKA. Audience intelligence, short-video campaign delivery, Indic market insights, CRM, and Gemini AI strategy optimization.",
      },
    ],
  }),
  component: BrandsRouteComponent,
});

function BrandsRouteComponent() {
  const { tab } = Route.useSearch();
  return <BrandGrowthOS initialTab={tab || "dashboard"} />;
}
