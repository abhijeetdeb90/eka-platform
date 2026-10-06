/**
 * ==============================================================================
 * EKA PLATFORM & CREATOR COMMERCE FINANCIAL REVENUE ENGINE
 * ==============================================================================
 * Strict Separation:
 * - Subscriptions (EKA Premium ₹299/mo) belong 100% to EKA (Creator payout = ₹0).
 * - Creators earn exclusively from completed transactions on creator-owned offerings.
 * - Platform commission (take rate) is 5-10% on transactions.
 * - Cultural preservation grants (Peace & Knowledge Fund) are funded from platform operating budget.
 * ==============================================================================
 */

export interface PlatformRevenueInflow {
  membershipsGross: number; // e.g. ₹299/mo subscriptions -> 100% EKA Owned Revenue
  fanSupportGross: number; // Direct support: 95% creator / 5% platform
  coursesGross: number; // Paid courses: 90% creator / 10% platform
  brandMarketplaceGross: number; // Brand collabs: 90% creator / 10% platform
  commerceGross: number; // Digital/physical offerings: 90% creator / 10% platform
  sponsorGross: number; // Sponsored placements -> 100% EKA Owned Revenue
}

export interface MonthlyPoolCalculation {
  grossInflows: number;
  statutoryDeductions: {
    gstEstimated: number; // 18% on platform commission portion
    gatewayProcessing: number; // ~2.36% gateway processing (inclusive of GST)
    refundReserve: number; // ~5% rolling reserve
    totalDeductions: number;
  };
  ekaOwnedRevenue: {
    subscriptionGross: number;
    subscriptionNet: number;
    sponsorGross: number;
    platformCommissionFromTransactions: number;
    totalNetEkaRevenue: number;
  };
  directCreatorEarnings: number; // Completed transactions net payable to creators
  missionGrantBudget: number; // Discretionary cultural preservation allocation from platform profit
  knowledgePoolFunded: number; // Discretionary mission grant budget
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
 * Transaction Commission Splits for Creator Commerce
 * EKA Subscriptions: 100% EKA Owned Revenue (0% creator payout)
 */
export const PLATFORM_SPLITS = {
  memberships: { creatorPool: 0.0, platform: 1.0 }, // 100% EKA Revenue
  fanSupport: { creator: 0.95, platform: 0.05 },
  courses: { creator: 0.9, platform: 0.1 },
  brandMarketplace: { creator: 0.9, platform: 0.1 },
  commerce: { creator: 0.9, platform: 0.1 },
  advertising: { creator: 0.0, platform: 1.0 }, // 100% EKA Revenue
} as const;

/**
 * Computes monthly financial breakdown with strict separation between
 * EKA Owned Revenue and Creator Commerce Payouts.
 */
export function calculateMonthlyPool(inflows: PlatformRevenueInflow): MonthlyPoolCalculation {
  const gross =
    inflows.membershipsGross +
    inflows.fanSupportGross +
    inflows.coursesGross +
    inflows.brandMarketplaceGross +
    inflows.commerceGross +
    inflows.sponsorGross;

  // Transaction GMV
  const creatorCommerceGmv =
    inflows.fanSupportGross +
    inflows.coursesGross +
    inflows.brandMarketplaceGross +
    inflows.commerceGross;

  // Platform commission from creator commerce
  const platformCommissionFromTransactions =
    Math.round(inflows.fanSupportGross * PLATFORM_SPLITS.fanSupport.platform) +
    Math.round(inflows.coursesGross * PLATFORM_SPLITS.courses.platform) +
    Math.round(inflows.brandMarketplaceGross * PLATFORM_SPLITS.brandMarketplace.platform) +
    Math.round(inflows.commerceGross * PLATFORM_SPLITS.commerce.platform);

  // Direct creator earnings from completed transactions
  const directCreatorEarnings = creatorCommerceGmv - platformCommissionFromTransactions;

  // Gateway processing costs (~2% + 18% GST = 2.36%)
  const gatewayProcessing = Math.round(gross * 0.0236);
  const refundReserve = Math.round(creatorCommerceGmv * 0.05);

  // EKA subscription revenue: 100% EKA Owned
  const subscriptionGross = inflows.membershipsGross;
  const subGatewayProcessing = Math.round(subscriptionGross * 0.0236);
  const subscriptionNet = Math.max(0, subscriptionGross - subGatewayProcessing);

  // GST on platform fees (18% on commissions)
  const gstEstimated = Math.round(platformCommissionFromTransactions * 0.18 * 100) / 100;
  const totalDeductions = gatewayProcessing + refundReserve + gstEstimated;

  // Net EKA revenue = Net Subscriptions + Sponsors + Net Platform Commission
  const netCommission = Math.max(
    0,
    platformCommissionFromTransactions - Math.round(creatorCommerceGmv * 0.0236)
  );
  const totalNetEkaRevenue = subscriptionNet + inflows.sponsorGross + netCommission;

  // Discretionary 10% tithe from Net EKA Revenue towards Peace & Knowledge Preservation
  const missionGrantBudget = Math.round(totalNetEkaRevenue * 0.10);

  return {
    grossInflows: gross,
    statutoryDeductions: {
      gstEstimated,
      gatewayProcessing,
      refundReserve,
      totalDeductions,
    },
    ekaOwnedRevenue: {
      subscriptionGross,
      subscriptionNet,
      sponsorGross: inflows.sponsorGross,
      platformCommissionFromTransactions,
      totalNetEkaRevenue,
    },
    directCreatorEarnings,
    missionGrantBudget,
    knowledgePoolFunded: missionGrantBudget,
  };
}

/**
 * Distributes earnings for a single collaborative creator offering across verified co-contributors
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
