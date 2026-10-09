// ==============================================================================
// EKA UNIFIED INFORMATION ARCHITECTURE & NAVIGATION CONFIGURATION
// ==============================================================================
// Single source of truth for all navigation across desktop, mobile, sidebar,
// topbar, and footer discovery.
// Core loop: Discover → Stories → Learn → Ask EKA → Community → Create → My EKA
// ==============================================================================

import type { LucideIcon } from "lucide-react";
import {
  Home,
  Compass,
  Film,
  BookOpen,
  HelpCircle,
  Users,
  MessageSquare,
  User,
  Plus,
} from "lucide-react";

export const EKA_BRAND = {
  name: "EKA",
  positioning: "The World's Trusted Cultural Intelligence Layer",
  primaryHook: "Don't just scroll the world. Understand it.",
  philosophicalCore: "One Within. One With All.",
  productPromise: "Connect. Communicate. Build Community. Earn.",
  primaryLockup: "EKA — The World's Trusted Cultural Intelligence Layer",
  tagline: "Don't just scroll the world. Understand it.",
  supportingContext: "The World's Trusted Cultural Intelligence Layer",
  supportingStatement:
    "Understand the world's cultures, living traditions, master crafts, and sacred places through verified human intelligence.",
  contextStatement:
    "From generational lineages and living rituals to ancient crafts, foodways, oral traditions, classical texts, and festivals — EKA builds the global cultural intelligence layer connecting human knowledge and authentic custodians.",
} as const;

export interface NavItem {
  id: string;
  label: string;
  to: string;
  exact?: boolean;
  icon: LucideIcon;
  actionText?: string;
  description: string;
  badge?: string;
}

/**
 * 6 Primary Pillars of EKA Consumer Navigation (Specification: Section 1 & 20)
 * HOME · DISCOVER · STORIES · ASK EKA · FEED · MY EKA
 */
export const PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Home",
    to: "/",
    exact: true,
    icon: Home,
    description: "Living cultural entry point",
  },
  {
    id: "discover",
    label: "Discover",
    to: "/discover",
    icon: Compass,
    description: "Explore cultures, traditions, foodways & sacred places",
  },
  {
    id: "stories",
    label: "Stories",
    to: "/stories",
    icon: Film,
    description: "Watch visual reels, carousels & cultural narratives",
  },
  {
    id: "ask",
    label: "Ask EKA",
    to: "/ask",
    icon: HelpCircle,
    description: "Questions & universal cultural wisdom",
  },
  {
    id: "feed",
    label: "Feed",
    to: "/feed",
    icon: Users,
    description: "Social participation, creator reflections & community posts",
  },
  {
    id: "my-eka",
    label: "My EKA",
    to: "/my-eka",
    icon: User,
    description: "Your sanctuary, saved traditions & reflections",
  },
];

/**
 * Primary Create Action — contributions to living cultural archive
 */
export const CREATE_ACTION_ITEM: NavItem = {
  id: "create",
  label: "Create",
  to: "/create",
  icon: Plus,
  description: "Contribute post, story or reflection",
};

/**
 * Mobile Bottom Navigation: Highest frequency consumer touchpoints
 * HOME · DISCOVER · STORIES · ASK EKA · FEED · MY EKA
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
    icon: HelpCircle,
    description: "Ask",
  },
  {
    id: "feed",
    label: "Feed",
    to: "/feed",
    icon: Users,
    description: "Feed",
  },
  {
    id: "my-eka",
    label: "My EKA",
    to: "/my-eka",
    icon: User,
    description: "My EKA",
  },
];

/**
 * Secondary Mobile Drawer Items
 */
export const MOBILE_MORE_ITEMS: NavItem[] = [
  {
    id: "community",
    label: "Community Sanghas",
    to: "/community",
    icon: Users,
    description: "Explore Sanghas, discussions & elders",
  },
  {
    id: "messages",
    label: "Messages",
    to: "/messages",
    icon: MessageSquare,
    description: "Direct conversations & inquiries",
  },
  {
    id: "create",
    label: "Contribute Story",
    to: "/create",
    icon: Plus,
    description: "Contribute to the living cultural archive",
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
      { to: "/discover", label: "Explore Culture & Places" },
      { to: "/stories", label: "1 Billion Stories" },
      { to: "/learn", label: "Knowledge Codex & Guides" },
      { to: "/ask", label: "Ask EKA (Universal Wisdom)" },
      { to: "/discover#cultural-map", label: "Cultural Intelligence Map" },
      { to: "/search", label: "Multilingual Search" },
    ],
  },
  community: {
    title: "Community",
    links: [
      { to: "/community", label: "Discover Sanghas" },
      { to: "/create", label: "Contribute to Archive" },
      { to: "/standards", label: "Community Standards" },
      { to: "/give", label: "Stewardship & Grants" },
    ],
  },
  trustAndSafety: {
    title: "Trust & Safety",
    links: [
      { to: "/standards", label: "How EKA Works" },
      { to: "/standards", label: "Verification & Provenance" },
      { to: "/privacy", label: "Privacy Policy (DPDP 2023)" },
      { to: "/terms", label: "Terms of Service" },
      { to: "/refund", label: "Refund Policy" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { to: "/", label: "About EKA" },
      { to: "/stories", label: "Living Archive Vision" },
      { to: "mailto:contact@eka.earth", label: "Contact Us" },
    ],
  },
};
