// ==============================================================================
// EKA LOCALIZATION REGISTRY & AGGREGATOR
// ==============================================================================

import type { SupportedLocale } from "@/lib/i18n/types";
import { en, type TranslationKey } from "./en";
import { as } from "./as";
import { bn } from "./bn";
import { hi } from "./hi";
import { ta } from "./ta";
import { mr } from "./mr";
import { gu } from "./gu";
import { te, kn, ml, or, pa } from "./regional-languages";

export { type TranslationKey, en };

export const DICTIONARIES: Record<SupportedLocale, Record<TranslationKey, string>> = {
  en,
  as,
  bn,
  hi,
  ta,
  te,
  mr,
  gu,
  kn,
  ml,
  or,
  pa,
};

/**
 * Resolves a key with guaranteed canonical English fallback
 */
export function getTranslation(locale: SupportedLocale, key: TranslationKey): string {
  const dict = DICTIONARIES[locale] || DICTIONARIES.en;
  if (key in dict && dict[key]) {
    return dict[key];
  }
  return DICTIONARIES.en[key] || (key as string);
}
