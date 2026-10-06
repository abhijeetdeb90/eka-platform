// ==============================================================================
// EKA STUDIO — MONETIZATION, CREATOR PAYOUTS & PLATFORM FEES
// ==============================================================================

import { useState } from "react";
import {
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  PieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { StudioRole } from "@/lib/studio/types";

interface StudioMonetizationProps {
  currentRole: StudioRole;
}

const SEED_PAYOUTS = [
  {
    id: "payout_01",
    creator: "Pt. Ramesh Shastri",
    amount_inr: 45000,
    pan_verified: true,
    status: "Pending Approval",
    period: "August 2026",
  },
  {
    id: "payout_02",
    creator: "Niazi Brothers Qawwal Guild",
    amount_inr: 68000,
    pan_verified: true,
    status: "Processing",
    period: "August 2026",
  },
  {
    id: "payout_03",
    creator: "Tenzin Palmo",
    amount_inr: 32000,
    pan_verified: true,
    status: "Completed",
    period: "July 2026",
  },
];

export function StudioMonetization({ currentRole }: StudioMonetizationProps) {
  const [payouts, setPayouts] = useState(SEED_PAYOUTS);

  const handleApprovePayout = (id: string) => {
    setPayouts(
      payouts.map((p) => (p.id === id ? { ...p, status: "Processing" } : p)),
    );
    toast.success("Payout authorized. Funds dispatched to escrow release queue.");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-normal tracking-tight">Monetization & Treasury</h2>
          <p className="text-xs text-muted-foreground">
            Manage EKA Plus subscriptions, creator score pool distributions, and platform fee transparency.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <span className="text-xs uppercase text-muted-foreground font-medium">EKA Plus MRR</span>
          <p className="mt-1 font-display text-2xl font-semibold">₹4,85,000</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+14% this month</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <span className="text-xs uppercase text-muted-foreground font-medium">Platform Fee</span>
          <p className="mt-1 font-display text-2xl font-semibold">10.0%</p>
          <span className="text-[11px] text-muted-foreground">Transparent Commission</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <span className="text-xs uppercase text-muted-foreground font-medium">Creator Commerce GMV</span>
          <p className="mt-1 font-display text-2xl font-semibold">₹14,50,000</p>
          <span className="text-[11px] text-primary font-medium">Completed Offerings</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <span className="text-xs uppercase text-muted-foreground font-medium">Net Creator Payouts</span>
          <p className="mt-1 font-display text-2xl font-semibold">₹13,05,000</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Dispatched via Ledger</span>
        </div>
      </div>

      {/* Fee Allocation Policy Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-4">
        <h3 className="font-display text-base font-medium">Platform Fee Allocation Formula</h3>
        <p className="text-xs text-muted-foreground">
          Every 10% commission fee retained by EKA is contractually allocated as follows:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
          <div className="rounded-xl border border-border p-3 space-y-1">
            <span className="text-xs font-semibold text-primary">45%</span>
            <div className="text-xs font-medium">Platform Operations</div>
            <p className="text-[11px] text-muted-foreground">Hosting, delivery, security infrastructure.</p>
          </div>
          <div className="rounded-xl border border-border p-3 space-y-1">
            <span className="text-xs font-semibold text-primary">20%</span>
            <div className="text-xs font-medium">Trust & Safety</div>
            <p className="text-[11px] text-muted-foreground">Human moderation, academic verification.</p>
          </div>
          <div className="rounded-xl border border-border p-3 space-y-1">
            <span className="text-xs font-semibold text-primary">20%</span>
            <div className="text-xs font-medium">Peace & Knowledge Fund</div>
            <p className="text-[11px] text-muted-foreground">Preserving minority language manuscripts.</p>
          </div>
          <div className="rounded-xl border border-border p-3 space-y-1">
            <span className="text-xs font-semibold text-primary">15%</span>
            <div className="text-xs font-medium">Community Grants</div>
            <p className="text-[11px] text-muted-foreground">Direct subsidies to grassroots circles.</p>
          </div>
        </div>
      </div>

      {/* Payouts Approval Table */}
      <div className="rounded-2xl border border-border bg-card shadow-calm overflow-hidden space-y-3 p-5">
        <h3 className="font-display text-base font-medium">Creator Payouts Queue</h3>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">Creator</th>
              <th className="p-3">Period</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Tax KYC</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {payouts.map((p) => (
              <tr key={p.id}>
                <td className="p-3 font-medium">{p.creator}</td>
                <td className="p-3 text-xs text-muted-foreground">{p.period}</td>
                <td className="p-3 font-mono font-semibold">₹{p.amount_inr.toLocaleString()}</td>
                <td className="p-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="size-3.5" /> PAN Verified
                  </span>
                </td>
                <td className="p-3 text-xs font-medium">{p.status}</td>
                <td className="p-3 text-right">
                  {p.status === "Pending Approval" && (
                    <Button size="sm" onClick={() => handleApprovePayout(p.id)}>
                      Authorize Payout
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
