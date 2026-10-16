/**
 * Vercel Edge Middleware — money API auth gate + public plan catalog.
 */
const MONEY_PATHS = [
  "/api/payouts",
  "/api/payments",
  "/api/create-order",
  "/api/refunds",
  "/api/creator-earnings",
  "/api/verify-payment",
  "/api/finance",
  "/api/reconciliation",
];

const PUBLIC_PLANS = [
  {
    id: "monthly",
    code: "EKA_PATRON_MONTHLY",
    name: "Monthly EKA+ Membership",
    description:
      "Full access to cultural intelligence, AI exploration, Creator Studio, and community circles.",
    amount_minor: 49900,
    currency: "INR",
    cadence: "monthly",
    period_days: 30,
    is_active: true,
    features: ["cultural_library", "ai_exploration", "community_circles"],
  },
  {
    id: "quarterly",
    code: "EKA_PATRON_QUARTERLY",
    name: "Quarterly Patron Membership",
    description: "Seasonal rhythm alignment with seasonal workshops and heritage previews.",
    amount_minor: 79900,
    currency: "INR",
    cadence: "quarterly",
    period_days: 90,
    is_active: true,
    features: ["cultural_library", "seasonal_workshops", "heritage_previews"],
  },
  {
    id: "annual",
    code: "EKA_PATRON_ANNUAL",
    name: "Annual Patron Membership",
    description: "Full annual cycle of the twelve themes with VIP invitations.",
    amount_minor: 299000,
    currency: "INR",
    cadence: "annual",
    period_days: 365,
    is_active: true,
    features: ["full_annual_cycle", "vip_invitations", "peace_fund_patron"],
  },
  {
    id: "creator_pro",
    code: "EKA_CREATOR_PRO",
    name: "Creator Studio Pro",
    description: "Master Artisan Workspace with Epistemic Tier tagging & priority settlements.",
    amount_minor: 49900,
    currency: "INR",
    cadence: "monthly",
    period_days: 30,
    is_active: true,
    features: ["artisan_studio", "epistemic_tags", "priority_settlement"],
  },
  {
    id: "brand_growth",
    code: "EKA_BRAND_GROWTH",
    name: "Brand Growth OS",
    description: "Trend Radar, Brand Brain AI, Autopilot campaigns and verified creator matching.",
    amount_minor: 999900,
    currency: "INR",
    cadence: "monthly",
    period_days: 30,
    is_active: true,
    features: ["trend_radar", "brand_brain_ai", "creator_marketplace"],
  },
];

export const config = {
  matcher: ["/api/:path*"],
};

export default function middleware(request: Request): Response | void {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method.toUpperCase();

  // Public plan catalog — answered at the edge (avoids SSR/route 500s)
  if (method === "GET" && pathname === "/api/subscriptions") {
    return new Response(JSON.stringify({ success: true, plans: PUBLIC_PLANS }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "public, max-age=60",
        "x-eka-plans": "edge",
      },
    });
  }

  // Other GET under /api/subscriptions/* (e.g. entitlement) still require auth below
  const needsAuth =
    MONEY_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname === "/api/subscriptions" ||
    pathname.startsWith("/api/subscriptions/");

  if (!needsAuth) return;

  const auth = request.headers.get("authorization");
  if (!auth || !/^Bearer\s+\S+/i.test(auth)) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized: Missing Authorization header",
        guard: "v1-vercel-edge-middleware",
      }),
      {
        status: 401,
        headers: {
          "content-type": "application/json",
          "cache-control": "no-store",
          "x-eka-auth-guard": "v1-vercel-edge-middleware",
        },
      },
    );
  }
}
