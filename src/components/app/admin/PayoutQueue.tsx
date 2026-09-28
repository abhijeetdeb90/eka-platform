import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatINR } from "@/lib/billing";
import { timeAgo } from "@/lib/eka";
import {
  RISK_COPY,
  STATUS_COPY,
  fetchAllPayouts,
  reviewPayout,
  type PayoutRequest,
} from "@/lib/payouts";

/** Approve, reject or release a creator's payout — with the reasons on screen. */
export function PayoutQueue() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({ queryKey: ["admin-payouts"], queryFn: fetchAllPayouts });
  const open = rows.filter((r) => r.status === "pending" || r.status === "approved");
  const closed = rows.filter((r) => r.status !== "pending" && r.status !== "approved");

  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-display text-lg">Payouts</h2>
        <p className="text-xs text-muted-foreground">
          Larger amounts and flagged accounts wait here for a person before anything is released.
        </p>
      </div>
      {open.length === 0 && (
        <p className="text-sm text-muted-foreground">No payouts are waiting.</p>
      )}
      {open.map((p) => (
        <PayoutCard
          key={p.id}
          row={p}
          onDone={() => void qc.invalidateQueries({ queryKey: ["admin-payouts"] })}
        />
      ))}
      {closed.length > 0 && (
        <details className="rounded-2xl border border-border/70 bg-card p-4">
          <summary className="cursor-pointer text-sm">Settled ({closed.length})</summary>
          <ul className="mt-3 space-y-1.5">
            {closed.map((p) => (
              <li key={p.id} className="text-xs text-muted-foreground">
                {formatINR(p.amount_cents)} · {STATUS_COPY[p.status]} · {timeAgo(p.created_at)}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

function PayoutCard({ row, onDone }: { row: PayoutRequest; onDone: () => void }) {
  const [note, setNote] = useState(row.review_note ?? "");
  const [busy, setBusy] = useState(false);

  const act = async (status: "approved" | "rejected" | "paid" | "refunded") => {
    setBusy(true);
    const { error } = await reviewPayout(row.id, status, note);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    onDone();
    toast.success(`Marked ${status}.`);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display text-lg tabular-nums">{formatINR(row.amount_cents)}</p>
        <span className="text-[11px] text-muted-foreground">
          {STATUS_COPY[row.status]} · requested {timeAgo(row.created_at)}
        </span>
      </div>
      {row.note && <p className="mt-1 text-xs text-muted-foreground">{row.note}</p>}
      {row.risk_flags.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {row.risk_flags.map((f) => (
            <li
              key={f}
              className="rounded-full bg-accent px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {RISK_COPY[f] ?? f}
            </li>
          ))}
        </ul>
      )}
      <Input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Reason for the record"
        className="mt-3"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {row.status === "pending" && (
          <>
            <Button size="sm" disabled={busy} onClick={() => act("approved")}>
              Approve
            </Button>
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => act("rejected")}>
              Reject
            </Button>
          </>
        )}
        {row.status === "approved" && (
          <>
            <Button size="sm" disabled={busy} onClick={() => act("paid")}>
              Mark as paid
            </Button>
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => act("refunded")}>
              Return to balance
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
