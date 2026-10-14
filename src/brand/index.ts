// ==============================================================================
// EKA UNIVERSAL BRAND SYSTEM — EXPORTS & DESIGN TOKENS
// ==============================================================================
// Canonical programmatic entry point for the EKA Brand Identity.
// ==============================================================================

export { EkaMark, EkaLogo, type EkaLogoProps } from "@/components/brand/Logo";
export { EkaEmblem } from "@/components/brand/EkaLogo";
export { EkaLogoLoader } from "@/components/motion/EkaLogoLoader";
export { AppStoreBadges, type AppStoreBadgesProps } from "@/components/brand/AppStoreBadges";
export { APP_STORE_CONFIG } from "@/config/app-stores";
export { EKA_BRAND } from "@/config/navigation";

export const BRAND_ASSETS = {
  // Official Supplied Vector & Raster Brand Assets
  emblemSvg: "/brand/eka-emblem.svg",
  emblemPng: "/brand/eka-emblem.png",
  primaryLockupSvg: "/brand/eka-primary-lockup.svg",
  primaryLockupPng: "/brand/eka-primary-lockup.png",
  stackedLockupSvg: "/brand/eka-stacked-lockup.svg",
  stackedLockupPng: "/brand/eka-stacked-lockup.png",

  // Application & Platform References
  logoPrimary: "/brand/eka-primary-lockup.svg",
  logoSymbol: "/brand/eka-emblem.svg",
  logoDark: "/brand/eka-primary-lockup.svg",
  logoLight: "/brand/eka-primary-lockup.svg",
  logoMonochrome: "/brand/eka-emblem.svg",
  favicon: "/brand/favicon.svg",
  faviconIco: "/favicon.ico",
  faviconPng: "/favicon.png",
  appIconSvg: "/brand/eka-emblem.svg",
  appIconPng: "/brand/app-icon.png",
  appleTouchIcon: "/brand/apple-touch-icon.png",
  ogBanner: "/brand/eka-banner.jpg",
} as const;

export const BRAND_COLORS = {
  maroon: "#681A1C",
  brownAccent: "#875531",
  terracotta: "#C25E3E",
  slateMeridian: "#1E2A38",
  sandstoneAlabaster: "#F7F6F2",
  deepObsidian: "#11161F",
  indigoKnowledge: "#25384D",
  livingSage: "#2E5C47",
  dawnAmber: "#D97736",
} as const;
