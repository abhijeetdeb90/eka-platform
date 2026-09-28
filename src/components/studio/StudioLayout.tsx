// ==============================================================================
// EKA STUDIO — MASTER CONTROL PLANE OPERATING SYSTEM SHELL (v1.0)
// ==============================================================================

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  FileCheck,
  HardDrive,
  BookOpen,
  Network,
  FolderTree,
  MapPin,
  Users,
  Calendar,
  Languages,
  Building2,
  ShieldCheck,
  Scale,
  HeartHandshake,
  Compass,
  Layers,
  Search,
  Sparkles,
  Bot,
  Key,
  CreditCard,
  BarChart3,
  Settings,
  Shield,
  History,
  Activity,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { STUDIO_ROLES, getRoleBadgeClass } from "@/lib/studio/rbac";
import { logStudioAction } from "@/lib/studio/audit";
import type { StudioRole } from "@/lib/studio/types";

// Import Domain View Components
import { StudioDashboard } from "./StudioDashboard";
import { StudioContentBuilder } from "./StudioContentBuilder";
import { StudioHomepageBuilder } from "./StudioHomepageBuilder";
import { StudioTaxonomyManager } from "./StudioTaxonomyManager";
import { StudioKnowledgeManager } from "./StudioKnowledgeManager";
import { StudioKnowledgeGraph } from "./StudioKnowledgeGraph";
import { StudioTrustCenter } from "./StudioTrustCenter";
import { StudioMediaLibrary } from "./StudioMediaLibrary";
import { StudioUserManagement } from "./StudioUserManagement";
import { StudioEngagementCCRM } from "./StudioEngagementCCRM";
import { StudioDiscoverySearch } from "./StudioDiscoverySearch";
import { StudioAIManagement } from "./StudioAIManagement";
import { StudioEnterprise } from "./StudioEnterprise";
import { StudioMonetization } from "./StudioMonetization";
import { StudioAnalytics } from "./StudioAnalytics";
import { StudioSystemSettings } from "./StudioSystemSettings";

export function StudioLayout() {
  const [currentRole, setCurrentRole] = useState<StudioRole>("Super Admin");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleChange = async (role: StudioRole) => {
    setCurrentRole(role);
    await logStudioAction({
      actor_role: role,
      action: "permission_change",
      target_type: "user",
      target_title: `Role switched to ${role}`,
      details: { role },
    });
    toast.info(`Acting role set to "${role}". Least-privilege matrix active.`);
  };

  const navGroups = [
    {
      label: "OVERVIEW",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: "CONTENT",
      items: [
        { id: "content", label: "Content Items", icon: FileText },
        { id: "content-posts", label: "Posts & Discourses", icon: FolderKanban },
        { id: "content-pages", label: "Platform Pages", icon: FileText },
        { id: "media", label: "Media Library", icon: HardDrive },
      ],
    },
    {
      label: "KNOWLEDGE",
      items: [
        { id: "knowledge", label: "Knowledge Objects", icon: BookOpen },
        { id: "graph", label: "Knowledge Graph", icon: Network },
        { id: "taxonomy", label: "Taxonomy", icon: FolderTree },
        { id: "knowledge-traditions", label: "Traditions & Cultures", icon: Compass },
        { id: "knowledge-places", label: "Places & Geography", icon: MapPin },
      ],
    },
    {
      label: "TRUST",
      items: [
        { id: "trust", label: "Sources & Provenance", icon: ShieldCheck },
        { id: "trust-disputes", label: "Disputes & Conflicts", icon: Scale },
      ],
    },
    {
      label: "USERS",
      items: [
        { id: "users", label: "Users & Creators", icon: Users },
        { id: "communities", label: "Communities & Sanghas", icon: Sparkles },
      ],
    },
    {
      label: "ENGAGEMENT",
      items: [
        { id: "engagement", label: "CCRM & Events", icon: HeartHandshake },
      ],
    },
    {
      label: "DISCOVERY",
      items: [
        { id: "homepage", label: "Homepage Builder", icon: Layers },
        { id: "search", label: "Search & Navigation", icon: Search },
      ],
    },
    {
      label: "AI",
      items: [
        { id: "ai", label: "AI & Retrieval Policies", icon: Bot },
      ],
    },
    {
      label: "ENTERPRISE",
      items: [
        { id: "enterprise", label: "Workspaces & API Keys", icon: Building2 },
      ],
    },
    {
      label: "MONETIZATION",
      items: [
        { id: "monetization", label: "Treasury & Payouts", icon: CreditCard },
      ],
    },
    {
      label: "ANALYTICS",
      items: [
        { id: "analytics", label: "Platform Analytics", icon: BarChart3 },
      ],
    },
    {
      label: "SYSTEM",
      items: [
        { id: "system", label: "Settings & Audit Logs", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-accent"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <Link to="/studio" className="flex items-center gap-2">
            <span className="font-display font-semibold tracking-tight text-lg text-foreground">
              EKA <span className="font-sans text-xs uppercase tracking-widest text-primary font-bold">STUDIO</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.2 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Control Plane v1.0
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Search trigger */}
          <button
            type="button"
            onClick={() => setActiveTab("search")}
            className="hidden sm:flex items-center gap-2 rounded-xl border border-input bg-background/80 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50 transition-colors"
          >
            <Search className="size-3.5" /> Search Entities...
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
          </button>

          {/* 11-Role Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden lg:inline">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => handleRoleChange(e.target.value as StudioRole)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${getRoleBadgeClass(
                currentRole,
              )}`}
            >
              {STUDIO_ROLES.map((role) => (
                <option key={role} value={role} className="bg-background text-foreground">
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Consumer App Link */}
          <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex text-xs">
            <Link to="/app">
              Exit to Consumer <ArrowUpRight className="ml-1 size-3.5" />
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-border bg-card/95 backdrop-blur pt-16 md:pt-0 md:static md:block transform transition-transform duration-200 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="h-full overflow-y-auto p-4 space-y-5">
            {navGroups.map((group) => (
              <div key={group.label} className="space-y-1">
                <div className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      activeTab === item.id ||
                      (item.id === "content" && activeTab.startsWith("content-")) ||
                      (item.id === "knowledge" && activeTab.startsWith("knowledge-")) ||
                      (item.id === "trust" && activeTab.startsWith("trust-"));

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Workspace Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === "dashboard" && (
            <StudioDashboard
              currentRole={currentRole}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {(activeTab === "content" ||
            activeTab === "content-posts" ||
            activeTab === "content-pages") && (
            <StudioContentBuilder currentRole={currentRole} />
          )}

          {activeTab === "media" && <StudioMediaLibrary currentRole={currentRole} />}

          {(activeTab === "knowledge" ||
            activeTab === "knowledge-traditions" ||
            activeTab === "knowledge-places" ||
            activeTab === "knowledge-create" ||
            activeTab.startsWith("knowledge-detail-")) && (
            <StudioKnowledgeManager
              currentRole={currentRole}
              selectedId={
                activeTab.startsWith("knowledge-detail-")
                  ? activeTab.replace("knowledge-detail-", "")
                  : undefined
              }
            />
          )}

          {activeTab === "graph" && <StudioKnowledgeGraph currentRole={currentRole} />}

          {activeTab === "taxonomy" && <StudioTaxonomyManager currentRole={currentRole} />}

          {(activeTab === "trust" || activeTab === "trust-disputes") && (
            <StudioTrustCenter currentRole={currentRole} />
          )}

          {(activeTab === "users" || activeTab === "communities") && (
            <StudioUserManagement currentRole={currentRole} />
          )}

          {activeTab === "engagement" && <StudioEngagementCCRM currentRole={currentRole} />}

          {activeTab === "homepage" && <StudioHomepageBuilder currentRole={currentRole} />}

          {activeTab === "search" && (
            <StudioDiscoverySearch
              currentRole={currentRole}
              onSelectEntity={(type, id) => {
                if (type === "knowledge_object") {
                  setActiveTab(`knowledge-detail-${id}`);
                } else if (type === "content") {
                  setActiveTab("content");
                } else if (type === "media") {
                  setActiveTab("media");
                } else if (type === "taxonomy") {
                  setActiveTab("taxonomy");
                }
              }}
            />
          )}

          {activeTab === "ai" && <StudioAIManagement currentRole={currentRole} />}

          {activeTab === "enterprise" && <StudioEnterprise currentRole={currentRole} />}

          {activeTab === "monetization" && <StudioMonetization currentRole={currentRole} />}

          {activeTab === "analytics" && <StudioAnalytics currentRole={currentRole} />}

          {activeTab === "system" && <StudioSystemSettings currentRole={currentRole} />}
        </main>
      </div>
    </div>
  );
}
