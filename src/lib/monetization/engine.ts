/**
 * ==============================================================================
 * EKA MONETISATION ARCHITECTURE & REVENUE ENGINE (CANONICAL)
 * ==============================================================================
 * 
 * Strict separation of revenue streams:
 * 
 * A. EKA REVENUE:
 *    - EKA Premium subscription (₹299/mo, ₹2,990/yr) -> 100% EKA revenue (creator payout = ₹0)
 *    - EKA Pro features / Cultural Intelligence API
 *    - Creator Pro tools (e.g. Creator Studio subscription ₹799/mo)
 *    - Enterprise SaaS & Cultural Intelligence products
 *    - Enterprise research, reports & sponsored placements
 *    -> NO creator payout or subsidy pool from EKA subscriptions.
 * 
 * B. CREATOR REVENUE:
 *    - Earns ONLY from completed transactions on creator-owned products/services:
 *      (Paid consultations, courses, workshops, cultural experiences, digital goods, ticketed events)
 *    - NO payouts for views, likes, followers, impressions, watch time, or posts.
 *    - Transaction-driven economics, NOT subsidy-driven.
 *    - Transparent ledger: GMV -> Creator Payout -> EKA Commission -> Gateway Cost -> Net EKA Revenue
 * ==============================================================================
 */

export type EkaRevenueStreamKind =
  | "eka_premium_subscription"
  | "creator_studio_tooling"
  | "cultural_intelligence_api"
  | "enterprise_saas"
  | "enterprise_research_report"
  | "sponsored_placement"
  | "platform_listing_fee";

export type CreatorOfferingKind =
  | "cultural_consultation"
  | "master_workshop"
  | "paid_course"
  | "cultural_experience"
  | "ticketed_event"
  | "digital_product"
  | "creator_service";

/**
 * Configurable Platform Commission Rules (in percentage points).
 * Can be tuned dynamically without application re-architecture.
 */
export interface CommissionConfig {
  cultural_consultation: number; // Default 5.0%
  master_workshop: number;        // Default 8.0%
  paid_course: number;            // Default 10.0%
  cultural_experience: number;    // Default 10.0%
  ticketed_event: number;         // Default 8.0%
  digital_product: number;        // Default 10.0%
  creator_service: number;        // Default 5.0%
  default: number;                // Default 10.0%
  gatewayFeeRatePercent: number;  // ~2.0% gateway fee
  gstOnGatewayPercent: number;    // 18.0% GST on gateway processing fee
  tdsPanVerifiedPercent: number;  // 1.0% u/s 194-O (e-commerce operator)
  tdsNoPanPercent: number;        // 20.0% penal rate u/s 206AA
}

export const DEFAULT_COMMISSION_CONFIG: CommissionConfig = {
  cultural_consultation: 5.0,
  master_workshop: 8.0,
  paid_course: 10.0,
  cultural_experience: 10.0,
  ticketed_event: 8.0,
  digital_product: 10.0,
  creator_service: 5.0,
  default: 10.0,
  gatewayFeeRatePercent: 2.0,
  gstOnGatewayPercent: 18.0,
  tdsPanVerifiedPercent: 1.0,
  tdsNoPanPercent: 20.0,
};

/**
 * Transaction Breakdown for Creator Commerce
 */
export interface TransactionBreakdown {
  gmvMinor: number;                     // Gross Transaction Value (in paise / cents)
  offeringKind: CreatorOfferingKind;
  takeRatePercent: number;              // EKA commission rate
  ekaCommissionMinor: number;           // EKA Platform Commission (in paise)
  gatewayProcessingCostMinor: number;   // Payment Gateway fee + GST
  netEkaRevenueMinor: number;           // EKA Commission minus payment processing costs
  creatorGrossShareMinor: number;       // GMV minus EKA Commission
  tdsWithholdingMinor: number;          // Statutory TDS withholding
  creatorNetPayoutMinor: number;        // Actual payout dispatched to creator bank account
  contributionMarginPercent: number;    // Net EKA revenue / EKA Commission
}

/**
 * Computes exact transaction economics for any completed creator transaction.
 * Never uses floating-point pennies for payout outputs.
 */
export function calculateCreatorTransaction(
  gmvMinor: number,
  offeringKind: CreatorOfferingKind,
  options?: {
    customTakeRatePercent?: number;
    panVerified?: boolean;
    config?: Partial<CommissionConfig>;
  }
): TransactionBreakdown {
  if (gmvMinor <= 0 || !Number.isInteger(gmvMinor)) {
    throw new Error(`Invalid GMV amount: must be positive integer minor units, got ${gmvMinor}`);
  }

  const cfg: CommissionConfig = {
    ...DEFAULT_COMMISSION_CONFIG,
    ...options?.config,
  };

  const takeRatePercent =
    options?.customTakeRatePercent ??
    cfg[offeringKind] ??
    cfg.default;

  // 1. EKA Commission
  const ekaCommissionMinor = Math.round((gmvMinor * takeRatePercent) / 100);

  // 2. Gateway Processing Cost: (2% + 18% GST = 2.36% of GMV)
  const baseGateway = (gmvMinor * cfg.gatewayFeeRatePercent) / 100;
  const gstOnGateway = (baseGateway * cfg.gstOnGatewayPercent) / 100;
  const gatewayProcessingCostMinor = Math.round(baseGateway + gstOnGateway);

  // 3. Net EKA Revenue from this transaction
  const netEkaRevenueMinor = Math.max(0, ekaCommissionMinor - gatewayProcessingCostMinor);

  // 4. Creator Share
  const creatorGrossShareMinor = gmvMinor - ekaCommissionMinor;

  // 5. TDS withholding (Section 194-O)
  const tdsRate = (options?.panVerified ?? true)
    ? cfg.tdsPanVerifiedPercent
    : cfg.tdsNoPanPercent;
  const tdsWithholdingMinor = Math.round((creatorGrossShareMinor * tdsRate) / 100);

  // 6. Creator Net Payout
  const creatorNetPayoutMinor = Math.max(0, creatorGrossShareMinor - tdsWithholdingMinor);

  // 7. Contribution Margin
  const contributionMarginPercent =
    ekaCommissionMinor > 0
      ? Math.round((netEkaRevenueMinor / ekaCommissionMinor) * 1000) / 10
      : 0;

  return {
    gmvMinor,
    offeringKind,
    takeRatePercent,
    ekaCommissionMinor,
    gatewayProcessingCostMinor,
    netEkaRevenueMinor,
    creatorGrossShareMinor,
    tdsWithholdingMinor,
    creatorNetPayoutMinor,
    contributionMarginPercent,
  };
}

/**
 * Calculates EKA Subscription Revenue.
 * Strict rule: 100% belongs to EKA. Creator payout = 0.
 */
export interface SubscriptionRevenueBreakdown {
  activeSubscribers: number;
  monthlyPricePaise: number;
  grossSubscriptionRevenueMinor: number;
  gatewayProcessingCostMinor: number;
  netEkaSubscriptionRevenueMinor: number;
  creatorPayoutMinor: 0; // Strictly 0!
}

export function calculateEkaSubscriptionRevenue(
  activeSubscribers: number,
  monthlyPricePaise: number = 29_900 // ₹299 benchmark
): SubscriptionRevenueBreakdown {
  const gross = activeSubscribers * monthlyPricePaise;
  // ~2% gateway cost on subscriptions
  const gatewayProcessing = Math.round((gross * 0.02 * 1.18));
  const net = Math.max(0, gross - gatewayProcessing);

  return {
    activeSubscribers,
    monthlyPricePaise,
    grossSubscriptionRevenueMinor: gross,
    gatewayProcessingCostMinor: gatewayProcessing,
    netEkaSubscriptionRevenueMinor: net,
    creatorPayoutMinor: 0,
  };
}

/**
 * Master Financial Ledger Aggregation Model
 */
export interface MasterFinancialTelemetry {
  // A. EKA Owned Revenue
  subscriptionRevenueGrossMinor: number;
  subscriptionRevenueNetMinor: number;
  enterpriseRevenueGrossMinor: number;
  creatorStudioToolingRevenueMinor: number;
  totalEkaDirectRevenueMinor: number;

  // B. Creator Commerce
  creatorGmvMinor: number;
  completedTransactionsCount: number;
  ekaPlatformCommissionMinor: number;
  totalCreatorPayoutsDispatchedMinor: number;
  totalTdsWithheldMinor: number;
  totalProcessingCostsMinor: number;

  // C. Combined EKA Economics
  totalGrossPlatformInflowMinor: number;
  totalNetEkaRevenueMinor: number;
  blendedTakeRatePercent: number;
  overallContributionMarginPercent: number;
}

export function aggregateMasterFinancials(params: {
  activeSubscribers: number;
  subPricePaise?: number;
  creatorStudioSubscribers?: number;
  enterpriseContractValueMinor?: number;
  creatorTransactions: Array<{
    gmvMinor: number;
    kind: CreatorOfferingKind;
    panVerified?: boolean;
  }>;
}): MasterFinancialTelemetry {
  const subBreakdown = calculateEkaSubscriptionRevenue(
    params.activeSubscribers,
    params.subPricePaise ?? 29_900
  );

  const creatorStudioSubRevenue = (params.creatorStudioSubscribers ?? 0) * 79_900; // ₹799
  const enterpriseRevenue = params.enterpriseContractValueMinor ?? 0;

  let creatorGmvMinor = 0;
  let ekaCommissionMinor = 0;
  let creatorPayoutsMinor = 0;
  let tdsWithheldMinor = 0;
  let transactionProcessingCosts = 0;

  for (const txn of params.creatorTransactions) {
    const res = calculateCreatorTransaction(txn.gmvMinor, txn.kind, {
      panVerified: txn.panVerified,
    });
    creatorGmvMinor += res.gmvMinor;
    ekaCommissionMinor += res.ekaCommissionMinor;
    creatorPayoutsMinor += res.creatorNetPayoutMinor;
    tdsWithheldMinor += res.tdsWithholdingMinor;
    transactionProcessingCosts += res.gatewayProcessingCostMinor;
  }

  const directEkaRev =
    subBreakdown.grossSubscriptionRevenueMinor +
    creatorStudioSubRevenue +
    enterpriseRevenue;

  const totalInflows = directEkaRev + creatorGmvMinor;

  const totalNetEka =
    subBreakdown.netEkaSubscriptionRevenueMinor +
    creatorStudioSubRevenue +
    enterpriseRevenue +
    Math.max(0, ekaCommissionMinor - transactionProcessingCosts);

  const blendedTakeRate =
    creatorGmvMinor > 0
      ? Math.round((ekaCommissionMinor / creatorGmvMinor) * 1000) / 10
      : 0;

  const overallGrossFees = directEkaRev + ekaCommissionMinor;
  const overallMargin =
    overallGrossFees > 0
      ? Math.round((totalNetEka / overallGrossFees) * 1000) / 10
      : 0;

  return {
    subscriptionRevenueGrossMinor: subBreakdown.grossSubscriptionRevenueMinor,
    subscriptionRevenueNetMinor: subBreakdown.netEkaSubscriptionRevenueMinor,
    enterpriseRevenueGrossMinor: enterpriseRevenue,
    creatorStudioToolingRevenueMinor: creatorStudioSubRevenue,
    totalEkaDirectRevenueMinor: directEkaRev,
    creatorGmvMinor,
    completedTransactionsCount: params.creatorTransactions.length,
    ekaPlatformCommissionMinor: ekaCommissionMinor,
    totalCreatorPayoutsDispatchedMinor: creatorPayoutsMinor,
    totalTdsWithheldMinor: tdsWithheldMinor,
    totalProcessingCostsMinor: subBreakdown.gatewayProcessingCostMinor + transactionProcessingCosts,
    totalGrossPlatformInflowMinor: totalInflows,
    totalNetEkaRevenueMinor: totalNetEka,
    blendedTakeRatePercent: blendedTakeRate,
    overallContributionMarginPercent: overallMargin,
  };
}
