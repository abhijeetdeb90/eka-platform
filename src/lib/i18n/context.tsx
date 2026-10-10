// ==============================================================================
// EKA 3-LAYER LOCALIZATION ENGINE — CONTEXT & REACT HOOK
// ==============================================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  type SupportedLocale,
  type RegionalContext,
  type LocaleInfo,
  SUPPORTED_LOCALES,
  LOCALES_LIST,
} from "./types";
import {
  detectUserLocale,
  inferRegionalContext,
  persistUserLocale,
} from "./detect";
import { getTranslation, type TranslationKey } from "@/locales";
import { supabase } from "@/integrations/supabase/client";

interface LocalizationContextValue {
  locale: SupportedLocale;
  localeInfo: LocaleInfo;
  region: RegionalContext;
  isRTL: boolean;
  localesList: LocaleInfo[];
  t: (key: TranslationKey, fallback?: string) => string;
  setLocale: (newLocale: SupportedLocale, newRegion?: RegionalContext) => Promise<void>;
  setRegion: (newRegion: RegionalContext) => void;
  detectedLocale: SupportedLocale;
}

const LocalizationContext = createContext<LocalizationContextValue | null>(null);

export function LocalizationProvider({ children }: { children: ReactNode }) {
  // Initialize from detection engine safely
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    return detectUserLocale();
  });

  const [region, setRegionState] = useState<RegionalContext>(() => {
    return inferRegionalContext(detectUserLocale());
  });

  const detectedLocale = useMemo(() => detectUserLocale(), []);

  // Sync HTML tag attributes
  useEffect(() => {
    const info = SUPPORTED_LOCALES[locale] || SUPPORTED_LOCALES.en;
    if (typeof document !== "undefined") {
      document.documentElement.lang = info.code;
      document.documentElement.dir = info.dir;
    }
  }, [locale]);

  // Read Supabase user profile on mount to check saved preference
  useEffect(() => {
    let isMounted = true;
    async function loadUserProfilePreference() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data: profile } = await (supabase as any)
          .from("profiles")
          .select("preferred_language, preferred_region, language, region")
          .eq("id", session.user.id)
          .single();

        if (profile && isMounted) {
          const profileLocale = (profile.preferred_language || profile.language) as string | undefined;
          if (profileLocale && profileLocale in SUPPORTED_LOCALES) {
            // Only adopt profile preference if user hasn't explicitly set localStorage in this session
            const stored = typeof window !== "undefined" ? window.localStorage.getItem("eka_locale") : null;
            if (!stored) {
              setLocaleState(profileLocale as SupportedLocale);
              setRegionState(inferRegionalContext(profileLocale as SupportedLocale, profile.preferred_region || profile.region));
            }
          }
        }
      } catch (err) {
        // Non-blocking telemetry
        console.warn("[EKA i18n] Error syncing Supabase profile language:", err);
      }
    }

    void loadUserProfilePreference();
    return () => {
      isMounted = false;
    };
  }, []);

  const setLocale = useCallback(
    async (newLocale: SupportedLocale, newRegion?: RegionalContext) => {
      const targetRegion = newRegion || inferRegionalContext(newLocale);
      setLocaleState(newLocale);
      setRegionState(targetRegion);
      persistUserLocale(newLocale, targetRegion);

      // Asynchronously sync to Supabase profile if user is logged in
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase
            .from("profiles")
            .update({
              preferred_language: newLocale,
              preferred_region: targetRegion,
              language: newLocale,
            } as any)
            .eq("id", session.user.id);
        }
      } catch (err) {
        console.warn("[EKA i18n] Background profile update ignored:", err);
      }
    },
    []
  );

  const setRegion = useCallback((newRegion: RegionalContext) => {
    setRegionState(newRegion);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("eka_region", newRegion);
      } catch {}
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey, fallback?: string): string => {
      const translated = getTranslation(locale, key);
      if (translated) return translated;
      if (fallback) return fallback;
      return key as string;
    },
    [locale]
  );

  const localeInfo = SUPPORTED_LOCALES[locale] || SUPPORTED_LOCALES.en;
  const isRTL = localeInfo.dir === "rtl";

  const value = useMemo<LocalizationContextValue>(
    () => ({
      locale,
      localeInfo,
      region,
      isRTL,
      localesList: LOCALES_LIST,
      t,
      setLocale,
      setRegion,
      detectedLocale,
    }),
    [locale, localeInfo, region, isRTL, t, setLocale, setRegion, detectedLocale]
  );

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization(): LocalizationContextValue {
  const context = useContext(LocalizationContext);
  if (!context) {
    // Graceful fallback if called outside provider (e.g. testing or SSR)
    const fallbackLocale: SupportedLocale = "en";
    const info = SUPPORTED_LOCALES[fallbackLocale];
    return {
      locale: fallbackLocale,
      localeInfo: info,
      region: "global",
      isRTL: false,
      localesList: LOCALES_LIST,
      t: (key: TranslationKey, fallback?: string) => getTranslation("en", key) || fallback || (key as string),
      setLocale: async () => {},
      setRegion: () => {},
      detectedLocale: "en",
    };
  }
  return context;
}

export { useLocalization as useTranslation };
