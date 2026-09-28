import { supabase } from "@/integrations/supabase/client";

/* --------------------------------------------------- practitioner review ---
 * Identity, credentials and experience are judged separately by a person.
 * "EKA Verified" and "Top Rated" are derived from those judgements — never
 * granted automatically, never bought.
 * -------------------------------------------------------------------------- */

export type VerificationStatus =
  "unsubmitted" | "submitted" | "in_review" | "approved" | "rejected";

export type ReviewRow = {
  id: string;
  user_id: string | null;
  slug: string;
  display_name: string;
  headline: string;
  about: string;
  traditions: string[];
  categories: string[];
  years_experience: number;
  status: string;
  verification_status: VerificationStatus;
  verification_note: string | null;
  identity_verified: boolean;
  credentials_verified: boolean;
  experience_verified: boolean;
  eka_recommended: boolean;
  top_rated: boolean;
  rating: number;
  review_count: number;
  reviewed_at: string | null;
  created_at: string;
};

export const VERIFICATION_COPY: Record<VerificationStatus, string> = {
  unsubmitted: "Not yet submitted",
  submitted: "Waiting for review",
  in_review: "Being reviewed",
  approved: "Verified by EKA",
  rejected: "Not verified",
};

export async function fetchVerificationQueue(): Promise<ReviewRow[]> {
  const { data } = await supabase
    .from("practitioners")
    .select(
      "id, user_id, slug, display_name, headline, about, traditions, categories, years_experience, status, verification_status, verification_note, identity_verified, credentials_verified, experience_verified, eka_recommended, top_rated, rating, review_count, reviewed_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(60);
  return (data ?? []) as ReviewRow[];
}

export async function reviewPractitioner(input: {
  id: string;
  status: Exclude<VerificationStatus, "unsubmitted">;
  identity: boolean;
  credentials: boolean;
  experience: boolean;
  note?: string;
}) {
  const { error } = await supabase.rpc("review_practitioner", {
    _id: input.id,
    _status: input.status,
    _identity: input.identity,
    _credentials: input.credentials,
    _experience: input.experience,
    ...(input.note ? { _note: input.note } : {}),
  });
  return { error };
}
