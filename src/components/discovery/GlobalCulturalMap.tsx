// ==============================================================================
// EKA GLOBAL CULTURAL INTELLIGENCE MAP — ADAPTER
// ==============================================================================
// Bridges the discover, knowledge, and learn routes to the canonical
// LivingCulturalAtlas component, unifying the editorial atlas experience.
// ==============================================================================

import React from "react";
import { LivingCulturalAtlas } from "@/components/atlas/LivingCulturalAtlas";

export interface GlobalCulturalMapProps {
  onAskEka: (target: {
    title: string;
    location?: string;
    category?: string;
    initialQuestion?: string;
    preloadedSummary?: string;
  }) => void;
  className?: string;
  compactMode?: boolean;
}

export function GlobalCulturalMap({
  onAskEka,
  className = "",
  compactMode = false,
}: GlobalCulturalMapProps) {
  return (
    <LivingCulturalAtlas
      className={className}
      showEditorialBanner={!compactMode}
      onAskEka={onAskEka}
    />
  );
}
