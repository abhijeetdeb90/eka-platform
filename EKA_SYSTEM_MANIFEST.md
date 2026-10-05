# EKA PLATFORM — FULL SYSTEM ARCHIVE MANIFEST

**Canonical Platform:** EKA — The Living Cultural Intelligence Layer  
**Manifest Generated:** `2026-10-05T07:00:47.049Z`  
**Version:** `2.4.0-production`  
**Live Production URL:** [eka-platform.vercel.app](https://eka-platform.vercel.app)  
**Google Drive Offsite Backup Vault:** [Google Drive Target Folder](https://drive.google.com/drive/folders/1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL) (Folder ID: `1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL`)  

## 1. Executive Summary & Vault Architecture

EKA operates on a dual-tier storage and resilience architecture:
- **Live Tier (Transactional Source of Truth):** Supabase (PostgreSQL 15, GoTrue Auth, Row-Level Security, Storage Buckets). Project ID: `kbiutqzhcbyuseygcspe`.
- **Vault Tier (Disaster Recovery & Enterprise Archive):** Google Drive Secure Enterprise Vault (`1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL`). Stores snapshot dumps, schema migration catalogs, offline system manifests, and business continuity artifacts.

## 2. Platform Telemetry & Codebase Metrics

| Metric | Count |
| :--- | :--- |
| **Total Monitored Files** | 785 |
| **Total Source Lines** | 1,90,391 |
| **Total Project Size** | 16.14 MB |
| **Database Migrations** | 40 files |
| **UI Components & Views** | 333 modules |
| **Security & RBAC Modules** | 17 modules |

### Component Distribution

- **Architecture Documentation:** 119 files
- **Configuration & Tooling:** 24 files
- **System Support File:** 93 files
- **Internal Workspace Container:** 10 files
- **Founder Cockpit & Platform Ops:** 11 files
- **UI Component:** 193 files
- **Brand & Identity Asset:** 1 files
- **React State Hook:** 5 files
- **Authentication & RBAC:** 2 files
- **Supabase SDK & Types:** 6 files
- **Core Business Logic / Service:** 110 files
- **Ledger & Financial Settlement:** 16 files
- **Enterprise Security & Threat Monitoring:** 15 files
- **Application Route / Page:** 140 files
- **Database Migration:** 40 files

## 3. Subsystem Topologies Tracked

1. **People & Identities (Biographical Passports)**
2. **Living Stories (Multimodal Narrative Graph)**
3. **Traditions & Customs (Temporal Ritual Context)**
4. **Communities & Circles (Cultural Affinity Hubs)**
5. **Places & Geographies (Sacred & Indigenous Cartography)**
6. **Languages & Dialects (Phonetic & Oral Preservations)**
7. **Rituals & Observances (Cyclical Calendar)**
8. **Knowledge & Epistemic Taxonomies (5-Tier Provenance)**
9. **Audio / Oral Heritage (Acoustic Preservations)**
10. **Visual & Material Culture (Artisan Artifacts)**
11. **Ledger & Settlement (Dual-Entry Creator Ledger)**
12. **Governance & Security (Super-Admin Cockpit & Threat Telemetry)**

## 4. Disaster Recovery & Restoration Protocol

1. **Codebase Restoration:** Clone or unpack repository files verified against the SHA-256 hashes registered in `EKA_SYSTEM_MANIFEST.json`.
2. **Dependency Resolution:** Run `npm ci` or `npm install` under Node.js >= 22.
3. **Database Schema Application:** Execute `supabase/migrations/*.sql` in lexicographical sequence against the Supabase project.
4. **Environment Configuration:** Populate `.env` from `.env.example` with production secrets in Vercel and Supabase.
5. **Google Drive Sync:** Execute `npm run backup:drive` or `node scripts/backup-to-drive.mjs` to verify sync integrity.

*Vault Target: `https://drive.google.com/drive/folders/1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL`*
