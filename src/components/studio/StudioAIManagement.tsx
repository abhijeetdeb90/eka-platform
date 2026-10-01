// ==============================================================================
// EKA STUDIO — AI CONFIGURATION, AGENTS & EPISTEMIC RETRIEVAL POLICIES
// ==============================================================================

import { useState } from "react";
import {
  Sparkles,
  Bot,
  ShieldCheck,
  FileCode,
  Sliders,
  History,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { fetchAIAgents, saveAIAgent, SEED_AI_AGENTS } from "@/lib/studio/system-service";
import type { AIAgentConfig, StudioRole } from "@/lib/studio/types";

interface StudioAIManagementProps {
  currentRole: StudioRole;
}

export function StudioAIManagement({ currentRole }: StudioAIManagementProps) {
  const [agents, setAgents] = useState<AIAgentConfig[]>(SEED_AI_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<AIAgentConfig>(agents[0]!);

  const handleSave = async () => {
    const updated = await saveAIAgent(selectedAgent, currentRole);
    setAgents(agents.map((a) => (a.id === updated.id ? updated : a)));
    setSelectedAgent(updated);
    toast.success(`AI Configuration for "${updated.name}" saved.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-normal tracking-tight">AI & Epistemic Retrieval Engine</h2>
          <p className="text-xs text-muted-foreground">
            Govern foundational model temperature, system prompts, retrieval source policies, and audit synthetic grounding.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-3.5" /> Grounding Integrity: 99.8%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Agents List (4 cols) */}
        <div className="space-y-3 lg:col-span-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Registered Agents & Models
          </div>
          <div className="space-y-2">
            {agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  selectedAgent.id === agent.id
                    ? "border-primary bg-primary/5 shadow-calm"
                    : "border-border bg-card hover:border-border/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{agent.name}</span>
                  <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    {agent.model}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{agent.role}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                  <span>Temp: {agent.temperature}</span>
                  <span>{agent.source_policies.length} Policies</span>
                </div>
              </div>
            ))}
          </div>

          {/* Epistemic Guardrail Notice */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Sparkles className="size-4" /> Non-Hallucinatory Directive
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When answering consumer theological or historical inquiries, agents must strictly retrieve from
              verified Canonical Knowledge Objects. Fabricated citations trigger automated execution aborts.
            </p>
          </div>

          {/* Human-First Community Rule Guardrail */}
          <div className="rounded-2xl border border-terracotta/20 bg-sand/30 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-terracotta">
              <UserCheck className="size-4" /> Human-First Community Rule
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>"The intelligence is artificial. The community isn't."</strong> Agents are strictly barred from masquerading as human members, posting synthetic comments, or covertly participating in community sanghas.
            </p>
          </div>
        </div>

        {/* Right Column: Agent Configuration Editor (8 cols) */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-calm space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-display text-lg font-medium">{selectedAgent.name}</h3>
                <p className="text-xs text-muted-foreground">ID: {selectedAgent.id}</p>
              </div>
              <Button size="sm" onClick={handleSave}>
                Save AI Configuration
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Foundation Model</label>
                  <select
                    value={selectedAgent.model}
                    onChange={(e) => setSelectedAgent({ ...selectedAgent, model: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-mono"
                  >
                    <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (High Reasoning)</option>
                    <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Sub-100ms Latency)</option>
                    <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
                    <option value="gpt-4o">OpenAI GPT-4o</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Temperature ({selectedAgent.temperature})
                  </label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={selectedAgent.temperature}
                      onChange={(e) =>
                        setSelectedAgent({
                          ...selectedAgent,
                          temperature: parseFloat(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-xs font-mono font-bold text-primary">
                      {selectedAgent.temperature}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">System Prompt Directive</label>
                <Textarea
                  value={selectedAgent.system_prompt}
                  onChange={(e) =>
                    setSelectedAgent({ ...selectedAgent, system_prompt: e.target.value })
                  }
                  rows={8}
                  className="mt-1 font-mono text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Epistemic Retrieval Policies
                </label>
                <div className="mt-2 space-y-2">
                  {[
                    { id: "require_canonical_sources", label: "Enforce Canonical Scripture Provenance Only" },
                    { id: "disallow_hallucinated_dogma", label: "Bar Synthetic Inferences as Historical Fact" },
                    { id: "separate_interpretation_from_canon", label: "Explicitly Disclose School Hermeneutics" },
                  ].map((pol) => {
                    const isChecked = selectedAgent.source_policies.includes(pol.id);
                    return (
                      <label
                        key={pol.id}
                        className="flex items-center justify-between rounded-xl border border-border p-3 text-xs cursor-pointer hover:bg-accent/30"
                      >
                        <span>{pol.label}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...selectedAgent.source_policies, pol.id]
                              : selectedAgent.source_policies.filter((p) => p !== pol.id);
                            setSelectedAgent({ ...selectedAgent, source_policies: next });
                          }}
                          className="size-4"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
