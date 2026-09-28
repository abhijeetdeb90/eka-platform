/**
 * EKA Monthly Creator Knowledge Pool & Multi-Contributor Split Engine
 */

export interface PlatformRevenueInflow {
  membershipsGross: number; // e.g. ₹299/mo subscriptions
  fanSupportGross: number; // 85% creator / 15% platform
  coursesGross: number; // 80% creator / 20% platform
  brandMarketplaceGross: number; // 80% creator / 20% platform
  commerceGross: number; // 75% creator / 25% platform
  sponsorGross: number; // 55% creator / 45% platform
}

export interface MonthlyPoolCalculation {
  grossInflows: number;
  statutoryDeductions: {
    gstEstimated: number; // 18% on platform fee
    gatewayProcessing: number; // ~2%
    refundReserve: number; // ~5% rolling reserve
    totalDeductions: number;
  };
  netPlatformRevenue: number;
  knowledgePoolFunded: number; // Pool earmarked for knowledge & trust contributors
  directCreatorEarnings: number; // Direct fan support, courses, marketplace
}

export interface ContributorAttributionSplit {
  contentId: string;
  totalEarningsForContent: number;
  shares: Array<{
    role: "creator" | "source" | "verifier" | "community_steward" | "translator" | "platform";
    recipientName: string;
    percentage: number;
    amount: number;
  }>;
}

/**
 * Standard Revenue Splits
 */
export const PLATFORM_SPLITS = {
  fanSupport: { creator: 0.85, platform: 0.15 },
  memberships: { creatorPool: 0.85, platform: 0.15 },
  courses: { creator: 0.8, platform: 0.2 },
  brandMarketplace: { creator: 0.8, platform: 0.2 },
  commerce: { creator: 0.75, platform: 0.25 },
  advertising: { creator: 0.55, platform: 0.45 },
} as const;

/**
 * Computes monthly pool breakdown
 */
export function calculateMonthlyPool(inflows: PlatformRevenueInflow): MonthlyPoolCalculation {
  const gross =
    inflows.membershipsGross +
    inflows.fanSupportGross +
    inflows.coursesGross +
    inflows.brandMarketplaceGross +
    inflows.commerceGross +
    inflows.sponsorGross;

  const gatewayProcessing = Math.round(gross * 0.02);
  const refundReserve = Math.round(gross * 0.05);
  const gstEstimated = Math.round(gross * 0.15 * 0.18 * 100) / 100; // GST on platform portion
  const totalDeductions = gatewayProcessing + refundReserve + gstEstimated;

  const netPlatformRevenue = Math.max(0, gross - totalDeductions);

  // Memberships allocate 85% directly to the Creator & Knowledge Pool
  const knowledgePoolFunded = Math.round(
    inflows.membershipsGross * PLATFORM_SPLITS.memberships.creatorPool,
  );

  const directCreatorEarnings =
    Math.round(inflows.fanSupportGross * PLATFORM_SPLITS.fanSupport.creator) +
    Math.round(inflows.coursesGross * PLATFORM_SPLITS.courses.creator) +
    Math.round(inflows.brandMarketplaceGross * PLATFORM_SPLITS.brandMarketplace.creator) +
    Math.round(inflows.commerceGross * PLATFORM_SPLITS.commerce.creator);

  return {
    grossInflows: gross,
    statutoryDeductions: {
      gstEstimated,
      gatewayProcessing,
      refundReserve,
      totalDeductions,
    },
    netPlatformRevenue,
    knowledgePoolFunded,
    directCreatorEarnings,
  };
}

/**
 * Distributes earnings for a single knowledge artifact across its contributors
 */
export function calculateAttributionSplit(
  contentId: string,
  totalEarnings: number,
  participants: Array<{
    role: "creator" | "source" | "verifier" | "community_steward" | "translator" | "platform";
    recipientName: string;
    percentage: number;
  }>,
): ContributorAttributionSplit {
  return {
    contentId,
    totalEarningsForContent: totalEarnings,
    shares: participants.map((p) => ({
      ...p,
      amount: Math.round(totalEarnings * (p.percentage / 100) * 100) / 100,
    })),
  };
}
