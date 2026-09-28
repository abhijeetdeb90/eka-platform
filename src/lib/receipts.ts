import { FEE_ALLOCATION, TXN_LABEL, formatINR, type WalletTxn } from "@/lib/pay";

/**
 * Receipts. Every movement is traceable to the action that caused it: what it
 * was, what EKA took, what reached the creator, and what carried into the
 * Peace & Knowledge Fund.
 */

const FUND_PERCENT =
  FEE_ALLOCATION.find((f) => f.key.toLowerCase().includes("peace"))?.percent ?? 0;

export type Receipt = {
  id: string;
  date: string;
  action: string;
  reference: string;
  gross: number;
  fee: number;
  net: number;
  fund: number;
  status: string;
};

export function receiptFor(t: WalletTxn): Receipt {
  const gross = Math.abs(t.amount_cents);
  const fee = t.fee_cents ?? 0;
  return {
    id: t.id,
    date: t.created_at,
    action: TXN_LABEL[t.kind] ?? t.kind,
    reference: t.reference_kind ? `${t.reference_kind}:${t.reference_id ?? "—"}` : (t.note ?? "—"),
    gross,
    fee,
    net: t.amount_cents < 0 ? -gross : gross - fee,
    fund: Math.round((fee * FUND_PERCENT) / 100),
    status: t.status,
  };
}

export function receiptsFor(txns: WalletTxn[]): Receipt[] {
  return txns.map(receiptFor);
}

export function receiptTotals(receipts: Receipt[]) {
  return receipts.reduce(
    (acc, r) => ({
      gross: acc.gross + r.gross,
      fee: acc.fee + r.fee,
      net: acc.net + r.net,
      fund: acc.fund + r.fund,
    }),
    { gross: 0, fee: 0, net: 0, fund: 0 },
  );
}

function csvCell(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function receiptsToCsv(receipts: Receipt[]): string {
  const header = [
    "Date",
    "Action",
    "Reference",
    "Gross",
    "EKA fee",
    "Net",
    "Peace & Knowledge Fund",
    "Status",
    "Receipt ID",
  ];
  const rows = receipts.map((r) => [
    new Date(r.date).toISOString(),
    r.action,
    r.reference,
    (r.gross / 100).toFixed(2),
    (r.fee / 100).toFixed(2),
    (r.net / 100).toFixed(2),
    (r.fund / 100).toFixed(2),
    r.status,
    r.id,
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

export function downloadReceipts(receipts: Receipt[], filename = "eka-wallet-receipts.csv") {
  if (typeof window === "undefined") return;
  const blob = new Blob([receiptsToCsv(receipts)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function receiptLine(r: Receipt) {
  return `${formatINR(r.gross)} · fee ${formatINR(r.fee)} · fund ${formatINR(r.fund)}`;
}
