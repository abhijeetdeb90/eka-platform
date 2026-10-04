// ==============================================================================
// CONSUMER APPLICATION — PRIMARY NAVIGATION & SITEMAP CONFIGURATION
// ==============================================================================
// Contains ONLY launch-ready consumer features.
// ZERO internal, founder, admin, ops, or enterprise references allowed.
// ==============================================================================

export interface ConsumerNavLink {
  to: string;
  label: string;
  exact?: boolean;
}

export const CONSUMER_PRIMARY_NAV: ConsumerNavLink[] = [
  { to: "/discover", label: "Discover" },
  { to: "/stories", label: "Stories" },
  { to: "/learn", label: "Learn" },
  { to: "/create", label: "Create" },
];

export const CONSUMER_FOOTER_EXPLORE: ConsumerNavLink[] = [
  { to: "/discover", label: "Discover Traditions" },
  { to: "/stories", label: "1 Billion Stories" },
  { to: "/learn", label: "Knowledge Codex" },
  { to: "/observe", label: "Sacred Calendar" },
];

export const CONSUMER_FOOTER_COMMUNITY: ConsumerNavLink[] = [
  { to: "/standards", label: "Community Standards" },
  { to: "/give", label: "Give & Transparency" },
  { to: "/create", label: "Creator Reflections" },
  { to: "/membership", label: "Sanctuary Membership" },
];

export const CONSUMER_FOOTER_LEGAL: ConsumerNavLink[] = [
  { to: "/privacy", label: "Privacy Policy (DPDP)" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/refund", label: "Refund & Cancellation" },
  { to: "/copyright", label: "Copyright & IP" },
  { to: "/cookies", label: "Cookie Preferences" },
];
