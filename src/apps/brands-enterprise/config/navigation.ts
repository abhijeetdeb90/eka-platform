// ==============================================================================
// BRANDS / ENTERPRISE APPLICATION — NAVIGATION CONFIGURATION
// ==============================================================================
// Private B2B application destinations.
// Private routes under /brands-enterprise
// ==============================================================================

import {
  LayoutDashboard,
  Megaphone,
  Radar,
  Bot,
  Building2,
  Receipt,
  Sparkles,
} from "lucide-react";

export interface BrandEnterpriseNavItem {
  id: string;
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  description: string;
}

export const BRANDS_ENTERPRISE_NAV: BrandEnterpriseNavItem[] = [
  {
    id: "dashboard",
    label: "Brand Growth OS",
    to: "/brands-enterprise",
    icon: LayoutDashboard,
    description: "Intelligence, active campaigns & recommendations",
  },
  {
    id: "campaigns",
    label: "Campaigns & Promotion",
    to: "/brands-enterprise/campaigns",
    icon: Megaphone,
    description: "Launch, schedule & manage verified sponsor campaigns",
  },
  {
    id: "audience",
    label: "Audience Intelligence",
    to: "/brands-enterprise/audience",
    icon: Radar,
    description: "Cultural affinities, demographic radar & resonance",
  },
  {
    id: "agent",
    label: "Branding Agent",
    to: "/brands-enterprise/agent",
    icon: Bot,
    badge: "AI",
    description: "Autonomous cultural alignment & sensitivity audit",
  },
  {
    id: "enterprise",
    label: "Enterprise Solutions",
    to: "/brands-enterprise/enterprise",
    icon: Building2,
    badge: "Institutional",
    description: "Dedicated namespaces, API credentials & high-throughput",
  },
  {
    id: "finance",
    label: "Campaign Billing & Spend",
    to: "/brands-enterprise/finance",
    icon: Receipt,
    description: "Invoices, escrow disbursements & GST compliance",
  },
];
