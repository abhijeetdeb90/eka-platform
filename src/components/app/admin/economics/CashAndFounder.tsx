import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney, parseAmountToMinor } from "@/lib/money";
import {
  DISTRIBUTION_LABEL,
  addDistribution,
  download,
  fetchDistributions,
  setDistributionStatus,
  toCsv,
  thresholds,
  type Distribution,
  type DistributionKind,
  type DistributionStatus,
  type Economics,
} from "@/lib/economics";
import { Empty, Money, Panel, Row, Scroller, Section, Stat } from "./Primitives";

const money = (n: number) => formatMoney(n, "INR");

export function CashView({ e }: { e: Economics }) {
  const t = thresholds(e.config ?? {});
  const reserve = t.reserveMonths * e.operating_expenses;
  return (
    <div className="space-y-8">
      <Section
        title="Cash"
        hint="Accounting profit is not cash. Cash figures come only from recorded balances."
      >
        {!e.cash_connected ? (
          <Empty
            title="Cash reconciliation isn't connected."
            body="Record a closing cash balance for a month to start tracking cash here."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Cash balance" emphasis value={money(e.cash_balance)} />
            <Stat label="Pending creator payouts" value={money(e.creator_pending_payouts)} />
            <Stat
              label="Reserve target"
              value={money(reserve)}
              sub={`${t.reserveMonths} months of operating costs`}
            />
            <Stat
              label="Estimated free cash"
              value={money(e.cash_balance - e.creator_pending_payouts - reserve)}
              tone={
                e.cash_balance - e.creator_pending_payouts - reserve < 0 ? "negative" : "default"
              }
            />
          </div>
        )}
      </Section>

      <Section
        title="Creator payout liability"
        hint="Creator earnings are money owed to creators. They are never EKA revenue."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Creator earnings generated" value={money(e.creator_earned)} />
          <Stat label="Creator earnings paid" value={money(e.creator_paid)} />
          <Stat label="Pending payouts" value={money(e.creator_pending_payouts)} />
          <Stat label="Creator payout liability" emphasis value={money(e.creator_liability)} />
        </div>
      </Section>
    </div>
  );
}

export function FounderEconomics({ e, from, to }: { e: Economics; from: string; to: string }) {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["finance-distributions", from, to],
    queryFn: () => fetchDistributions(from, to),
  });
  const founderCash = e.founder_compensation_paid + e.owner_distributions_paid;

  return (
    <div className="space-y-8">
      <Section
        title="Founder economics"
        hint="Private. Company profit and founder income are different things."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Founder compensation"
            value={money(e.founder_compensation)}
            sub="Approved or paid this period"
          />
          <Stat label="Owner distributions" value={money(e.owner_distributions)} />
          <Stat label="Company operating profit" value={money(e.operating_profit)} />
          <Stat label="Company retained earnings" value={money(e.retained_earnings)} />
        </div>
        <Panel className="border-primary/30 bg-primary/5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Founder cash received
          </p>
          <div className="mt-2 max-w-sm">
            <Row
              label="Founder compensation paid"
              value={<Money minor={e.founder_compensation_paid} />}
            />
            <Row
              label="Owner distributions paid"
              value={<Money minor={e.owner_distributions_paid} />}
            />
            <Row strong label="Total cash received" value={<Money minor={founderCash} />} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Company profit belongs to EKA. Founder income is determined by approved compensation and
            distributions according to the company's ownership and legal structure.
          </p>
        </Panel>
      </Section>

      <DistributionLedger
        rows={rows}
        period={from}
        onChanged={() => {
          void qc.invalidateQueries({ queryKey: ["finance-distributions"] });
          void qc.invalidateQueries({ queryKey: ["eka-economics"] });
          void qc.invalidateQueries({ queryKey: ["eka-months"] });
        }}
      />

      <Section title="Retained earnings" hint="Cumulative for the selected period.">
        <Panel className="max-w-md">
          <Row label="Operating profit" value={<Money minor={e.operating_profit} />} />
          <Row label="− Creator Pool" value={<Money minor={-e.creator_pool} />} />
          <Row label="− Founder compensation" value={<Money minor={-e.founder_compensation} />} />
          <Row label="− Owner distributions" value={<Money minor={-e.owner_distributions} />} />
          <Row
            strong
            label="= Closing retained earnings"
            value={<Money minor={e.retained_earnings} />}
          />
        </Panel>
      </Section>
    </div>
  );
}

const STATUSES: DistributionStatus[] = ["draft", "proposed", "approved", "paid", "cancelled"];

function DistributionLedger({
  rows,
  period,
  onChanged,
}: {
  rows: Distribution[];
  period: string;
  onChanged: () => void;
}) {
  const [kind, setKind] = useState<DistributionKind>("founder_compensation");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <Section
      title="Compensation & distributions"
      hint="Founder compensation and owner distributions are separate ledgers. Neither is an operating expense. Records are never deleted — cancel instead."
      action={
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            download(
              "eka-founder-compensation.csv",
              toCsv(
                [
                  "Period",
                  "Kind",
                  "Recipient",
                  "Amount",
                  "Status",
                  "Payment date",
                  "Reference",
                  "Note",
                ],
                rows.map((r) => [
                  r.period,
                  DISTRIBUTION_LABEL[r.kind],
                  r.recipient_name ?? "",
                  r.amount_cents / 100,
                  r.status,
                  r.payment_date ?? "",
                  r.reference ?? "",
                  r.note ?? "",
                ]),
              ),
            )
          }
        >
          Export
        </Button>
      }
    >
      <Panel className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-4">
          <select
            value={kind}
            onChange={(ev) => setKind(ev.target.value as DistributionKind)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            {(Object.keys(DISTRIBUTION_LABEL) as DistributionKind[]).map((k) => (
              <option key={k} value={k}>
                {DISTRIBUTION_LABEL[k]}
              </option>
            ))}
          </select>
          <Input
            placeholder="Amount (₹)"
            value={amount}
            inputMode="decimal"
            onChange={(ev) => setAmount(ev.target.value)}
          />
          <Input
            placeholder="Recipient"
            value={recipient}
            onChange={(ev) => setRecipient(ev.target.value)}
          />
          <Input placeholder="Note" value={note} onChange={(ev) => setNote(ev.target.value)} />
        </div>
        <Button
          size="sm"
          disabled={busy || !amount}
          onClick={async () => {
            setBusy(true);
            const { error } = await addDistribution({
              period,
              kind,
              amount_cents: parseAmountToMinor(amount),
              status: "draft",
              ...(recipient ? { recipient_name: recipient } : {}),
              ...(note ? { note } : {}),
            });
            setBusy(false);
            if (error) {
              toast.error(error.message);
              return;
            }
            setAmount("");
            setRecipient("");
            setNote("");
            onChanged();
            toast.success("Recorded as draft.");
          }}
        >
          Record entry
        </Button>
      </Panel>

      {rows.length === 0 ? (
        <Empty
          title="Nothing recorded for this period."
          body="Draft entries do not affect reporting until they are approved."
        />
      ) : (
        <Scroller>
          <table className="w-full min-w-[44rem] text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="py-2">Period</th>
                <th>Kind</th>
                <th>Recipient</th>
                <th>Amount</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border/60">
                  <td className="py-2 whitespace-nowrap">{r.period}</td>
                  <td>{DISTRIBUTION_LABEL[r.kind]}</td>
                  <td>{r.recipient_name ?? "—"}</td>
                  <td className="tabular-nums">{money(r.amount_cents)}</td>
                  <td>{r.status}</td>
                  <td className="py-2">
                    <select
                      value={r.status}
                      disabled={r.status === "paid"}
                      onChange={async (ev) => {
                        const { error } = await setDistributionStatus(
                          r.id,
                          ev.target.value as DistributionStatus,
                        );
                        if (error) {
                          toast.error(error.message);
                          return;
                        }
                        onChanged();
                        toast.success("Status updated.");
                      }}
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Scroller>
      )}
    </Section>
  );
}
