// ==============================================================================
// EKA STUDIO — ENTERPRISE, INSTITUTIONAL WORKSPACES & API KEYS
// ==============================================================================

import { useState } from "react";
import {
  Building2,
  Key,
  Plus,
  Trash2,
  Copy,
  ShieldCheck,
  Activity,
  Layers,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  createApiKey,
  fetchApiKeys,
  fetchEnterpriseOrgs,
  revokeApiKey,
  SEED_API_KEYS,
  SEED_ENTERPRISE_ORGS,
} from "@/lib/studio/system-service";
import type { EnterpriseApiKey, EnterpriseOrg, StudioRole } from "@/lib/studio/types";

interface StudioEnterpriseProps {
  currentRole: StudioRole;
}

export function StudioEnterprise({ currentRole }: StudioEnterpriseProps) {
  const [orgs, setOrgs] = useState<EnterpriseOrg[]>(SEED_ENTERPRISE_ORGS);
  const [apiKeys, setApiKeys] = useState<EnterpriseApiKey[]>(SEED_API_KEYS);
  const [selectedOrgId, setSelectedOrgId] = useState<string>(orgs[0]?.id || "");
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  const activeOrg = orgs.find((o) => o.id === selectedOrgId) || orgs[0];
  const orgKeys = apiKeys.filter((k) => k.org_id === activeOrg?.id);

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key.");
      return;
    }
    const created = await createApiKey(
      {
        org_id: activeOrg.id,
        name: newKeyName.trim(),
        scopes: ["read:knowledge", "read:graph", "read:sources"],
      },
      currentRole,
    );
    setApiKeys([created, ...apiKeys]);
    setIsCreatingKey(false);
    setNewKeyName("");
    toast.success(`API Key generated: ${created.name}`);
  };

  const handleRevoke = async (id: string) => {
    await revokeApiKey(id, currentRole);
    setApiKeys(apiKeys.map((k) => (k.id === id ? { ...k, is_revoked: true } : k)));
    toast.warning("API Key revoked immediately.");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-normal tracking-tight">
            Enterprise & Institutional Access
          </h2>
          <p className="text-xs text-muted-foreground">
            Academic institutes, heritage trusts, and institutional research access via scoped API keys.
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreatingKey(true)}>
          <Plus className="mr-1.5 size-4" /> Issue Enterprise API Key
        </Button>
      </div>

      {isCreatingKey && (
        <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-calm space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="font-display text-base font-medium">Issue Scoped Enterprise API Key</h3>
            <Button size="sm" variant="ghost" onClick={() => setIsCreatingKey(false)}>
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Key Identifier / Name</label>
              <Input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. Oxford Digital Sanskrit Sync"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Target Organization</label>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
              >
                {orgs.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Authorized Scopes</label>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-primary/10 text-primary px-3 py-1 font-mono">
                read:knowledge
              </span>
              <span className="rounded-full bg-primary/10 text-primary px-3 py-1 font-mono">
                read:graph
              </span>
              <span className="rounded-full bg-primary/10 text-primary px-3 py-1 font-mono">
                read:sources
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="ghost" onClick={() => setIsCreatingKey(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateKey}>
              Generate Key Secret
            </Button>
          </div>
        </div>
      )}

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {orgs.map((org) => {
          const isSelected = org.id === activeOrg.id;

          return (
            <div
              key={org.id}
              onClick={() => setSelectedOrgId(org.id)}
              className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-calm"
                  : "border-border bg-card hover:border-border/80"
              }`}
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-primary uppercase text-[10px]">{org.plan}</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.2 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {org.billing_status}
                </span>
              </div>
              <h4 className="mt-2 font-display text-base font-medium">{org.name}</h4>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                <span>Seats: {org.seats_used} / {org.seats_limit}</span>
                <span>Active</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* API Keys Table for Selected Org */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-medium">
              API Keys for {activeOrg.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              Rate Limit Quota: 1,200 requests/minute · 99.9% Uptime SLA
            </p>
          </div>
        </div>

        {orgKeys.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
            No active API keys issued for this organization.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {orgKeys.map((key) => (
              <div key={key.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3.5 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{key.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.2 text-[10px] font-semibold ${
                        key.is_revoked
                          ? "bg-destructive/10 text-destructive"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {key.is_revoked ? "REVOKED" : "ACTIVE"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <span>Key Prefix: {key.key_prefix}...</span>
                    <span>·</span>
                    <span>Limit: {key.rate_limit_rpm} RPM</span>
                  </div>
                  <div className="flex gap-1 pt-0.5">
                    {key.scopes.map((s) => (
                      <span key={s} className="rounded bg-accent px-1.5 py-0.2 text-[9px] text-muted-foreground font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {!key.is_revoked && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRevoke(key.id)}
                    className="text-destructive hover:bg-destructive/10 text-xs"
                  >
                    Revoke Key
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
