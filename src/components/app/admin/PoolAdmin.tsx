import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatINR } from "@/lib/billing";
import { fetchConfig } from "@/lib/config";
import {
  POOL_EXPLAINER,
  createPeriod,
  fetchAllocations,
  fetchPoolPeriods,
  previewDistribution,
  publishDistribution,
} from "@/lib/pool";

const thisPeriod = () => new Date().toISOString().slice(0, 7);

/** Set a pool, preview who receives what, then publish it. Never automatic. */
export function PoolAdmin() {
  const qc = useQueryClient();
  const { data: config } = useQuery({ queryKey: ["platform-config"], queryFn: fetchConfig });
  const { data: periods = [] } = useQuery({
    queryKey: ["admin-pool-periods"],
    queryFn: fetchPoolPeriods,
  });
  const [period, setPeriod] = useState(thisPeriod());
  const [amount, setAmount] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const { data: allocations = [] } = useQuery({
    queryKey: ["admin-pool-allocations", openId],
    enabled: Boolean(openId),
    queryFn: () => fetchAllocations(openId as string),
  });

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["admin-pool-periods"] });
    void qc.invalidateQueries({ queryKey: ["admin-pool-allocations"] });
  };

  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-display text-lg">Creator Pool</h2>
        <p className="text-xs leading-relaxed text-muted-foreground">{POOL_EXPLAINER}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Period</p>
            <Input
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="mt-1.5 w-[140px]"
            />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Pool (₹)
            </p>
            <Input
              value={amount}
              inputMode="numeric"
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
              className="mt-1.5 w-[160px]"
            />
          </div>
          <Button
            size="sm"
            disabled={busy || !period || !amount}
            onClick={async () => {
              setBusy(true);
              const { error } = await createPeriod(
                period,
                Number(amount) * 100,
                "A share of EKA profit.",
              );
              setBusy(false);
              if (error) {
                toast.error(error.message);
                return;
              }
              setAmount("");
              refresh();
              toast.success("Period created as a draft.");
            }}
          >
            Create period
          </Button>
        </div>
      </div>

      {periods.map((p) => (
        <div key={p.id} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-medium">
              {p.period} · {formatINR(p.pool_cents)}
            </p>
            <span className="text-[11px] text-muted-foreground">{p.status}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{p.funding_source}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={busy || p.status === "published"}
              onClick={async () => {
                if (!config) return;
                setBusy(true);
                const { error } = await previewDistribution(p.id, config);
                setBusy(false);
                if (error) {
                  toast.error(error.message);
                  return;
                }
                setOpenId(p.id);
                refresh();
                toast.success("Preview ready.");
              }}
            >
              Preview distribution
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setOpenId(openId === p.id ? null : p.id)}
            >
              {openId === p.id ? "Hide" : "Show"} allocations
            </Button>
            <Button
              size="sm"
              disabled={busy || p.status !== "preview"}
              onClick={async () => {
                setBusy(true);
                const { error } = await publishDistribution(p.id);
                setBusy(false);
                if (error) {
                  toast.error(error.message);
                  return;
                }
                refresh();
                toast.success("Published to creators.");
              }}
            >
              Publish
            </Button>
          </div>
          {openId === p.id && (
            <ul className="mt-3 space-y-1.5">
              {allocations.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between text-xs text-muted-foreground"
                >
                  <span>
                    Score {a.score} · {(a.share * 100).toFixed(1)}%
                  </span>
                  <span className="tabular-nums">{formatINR(a.amount_cents)}</span>
                </li>
              ))}
              {allocations.length === 0 && (
                <li className="text-xs text-muted-foreground">No allocations yet.</li>
              )}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}
