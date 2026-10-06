// ==============================================================================
// EKA UNIVERSAL BRAND SYSTEM — EXPORTS & DESIGN TOKENS
// ==============================================================================
// Canonical programmatic entry point for the EKA Brand Identity.
// ==============================================================================

export { EkaMark, EkaLogo, type EkaLogoProps } from "@/components/brand/Logo";
export { EkaLogoLoader } from "@/components/motion/EkaLogoLoader";
export { AppStoreBadges, type AppStoreBadgesProps } from "@/components/brand/AppStoreBadges";
export { APP_STORE_CONFIG } from "@/config/app-stores";
export { EKA_BRAND } from "@/config/navigation";

export const BRAND_ASSETS = {
  logoPrimary: "/brand/logo-primary.svg",
  logoSymbol: "/brand/logo-symbol.svg",
  logoDark: "/brand/logo-dark.svg",
  logoLight: "/brand/logo-light.svg",
  logoMonochrome: "/brand/logo-monochrome.svg",
  favicon: "/brand/favicon.svg",
  appIconSvg: "/brand/app-icon.svg",
  appIconPng: "/brand/app-icon.png",
  ogBanner: "/brand/eka-banner.jpg",
} as const;

export const BRAND_COLORS = {
  terracotta: "#C25E3E",
  slateMeridian: "#1E2A38",
  sandstoneAlabaster: "#F7F6F2",
  deepObsidian: "#11161F",
  indigoKnowledge: "#25384D",
  livingSage: "#2E5C47",
  dawnAmber: "#D97736",
} as const;
