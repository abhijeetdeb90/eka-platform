/** The one agreement everyone on EKA keeps, and what happens when it is broken. */

export const AGREEMENT_TEXT =
  "I agree to participate in EKA as an authentic human contributor without spreading hatred or encouraging violence against people based on religion, caste, community, ethnicity, nationality, gender, or other protected characteristics. I understand that bot accounts, AI impersonating humans, synthetic engagement, harassment, threats, or violations of EKA's community standards will result in immediate content removal, suspension, or a permanent ban.";

export const LADDER = [
  {
    step: "Warning",
    body: "A first, non-severe breach. The post stays up, you are told exactly which line it crossed.",
  },
  {
    step: "Content removal",
    body: "The specific post, clip, comment or question comes down. Your account is untouched.",
  },
  {
    step: "Temporary restriction",
    body: "Posting pauses for 24 hours, 7 days or 30 days depending on severity and history. You can still read and reflect.",
  },
  {
    step: "Permanent ban",
    body: "Reserved for severe harm — threats, incitement, dehumanisation, bot accounts, synthetic personas — or repeated restrictions.",
  },
] as const;

export const REMOVED = [
  "Hatred or dehumanisation of people for who they are",
  "Incitement to violence, or glorifying it",
  "Harassment, threats, or pile-ons against a person",
  "Impersonating a teacher, tradition or institution",
  "Sacred imagery or ritual clipped deliberately to mock",
  "Bot accounts, synthetic personas, or AI pretending to be people",
  "Manufactured engagement, automated comments, or engagement pods",
  "Covert AI participation disguised as a community member",
];

export const NOT_REMOVED = [
  "Disagreeing with a belief, text or practice",
  "Asking a question that sounds naive",
  "Historical and scholarly criticism of ideas and institutions",
  "Sharing a tradition that others find unfamiliar",
  "Saying you left a faith, or found one",
  "Using AI tools privately to assist in drafting, grammar, or translation",
];

export const HUMAN_FIRST_RULE = {
  motto: "The intelligence is artificial. The community isn't.",
  subtext: "AI-powered knowledge. Human-powered community.",
  summary:
    "EKA is a sanctuary for authentic human cultural and spiritual exchange. AI powers knowledge behind the scenes, but the visible community layer stays strictly human.",
  behindTheScenesAI: [
    "Knowledge verification & citation checking against canonical archives",
    "Multi-lingual translation across scripts and regional dialects",
    "Moderation assistance & safety triage for human curators",
    "Personalization & topical discovery across the Cultural Knowledge Graph",
    "Search & semantic exploration",
    "Drafting & research assistance for creators",
    "Fraud, sybil, and synthetic bot detection",
    "Community management and circle analytics",
  ],
  distinctions: [
    {
      allowed: "AI helps a human create, format, or draft a post",
      notAllowed: "AI creates a fake or automated human account",
    },
    {
      allowed: "AI translates someone's lived message across languages",
      notAllowed: "AI pretends to be a community member or elder",
    },
    {
      allowed: "AI recommends relevant people, sacred places, and topics",
      notAllowed: "AI generates fake comments or simulated discussions",
    },
    {
      allowed: "AI helps verify historical and cultural claims against sources",
      notAllowed: "AI manufactures artificial consensus or engagement loops",
    },
    {
      allowed: "AI assists human moderators with triage and safety alerts",
      notAllowed: "AI participates covertly in discussions or debates",
    },
    {
      allowed: "Clearly labeled, transparent official EKA AI assistant",
      notAllowed: "A 'person' or profile that is actually a bot",
    },
  ],
} as const;
