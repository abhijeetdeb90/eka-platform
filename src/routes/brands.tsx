// ==============================================================================
// EKA BRAND WORKSPACE (/brands)
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
      "radar",
      "brain",
      "autopilot",
      "creators",
      "attribution",
      "campaigns",
      "audience",
      "promote",
      "analytics",
      "crm",
      "strategy",
      "agent",
    ];
    const requested = search["tab"] as BrandTab;
    return {
      tab: validTabs.includes(requested) ? requested : "dashboard",
    };
  },
  head: () => ({
    meta: [
      { title: "EKA Brand Workspace — Audience Intelligence, Campaigns & Analytics" },
      {
        name: "description",
        content:
          "Authorized workspace for brands on EKA. Audience intelligence, campaign delivery, CRM, and AI strategy optimization.",
      },
    ],
  }),
  component: BrandsRouteComponent,
});

function BrandsRouteComponent() {
  const { tab } = Route.useSearch();
  return <BrandGrowthOS initialTab={tab || "dashboard"} />;
}
