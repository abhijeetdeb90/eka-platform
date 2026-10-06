# EKA — Brand & Visual Identity Guidelines
**Universal Cultural Intelligence System**
*Version 2.0.0 — Canonical Production Reference*

---

## 1. Executive Summary & Core Positioning

EKA is the world’s trusted platform for discovering, documenting, and understanding living human culture, traditions, places, and knowledge. EKA is not a yoga app, meditation tool, religious forum, or regional spiritual platform. It is a universal global cultural intelligence platform with a social layer.

### Brand Positioning Hierarchy

* **Primary Brand**: EKA
* **Primary Product Positioning**: The World’s Trusted Cultural Intelligence Layer
* **Philosophy**: *One Within. One With All.*
* **Consumer Hook**: *Don't just scroll the world. Understand it.*
* **Product Promise**: *Connect. Communicate. Build Community. Earn.*

---

## 2. The Core Problem We Solved

### Previous Perception
* Old emblem: Concentric mandala with a seated figure in lotus/meditation pose and 12 outer petal nodes.
* Consequence: Immediately perceived as a yoga studio, meditation app, Hindu-only platform, or spiritual wellness app.
* External signal: *"I'm not too sure about the logo. Gives a feel of a yoga based platform. This is supposed to be a platform that will be universal."*
* Secondary signal: *"The videos look good, but the Gemini watermark is there."*

### New Perception
* New emblem: **The Cultural Meridian Nexus**.
* A clean, universal synthesis of a cartographic globe, planetary meridians, the documentary aperture/lens of human observation, and the central focal beacon of individual human consciousness (*"One Within"*).
* Complete neutrality: 0% religious, 0% yoga, 0% spiritual cliché.
* 100% human, documentary, editorial, global, and technology-ready.

---

## 3. Anatomy of the EKA Symbol

```
        (N) [●]
       .---'|'---.
     /     '|'     \
    /   ( \ | / )   \
[●]----+---+●+---+----[●]  (Shared Human Equator / Horizon)
(W) \   ( / | \ )   / (E)
     \     '|'     /
       '---.|.---'
        (S) [●]
```

1. **The Global Boundary (Outer Ring)**: The shared world commons (*"One With All"*). Precision line-weight that scales seamlessly from a 16px favicon to giant architectural signage.
2. **The Shared Horizon (Equator)**: The universal plane of humanity connecting East, West, North, and South without hierarchy.
3. **The Prime Meridians (Longitudinal Arcs)**: The passage of time, generational lineages, oral traditions, and cross-cultural dialogue across continents.
4. **Cardinal Meridian Nodes**: Four anchor pins at 12, 3, 6, and 9 o'clock symbolizing global orientation (from Guwahati to Tokyo, Nairobi, Dubai, London, São Paulo, and New York).
5. **The Negative-Space Aperture**: A circular clearing around the core representing the camera aperture, the eye of documentary observation, and room to breathe.
6. **The Focal Nucleus ("One Within")**: Radiant Earth Terracotta circle at the absolute center. Represents the individual soul, the storyteller, the living artisan, and human consciousness.

---

## 4. Logo Variants & Canonical Assets

All production assets are available in `/public/brand` and `/brand`:

| Asset File | Purpose & Usage | Format |
| :--- | :--- | :--- |
| `logo-primary.svg` | Canonical horizontal lockup (Symbol + EKA + CULTURAL INTELLIGENCE) | Vector SVG |
| `logo-symbol.svg` | Standalone icon mark for headers, avatars, stamps | Vector SVG |
| `logo-dark.svg` | Optimized for dark backgrounds (Obsidian/Stone canvas) | Vector SVG |
| `logo-light.svg` | Optimized for light backgrounds (Sandstone/Alabaster canvas) | Vector SVG |
| `logo-monochrome.svg` | Single-color dynamic `currentColor` vector for print & utility | Vector SVG |
| `favicon.svg` | Ultra-crisp browser tab icon (optimized stroke weights) | Vector SVG |
| `app-icon.svg` | Master app icon (iOS / Android / PWA squircle format) | Vector SVG |
| `app-icon.png` | 512x512 high-DPI rasterized app icon | 32-bit PNG |
| `eka-logo.png` | 512x512 high-DPI transparent rasterized symbol | 32-bit PNG |
| `eka-banner.jpg` | 1200x630 social OpenGraph & Twitter preview banner | 24-bit JPEG |

### Clearspace & Scaling
* **Minimum Clearspace**: 1X the radius of the central core on all four sides.
* **Minimum Digital Size**: 16x16px (favicon), 24x24px (header mark).
* **Wordmark Tracking**: `0.22em` on "EKA", `0.28em` on "CULTURAL INTELLIGENCE".

---

## 5. Color System

| Token | Name | OKLCH / Hex | Usage |
| :--- | :--- | :--- | :--- |
| `--color-primary` | **Earth Terracotta** | `oklch(0.585 0.077 45)` / `#C25E3E` | Focal core ("One Within"), active indicators, verified marks |
| `--color-foreground` | **Meridian Charcoal** | `oklch(0.248 0.004 95)` / `#1E2A38` | Primary text, symbol boundaries, cartographic lines |
| `--color-background` | **Warm Sandstone** | `oklch(0.966 0.005 95)` / `#F7F6F2` | Light mode canvas, editorial background |
| `--surface-dark` | **Deep Obsidian** | `oklch(0.196 0.008 160)` / `#11161F` | Dark mode surface, cinema reels viewer |
| `--color-indigo-ink` | **Knowledge Lapis** | `oklch(0.395 0.079 268)` / `#25384D` | Data graphs, maps, enterprise intelligence views |
| `--color-forest` | **Living Sage** | `oklch(0.352 0.048 155)` / `#2E5C47` | Ecological stewardship, legal/DPDP compliance |
| `--color-saffron` | **Dawn Amber** | `oklch(0.735 0.126 68)` / `#D97736` | Secondary curiosity highlights |

---

## 6. Typography System

* **Display**: `Fraunces` (Editorial serif) — Used for titles, hero statements, and place headings. Provides book-craft authority and cultural permanence without religious connotations.
* **Body / UI**: `Karla` (Humanist sans) — Used for all narrative body text, metadata, and form inputs. Clean digital rendering, optimal x-height, WCAG AAA contrast compliant.
* **Monospace**: `SFMono-Regular`, `Consolas`, `monospace` — Used for geographic coordinates, archive IDs, provenance hashes, and taxonomy slugs.

---

## 7. Motion Identity & Logo Loader

* **File**: `src/components/motion/EkaLogoLoader.tsx`
* **Duration**: 1.6 seconds loop
* **Choreography**:
  1. **Core Point Pulse**: The terracotta nucleus expands and contracts rhythmically (individual awareness).
  2. **Longitudinal Wave**: The dashed meridian arc pulses counter-clockwise (cultural lineages & memory).
  3. **Global Orbital Sweep**: The outer boundary rotates clockwise in steady orbital motion (universal world commons).
* **Accessibility**: Fully integrates `useReducedMotion()`. When motion reduction is active, animations fall back to calm, static opacity indicators.

---

## 8. AI Watermark & Asset Provenance Policy

### ZERO WATERMARK RULE
1. **Strict Prohibition**: No user-facing EKA asset, video, reel, poster, thumbnail, or marketing card may display a Gemini watermark, Google watermark, AI synthesis artifact, or tool branding.
2. **Provenance Record**: Every production media asset must have an authentic documentary source (verified community steward, archival partner, or licensed photographer).
3. **Human Lineages First**: EKA showcases living people in real environments (potters, weavers, temple custodians, musicians, farmers, elders, and scholars). Synthetic hallucinated cultures are strictly prohibited.

---

## 9. Brand Differentiation Matrix

| Category | Brand Reference | How EKA Differs |
| :--- | :--- | :--- |
| **Social Video** | Instagram / TikTok | EKA is context-first, not algorithmic addiction. No brain rot; verified cultural provenance. |
| **Video Knowledge** | YouTube | EKA connects video directly to geographic graphs, community stewards, and living traditions. |
| **Encyclopedic Knowledge**| Wikipedia | EKA is living and experiential (video, sound, oral history, local voices), not just dry text. |
| **Cartography & Places** | Google Maps | EKA maps the sacred and cultural soul of places, not just commercial businesses. |
| **Language & Learning** | Duolingo | EKA embeds language in living community rituals, folklore, and crafts. |
| **Travel & Hospitality** | Airbnb Experiences | EKA is steward-first and educational, preserving traditions rather than commodifying them. |
| **Yoga / Meditation Apps**| Calm / Headspace | EKA has **zero** yoga/spiritual-only branding; covers craft, history, food, and global world cultures. |
| **Religious Apps** | Temple/Church portals| EKA is universal and welcoming to all cultures, secular historians, and global citizens equally. |
