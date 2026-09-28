import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppScreen, EmptyState } from "@/components/app/AppScreen";
import { Button } from "@/components/ui/button";
import { useIsAdmin, useIsModerator } from "@/hooks/useRole";
import { VerificationQueue } from "@/components/app/admin/VerificationQueue";
import { PayoutQueue } from "@/components/app/admin/PayoutQueue";
import { ConfigEditor } from "@/components/app/admin/ConfigEditor";
import { PoolAdmin } from "@/components/app/admin/PoolAdmin";
import { timeAgo } from "@/lib/eka";
import {
  LADDER,
  RESTRICTION_WINDOWS,
  fetchActionLog,
  fetchActiveRestrictions,
  fetchQueue,
  liftRestriction,
  restrictUser,
  reviewReport,
  type QueueReport,
} from "@/lib/moderation";
import { NorthStar } from "@/components/app/admin/NorthStar";
import {
  APPEAL_OUTCOMES,
  APPEAL_REASONS,
  decideAppeal,
  fetchAppealQueue,
  type Appeal,
} from "@/lib/appeals";

export const Route = createFileRoute("/_authenticated/app/admin")({
  component: Admin,
});

function Admin() {
  const { data: isMod, isLoading } = useIsModerator();
  const { data: isAdmin } = useIsAdmin();
  const queryClient = useQueryClient();

  const { data: metrics } = useQuery({
    queryKey: ["admin-metrics"],
    enabled: Boolean(isMod),
    queryFn: async () => {
      const week = new Date(Date.now() - 7 * 86_400_000).toISOString();
      const [users, posts, comments, communities, newUsers, plus, active] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("posts").select("id", { count: "exact", head: true }),
        supabase.from("post_comments").select("id", { count: "exact", head: true }),
        supabase.from("communities").select("id", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .gte("created_at", week),
        supabase
          .from("subscriptions")
          .select("id", { count: "exact", head: true })
          .eq("plan", "plus"),
        supabase.from("posts").select("author_id").gte("created_at", week),
      ]);
      return {
        users: users.count ?? 0,
        posts: posts.count ?? 0,
        comments: comments.count ?? 0,
        communities: communities.count ?? 0,
        newUsers: newUsers.count ?? 0,
        plus: plus.count ?? 0,
        wau: new Set((active.data ?? []).map((r) => r.author_id)).size,
      };
    },
  });

  const { data: escalated } = useQuery({
    queryKey: ["admin-escalated"],
    enabled: Boolean(isMod),
    queryFn: () => fetchQueue("escalated"),
  });

  const { data: reports } = useQuery({
    queryKey: ["admin-reports"],
    enabled: Boolean(isMod),
    queryFn: () => fetchQueue("open"),
  });

  const { data: restrictions } = useQuery({
    queryKey: ["admin-restrictions"],
    enabled: Boolean(isMod),
    queryFn: fetchActiveRestrictions,
  });

  const { data: appeals } = useQuery({
    queryKey: ["admin-appeals"],
    enabled: Boolean(isMod),
    queryFn: fetchAppealQueue,
  });

  const { data: actionLog } = useQuery({
    queryKey: ["admin-actions"],
    enabled: Boolean(isMod),
    queryFn: fetchActionLog,
  });

  const { data: recentPosts } = useQuery({
    queryKey: ["admin-posts"],
    enabled: Boolean(isMod),
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, content, status, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  if (isLoading) return <AppScreen title="Admin">Loading…</AppScreen>;
  if (!isMod)
    return (
      <AppScreen title="Admin">
        <EmptyState title="Not available" body="This area is for EKA moderators and admins." />
      </AppScreen>
    );

  const setPostStatus = async (id: string, status: string) => {
    await supabase.from("posts").update({ status }).eq("id", id);
    void queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
    toast.success(status === "hidden" ? "Post hidden." : "Post restored.");
  };

  const refreshModeration = () => {
    for (const key of [
      "admin-reports",
      "admin-escalated",
      "admin-restrictions",
      "admin-actions",
      "admin-posts",
      "admin-appeals",
    ]) {
      void queryClient.invalidateQueries({ queryKey: [key] });
    }
  };

  const decide = async (report: QueueReport, outcome: "upheld" | "restored") => {
    await reviewReport(report, outcome);
    refreshModeration();
    toast.success(outcome === "upheld" ? "Kept hidden and logged." : "Restored to the community.");
  };

  const restrict = async (report: QueueReport, days: number) => {
    if (!report.reported_user_id) {
      toast.error("No member is attached to this report.");
      return;
    }
    await restrictUser(report.reported_user_id, days, report.reason);
    refreshModeration();
    toast.success(`Posting paused for ${days} ${days === 1 ? "day" : "days"}.`);
  };

  const queueCard = (r: QueueReport) => (
    <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={
            r.severity === "severe"
              ? "rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] text-destructive"
              : "rounded-full bg-accent px-2 py-0.5 text-[11px] text-muted-foreground"
          }
        >
          {r.severity === "severe" ? "Severe" : "Standard"}
        </span>
        {r.auto_hidden && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] text-muted-foreground">
            Auto-hidden
          </span>
        )}
        <span className="text-[11px] text-muted-foreground">
          {r.target_kind} · {timeAgo(r.created_at)}
        </span>
      </div>
      <p className="mt-2 text-sm">{r.reason}</p>
      {r.details && <p className="mt-1 text-xs text-muted-foreground">{r.details}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => decide(r, "upheld")}>
          Uphold — keep hidden
        </Button>
        <Button size="sm" variant="outline" onClick={() => decide(r, "restored")}>
          Restore
        </Button>
        {RESTRICTION_WINDOWS.map((w) => (
          <Button key={w.days} size="sm" variant="ghost" onClick={() => restrict(r, w.days)}>
            Pause {w.label}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <AppScreen eyebrow="Moderation" title="Admin">
      {/* EKA Studio Master Control Plane Gateway */}
      <div className="rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-accent/20 p-5 shadow-calm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-semibold tracking-tight text-foreground">
                EKA STUDIO — Internal Control Plane
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                v1.0 Ready
              </span>
            </div>
            <p className="text-xs text-muted-foreground max-w-xl">
              Launch the complete 12-domain platform operating system: Canonical Knowledge Objects,
              first-class graph relationships, hierarchical taxonomy, visual homepage manager, and 11-role RBAC.
            </p>
          </div>
          <Button asChild size="sm">
            <Link to="/studio">Launch Studio Control Plane →</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          ["Users", metrics?.users],
          ["New (7d)", metrics?.newUsers],
          ["Active (7d)", metrics?.wau],
          ["Posts", metrics?.posts],
          ["Comments", metrics?.comments],
          ["Sanghas", metrics?.communities],
          ["Plus", metrics?.plus],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
            <p className="mt-1 font-display text-2xl">{value ?? 0}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card/60 p-5">
        <h2 className="font-display text-lg">Escalation ladder</h2>
        <ul className="mt-2 space-y-2">
          {LADDER.map((l) => (
            <li key={l.rung} className="border-t border-border pt-2 first:border-0 first:pt-0">
              <p className="text-sm">{l.rung}</p>
              <p className="text-xs text-muted-foreground">{l.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg">Auto-hidden — needs review</h2>
        {(escalated?.length ?? 0) === 0 ? (
          <EmptyState
            title="Nothing auto-hidden"
            body="No severe reports are waiting on a person."
          />
        ) : (
          escalated?.map(queueCard)
        )}
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg">Open reports</h2>
        {(reports?.length ?? 0) === 0 ? (
          <EmptyState title="Queue is clear" body="No open reports right now." />
        ) : (
          reports?.map(queueCard)
        )}
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg">Appeals waiting</h2>
        {(appeals?.length ?? 0) === 0 ? (
          <EmptyState
            title="No appeals"
            body="Members can appeal every hidden item and every pause."
          />
        ) : (
          appeals?.map((a: Appeal) => (
            <div key={a.id} className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">
                {APPEAL_REASONS.find((r) => r.code === a.reason_code)?.label ?? a.reason_code} ·{" "}
                {a.subject_kind} · {timeAgo(a.created_at)}
              </p>
              <p className="mt-2 text-sm">{a.statement}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {APPEAL_OUTCOMES.map((o) => (
                  <Button
                    key={o.code}
                    size="sm"
                    variant={o.code === "overturned" ? "default" : "outline"}
                    onClick={async () => {
                      await decideAppeal(a, o.code, o.body);
                      refreshModeration();
                      toast.success(o.label);
                    }}
                  >
                    {o.label}
                  </Button>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg">Active restrictions</h2>
        {(restrictions?.length ?? 0) === 0 ? (
          <EmptyState
            title="No one is restricted"
            body="Temporary pauses appear here until they expire."
          />
        ) : (
          restrictions?.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm">{r.reason}</p>
                <p className="text-xs text-muted-foreground">
                  Posting paused
                  {r.expires_at ? ` until ${new Date(r.expires_at).toLocaleString()}` : ""}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  await liftRestriction(r.id);
                  refreshModeration();
                  toast.success("Restriction lifted.");
                }}
              >
                Lift
              </Button>
            </div>
          ))
        )}
      </section>

      {isAdmin && (
        <>
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-calm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg">Creator Risk & Fraud Operations</h3>
                <p className="text-xs text-muted-foreground">
                  Audit bot velocity anomalies, review creator KYC & PAN withholding, and execute
                  monthly payout dry runs.
                </p>
              </div>
              <Button asChild size="sm">
                <Link to="/admin/creator-risk">Open Creator Risk Center</Link>
              </Button>
            </div>
          </div>
          <NorthStar />
          <PayoutQueue />
          <VerificationQueue />
          <PoolAdmin />
          <ConfigEditor />
        </>
      )}

      <section className="space-y-2">
        <h2 className="font-display text-lg">Action log</h2>
        {actionLog?.map((a) => (
          <p
            key={a.id}
            className="rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground"
          >
            {a.rung} · {a.action} · {a.target_kind} · {timeAgo(a.created_at)}
            {a.notes ? ` — ${a.notes}` : ""}
          </p>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-lg">Recent posts</h2>
        {recentPosts?.map((p) => (
          <div
            key={p.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <div className="min-w-0">
              <p className="truncate text-sm">{p.content}</p>
              <p className="text-xs text-muted-foreground">
                {p.status} · {timeAgo(p.created_at)}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPostStatus(p.id, p.status === "hidden" ? "visible" : "hidden")}
            >
              {p.status === "hidden" ? "Restore" : "Hide"}
            </Button>
          </div>
        ))}
      </section>
    </AppScreen>
  );
}
