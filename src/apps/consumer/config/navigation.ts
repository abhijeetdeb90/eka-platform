// ==============================================================================
// CONSUMER APPLICATION — PRIMARY NAVIGATION & SITEMAP CONFIGURATION
// ==============================================================================
// Unified with the single canonical source of truth in src/config/navigation.ts.
// Contains ONLY launch-ready consumer features.
// ZERO internal, founder, admin, ops, or enterprise references allowed.
// ==============================================================================

export type { NavItem as ConsumerNavLink } from "@/config/navigation";
export {
  PRIMARY_NAV_ITEMS as CONSUMER_PRIMARY_NAV,
  CREATE_ACTION_ITEM,
  MOBILE_PRIMARY_TABS,
  MOBILE_MORE_ITEMS,
  FOOTER_IA_CONFIG,
  EKA_BRAND,
} from "@/config/navigation";

// Legacy compatibility aliases for existing footer consumers
export const CONSUMER_FOOTER_EXPLORE = [
  { to: "/discover", label: "Discover Traditions" },
  { to: "/stories", label: "1 Billion Stories" },
  { to: "/discover", label: "Living Knowledge Codex" },
  { to: "/ask", label: "Ask EKA" },
  { to: "/observe", label: "Sacred Calendar" },
];

export const CONSUMER_FOOTER_COMMUNITY = [
  { to: "/community", label: "Living Communities" },
  { to: "/standards", label: "Community Standards" },
  { to: "/give", label: "Give & Transparency" },
  { to: "/create", label: "Contribute to Archive" },
  { to: "/membership", label: "Sanctuary Membership" },
];

export const CONSUMER_FOOTER_LEGAL = [
  { to: "/privacy", label: "Privacy Policy (DPDP)" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/refund", label: "Refund & Cancellation" },
  { to: "/copyright", label: "Copyright & IP" },
  { to: "/cookies", label: "Cookie Preferences" },
];
