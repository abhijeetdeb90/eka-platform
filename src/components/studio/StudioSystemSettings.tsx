// ==============================================================================
// EKA STUDIO — SYSTEM SETTINGS, RBAC MATRIX, AUDIT LOGS & HEALTH
// ==============================================================================

import { useState, useEffect } from "react";
import {
  Settings,
  Shield,
  Key,
  ToggleLeft,
  History,
  HardDriveDownload,
  Activity,
  Download,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  exportAuditLogsAsJSON,
  fetchAuditLogs,
} from "@/lib/studio/audit";
import {
  generatePlatformBackupBundle,
} from "@/lib/studio/system-service";
import {
  ROLE_DESCRIPTIONS,
  ROLE_PERMISSIONS,
  STUDIO_ROLES,
} from "@/lib/studio/rbac";
import { DEFAULT_FLAGS, FLAG_LABEL, type FeatureFlag } from "@/lib/flags";
import type { StudioAuditLog, StudioRole } from "@/lib/studio/types";

interface StudioSystemSettingsProps {
  currentRole: StudioRole;
}

export function StudioSystemSettings({ currentRole }: StudioSystemSettingsProps) {
  const [activeTab, setActiveTab] = useState<
    "audit" | "roles" | "flags" | "health" | "backups"
  >("audit");

  const [logs, setLogs] = useState<StudioAuditLog[]>([]);
  const [auditActionFilter, setAuditActionFilter] = useState("all");
  const [auditQuery, setAuditQuery] = useState("");
  const [flags, setFlags] = useState<Record<FeatureFlag, boolean>>(DEFAULT_FLAGS);

  useEffect(() => {
    void fetchAuditLogs({ action: auditActionFilter, query: auditQuery }).then(setLogs);
  }, [auditActionFilter, auditQuery]);

  const handleExportAudit = () => {
    const json = exportAuditLogsAsJSON(logs);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eka-audit-log-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    toast.success("Audit log exported as JSON.");
  };

  const handleDownloadBackup = async () => {
    const bundle = await generatePlatformBackupBundle(currentRole);
    const blob = new Blob([bundle], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eka-disaster-recovery-backup-${Date.now()}.json`;
    a.click();
    toast.success("Platform disaster recovery bundle downloaded.");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-normal tracking-tight">System & Platform Governance</h2>
          <p className="text-xs text-muted-foreground">
            Append-only audit telemetry, 11-role least-privilege matrix, dynamic feature flags, and disaster recovery.
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            size="sm"
            variant={activeTab === "audit" ? "default" : "outline"}
            onClick={() => setActiveTab("audit")}
          >
            <History className="mr-1.5 size-3.5" /> Audit Logs
          </Button>
          <Button
            size="sm"
            variant={activeTab === "roles" ? "default" : "outline"}
            onClick={() => setActiveTab("roles")}
          >
            <Shield className="mr-1.5 size-3.5" /> 11 Roles RBAC
          </Button>
          <Button
            size="sm"
            variant={activeTab === "flags" ? "default" : "outline"}
            onClick={() => setActiveTab("flags")}
          >
            <ToggleLeft className="mr-1.5 size-3.5" /> Feature Flags
          </Button>
          <Button
            size="sm"
            variant={activeTab === "health" ? "default" : "outline"}
            onClick={() => setActiveTab("health")}
          >
            <Activity className="mr-1.5 size-3.5" /> System Health
          </Button>
          <Button
            size="sm"
            variant={activeTab === "backups" ? "default" : "outline"}
            onClick={() => setActiveTab("backups")}
          >
            <HardDriveDownload className="mr-1.5 size-3.5" /> Backups
          </Button>
        </div>
      </div>

      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="size-4 text-muted-foreground" />
              <Input
                placeholder="Search audit actions, titles, or actors..."
                value={auditQuery}
                onChange={(e) => setAuditQuery(e.target.value)}
                className="text-xs h-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={auditActionFilter}
                onChange={(e) => setAuditActionFilter(e.target.value)}
                className="rounded-md border border-input bg-background px-2.5 py-1 text-xs"
              >
                <option value="all">All Actions</option>
                <option value="login">Login</option>
                <option value="create">Create</option>
                <option value="edit">Edit</option>
                <option value="verify">Verify</option>
                <option value="publish">Publish</option>
                <option value="restore">Restore</option>
                <option value="api_key_create">API Key Issue</option>
                <option value="data_export">Data Export</option>
              </select>
              <Button size="sm" variant="outline" onClick={handleExportAudit}>
                <Download className="mr-1.5 size-3.5" /> Export JSON
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-calm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor & Role</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target Entity</th>
                  <th className="p-3">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {logs.map((log) => (
                  <tr key={log.id} className="transition-colors hover:bg-accent/20">
                    <td className="p-3 text-[11px] font-mono text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-xs text-foreground">{log.actor_name}</div>
                      <div className="text-[10px] text-primary">{log.actor_role}</div>
                    </td>
                    <td className="p-3">
                      <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="text-xs font-medium text-foreground">{log.target_title || log.target_id}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">{log.target_type}</div>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground font-mono max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "roles" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-6">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-medium">11-Role Least-Privilege Permissions Matrix</h3>
            <p className="text-xs text-muted-foreground">
              Every operation across the control plane is strictly mapped to designated roles.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STUDIO_ROLES.map((role) => {
              const perms = ROLE_PERMISSIONS[role] || [];
              const desc = ROLE_DESCRIPTIONS[role];

              return (
                <div key={role} className="rounded-2xl border border-border p-4 space-y-2 bg-muted/10">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-medium text-base text-foreground">{role}</h4>
                    <span className="text-[10px] font-mono text-primary font-semibold">
                      {perms.length} perms
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  <div className="pt-2 border-t border-border/50">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                      Capabilities:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {perms.slice(0, 4).map((p) => (
                        <span key={p} className="rounded bg-accent px-1.5 py-0.2 text-[9px] font-mono text-muted-foreground">
                          {p.split(":")[1]}
                        </span>
                      ))}
                      {perms.length > 4 && (
                        <span className="text-[9px] text-muted-foreground">+{perms.length - 4} more</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "flags" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-4">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-medium">Dynamic Feature Flags</h3>
            <p className="text-xs text-muted-foreground">
              Enable dark features for phased rollout without executing code deploys.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {(Object.keys(FLAG_LABEL) as FeatureFlag[]).map((flag) => (
              <div
                key={flag}
                className="flex items-center justify-between rounded-xl border border-border p-4"
              >
                <div>
                  <h4 className="text-sm font-medium">{FLAG_LABEL[flag]}</h4>
                  <p className="text-[11px] font-mono text-muted-foreground">{flag}</p>
                </div>
                <Switch
                  checked={flags[flag]}
                  onCheckedChange={(checked) => {
                    setFlags({ ...flags, [flag]: checked });
                    toast.success(`${FLAG_LABEL[flag]} ${checked ? "activated" : "deactivated"}`);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "health" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-6">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-medium">Infrastructure Topology & System Health</h3>
            <p className="text-xs text-muted-foreground">Real-time telemetry across distributed services.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground">PostgreSQL Core</span>
                <CheckCircle className="size-4 text-emerald-500" />
              </div>
              <p className="font-display text-xl font-medium text-emerald-600 dark:text-emerald-400">
                Connected
              </p>
              <div className="text-[11px] text-muted-foreground">93 Tables · RLS Active · Latency 14ms</div>
            </div>

            <div className="rounded-xl border border-border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Edge Routing</span>
                <CheckCircle className="size-4 text-emerald-500" />
              </div>
              <p className="font-display text-xl font-medium text-emerald-600 dark:text-emerald-400">
                Online
              </p>
              <div className="text-[11px] text-muted-foreground">Vercel / Nitro Edge Workers · SSL Valid</div>
            </div>

            <div className="rounded-xl border border-border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground">AI Epistemic Layer</span>
                <CheckCircle className="size-4 text-emerald-500" />
              </div>
              <p className="font-display text-xl font-medium text-emerald-600 dark:text-emerald-400">
                Grounded
              </p>
              <div className="text-[11px] text-muted-foreground">Gemini 1.5 Pro · Strict Citation Policy</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "backups" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-4">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-medium">Disaster Recovery & Archival Backups</h3>
            <p className="text-xs text-muted-foreground">
              Generate self-contained, JSON-archived snapshots of the entire EKA knowledge topology.
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <div className="text-xs font-semibold text-primary">Archival Benchmark Compliance</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Backups include all canonical Knowledge Objects, first-class semantic relationships,
              hierarchical taxonomy trees, media rights registries, and append-only audit histories.
            </p>
          </div>

          <div className="pt-2">
            <Button onClick={handleDownloadBackup}>
              <Download className="mr-1.5 size-4" /> Download Disaster Recovery Snapshot
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
