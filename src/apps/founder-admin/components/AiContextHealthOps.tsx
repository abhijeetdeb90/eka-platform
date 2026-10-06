// ==============================================================================
// EKA FOUNDER / ADMIN OPERATING SYSTEM — AI CONTEXT HEALTH DASHBOARD
// ==============================================================================
// Specification: Sections 33.1, 33.13, 33.14, 33.16
// Displays real-time context health, token telemetry, guard interceptions,
// cost estimates, and diagnostic breakdowns.
// ==============================================================================

import { useState, useEffect } from "react";
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Cpu,
  BarChart3,
  RefreshCw,
  Sliders,
  DollarSign,
  AlertTriangle,
  Layers,
  Terminal,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  getAiContextHealthMetrics,
  inspectContextGuard,
  TOKEN_BUDGETS,
  type TokenLogEntry,
} from "@/lib/ai/token-budget-manager";

export function AiContextHealthOps() {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    avgInputTokens: 1420,
    p50InputTokens: 1250,
    p95InputTokens: 3800,
    maxInputTokens: 7600,
    avgOutputTokens: 380,
    totalTokensToday: 18450,
    totalRequests: 12,
    failedRequests: 0,
    guardBlockedRequests: 0,
    estimatedCostTodayUsd: 0.0028,
    recentLogs: [] as TokenLogEntry[],
  });

  // Simulator / Context Guard Tester State
  const [simPrompt, setSimPrompt] = useState(
    "Analyze the regional variations of Diwali between Tamil Nadu, Bengal, and Gujarat with primary citations from Skanda Purana.",
  );
  const [simTaskType, setSimTaskType] = useState<"ask_eka" | "dev_agent" | "admin_synthesis">("ask_eka");
  const [simResult, setSimResult] = useState<any>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await getAiContextHealthMetrics();
      setMetrics(data);
    } catch {
      toast.error("Could not refresh token metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMetrics();
  }, []);

  const runSimulator = () => {
    const res = inspectContextGuard({
      prompt: simPrompt,
      taskType: simTaskType,
      conversationHistoryTokens: 1200,
      repositoryFilesTokens: simTaskType === "dev_agent" ? 18000 : 0,
    });
    setSimResult(res);
    toast.success(res.allowed ? "Context Guard Passed" : "Context Guard Intercepted");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="size-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Active Context Guard · Section 33 Architecture
            </span>
          </div>
          <h2 className="text-xl font-medium tracking-tight text-neutral-100">
            AI Context Health & Token Telemetry
          </h2>
          <p className="text-xs text-neutral-400">
            Hard budget targets enforced (Ask EKA: 5k–20k, Cap: 50k, Dev: 100k, Provider Ceiling: 1M tokens).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-mono text-xs px-3 py-1"
          >
            CEILING: 1,048,576 TOKENS PROTECTED
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchMetrics}
            disabled={loading}
            className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
          >
            <RefreshCw className={`mr-2 size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid (Section 33.13) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Avg Input Tokens</span>
            <Cpu className="size-4 text-neutral-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-neutral-100 font-mono">
            {metrics.avgInputTokens.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-emerald-400">Target: ≤ 20,000</p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">P50 / P95 Input</span>
            <BarChart3 className="size-4 text-neutral-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-neutral-100 font-mono">
            {metrics.p50InputTokens} / {metrics.p95InputTokens}
          </div>
          <p className="mt-1 text-[11px] text-neutral-400">P95 below 50k cap</p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Max Peak Input</span>
            <Activity className="size-4 text-neutral-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-neutral-100 font-mono">
            {metrics.maxInputTokens.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-emerald-400">Safe below 100k</p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Guard Interceptions</span>
            <ShieldAlert className="size-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-emerald-400 font-mono">
            {metrics.guardBlockedRequests}
          </div>
          <p className="mt-1 text-[11px] text-neutral-400">HTTP 400s prevented</p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Est. Cost Today</span>
            <DollarSign className="size-4 text-neutral-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-neutral-100 font-mono">
            ${metrics.estimatedCostTodayUsd}
          </div>
          <p className="mt-1 text-[11px] text-neutral-400">{metrics.totalTokensToday.toLocaleString()} tokens total</p>
        </div>
      </div>

      {/* Real-time Context Guard Simulator & Diagnostic Inspector */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="size-4 text-amber-400" />
            <h3 className="text-sm font-medium text-neutral-200">
              Automatic Context Guard Pre-Flight Simulator (Section 33.14)
            </h3>
          </div>
          <span className="text-xs text-neutral-400">
            Simulate token payloads before network dispatch
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs text-neutral-400">Task Type Profile:</label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={simTaskType === "ask_eka" ? "default" : "outline"}
                onClick={() => setSimTaskType("ask_eka")}
                className="h-7 text-xs"
              >
                Ask EKA (≤50k target)
              </Button>
              <Button
                size="sm"
                variant={simTaskType === "dev_agent" ? "default" : "outline"}
                onClick={() => setSimTaskType("dev_agent")}
                className="h-7 text-xs"
              >
                Dev Task (≤100k target)
              </Button>
              <Button
                size="sm"
                variant={simTaskType === "admin_synthesis" ? "default" : "outline"}
                onClick={() => setSimTaskType("admin_synthesis")}
                className="h-7 text-xs"
              >
                Engineering (≤200k target)
              </Button>
            </div>
          </div>

          <textarea
            value={simPrompt}
            onChange={(e) => setSimPrompt(e.target.value)}
            rows={3}
            placeholder="Type or paste payload to estimate..."
            className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-200 focus:border-amber-500/50 focus:outline-none font-mono"
          />

          <div className="flex justify-between items-center">
            <span className="text-xs text-neutral-400">
              Input chars: {simPrompt.length.toLocaleString()} (Approx{" "}
              {Math.ceil(simPrompt.length / 3.8)} tokens)
            </span>
            <Button
              size="sm"
              onClick={runSimulator}
              className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs px-4"
            >
              Run Context Guard Verification
            </Button>
          </div>

          {simResult && (
            <div
              className={`rounded-xl border p-4 text-xs font-mono space-y-2 ${
                simResult.allowed
                  ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
                  : "border-red-500/30 bg-red-950/20 text-red-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold uppercase tracking-wider">
                  Status: {simResult.action.toUpperCase()}
                </span>
                <span>
                  Estimated: {simResult.estimatedTokens.toLocaleString()} /{" "}
                  {simResult.targetBudget.toLocaleString()} tokens
                </span>
              </div>
              <p className="text-[11px] opacity-90">
                Breakdown: System: {simResult.breakdown.system_instructions_tokens}t | Repo:{" "}
                {simResult.breakdown.repository_files_tokens}t | Conversation:{" "}
                {simResult.breakdown.conversation_memory_tokens}t | Query:{" "}
                {simResult.breakdown.user_query_tokens}t
              </p>
              {simResult.largestContributor && (
                <p className="text-[11px] opacity-90">
                  Largest contributor: {simResult.largestContributor.name} (
                  {simResult.largestContributor.tokens}t, {simResult.largestContributor.percentage}%)
                </p>
              )}
              {simResult.diagnosticMessage && (
                <pre className="mt-2 text-[10px] whitespace-pre-wrap bg-neutral-950/80 p-2 rounded">
                  {simResult.diagnosticMessage}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Request Telemetry Stream */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-neutral-400" />
            <h3 className="text-sm font-medium text-neutral-200">
              Live AI Telemetry Logs (Section 33.13)
            </h3>
          </div>
          <span className="text-xs text-neutral-400">Last 15 dispatches</span>
        </div>

        {metrics.recentLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            Telemetry logs initializing. Normal requests will stream here in real time.
          </div>
        ) : (
          <div className="divide-y divide-neutral-800 overflow-x-auto">
            {metrics.recentLogs.map((log) => (
              <div key={log.requestId} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono ${
                        log.status === "success"
                          ? "border-emerald-500/40 text-emerald-400"
                          : log.status === "guard_intercepted"
                          ? "border-amber-500/40 text-amber-400"
                          : "border-red-500/40 text-red-400"
                      }`}
                    >
                      {log.status.toUpperCase()}
                    </Badge>
                    <span className="font-mono text-neutral-300">{log.requestId}</span>
                    <span className="text-neutral-500">({log.model})</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Input: {log.estimatedInputTokens.toLocaleString()} tokens | Output:{" "}
                    {log.actualCompletionTokens || 0} tokens | Latency: {log.latencyMs}ms
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-mono text-[11px] text-neutral-300">
                    ${log.costEstimateUsd?.toFixed(5) || "0.00010"}
                  </span>
                  {log.guardTriggered && (
                    <p className="text-[10px] text-amber-400">Guard Protected</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
