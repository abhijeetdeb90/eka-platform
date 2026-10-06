# EKA Imagery & Photography Guidelines

**Standard**: Documentary Dignity & Living Human Provenance  
**Audience**: Curators, Creators, Editors, Product Designers, Engineering Teams  
**Platform**: EKA — The World's Trusted Cultural Intelligence Layer  

---

## 1. Core Visual Ethos

> *"A random EKA image must feel like a real window into someone's culture, not a wellness advertisement or tourism marketing brochure."*

EKA is dedicated to preserving, understanding, and communicating the living heritage of humanity. Photography and visual media are not decorative fillers—they are **primary cultural records**.

Every image published on EKA must uphold **documentary dignity**: representing people, practices, geographies, and crafts as they exist in truth, with respect for communal ownership and individual agency.

---

## 2. Preferred vs Avoid Matrix

| Category | Preferred (The EKA Standard) | Explicitly Avoid (Prohibited) |
| :--- | :--- | :--- |
| **People** | Real cultural practitioners, artisans, elders, cooks, musicians, community members photographed in natural context. | Stereotypical stock models, artificial "AI-looking" faces with plastic skin, staged studio portraits, or exoticized tropes. |
| **Spiritual & Sacred** | Authentic rituals, architectural context, community festivals, living sacred geography documented with provenance. | Generic sunset meditation silhouettes, yoga poses, levitating crystals, incense fog, or commodified New Age wellness scenes. |
| **Craft & Labor** | Hands actively weaving, carving, cooking, singing, assembling; natural wear-and-tear on tools; real workshops. | Pristine staged craft setups, stock photos of hands holding abstract glowing spheres, or fake artisan simulations. |
| **Geography & Environment** | Authentic architecture, regional landscapes, village commons, bustling markets, urban alleys, living sacred spaces. | Generic drone sweeps over generic beaches, postcard cliches, or homogenized hyper-saturated travel ads. |
| **Geographic Diversity** | Truly global balance: Andes, Sahara, Kyoto, Oaxaca, Rift Valley, Hebrides, Amazonia, Indus, Balkans, Arctic. | Monocultural clustering (e.g. 90% Indian temples or 90% Western modern architecture). |
| **Lighting & Texture** | Natural sunlight, documentary chiaroscuro, natural shadows, genuine film grain, honest environmental exposure. | Over-sharpened HDR, neon cyan/magenta festival filters, artificial blur, or synthetic AI gloss. |

---

## 3. Strict AI Asset & Tool Clean-Up Policy

### 3.1 Zero-Watermark Mandate
**No production-facing EKA asset may contain any AI platform watermark, synthetic generation artifact, or tool branding.**

This includes, but is not limited to:
- Google Gemini watermarks (stars, "Gemini", "Generated with Google AI" overlays)
- Midjourney / DALL-E / Runway / Sora watermarks or floating logo stamps
- Shutterstock / Getty / Adobe Stock preview grids or watermarks
- AI facial artifacts (irregular fingers, melting backgrounds, asymmetric pupils, impossible textile weaves)

### 3.2 Enforcement in Code & Bundles
1. All static assets in `/public/brand/`, `/public/images/`, and `/src/assets/` are checked during pre-commit and CI/CD pipelines.
2. Any asset flagged with a third-party generation watermark is immediately expunged and replaced with verified Unsplash Editorial, Wikimedia Commons (CC-BY/Public Domain), or direct community-contributed photography.
3. User-generated content (UGC) uploaded to the living archive is scanned for synthetic metadata tags and watermarks prior to public indexing in the Knowledge Graph.

---

## 4. Pan-Cultural Geographic Balancing

To ensure EKA feels equally natural in **Guwahati, Tokyo, Nairobi, Dubai, London, São Paulo, and New York**, photography curation must maintain a balanced global geographic distribution:

```
+--------------------------------------------------------------------------------+
|                         GLOBAL CULTURAL FOOTPRINT (TARGET: 100%)               |
+--------------------------+-----------------------------------------------------+
| East & Southeast Asia    | 16% (Japan, Korea, Indonesia, Vietnam, Philippines) |
| South & Central Asia     | 16% (India, Nepal, Uzbekistan, Sri Lanka, Bhutan)   |
| Sub-Saharan Africa       | 16% (Kenya, Nigeria, Ethiopia, Ghana, Mali)         |
| Middle East & N. Africa  | 14% (Morocco, Egypt, Oman, Jordan, Lebanon)         |
| Latin America & Caribbean| 14% (Mexico, Peru, Brazil, Colombia, Guatemala)     |
| Europe & Mediterranean   | 12% (Greece, Portugal, Ireland, Georgia, Italy)     |
| North America & Oceania  | 12% (Indigenous First Nations, Pacific Islands, NZ) |
+--------------------------+-----------------------------------------------------+
```

---

## 5. Technical Specifications for Media Production

### 5.1 Aspect Ratios & Canonical Sizes
- **OpenGraph & Social Share Cards**: `1200 × 630 px` (1.91:1) — e.g. `public/brand/eka-banner.jpg`
- **Story Hero Banners**: `16:9` or `21:9` widescreen, minimum `1920 × 1080 px`
- **Cultural Exploration Tiles**: `4:5` vertical portrait or `1:1` square, minimum `800 × 1000 px`
- **Avatar & Practitioner Badges**: `1:1` circular crop, minimum `256 × 256 px`
- **App Icons**: `512 × 512 px` PNG with alpha transparency, plus canonical vector SVG

### 5.2 Compression & Web Delivery
- Format preference: Modern WebP / AVIF with JPEG fallback
- Compression target: Maximum 180 KB for standard feed cards, maximum 450 KB for full-bleed hero banners
- Lazy loading: `loading="lazy"` on all below-the-fold media; `fetchpriority="high"` strictly reserved for hero imagery
- Image Alt-Text: Mandatory descriptive accessibility captions focusing on cultural context (e.g., *"Maasai elder conducting beadwork in Kajiado, Kenya"*, not *"Cultural person"*).
