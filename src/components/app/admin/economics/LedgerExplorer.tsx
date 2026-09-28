import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";
import { download, fetchLedger, toCsv, type LedgerEntry } from "@/lib/economics";
import { Empty, Money, Panel, Row, Scroller, Section } from "./Primitives";

const money = (n: number) => formatMoney(n, "INR", { decimals: true });

export function LedgerExplorer({
  from,
  to,
  category,
  onCategory,
}: {
  from: string;
  to: string;
  category: string;
  onCategory: (c: string) => void;
}) {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<LedgerEntry | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["eka-ledger", from, to, category, status, search],
    queryFn: () => fetchLedger({ from, to, category, status, search }),
  });

  return (
    <Section
      title="Financial ledger"
      hint="Every settled movement, append-only. Corrections are recorded as reversals, never edits."
      action={
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            download(
              "eka-ledger.csv",
              toCsv(
                [
                  "Date",
                  "Reference",
                  "Type",
                  "Creator amount",
                  "EKA fee",
                  "Processing cost",
                  "Refund",
                  "Chargeback",
                  "Operations",
                  "Trust & Safety",
                  "Peace & Knowledge",
                  "Community",
                  "Retained",
                  "Status",
                  "Test",
                ],
                rows.map((r) => [
                  new Date(r.created_at).toISOString(),
                  r.transaction_ref ?? r.id,
                  r.category,
                  r.gross_creator_amount / 100,
                  r.eka_gross_fee / 100,
                  r.payment_processing_cost / 100,
                  r.refund_amount / 100,
                  r.chargeback_amount / 100,
                  r.operations_allocation / 100,
                  r.trust_safety_allocation / 100,
                  r.peace_knowledge_allocation / 100,
                  r.community_allocation / 100,
                  r.retained_earnings_allocation / 100,
                  r.status,
                  r.is_test_transaction ? "yes" : "no",
                ]),
              ),
            )
          }
        >
          Export ledger
        </Button>
      }
    >
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search reference"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-[220px]"
        />
        <select
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          {["all", "service", "session", "conversation", "membership", "gratitude", "episode"].map(
            (c) => (
              <option key={c} value={c}>
                {c === "all" ? "All types" : c}
              </option>
            ),
          )}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          {["all", "settled", "reversed", "pending"].map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All statuses" : s}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Panel>Loading…</Panel>
      ) : rows.length === 0 ? (
        <Empty
          title="No financial activity yet."
          body="Settled transactions appear here as soon as members pay creators."
        />
      ) : (
        <Scroller>
          <table className="w-full min-w-[54rem] text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="py-2">Date</th>
                <th>Reference</th>
                <th>Type</th>
                <th>Creator</th>
                <th>EKA revenue</th>
                <th>Refund</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="cursor-pointer border-t border-border/60 hover:bg-accent/40"
                  onClick={() => setOpen(r)}
                >
                  <td className="py-2 whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString("en-GB")}
                  </td>
                  <td className="max-w-[14rem] truncate">{r.transaction_ref ?? r.id}</td>
                  <td>{r.category}</td>
                  <td className="tabular-nums">{money(r.gross_creator_amount)}</td>
                  <td className="tabular-nums">{money(r.eka_gross_fee)}</td>
                  <td className="tabular-nums">{r.refund_amount ? money(r.refund_amount) : "—"}</td>
                  <td>
                    {r.status}
                    {r.is_test_transaction && (
                      <span className="ml-1 text-xs text-muted-foreground">· test</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Scroller>
      )}

      <Sheet open={Boolean(open)} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-display">Transaction detail</SheetTitle>
          </SheetHeader>
          {open && (
            <div className="mt-4">
              <Row label="Reference" value={open.transaction_ref ?? open.id} />
              <Row label="Type" value={open.category} />
              <Row
                label="Creator price"
                value={<Money minor={open.gross_creator_amount} decimals />}
              />
              <Row label="EKA platform fee" value={<Money minor={open.eka_gross_fee} decimals />} />
              <Row
                strong
                label="Member total"
                value={<Money minor={open.gross_creator_amount + open.eka_gross_fee} decimals />}
              />
              <Row
                label="Creator earnings"
                value={<Money minor={open.creator_net_amount} decimals />}
              />
              <Row
                label="Payment cost"
                value={<Money minor={open.payment_processing_cost} decimals />}
              />
              <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">
                EKA fee allocation
              </p>
              <Row
                label="Platform operations"
                value={<Money minor={open.operations_allocation} decimals />}
              />
              <Row
                label="Trust & Safety"
                value={<Money minor={open.trust_safety_allocation} decimals />}
              />
              <Row
                label="Peace & Knowledge Fund"
                value={<Money minor={open.peace_knowledge_allocation} decimals />}
              />
              <Row
                label="Community projects"
                value={<Money minor={open.community_allocation} decimals />}
              />
              <Row
                label="EKA retained earnings"
                value={<Money minor={open.retained_earnings_allocation} decimals />}
              />
              <Row strong label="Status" value={open.status} />
              {open.reverses_id && (
                <p className="mt-2 text-xs text-muted-foreground">
                  This entry reverses {open.reverses_id}.
                </p>
              )}
              {open.is_test_transaction && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Test payment path — excluded from financial reporting.
                </p>
              )}
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Allocations were calculated with the economic model in force at the time of the
                transaction.
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </Section>
  );
}
