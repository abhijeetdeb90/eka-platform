// src/lib/constants/economics.ts: the canonical source of truth for platform pricing and economics
// Strict separation of EKA Revenue (Subscriptions, Pro tools, Enterprise) vs Creator Revenue (Transaction payouts)

/**
 * Benchmark digital membership pricing in integer paise (INR).
 * Unified EKA+ at ₹499/month (49,900 paise) and ₹4,990/year (499,000 paise - 10 months paid, 2 months free).
 * 100% of this revenue belongs to EKA. Creator payout from subscriptions = ₹0.
 */
export const PLUS_PRICE_PAISE = 49_900;
export const PLUS_ANNUAL_PAISE = 499_000;

/**
 * Legacy Creator Studio Pro subscription fee (now merged into EKA+ at ₹499/mo).
 * Preserved for backwards compatibility with existing records.
 */
export const CREATOR_STUDIO_PRICE_PAISE = 49_900;

/**
 * Platform commission in basis points (1 bps = 0.01%, 100 bps = 1%).
 * Applied ONLY to completed creator commerce transactions.
 * - Consultations & 1-on-1 sessions: 5% = 500 bps
 * - Workshops & Ticketed Events: 8% = 800 bps
 * - Digital offerings, masterclasses, physical goods: 10% = 1000 bps
 */
export const COMMISSION_BPS = {
  services: 500,
  workshops: 800,
  goods: 1000,
  brand_collab: 1000,
  digital: 1000,
} as const;

/**
 * Calculates platform fee in integer paise using half-up rounding.
 * Creator receives the remainder (grossPaise - platformFee), so fee + creator = gross exactly.
 */
export const feePaise = (grossPaise: number, bps: number): number =>
  Math.floor((grossPaise * bps + 5000) / 10000);
