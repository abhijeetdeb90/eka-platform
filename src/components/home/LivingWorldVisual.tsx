// ==============================================================================
// EKA HOMEPAGE — LIVING CULTURAL WORLD MAP (EDITORIAL ATLAS)
// ==============================================================================
// Replaces previous dark-tech dashboard and abstract continent blobs with the
// canonical Living Cultural Atlas: warm parchment, recognizable world geography,
// 8 Knowledge Object categories, intelligent clustering, and India-first exploration.
// ==============================================================================

import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { LivingCulturalAtlas } from "@/components/atlas/LivingCulturalAtlas";
import {
  ATLAS_CULTURAL_OBJECTS,
  type AtlasCulturalObject,
} from "@/lib/cultural-intelligence/cultural-atlas-data";

// Backward compatibility exports
export type CulturalWorldHotspot = AtlasCulturalObject;
export const CULTURAL_HOTSPOTS = ATLAS_CULTURAL_OBJECTS;

interface LivingWorldVisualProps {
  className?: string;
  onAskEka?: (target: {
    title: string;
    location?: string;
    category?: string;
    initialQuestion?: string;
    preloadedSummary?: string;
  }) => void;
}

export function LivingWorldVisual({
  className = "",
  onAskEka,
}: LivingWorldVisualProps) {
  const navigate = useNavigate();

  const handleAskEka = (target: {
    title: string;
    location?: string;
    category?: string;
    initialQuestion?: string;
    preloadedSummary?: string;
  }) => {
    if (onAskEka) {
      onAskEka(target);
    } else {
      // Default homepage behavior: Navigate to /ask with preloaded question
      navigate({
        to: "/ask",
        search: {
          q: target.initialQuestion || `Tell me about ${target.title} in ${target.location}`,
        } as any,
      });
    }
  };

  return (
    <div id="living-world-atlas" className={className}>
      <LivingCulturalAtlas
        initialRegion="all"
        showEditorialBanner={true}
        onAskEka={handleAskEka}
      />
    </div>
  );
}
