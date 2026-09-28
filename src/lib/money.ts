/* ------------------------------------------------------------------ money --
 * Every amount in EKA is an integer in the smallest currency unit (paise for
 * INR). Nothing here uses floating point for accounting: percentages are
 * applied with integer arithmetic and a largest-remainder split so a set of
 * allocations always adds back to the original amount, to the paisa.
 * -------------------------------------------------------------------------- */

/** Apply a percentage to an integer amount, rounding half up. */
export function percentOf(amount: number, percent: number): number {
  return Math.round((amount * percent) / 100);
}

/**
 * Split `amount` across `percents` so the parts sum exactly to `amount`.
 * Largest remainder: the leftover paise go to the buckets that lost the most
 * in rounding, which is the standard, defensible way to do it.
 */
export function allocate(amount: number, percents: number[]): number[] {
  if (!percents.length) return [];
  const totalPercent = percents.reduce((n, p) => n + p, 0) || 100;
  const raw = percents.map((p) => (amount * p) / totalPercent);
  const floors = raw.map((v) => Math.floor(v));
  let remainder = amount - floors.reduce((n, v) => n + v, 0);
  const order = raw.map((v, i) => ({ i, frac: v - Math.floor(v) })).sort((a, b) => b.frac - a.frac);
  const out = [...floors];
  for (const { i } of order) {
    if (remainder <= 0) break;
    out[i] = (out[i] ?? 0) + 1;
    remainder -= 1;
  }
  return out;
}

const LOCALE: Record<string, string> = {
  INR: "en-IN",
  USD: "en-US",
  GBP: "en-GB",
  EUR: "en-IE",
  AED: "en-AE",
};

/** Present an integer minor-unit amount as money. Rounding happens only here. */
export function formatMoney(minor: number, currency = "INR", opts?: { decimals?: boolean }) {
  const decimals = opts?.decimals ?? false;
  return new Intl.NumberFormat(LOCALE[currency] ?? "en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(minor / 100);
}

/** Compact Indian-style reading for headline figures: ₹8.2L, ₹1.2Cr. */
export function formatCompact(minor: number, currency = "INR") {
  const rupees = minor / 100;
  const sign = rupees < 0 ? "-" : "";
  const n = Math.abs(rupees);
  const symbol = currency === "INR" ? "₹" : "";
  if (currency !== "INR") return formatMoney(minor, currency);
  if (n >= 1_00_00_000)
    return `${sign}${symbol}${(n / 1_00_00_000).toFixed(n >= 10_00_00_000 ? 0 : 1)}Cr`;
  if (n >= 1_00_000) return `${sign}${symbol}${(n / 1_00_000).toFixed(n >= 10_00_000 ? 0 : 1)}L`;
  if (n >= 1_000) return `${sign}${symbol}${(n / 1_000).toFixed(0)}K`;
  return `${sign}${symbol}${n.toFixed(0)}`;
}

/** Safe ratio as a percentage; null when the denominator says "not enough data". */
export function ratio(part: number, whole: number): number | null {
  if (!whole) return null;
  return (part / whole) * 100;
}

export function formatPercent(value: number | null, decimals = 1) {
  return value === null ? "—" : `${value.toFixed(decimals)}%`;
}

export function parseAmountToMinor(text: string): number {
  const cleaned = text.replace(/[^\d.-]/g, "");
  if (!cleaned) return 0;
  return Math.round(Number(cleaned) * 100);
}
