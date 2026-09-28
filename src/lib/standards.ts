/** The one agreement everyone on EKA keeps, and what happens when it is broken. */

export const AGREEMENT_TEXT =
  "I agree to participate in EKA without spreading hatred or encouraging violence against people based on religion, caste, community, ethnicity, nationality, gender, or other protected characteristics. I understand that harassment, threats, targeted hate, or repeated violations of EKA's community standards may result in content removal, suspension, or a permanent ban.";

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
    body: "Reserved for severe harm — threats, incitement, dehumanisation — or repeated restrictions that did not change anything.",
  },
] as const;

export const REMOVED = [
  "Hatred or dehumanisation of people for who they are",
  "Incitement to violence, or glorifying it",
  "Harassment, threats, or pile-ons against a person",
  "Impersonating a teacher, tradition or institution",
  "Sacred imagery or ritual clipped deliberately to mock",
];

export const NOT_REMOVED = [
  "Disagreeing with a belief, text or practice",
  "Asking a question that sounds naive",
  "Historical and scholarly criticism of ideas and institutions",
  "Sharing a tradition that others find unfamiliar",
  "Saying you left a faith, or found one",
];
