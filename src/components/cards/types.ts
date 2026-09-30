// ==============================================================================
// EKA DESIGN SYSTEM: UNIFIED CARD TYPES & INTENT INTERFACES
// ==============================================================================

import type { EpistemicTier, IntentTriggerType } from "@/lib/tokens/theme";

export interface BaseCardProps {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  tags?: string[];
  imageUrl?: string;
  videoUrl?: string;
  actionTo?: string;
  onClick?: () => void;
  className?: string;
  featured?: boolean;
}

export interface CreatorAttribution {
  name: string;
  handle?: string;
  avatar?: string;
  tradition?: string;
  verified?: boolean;
  role?: string;
}

export interface IntentActionProps {
  type: IntentTriggerType;
  label?: string;
  onTrigger?: (type: IntentTriggerType) => void;
}
