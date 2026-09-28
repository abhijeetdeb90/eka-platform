# EKA Mobile Architecture — Unified Cross-Platform Strategy

## 1. Executive Summary & Technology Decision

For a multi-faith, contemplation-centric platform combining daily sadhana rhythms, media streaming, and offline-first private journals, the mobile client must balance:

- Rapid iteration and unified business logic with the web application.
- Native performance (60/120 FPS buttery smooth transitions).
- Low battery footprint during background meditation audio sessions.
- Offline data privacy and local encrypted storage.

### Framework Evaluation Matrix

| Criterion                     | React Native (Expo SDK 52+)                                | Flutter (Dart)                                  | Native (Swift / Kotlin)               |
| :---------------------------- | :--------------------------------------------------------- | :---------------------------------------------- | :------------------------------------ |
| **Code Sharing with Web**     | **95%** (TypeScript, Supabase client, Zod, TanStack Query) | **0%** (Requires Dart duplicate models & logic) | **0%** (Dual codebases required)      |
| **New Architecture (Fabric)** | Native C++ core, synchronous layout, zero bridge lag       | Skia / Impeller canvas rendering                | Direct platform APIs                  |
| **Audio Background Playback** | Native background audio with lock-screen controls          | High quality (`just_audio`)                     | Native `AVPlayer` / `ExoPlayer`       |
| **Offline Privacy (SQLite)**  | High (`op-sqlite` / WatermelonDB)                          | High (`drift` / `sqflite`)                      | Native `CoreData` / `Room`            |
| **Developer Velocity**        | Single unified team across Web + iOS + Android             | Dedicated Dart team required                    | Two separate mobile teams required    |
| **Verdict**                   | **SELECTED: Primary Mobile Core**                          | Secondary evaluation for standalone 3D          | Retained only for low-level audio DSP |

---

## 2. Shared Code Architecture

The mobile codebase connects to the shared EKA backend using monorepo or submodule packages:

```
eka-workspace/
├── web/                     # Current TanStack Start / React 19 web sanctuary
├── mobile/                  # Expo SDK 52 application
│   ├── app/                 # Expo Router file-based navigation (mirrors web routes)
│   │   ├── (auth)/          # SignIn, Join, Biometric Lock
│   │   ├── (tabs)/          # Daily Sadhana, Sacred Calendar, Sanghas, Knowledge
│   │   └── _layout.tsx
│   ├── components/          # React Native Paper / Tamagui / NativeWind UI
│   ├── lib/
│   │   ├── audio/           # Background chant & meditation player engine
│   │   ├── offline/         # Encrypted SQLite sadhana journal cache
│   │   └── notifications/   # Local notification triggers (Brahma Muhurta, fast ends)
│   └── package.json
└── packages/shared/         # Shared TypeScript contracts
    ├── types/               # Supabase database types & EKA Context Object schemas
    ├── api/                 # API query hooks & client adapters
    └── validators/          # Zod validation schemas (Join, Reviews, Booking)
```

---

## 3. Key Native Mobile Features

### A. Offline-First Sadhana & Private Journal

- **Storage:** Local encrypted SQLite via SQLCipher.
- **Privacy Guard:** Private reflections written while on pilgrimage or in offline retreats stay on the device and only synchronize to Supabase when the user explicitly enables cloud backup.

### B. Sacred Audio Engine (Meditation & Chanting)

- Seamless background audio streaming with lockscreen metadata (Deity, Tradition, Lineage, Duration).
- Offline download capability for guided meditations and sacred soundscapes.

### C. Panchangam & Local Rhythm Notifications

- Zero-tracking local scheduling: Prayers, fasting sunrise/sunset milestones, and reflection reminders are scheduled locally on the device's native alarm scheduler without tracking the user's live GPS.

---

## 4. Setup & Running the Mobile Prototype

```bash
# 1. Install dependencies
cd mobile
npm install

# 2. Run local development with Expo Go
npx expo start

# 3. Build native binaries via EAS (Expo Application Services)
npx eas build --platform ios
npx eas build --platform android
```
