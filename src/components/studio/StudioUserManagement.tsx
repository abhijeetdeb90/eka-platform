// ==============================================================================
// EKA STUDIO — USER, CREATOR & COMMUNITY GOVERNANCE MODULE
// ==============================================================================

import { useState } from "react";
import {
  Users,
  Award,
  Sparkles,
  Shield,
  Search,
  CheckCircle,
  XCircle,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { StudioRole } from "@/lib/studio/types";

interface StudioUserManagementProps {
  currentRole: StudioRole;
}

const SEED_USERS = [
  {
    id: "usr_01",
    display_name: "Aditya Verma",
    username: "aditya_v",
    account_type: "Creator / Practitioner",
    tradition: "Sanatana Dharma",
    verified: true,
    suspended: false,
    role: "Creator Manager",
    joined: "2026-08-15",
  },
  {
    id: "usr_02",
    display_name: "Prof. S. Ranganathan",
    username: "sranganathan",
    account_type: "Scholar / Verifier",
    tradition: "Vedic Philology",
    verified: true,
    suspended: false,
    role: "Verifier",
    joined: "2026-08-20",
  },
  {
    id: "usr_03",
    display_name: "Tenzin Palmo",
    username: "tenzin_p",
    account_type: "Contemplative Teacher",
    tradition: "Tibetan Buddhism",
    verified: true,
    suspended: false,
    role: "Knowledge Editor",
    joined: "2026-09-01",
  },
  {
    id: "usr_04",
    display_name: "Ahmad Raza",
    username: "ahmad_chishti",
    account_type: "Living Lineage Keeper",
    tradition: "Chishti Sufism",
    verified: true,
    suspended: false,
    role: "Community Moderator",
    joined: "2026-09-05",
  },
];

const SEED_COMMUNITIES = [
  {
    id: "comm_01",
    name: "Dawn Contemplation Sangha",
    category: "Contemplative Practice",
    member_count: 342,
    featured: true,
  },
  {
    id: "comm_02",
    name: "Vedic Sanskrit Philology Circle",
    category: "Scriptural Study",
    member_count: 188,
    featured: true,
  },
  {
    id: "comm_03",
    name: "Sufi Poetry & Sama Assembly",
    category: "Mystical Devotion",
    member_count: 260,
    featured: false,
  },
];

export function StudioUserManagement({ currentRole }: StudioUserManagementProps) {
  const [activeTab, setActiveTab] = useState<"users" | "creators" | "communities">("users");
  const [users, setUsers] = useState(SEED_USERS);
  const [communities, setCommunities] = useState(SEED_COMMUNITIES);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleSuspend = (id: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const nextState = !u.suspended;
          toast[nextState ? "warning" : "success"](
            `User ${u.display_name} is now ${nextState ? "suspended" : "reactivated"}.`,
          );
          return { ...u, suspended: nextState };
        }
        return u;
      }),
    );
  };

  const handleToggleFeatured = (id: string) => {
    setCommunities(
      communities.map((c) => {
        if (c.id === id) {
          toast.success(`Community ${c.name} featured state toggled.`);
          return { ...c, featured: !c.featured };
        }
        return c;
      }),
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-normal tracking-tight">User & Community Governance</h2>
          <p className="text-xs text-muted-foreground">
            Manage authenticated seekers, verified scholars, living lineage creators, and sacred communities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={activeTab === "users" ? "default" : "outline"}
            onClick={() => setActiveTab("users")}
          >
            <Users className="mr-1.5 size-3.5" /> Members & Roles ({users.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === "communities" ? "default" : "outline"}
            onClick={() => setActiveTab("communities")}
          >
            <Sparkles className="mr-1.5 size-3.5" /> Communities ({communities.length})
          </Button>
        </div>
      </div>

      {activeTab === "users" ? (
        <div className="rounded-2xl border border-border bg-card shadow-calm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Account Type</th>
                <th className="p-3.5">Tradition</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {users.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-accent/20">
                  <td className="p-3.5">
                    <div className="font-medium text-foreground">{u.display_name}</div>
                    <div className="text-xs text-muted-foreground">@{u.username}</div>
                  </td>
                  <td className="p-3.5 text-xs text-muted-foreground">{u.account_type}</td>
                  <td className="p-3.5 text-xs text-muted-foreground">{u.tradition}</td>
                  <td className="p-3.5 text-xs">
                    <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 font-medium">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        u.suspended
                          ? "bg-destructive/10 text-destructive"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {u.suspended ? "SUSPENDED" : "ACTIVE"}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleSuspend(u.id)}
                      className={u.suspended ? "text-emerald-600" : "text-destructive"}
                    >
                      {u.suspended ? "Reactivate" : "Suspend"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {communities.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-calm">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-primary uppercase text-[10px]">{c.category}</span>
                <span className="text-muted-foreground">{c.member_count} Members</span>
              </div>
              <h4 className="font-display text-base font-medium">{c.name}</h4>
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-xs text-muted-foreground">
                  {c.featured ? "Featured on Home" : "Standard"}
                </span>
                <Button size="sm" variant="outline" onClick={() => handleToggleFeatured(c.id)}>
                  {c.featured ? "Unfeature" : "Feature"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
