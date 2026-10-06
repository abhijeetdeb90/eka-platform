# EKA Motion & Kinetic Choreography Guidelines

## Philosophy: "One Within $\rightarrow$ One With All"

The EKA motion system translates the brand's core purpose—**The World's Trusted Cultural Intelligence Layer**—into digital kinetic behavior. It rejects chaotic startup flashiness and mystical spiritual tropes (lotus blooming, glowing halos, floating incense) in favor of **calm, planetary, documentary precision**.

---

## 1. Core Kinetic Primitives

### A. The Cultural Meridian Orbital Rotation
- **Symbolism**: Cartographic navigation, planetary rotation, global human commons.
- **Timing**: 2.4s per revolution, linear continuous ease.
- **Visual Weight**: 2px hairline outer orbital ring with subtle Terracotta leading edge (`#C25E3E`) and muted slate trailing edge.

### B. Longitudinal Meridian Intersection
- **Symbolism**: Cross-cultural dialogue, shared human horizons, intersecting lived traditions.
- **Timing**: 3.2s counter-revolution, linear continuous ease, with subtle respiratory breathing cycle (scale 0.94 $\rightarrow$ 1.04 $\rightarrow$ 0.94 over 1.6s).
- **Visual Weight**: 1px dashed terracotta/slate arc.

### C. The "One Within" Focal Nucleus Pulse
- **Symbolism**: The individual human voice, the storyteller, the focal point of consciousness.
- **Timing**: 1.6s cycle, `easeInOut` (scale 0.85 $\rightarrow$ 1.20 $\rightarrow$ 0.85, opacity 0.75 $\rightarrow$ 1.00 $\rightarrow$ 0.75).
- **Color**: Radiant Terracotta core with calibrated soft ambient penumbra (`rgba(194, 94, 62, 0.5)`).

---

## 2. Interactive States & Micro-interactions

| Component State | Target Property | Duration | Easing Curve | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Hover (Logo Lockup)** | Scale & Rotate | 500ms - 700ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Emblem scales 1.05× with 6° axial tilt; typography remains anchor-stable. |
| **Card Elevate** | Y-translate & Shadow | 300ms | `cubic-bezier(0.2, 0.8, 0.2, 1)` | `translate-y: -3px`, shadow transitions from calm to soft lift. |
| **Drawer / Modal Reveal**| Opacity & Y-offset | 250ms | `cubic-bezier(0.22, 1, 0.36, 1)` | Smooth aperture reveal without jarring bouncing or elastic overshoots. |

---

## 3. Accessibility & Reduced Motion Standard

When `prefers-reduced-motion: reduce` is detected via `useReducedMotion()`:
- **No continuous spinning or orbiting**: Rotation transitions are locked to static orientation (`rotate: 0deg`).
- **No pulsing scales**: Scale remains invariant at `1.0`.
- **Calm opacity indication**: Loading states communicate progress via gentle opacity changes or a steady, dignified indicator.
