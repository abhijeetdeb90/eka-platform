// ==============================================================================
// EKA FOUNDER / ADMIN OPERATING SYSTEM — NAVIGATION CONFIGURATION
// ==============================================================================
// Strictly internal operating system destinations.
// Private routes under /founder-admin
// ==============================================================================

import {
  LayoutDashboard,
  Terminal,
  Server,
  DollarSign,
  ShieldAlert,
  BookOpen,
  Layers,
  HeartHandshake,
  Receipt,
  Radio,
  Cpu,
} from "lucide-react";

export interface FounderAdminNavItem {
  id: string;
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  description: string;
}

export const FOUNDER_ADMIN_NAV: FounderAdminNavItem[] = [
  {
    id: "cockpit",
    label: "Founder Cockpit",
    to: "/founder-admin",
    icon: LayoutDashboard,
    badge: "Executive",
    description: "Mission, platform economics & strategic dispatches",
  },
  {
    id: "ops",
    label: "Operations Radar",
    to: "/founder-admin/ops",
    icon: Terminal,
    description: "Subsystems, moderation queue & telemetry",
  },
  {
    id: "studio",
    label: "Studio Control Plane",
    to: "/founder-admin/studio",
    icon: Server,
    description: "Knowledge graph, taxonomies & content pipelines",
  },
  {
    id: "economics",
    label: "Platform Economics",
    to: "/founder-admin/economics",
    icon: DollarSign,
    description: "Double-entry ledger, P&L & reserve pools",
  },
  {
    id: "risk",
    label: "Creator Risk & Fraud",
    to: "/founder-admin/risk",
    icon: ShieldAlert,
    badge: "KYC/AML",
    description: "Anomaly audits, payout batches & dispute reserves",
  },
  {
    id: "knowledge",
    label: "Epistemic & Knowledge Ops",
    to: "/founder-admin/knowledge",
    icon: BookOpen,
    description: "5-Tier provenance, source licenses & connector health",
  },
  {
    id: "system",
    label: "Master System Map",
    to: "/founder-admin/system",
    icon: Layers,
    description: "Subsystem topology, dependency graph & latency",
  },
  {
    id: "crm",
    label: "Staff CRM & Lifecycle",
    to: "/founder-admin/crm",
    icon: HeartHandshake,
    description: "Member onboarding journeys & retention triggers",
  },
  {
    id: "finance",
    label: "Settlements & Finance",
    to: "/founder-admin/finance",
    icon: Receipt,
    description: "Platform reconciliation, tax records & invoicing",
  },
  {
    id: "ai-context",
    label: "AI Context Health",
    to: "/founder-admin/ai-context",
    icon: Cpu,
    badge: "1M Guard",
    description: "Token telemetry, budget enforcement & context health",
  },
  {
    id: "investor",
    label: "Investor Status",
    to: "/founder-admin/ops?tab=investor-status",
    icon: Radio,
    badge: "Live",
    description: "Product maturity states & health validator",
  },
];
