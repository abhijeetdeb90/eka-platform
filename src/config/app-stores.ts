// ==============================================================================
// EKA MOBILE PLATFORM STORE CONFIGURATION
// ==============================================================================
// Centralized configuration for Apple App Store (iOS) and Google Play (Android).
// Provides canonical store URLs, beta preview status flags, and localized labels.
// ==============================================================================

export interface PlatformStoreConfig {
  id: "ios" | "android";
  platformName: string;
  storeName: string;
  badgeHeading: string;
  badgeSubheading: string;
  storeUrl: string;
  isAvailable: boolean;
  statusBadgeText: string;
  availabilityNotice: string;
}

export interface AppStoresConfig {
  title: string;
  subtitle: string;
  ios: PlatformStoreConfig;
  android: PlatformStoreConfig;
}

export const APP_STORE_CONFIG: AppStoresConfig = {
  title: "Available on",
  subtitle: "Experience the living cultural archive everywhere",
  ios: {
    id: "ios",
    platformName: "Apple iOS",
    storeName: "App Store",
    badgeHeading: "Download on the",
    badgeSubheading: "App Store",
    storeUrl: "https://apps.apple.com/app/eka-cultural-intelligence/id6400000000",
    isAvailable: false, // In active TestFlight validation
    statusBadgeText: "Beta Soon",
    availabilityNotice: "EKA for iOS is currently in invite-only TestFlight. Join the waitlist for early access.",
  },
  android: {
    id: "android",
    platformName: "Google Android",
    storeName: "Google Play",
    badgeHeading: "GET IT ON",
    badgeSubheading: "Google Play",
    storeUrl: "https://play.google.com/store/apps/details?id=earth.eka.app",
    isAvailable: false, // In closed internal track
    statusBadgeText: "Beta Soon",
    availabilityNotice: "EKA for Android is in closed preview. Join the waitlist for the public APK & Play Store release.",
  },
};
