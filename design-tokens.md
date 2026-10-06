# EKA Design Token System

**Version**: 2.0.0 (Universal Cultural Intelligence Architecture)  
**Conformance**: W3C Design Tokens Community Group Specification  
**Color Model**: OKLCH Primary with HEX, RGB, and HSL backward-compatibility mappings  

---

## 1. Brand Color Token Architecture

The EKA color system is grounded in **Earth, Cartography, and Natural Pigments**—universal materials shared by human civilizations across every continent (ceramic terracotta, volcanic obsidian, vegetable indigo, raw linen, forest flora).

### 1.1 Core Semantic Token Palette (Light Mode / Default Canvas)

| Token Name | HEX | RGB | HSL | OKLCH | Semantic Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `color.primary` | `#9E472A` | `rgb(158, 71, 42)` | `hsl(15, 58%, 39%)` | `oklch(0.585 0.077 45)` | Authoritative brand emphasis, primary CTAs |
| `color.primary.soft` | `#F4EAE4` | `rgb(244, 234, 228)` | `hsl(23, 44%, 93%)` | `oklch(0.917 0.028 55)` | Subtle category pill backdrops, highlighted row surfaces |
| `color.secondary` | `#EBE8DF` | `rgb(235, 232, 223)` | `hsl(45, 24%, 90%)` | `oklch(0.906 0.011 92)` | Secondary interactive controls, toggle backdrops |
| `color.accent` | `#E2DDD1` | `rgb(226, 221, 209)` | `hsl(42, 25%, 85%)` | `oklch(0.878 0.020 92)` | Subtle hover fills, pill indicators, card borders |
| `color.background` | `#FBF9F5` | `rgb(251, 249, 245)` | `hsl(40, 38%, 97%)` | `oklch(0.966 0.005 95)` | Global application background (Calibrated Sand/Ivory) |
| `color.surface` | `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)` | `oklch(0.988 0.003 95)` | Standard card, feed container, dialog surface |
| `color.surface.elevated` | `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)` | `oklch(1.000 0.000 0)` | Modals, elevated flyouts, sticky headers (`backdrop-blur`) |
| `color.text.primary` | `#201D1A` | `rgb(32, 29, 26)` | `hsl(30, 10%, 11%)` | `oklch(0.248 0.004 95)` | Primary headlines, body copy, active icons |
| `color.text.secondary` | `#45403A` | `rgb(69, 64, 58)` | `hsl(33, 9%, 25%)` | `oklch(0.350 0.006 95)` | Subheaders, section descriptions, active nav |
| `color.text.muted` | `#6E675D` | `rgb(110, 103, 93)` | `hsl(35, 8%, 40%)` | `oklch(0.440 0.009 95)` | Metadata, timestamps, coordinate captions ($\ge 4.5:1$ ratio) |
| `color.border` | `#E5E0D5` | `rgb(229, 224, 213)` | `hsl(41, 25%, 87%)` | `oklch(0.878 0.010 92)` | Dividers, card strokes, input contours |
| `color.hover` | `#F2EEE5` | `rgb(242, 238, 229)` | `hsl(42, 31%, 92%)` | `oklch(0.940 0.012 92)` | List row and button hover fill |
| `color.active` | `#DDD7CB` | `rgb(221, 215, 203)` | `hsl(40, 22%, 83%)` | `oklch(0.860 0.018 92)` | Pressed states, active tab pill |
| `color.focus` | `#C25E3E` | `rgb(194, 94, 62)` | `hsl(15, 52%, 50%)` | `oklch(0.585 0.077 45)` | 2px accessible focus ring with offset |

### 1.2 Status & Feedback Pigment Palette

| Token Name | HEX | RGB | HSL | OKLCH | Semantic Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `color.success` | `#2D5A43` | `rgb(45, 90, 67)` | `hsl(149, 33%, 26%)` | `oklch(0.480 0.080 155)` | Verified provenance, ethical certification, published |
| `color.warning` | `#B86A22` | `rgb(184, 106, 34)` | `hsl(29, 69%, 43%)` | `oklch(0.620 0.120 65)` | Unreviewed oral history, provisional attribution |
| `color.error` | `#992620` | `rgb(153, 38, 32)` | `hsl(3, 65%, 36%)` | `oklch(0.520 0.160 27)` | Disputed tradition, authentication failure, form error |

### 1.3 Dark Mode Palette (Nocturnal Living Archive)

| Token Name | HEX | RGB | HSL | OKLCH | Semantic Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `color.background` | `#13181F` | `rgb(19, 24, 31)` | `hsl(215, 24%, 10%)` | `oklch(0.196 0.008 160)` | Deep slate nocturnal canvas |
| `color.surface` | `#1A212B` | `rgb(26, 33, 43)` | `hsl(215, 25%, 14%)` | `oklch(0.238 0.010 160)` | Nocturnal card and panel backdrop |
| `color.surface.elevated` | `#222B38` | `rgb(34, 43, 56)` | `hsl(215, 24%, 18%)` | `oklch(0.280 0.012 160)` | Flyouts, sticky navigation bar |
| `color.text.primary` | `#F2F4F7` | `rgb(242, 244, 247)` | `hsl(216, 24%, 96%)` | `oklch(0.945 0.006 95)` | Primary high-contrast nocturnal text |
| `color.text.muted` | `#9BA3AF` | `rgb(155, 163, 175)` | `hsl(216, 12%, 65%)` | `oklch(0.712 0.010 95)` | Supporting metadata ($\ge 4.5:1$ ratio) |
| `color.border` | `rgba(255,255,255,0.12)` | `rgba(255,255,255,0.12)` | — | `oklch(0.98 0 0 / 12%)` | Hairline boundary strokes |

---

## 2. Typography Token System

EKA uses a **trio-tier typography structure** designed for cross-lingual storytelling, high information density, and cartographic precision.

### 2.1 Font Families

```css
--font-display: "Fraunces", "Playfair Display", ui-serif, Georgia, serif;
--font-sans: "Karla", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
```

### 2.2 Scale & Hierarchy

| Token | Font Size | Line Height | Letter Spacing | Font Family | Default Weight | Typical Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `type.display.2xl` | 3.5rem (56px) | 1.10 | -0.025em | Display | Bold (700) | Landing hero headlines, major monograph titles |
| `type.display.xl` | 2.5rem (40px) | 1.15 | -0.020em | Display | SemiBold (600) | Major cultural pillar headers, portal titles |
| `type.heading.lg` | 1.875rem (30px)| 1.25 | -0.015em | Display / Sans | SemiBold (600) | Section titles, story chapter headings |
| `type.heading.md` | 1.375rem (22px)| 1.35 | -0.010em | Sans | SemiBold (600) | Card titles, modal titles, profile names |
| `type.heading.sm` | 1.125rem (18px)| 1.40 | -0.005em | Sans | Medium (500) | Subsection headers, list item headers |
| `type.body.lg` | 1.125rem (18px)| 1.65 | 0.000em | Sans | Normal (400) | Long-form reading, cultural narratives |
| `type.body.md` | 0.9375rem (15px)| 1.60 | 0.005em | Sans | Normal (400) | Standard interface copy, card descriptions |
| `type.body.sm` | 0.8125rem (13px)| 1.50 | 0.010em | Sans | Normal (400) | Secondary metadata, comments, list subtitles |
| `type.caption` | 0.6875rem (11px)| 1.40 | 0.020em | Sans / Mono | Medium (500) | Badges, image captions, tooltips |
| `type.mono.code` | 0.75rem (12px) | 1.50 | 0.040em | Mono | Medium (500) | Coordinates, timestamps, provenance IDs |
| `type.brand.beta` | 0.5625rem (9px) | 1.00 | 0.150em | Mono | SemiBold (600) | `[EKA] BETA` badge beside primary logotype |

---

## 3. Spatial, Corner & Elevation Tokens

### 3.1 Border Radius
* `radius.xs`: `4px` (`calc(var(--radius) - 8px)`) — Micro badges, inline tags
* `radius.sm`: `8px` (`calc(var(--radius) - 4px)`) — Form inputs, dropdown items
* `radius.md`: `10px` (`calc(var(--radius) - 2px)`) — Standard buttons, tooltips
* `radius.lg`: `12px` (`var(--radius)`) — Cards, popovers, media previews
* `radius.xl`: `18px` (`calc(var(--radius) + 6px)`) — Large story modules, modal containers
* `radius.full`: `9999px` — Avatars, pill badges, store buttons

### 3.2 Elevation & Shadows
* `shadow.calm`: `0 1px 2px oklch(0.24 0.01 150 / 0.04), 0 12px 40px -24px oklch(0.24 0.01 150 / 0.35)`
  * Used for baseline cards, floating navigation bar, action sheets.
* `shadow.lift`: `0 2px 6px oklch(0.24 0.01 150 / 0.06), 0 24px 60px -28px oklch(0.24 0.01 150 / 0.40)`
  * Used for hover states, dialog modals, drag-and-drop objects.

---

## 4. Multi-Platform Token Export Format

Tokens are exported programmatically via `@/brand` and `public/brand/brand-colors.json` for consumption across:
- **Web**: Tailwind CSS v4 `@theme inline` and CSS Custom Properties
- **Mobile (React Native / iOS / Android)**: Direct JSON theme loading
- **Design Tools**: Figma Tokens Studio JSON schema compliant
