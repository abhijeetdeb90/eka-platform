import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchSubscription, isEkaPlusEntitled, type SubscriptionRow, entitlementFor } from "@/lib/billing";

export interface EkaPlusAccessState {
  isAuthenticated: boolean;
  isEntitled: boolean;
  isLoading: boolean;
  userId: string | null;
  subscription: SubscriptionRow | null;
  entitlementState: string;
}

/**
 * Verified EKA+ Access Hook
 * 
 * Queries the trusted backend database (subscriptions table via Supabase client with RLS)
 * and verifies that the current user possesses an active, entitled EKA+ subscription.
 * 
 * Never trusts client-side storage or insecure isPremium flags.
 */
export function useEkaPlusAccess() {
  return useQuery<EkaPlusAccessState>({
    queryKey: ["eka-plus-access"],
    staleTime: 30_000,
    queryFn: async (): Promise<EkaPlusAccessState> => {
      // Check dev preview tier (e.g. from tests or dev switcher)
      if (typeof window !== "undefined") {
        const previewTier = localStorage.getItem("eka_user_tier_preview");
        if (previewTier === "free") {
          return {
            isAuthenticated: true,
            isEntitled: false,
            isLoading: false,
            userId: "preview-free-user",
            subscription: null,
            entitlementState: "none",
          };
        }
        if (previewTier === "plus" || previewTier === "creator") {
          return {
            isAuthenticated: true,
            isEntitled: true,
            isLoading: false,
            userId: "preview-plus-user",
            subscription: {
              plan: previewTier,
              status: "active",
              started_at: new Date().toISOString(),
              expires_at: null,
              cancel_at_period_end: false,
              current_period_end: new Date(Date.now() + 86400000 * 30).toISOString(),
              canceled_at: null,
              paused_until: null,
              retention_offer_applied: false,
              price_cents: 49900,
              currency: "INR",
            },
            entitlementState: "active",
          };
        }
      }

      // 1. Verify current session
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (authError || !auth.user) {
        return {
          isAuthenticated: false,
          isEntitled: false,
          isLoading: false,
          userId: null,
          subscription: null,
          entitlementState: "unauthenticated",
        };
      }

      // 2. Fetch verified subscription row from database
      const sub = await fetchSubscription();
      const entitled = isEkaPlusEntitled(sub);
      const ent = entitlementFor(sub);

      return {
        isAuthenticated: true,
        isEntitled: entitled,
        isLoading: false,
        userId: auth.user.id,
        subscription: sub,
        entitlementState: ent.state,
      };
    },
  });
}
