// ==============================================================================
// EKA UNIFIED INFORMATION ARCHITECTURE & NAVIGATION CONFIGURATION
// ==============================================================================
// Single source of truth for all navigation across desktop, mobile, sidebar,
// topbar, and footer discovery.
//
// Desktop IA:  [EKA BETA]  Home | Discover | Stories | Learn | Community
//              Right side: Search | Create | Profile
//
// Mobile IA:   Home · Discover · Stories · Community · Profile
//              Central floating: Ask EKA
//
// Persistent:  Ask EKA (search + AI entry — accessible everywhere)
// ==============================================================================

import type { LucideIcon } from "lucide-react";
import {
  Home,
  Compass,
  Film,
  BookOpen,
  Users,
  MessageSquare,
  User,
  Plus,
  Search,
} from "lucide-react";

export const EKA_BRAND = {
  name: "EKA",
  tagline: "Understand the world.",
  heroStatement: "A billion stories. One world to understand.",
  subStatement: "Don't just scroll the world. Understand it.",
  philosophy: "One Within. One With All.",
  // Consumer-facing (what users see in UI)
  consumerPositioning: "Understand the world.",
  // Investor/B2B (kept out of consumer UI)
  investorPositioning: "Cultural Intelligence Infrastructure",
  productPromise: "Connect. Communicate. Build Community. Earn.",
  supportingStatement:
    "Explore places. Meet people. Understand traditions. Ask why.",
} as const;

export interface NavItem {
  id: string;
  label: string;
  to: string;
  exact?: boolean;
  icon: LucideIcon;
  description: string;
  badge?: string;
}

/**
 * 5 Primary Desktop Navigation Pillars
 * Displayed center-left in the desktop header.
 */
export const PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Home",
    to: "/",
    exact: true,
    icon: Home,
    description: "Your cultural starting point",
  },
  {
    id: "discover",
    label: "Discover",
    to: "/discover",
    icon: Compass,
    description: "Explore the world map",
  },
  {
    id: "stories",
    label: "Stories",
    to: "/stories",
    icon: Film,
    description: "Watch & understand",
  },
  {
    id: "ask",
    label: "Ask EKA",
    to: "/ask",
    icon: Search,
    description: "Understand something",
  },
  {
    id: "feed",
    label: "Feed",
    to: "/feed",
    icon: Users,
    description: "Community updates",
  },
  {
    id: "my-eka",
    label: "My EKA",
    to: "/my-eka",
    icon: User,
    description: "Your EKA sanctuary",
  }
];

/**
 * Primary Create Action
 */
export const CREATE_ACTION_ITEM: NavItem = {
  id: "create",
  label: "Create",
  to: "/create",
  icon: Plus,
  description: "Contribute to the living archive",
};

/**
 * Ask EKA — persistent AI/search entry point
 * Lives in the header search area; also floats on mobile.
 */
export const ASK_EKA_ITEM: NavItem = {
  id: "ask",
  label: "Ask EKA",
  to: "/ask",
  icon: Search,
  description: "Understand something",
};

/**
 * Profile sub-items — shown inside Profile dropdown
 * Routes are preserved; access points simply moved.
 */
export const PROFILE_NAV_ITEMS: NavItem[] = [
  {
    id: "my-eka",
    label: "My Profile",
    to: "/my-eka",
    icon: User,
    description: "Your EKA sanctuary",
  },
  {
    id: "messages",
    label: "Messages",
    to: "/messages",
    icon: MessageSquare,
    description: "Direct conversations",
  },
];

/**
 * Mobile Bottom Navigation: 5 primary tabs
 * Ask EKA is a floating central action, not a tab.
 */
export const MOBILE_PRIMARY_TABS: NavItem[] = [
  {
    id: "home",
    label: "Home",
    to: "/",
    exact: true,
    icon: Home,
    description: "Home",
  },
  {
    id: "discover",
    label: "Discover",
    to: "/discover",
    icon: Compass,
    description: "Discover",
  },
  {
    id: "stories",
    label: "Stories",
    to: "/stories",
    icon: Film,
    description: "Stories",
  },
  {
    id: "ask",
    label: "Ask EKA",
    to: "/ask",
    icon: Search,
    description: "Ask EKA",
  },
  {
    id: "feed",
    label: "Feed",
    to: "/feed",
    icon: Users,
    description: "Feed",
  },
];

/**
 * Secondary Mobile Drawer Items
 */
export const MOBILE_MORE_ITEMS: NavItem[] = [
  {
    id: "messages",
    label: "Messages",
    to: "/messages",
    icon: MessageSquare,
    description: "Direct conversations",
  },
  {
    id: "create",
    label: "Contribute",
    to: "/create",
    icon: Plus,
    description: "Add to the living archive",
  },
];

export interface FooterLink {
  to: string;
  label: string;
  badge?: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const FOOTER_IA_CONFIG: Record<string, FooterSection> = {
  explore: {
    title: "Explore",
    links: [
      { to: "/discover", label: "Discover" },
      { to: "/stories", label: "Stories" },
      { to: "/feed", label: "Feed" },
    ],
  },
  for: {
    title: "For",
    links: [
      { to: "/create", label: "Creators" },
      { to: "/membership", label: "Membership" },
      { to: "/give", label: "Stewardship" },
    ],
  },
  trust: {
    title: "Trust",
    links: [
      { to: "/standards#verification", label: "Verification" },
      { to: "/privacy", label: "Privacy" },
      { to: "/standards#safety", label: "Safety" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "mailto:contact@eka.earth", label: "Contact" },
      { to: "/terms", label: "Terms" },
    ],
  },
};
