import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfigEditor } from "@/components/app/admin/ConfigEditor";
import { FeatureFlags } from "@/components/app/admin/FeatureFlags";
import {
  Alerts,
  Decisions,
  EconomicModelCard,
  ExecutiveSummary,
  HealthPanel,
  ProfitCard,
  RevenueAndGmv,
  RevenueByCategory,
  Snapshot,
  Targets,
  Waterfall,
} from "@/components/app/admin/economics/Overview";
import { ProfitAndLoss } from "@/components/app/admin/economics/Pnl";
import { UnitEconomics } from "@/components/app/admin/economics/UnitEconomics";
import { CashView, FounderEconomics } from "@/components/app/admin/economics/CashAndFounder";
import {
  CostStructure,
  CreatorPoolSection,
  MissionFunding,
} from "@/components/app/admin/economics/MissionAndPool";
import { LedgerExplorer } from "@/components/app/admin/economics/LedgerExplorer";
import { Panel } from "@/components/app/admin/economics/Primitives";
import { RANGE_LABEL, fetchEconomics, priorRange, rangeFor, type RangeKey } from "@/lib/economics";
import { useIsAdmin } from "@/hooks/useRole";

export function PlatformEconomics() {
  const { data: isAdmin, isLoading } = useIsAdmin();
  const [rangeKey, setRangeKey] = useState<RangeKey>("current");
  const [custom, setCustom] = useState(rangeFor("current"));
  const [category, setCategory] = useState("all");

  const range = useMemo(() => rangeFor(rangeKey, custom), [rangeKey, custom]);
  const prior = useMemo(() => priorRange(range.from, range.to), [range]);

  const { data: e, error } = useQuery({
    queryKey: ["eka-economics", range.from, range.to],
    enabled: true,
    queryFn: () => fetchEconomics(range.from, range.to),
  });
  const { data: prev } = useQuery({
    queryKey: ["eka-economics", prior.from, prior.to],
    enabled: true,
    queryFn: () => fetchEconomics(prior.from, prior.to),
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        <header className="space-y-3">
          <div>
            <h1 className="font-display text-2xl text-white">EKA Platform Economics</h1>
            <p className="text-sm text-muted-foreground">
              Financial health, platform economics and sustainable growth.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <select
              value={rangeKey}
              onChange={(ev) => setRangeKey(ev.target.value as RangeKey)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {(Object.keys(RANGE_LABEL) as RangeKey[]).map((k) => (
                <option key={k} value={k}>
                  {RANGE_LABEL[k]}
                </option>
              ))}
            </select>
            {rangeKey === "custom" && (
              <>
                <Input
                  type="date"
                  value={custom.from}
                  onChange={(ev) => setCustom({ ...custom, from: ev.target.value })}
                  className="max-w-[170px]"
                />
                <Input
                  type="date"
                  value={custom.to}
                  onChange={(ev) => setCustom({ ...custom, to: ev.target.value })}
                  className="max-w-[170px]"
                />
              </>
            )}
            <span className="text-xs text-muted-foreground">Currency: INR</span>
          </div>
        </header>

        {error && (
          <Panel className="border-destructive/40 text-sm text-destructive">
            {(error as Error).message}
          </Panel>
        )}
        {!e ? (
          <Panel>Loading financial data…</Panel>
        ) : (
          <>
            <ExecutiveSummary e={e} />
            <Tabs defaultValue="overview">
              <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <TabsList className="w-max">
                  {[
                    "overview",
                    "p&l",
                    "unit",
                    "cash",
                    "pool",
                    "mission",
                    "founder",
                    "ledger",
                    "settings",
                  ].map((t) => (
                    <TabsTrigger key={t} value={t} className="capitalize">
                      {t}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="overview" className="mt-6 space-y-8">
                <Snapshot e={e} {...(prev ? { prev } : {})} />
                <ProfitCard e={e} />
                <Waterfall e={e} />
                <RevenueAndGmv e={e} />
                <RevenueByCategory e={e} onPick={setCategory} />
                <HealthPanel e={e} {...(prev ? { prev } : {})} />
                <Alerts e={e} {...(prev ? { prev } : {})} />
                <Decisions e={e} />
                <Targets e={e} />
                <EconomicModelCard
                  e={e}
                  onEdit={() => {
                    document
                      .getElementById("economic-model-settings")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                />
              </TabsContent>

              <TabsContent value="p&l" className="mt-6">
                <ProfitAndLoss />
              </TabsContent>
              <TabsContent value="unit" className="mt-6">
                <UnitEconomics e={e} />
              </TabsContent>
              <TabsContent value="cash" className="mt-6">
                <CashView e={e} />
              </TabsContent>
              <TabsContent value="pool" className="mt-6">
                <CreatorPoolSection e={e} />
              </TabsContent>
              <TabsContent value="mission" className="mt-6 space-y-8">
                <MissionFunding e={e} />
                <CostStructure e={e} from={range.from} to={range.to} />
              </TabsContent>
              <TabsContent value="founder" className="mt-6">
                <FounderEconomics e={e} from={range.from} to={range.to} />
              </TabsContent>
              <TabsContent value="ledger" className="mt-6">
                <LedgerExplorer
                  from={range.from}
                  to={range.to}
                  category={category}
                  onCategory={setCategory}
                />
              </TabsContent>
              <TabsContent value="settings" className="mt-6" id="economic-model-settings">
                <ConfigEditor />
                <div className="mt-6">
                  <FeatureFlags />
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  Changes apply to future transactions only. Past ledger entries keep the economic
                  model that was in force when they settled.
                </p>
              </TabsContent>
            </Tabs>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="ghost" disabled>
                Exports live inside each section
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
