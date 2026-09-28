/**
 * EKA Tri-Partite Creator Economy
 * Qualified Contribution Score (QCS) Engine
 *
 * Replaces superficial "1 like = ₹X" with a weighted 7-signal trust & quality model.
 */

export interface RawSignals {
  qualifiedReads: number; // Dwell >= 45s, scroll >= 70% (25%)
  savesAndShares: number; // Bookmarks, collections, external shares (20%)
  meaningfulComments: number; // Substantive community reflections >= 30 chars (15%)
  sourceCitations: number; // Primary canonical citations verified (15%)
  peerVerifications: number; // Scholar/practitioner validations (15%)
  repeatLearningSessions: number; // Return visits across days (5%)
  reactions: number; // Likes/hearts (5%)
  disputePenalties: number; // Substantiated corrections or community flags
}

export interface ContributionBreakdownItem {
  id: string;
  category:
    | "consumption"
    | "curation"
    | "discussion"
    | "provenance"
    | "trust"
    | "habit"
    | "reaction"
    | "dispute";
  label: string;
  count: number;
  pointsEarned: number;
  impact: "positive" | "negative";
}

export interface QCSResult {
  score: number; // 0 to 100
  trustTier: number; // 0 to 4
  trustTierLabel: string;
  breakdown: ContributionBreakdownItem[];
  eligibleForKnowledgePool: boolean;
}

export const TRUST_TIERS = [
  { tier: 0, label: "Community Contributor", minScore: 0, poolShareMultiplier: 1.0 },
  { tier: 1, label: "Verified Creator", minScore: 40, poolShareMultiplier: 1.15 },
  { tier: 2, label: "Trusted Knowledge Creator", minScore: 65, poolShareMultiplier: 1.35 },
  { tier: 3, label: "Community Expert", minScore: 80, poolShareMultiplier: 1.6 },
  { tier: 4, label: "Institutional Archive", minScore: 90, poolShareMultiplier: 2.0 },
] as const;

/**
 * Calculates EKA Qualified Contribution Score (QCS)
 */
export function calculateQCS(signals: RawSignals): QCSResult {
  // Weights: 25%, 20%, 15%, 15%, 15%, 5%, 5%
  const consumptionPts = Math.min(25, signals.qualifiedReads * 0.05);
  const curationPts = Math.min(20, signals.savesAndShares * 0.1);
  const discussionPts = Math.min(15, signals.meaningfulComments * 0.25);
  const provenancePts = Math.min(15, signals.sourceCitations * 1.25);
  const trustPts = Math.min(15, signals.peerVerifications * 1.5);
  const repeatPts = Math.min(5, signals.repeatLearningSessions * 0.1);
  const reactionPts = Math.min(5, signals.reactions * 0.02);

  const penaltyPts = signals.disputePenalties * 5.0;

  const rawScore =
    consumptionPts +
    curationPts +
    discussionPts +
    provenancePts +
    trustPts +
    repeatPts +
    reactionPts -
    penaltyPts;
  const score = Math.max(0, Math.min(100, Math.round(rawScore * 10) / 10));

  // Determine Trust Tier
  let tierInfo: (typeof TRUST_TIERS)[number] = TRUST_TIERS[0];
  for (let i = TRUST_TIERS.length - 1; i >= 0; i--) {
    const candidate = TRUST_TIERS[i];
    if (candidate && score >= candidate.minScore) {
      tierInfo = candidate;
      break;
    }
  }

  const breakdown: ContributionBreakdownItem[] = [
    {
      id: "sig_reads",
      category: "consumption",
      label: "Qualified learning sessions (dwell ≥ 45s, scroll ≥ 70%)",
      count: signals.qualifiedReads,
      pointsEarned: Math.round(consumptionPts * 10) / 10,
      impact: "positive",
    },
    {
      id: "sig_saves",
      category: "curation",
      label: "Community saves, collections and attribution shares",
      count: signals.savesAndShares,
      pointsEarned: Math.round(curationPts * 10) / 10,
      impact: "positive",
    },
    {
      id: "sig_discussion",
      category: "discussion",
      label: "Substantive discussion and community reflections",
      count: signals.meaningfulComments,
      pointsEarned: Math.round(discussionPts * 10) / 10,
      impact: "positive",
    },
    {
      id: "sig_provenance",
      category: "provenance",
      label: "Verified primary scripture & archival citations",
      count: signals.sourceCitations,
      pointsEarned: Math.round(provenancePts * 10) / 10,
      impact: "positive",
    },
    {
      id: "sig_trust",
      category: "trust",
      label: "Peer-reviewed verifications and lineage checks",
      count: signals.peerVerifications,
      pointsEarned: Math.round(trustPts * 10) / 10,
      impact: "positive",
    },
    {
      id: "sig_repeat",
      category: "habit",
      label: "Multi-day return visits & habit progression",
      count: signals.repeatLearningSessions,
      pointsEarned: Math.round(repeatPts * 10) / 10,
      impact: "positive",
    },
    {
      id: "sig_reactions",
      category: "reaction",
      label: "Community gratitude and positive reactions",
      count: signals.reactions,
      pointsEarned: Math.round(reactionPts * 10) / 10,
      impact: "positive",
    },
  ];

  if (signals.disputePenalties > 0) {
    breakdown.push({
      id: "sig_dispute",
      category: "dispute",
      label: "Unsubstantiated claims or community dispute penalties",
      count: signals.disputePenalties,
      pointsEarned: -penaltyPts,
      impact: "negative",
    });
  }

  return {
    score,
    trustTier: tierInfo.tier,
    trustTierLabel: tierInfo.label,
    breakdown,
    eligibleForKnowledgePool: score >= 25,
  };
}
