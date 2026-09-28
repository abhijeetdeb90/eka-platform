# Founder Simulator — reserve policy, pool and distribution controls with side-by-side sensitivity

Extend the existing Founder Simulator (Economics → Unit tab) so a scenario can model reserve policy, Creator Pool share of operating profit, and founder/owner distribution overrides — then compare scenarios side by side.

## What changes

**New scenario inputs**

- Cash reserve policy: target months of runway to hold back, plus an optional fixed reserve floor. Reserve funding is taken out of operating profit before discretionary distributions.
- Creator Pool: percentage of operating profit (already present) plus an optional cap amount and a "only fund when profit is positive" toggle.
- Founder compensation override: fixed monthly amount or a percentage of operating profit.
- Owner distribution override: fixed amount or percentage of profit remaining after reserve, pool and founder compensation.

**New waterfall order (per scenario)**

```text
EKA revenue
− variable costs
− fixed costs
− mission spending
= operating profit
− reserve funding (to reach target runway / floor)
− Creator Pool (capped)
− founder compensation
− owner distribution
= retained earnings
```

Negative or infeasible steps are shown as shortfalls rather than silently clamped to zero, with a note when the reserve policy cannot be met.

**Side-by-side sensitivity**

- A base scenario plus up to two variants ("Conservative" / "Base" / "Aggressive" presets, all editable) rendered in one comparison table: revenue, operating profit, operating margin, reserve funded, Creator Pool, founder compensation, owner distribution, retained earnings, months of runway covered, and the delta versus base.
- A one-variable sweep beneath the table: pick GMV, platform fee, pool percentage or fixed costs, and see the outcome across five steps around the current value, highlighting where retained earnings or founder compensation turn negative.
- All figures stay labelled as a scenario — nothing is written to the ledger.

## Technical approach

- `src/lib/economics.ts`: widen `Scenario` with `reserveTargetMonths`, `reserveFloorCents`, `poolCapCents`, `poolOnlyWhenProfitable`, `founderMode` (`fixed | percent`), `founderPercent`, `ownerMode`, `ownerAmountCents`, `ownerPercent`. Update `DEFAULT_SCENARIO` and rewrite `runScenario` to emit the extended waterfall plus `reserveFunded`, `reserveShortfall`, `runwayMonths`, `ownerDistribution`. Add `compareScenarios(base, variants)` and `sweep(scenario, key, steps)` pure helpers. Keep integer-paise arithmetic; no floating-point money.
- `src/components/app/admin/economics/UnitEconomics.tsx`: rework `FounderSimulator` into a base editor plus variant columns, using existing `Panel`/`Row`/`Stat`/`Money`/`PercentText` primitives and existing tokens — no new visual language. Variant state held locally, seeded by cloning the base scenario.
- Existing dashboard sections, the ledger and all persisted data are untouched.
