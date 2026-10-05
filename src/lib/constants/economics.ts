// src/lib/constants/economics.ts: the canonical source of truth for platform pricing and economics
// Grounded in docs/01-product/PRODUCT_AND_BRAND_KNOWLEDGE.md §14.11 and §14.1–14.4

/**
 * Benchmark digital membership pricing in integer paise (INR).
 * ₹299/month (29,900 paise) and ₹2,990/year (299,000 paise - 10 months paid, 2 months free).
 */
export const PLUS_PRICE_PAISE = 29_900;
export const PLUS_ANNUAL_PAISE = 299_000;

/**
 * Platform commission in basis points (1 bps = 0.01%, 100 bps = 1%).
 * - Services (consultations, workshops, bookings, fan support): 5% = 500 bps
 * - Goods, curated marketplace, brand collabs, digital courses: 10% = 1000 bps
 */
export const COMMISSION_BPS = {
  services: 500,
  goods: 1000,
  brand_collab: 1000,
  digital: 1000,
} as const;

/**
 * Subscription revenue share pool (25% of net subscription revenue).
 * Gated at 1,000 paying members.
 */
export const POOL_SHARE_BPS = 2500;
export const POOL_MIN_PAYING_MEMBERS = 1000;

/**
 * Calculates platform fee in integer paise using half-up rounding.
 * Creator receives the remainder (grossPaise - platformFee), so fee + creator = gross exactly.
 */
export const feePaise = (grossPaise: number, bps: number): number =>
  Math.floor((grossPaise * bps + 5000) / 10000);
