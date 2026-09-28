# EKA — Sustainable Platform Economics, Fee Allocation & Founder Profit Model

Rework EKA's money model so the fee is clearly revenue (not profit), allocations are budget lines rather than pretend expenses, real costs and founder pay are recorded privately, and the Creator Pool comes out of EKA's surplus. Existing visual identity, navigation and components stay as they are.

## What changes for each audience

**Members (checkout)**

- Creator price, EKA platform fee, total — always shown before paying.
- Line: "Your creator receives ₹1,000. EKA charges a 10% platform fee separately."

**Creators (wallet / Your EKA Impact)**

- "Creator receives" never shows a deduction for EKA's fee on added-fee purchases.
- "Earned / Shared / To community work / Reached other creators" recalculated so EKA's fee is never counted as money the creator shared.
- Receipts table expands to: Action · Reference · Creator Amount · EKA Fee · Operations · Trust & Safety · Peace & Knowledge · Community · Retained earnings · Creator Pool · Net/Status. Old rows show "Legacy / allocation unavailable".
- Public panel renamed "How EKA's platform fee is used" with the new 30/15/10/10/35 split and the "revenue, not profit" explanation. Creator Pool described as funded from EKA's operating surplus, paid in addition to earnings.

**Admins — "Economic Model" settings (extends the existing config editor)**

- Platform fee %, operations 30, trust & safety 15, peace & knowledge 10, community 10, retained earnings 35, Creator Pool enabled, Creator Pool % of operating profit, and eligibility rules (min score, min completed sessions, min account age, trust required).
- Saving is blocked unless allocations total exactly 100. Every change keeps who/when and the previous version (existing config history).

**Admins — new private "EKA Economics" dashboard** (admin-only, not in member navigation)

- Monthly periods: GMV, transactions, creators paid, EKA gross and net revenue, actual operating expenses by category, mission spending, operating profit, Creator Pool, founder compensation, owner distributions, retained earnings, cash reserve.
- Ratios: take rate, net margin, creator payout ratio, revenue per transaction, revenue per active creator, average transaction value, contribution margin, burn rate, runway.
- Unit economics per ₹1,000 of creator GMV, driven by recorded costs rather than assumptions.
- Forms to record actual expenses, mission spending, founder compensation, owner distributions and cash balance. Closing a month locks it; corrections become adjustment entries.

## Technical approach

**Money arithmetic** — new `src/lib/money.ts`: integer-paise helpers (`allocate` largest-remainder split so buckets always sum to the fee exactly, `formatMoney`). No floating-point in any financial path; all storage stays in the smallest unit.

**Database (one migration, RLS + grants)**

- `platform_config`: replace/insert allocation rows with the new five-bucket model (operations 30, trust 15, peace 10, community 10, retained 35), plus `creator_pool_enabled`, `creator_pool_percent_of_operating_profit`, and pool eligibility keys. Config editor validation enforces the 100% total.
- `ledger_entries` — one immutable row per eligible transaction: transaction ref, creator_id, member_id, gross_creator_amount, platform_fee_percentage, eka_gross_fee, payment_processing_cost, refund_amount, creator_net_amount, the five allocation columns, creator_pool_allocation, `config_snapshot` (the allocation active at settlement), currency, status, created_at, settled_at. Append-only: refunds/corrections insert reversal rows referencing the original.
- `finance_expenses` (period, category, amount, note, recorded_by), `finance_distributions` (kind: founder_compensation | owner_distribution | creator_pool | reinvestment), `finance_periods` (month, closed flag, cash balance, closed_by/at).
- All finance tables: admin-only RLS via `has_role(auth.uid(),'admin')`, no anon grant.
- Security-definer functions: `record_ledger_entry` (server-side allocation from live config — single source of truth), `finance_period_summary(month)` (revenue, costs, mission spending, operating profit, retained earnings), `close_finance_period(month)`.

**Backend as source of truth** — `payCreator` in `src/lib/pay.ts` calls the ledger function instead of computing allocations client-side; `checkout()` stays as the display-only mirror of the fee, reading the configured fee % from `platform_config`.

**Frontend**

- `src/lib/economics.ts`: typed readers for config, ledger rows, period summaries, unit economics and ratios.
- `src/lib/receipts.ts` rewritten against ledger rows (CSV export gains the new columns).
- `src/lib/pool.ts`: pool funding derived from operating profit × configured percentage; eligibility filter applied before distribution; Creator Score weights unchanged (35/25/20/20).
- New: `src/components/app/admin/EconomicsDashboard.tsx`, `FinanceEntryForms.tsx`, `UnitEconomics.tsx`; extended `ConfigEditor.tsx`. New admin-only route `/app/economics`.
- Copy pass across wallet, marketplace, episodes, membership and the pool panels using the approved phrasing ("EKA charges a 10% platform fee to members", never "EKA takes 10% from creators").

**Verification** — the seven data-integrity tests from the brief run against the real ledger functions: ₹1,000 and ₹4,999 checkouts, refund reversal, invalid 99/101 allocation rejection, Creator Pool from ₹100,000 profit, founder compensation reducing retained earnings only, and a config change leaving settled transactions on their original snapshot.

## Notes

- Existing wallet transactions are preserved untouched; they render as "Legacy / allocation unavailable" rather than being back-filled with invented numbers.
- Founder compensation, owner distributions, actual costs, profit and cash reserves are never exposed on any member- or creator-facing surface.
- No legal or tax classification is asserted anywhere — only neutral accounting terms.
