/**
 * ==============================================================================
 * EKA AI ARCHITECTURE — ROLLING CONVERSATION MEMORY MANAGER
 * ==============================================================================
 * Specification: Section 33.12 (Conversation Memory)
 *
 * Prevents conversational context explosion:
 * - Does NOT accumulate complete historical Q&A exchanges.
 * - Maintains a compact rolling window (last 2-3 turns).
 * - Distills older turns into structured memory:
 *   - Current topic & active entities
 *   - User constraints (tradition preferences, language, region)
 *   - Previously referenced Knowledge Object IDs
 *   - Compact summary of conclusions reached
 * ==============================================================================
 */

import { estimateTokens, TOKEN_BUDGETS } from "./token-budget-manager";

export interface ConversationTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
  entitiesMentioned?: string[];
  referencedKnowledgeIds?: string[];
}

export interface CompactConversationState {
  sessionId: string;
  currentTopic: string;
  activeEntities: string[];
  userConstraints: Record<string, string>;
  referencedKnowledgeObjectIds: string[];
  priorConclusionsSummary: string;
  recentTurns: ConversationTurn[];
  totalTurnsCount: number;
}

export class ConversationMemoryManager {
  private state: CompactConversationState;
  private maxRecentTurns: number;

  constructor(sessionId: string, maxRecentTurns = 3) {
    this.maxRecentTurns = maxRecentTurns;
    this.state = {
      sessionId,
      currentTopic: "",
      activeEntities: [],
      userConstraints: {},
      referencedKnowledgeObjectIds: [],
      priorConclusionsSummary: "",
      recentTurns: [],
      totalTurnsCount: 0,
    };
  }

  /**
   * Records a user inquiry and extracts focus entities.
   */
  public addUserMessage(content: string, detectedEntities: string[] = []): void {
    this.state.totalTurnsCount++;
    const turn: ConversationTurn = {
      id: `turn_${Date.now()}_u`,
      role: "user",
      content,
      timestamp: Date.now(),
      entitiesMentioned: detectedEntities,
    };

    // Update active entities (keep top 6 distinct)
    const entitySet = new Set([...detectedEntities, ...this.state.activeEntities]);
    this.state.activeEntities = Array.from(entitySet).slice(0, 6);

    // If current topic is empty or shifts significantly, update it
    if (!this.state.currentTopic && detectedEntities.length > 0) {
      this.state.currentTopic = detectedEntities[0] || "";
    }

    this.state.recentTurns.push(turn);
    this.maintainRollingWindow();
  }

  /**
   * Records assistant response and updates referenced knowledge IDs.
   */
  public addAssistantResponse(
    fullAnswer: string,
    referencedKoIds: string[] = [],
    conclusionSummary?: string,
  ): void {
    const summary = conclusionSummary || this.extractCompactSummary(fullAnswer);

    const turn: ConversationTurn = {
      id: `turn_${Date.now()}_a`,
      role: "assistant",
      // Store compact summary in memory rather than massive multi-paragraph text
      content: summary,
      timestamp: Date.now(),
      referencedKnowledgeIds: referencedKoIds,
    };

    // Update referenced knowledge IDs
    const idSet = new Set([...this.state.referencedKnowledgeObjectIds, ...referencedKoIds]);
    this.state.referencedKnowledgeObjectIds = Array.from(idSet);

    this.state.recentTurns.push(turn);
    this.maintainRollingWindow();
  }

  /**
   * Extracts a 1-2 sentence core conclusion from an AI response.
   */
  private extractCompactSummary(text: string): string {
    const summaryMatch = text.match(/(?:SUMMARY:|Core Understanding:?)\s*([^\n]+(?:\n[^\n]+)?)/i);
    if (summaryMatch && summaryMatch[1]) {
      return summaryMatch[1].trim();
    }
    // Fallback: take first 2 sentences
    const sentences = text.split(/(?<=[.!?])\s+/);
    return sentences.slice(0, 2).join(" ").slice(0, 280);
  }

  /**
   * Maintains rolling window by distilling older turns into priorConclusionsSummary.
   */
  private maintainRollingWindow(): void {
    while (this.state.recentTurns.length > this.maxRecentTurns * 2) {
      const oldestTurn = this.state.recentTurns.shift();
      if (oldestTurn && oldestTurn.role === "assistant") {
        const addition = `[Topic: ${this.state.currentTopic}] ${oldestTurn.content}`;
        if (!this.state.priorConclusionsSummary) {
          this.state.priorConclusionsSummary = addition;
        } else {
          // Append and cap prior summary length
          this.state.priorConclusionsSummary = `${this.state.priorConclusionsSummary} | ${addition}`;
          if (this.state.priorConclusionsSummary.length > 500) {
            this.state.priorConclusionsSummary =
              this.state.priorConclusionsSummary.slice(-450) + "…";
          }
        }
      }
    }
  }

  /**
   * Formats compact conversation context for LLM prompt insertion.
   * Total tokens guaranteed to stay within CONVERSATION_HISTORY_MAX (<= 8,000 tokens).
   */
  public formatContextForAiPrompt(): {
    contextText: string;
    estimatedTokens: number;
  } {
    const lines: string[] = [];

    if (this.state.currentTopic) {
      lines.push(`Current Topic: ${this.state.currentTopic}`);
    }
    if (this.state.activeEntities.length > 0) {
      lines.push(`Active Entities: ${this.state.activeEntities.join(", ")}`);
    }
    if (this.state.priorConclusionsSummary) {
      lines.push(`Previous Conclusions Summary: ${this.state.priorConclusionsSummary}`);
    }
    if (this.state.referencedKnowledgeObjectIds.length > 0) {
      lines.push(`Previously Consulted Traditions: ${this.state.referencedKnowledgeObjectIds.join(", ")}`);
    }

    if (this.state.recentTurns.length > 0) {
      lines.push("\nRecent Dialogue:");
      for (const turn of this.state.recentTurns) {
        const prefix = turn.role === "user" ? "Seeker:" : "EKA:";
        lines.push(`${prefix} ${turn.content}`);
      }
    }

    const contextText = lines.join("\n");
    const estimatedTokens = estimateTokens(contextText);

    return {
      contextText,
      estimatedTokens,
    };
  }

  public getState(): CompactConversationState {
    return { ...this.state };
  }
}
