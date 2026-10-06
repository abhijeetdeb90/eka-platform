# EKA Hybrid Architecture Specification: Supabase Core & 5 TB Google Drive Data Lake
**Document ID:** `EKA-ARCH-SPEC-2026-001`  
**Classification:** Core System Architecture  
**Target Scale:** $\le 5,000$ MAU Pre-Funding Seed Stage  
**Primary Storage Target:** Google Drive Folder ID `1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL`  
**Operational Database:** Supabase PostgreSQL (`kbiutqzhcbyuseygcspe`)  

---

## 1. Executive Summary & Strategic Rationale

EKA operates at the intersection of living heritage, sacred geography, community discourses, and cultural intelligence. In the bootstrap phase ($\le 5,000$ active users pre-funding), standard cloud object storage (AWS S3, Google Cloud Storage, Cloudflare R2) and database storage present critical cost and operational challenges:
- **Supabase Free/Pro Constraints:** Supabase provides generous auth and query limits (50,000 MAU), but Postgres disk space is capped at 500 MB (Free) and file storage at 1 GB. High-resolution temple imagery, creator audio/video, manuscripts, and AI training corpora quickly overwhelm standard tiers.
- **5 TB Google Drive Asset:** EKA's dedicated 5 TB Google Drive vault represents an immediate, zero-marginal-cost data lake and content vault with a 5,000:1 storage leverage over default limits.

### The Canonical Separation of Concerns
```
                    ┌─────────────────────────┐
                    │      EKA CLIENT APP     │
                    │  (React 19 / TanStack)  │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     SUPABASE LAYER      │
                    │   PostgreSQL + Auth +   │
                    │  RLS + Metadata Engine  │
                    └────────────┬────────────┘
                                 │
                   ┌─────────────┴─────────────┐
                   ▼                           ▼
        Operational Metadata           Backend Service Proxy
        - EKA Unique Identifiers       (Service Account / Token)
        - Relationships & Graph                    │
        - Permissions & Audits                     ▼
                                      ┌─────────────────────────┐
                                      │    GOOGLE DRIVE VAULT   │
                                      │   5 TB Content Lake     │
                                      │   (Files / Media / Raw) │
                                      └─────────────────────────┘
```

> **The Golden Architecture Rule:**  
> **EKA $\to$ Supabase $\to$ Google Drive**, NEVER **EKA $\to$ Google Drive $\to$ Everything**.  
> Supabase is the **brain and operational system of record**. Google Drive is the **vault and cold/warm object store**.

---

## 2. What Lives Where: Strict Classification Matrix

| Data Classification | System of Record | Storage Layer | Rationale & Access Control |
| :--- | :--- | :--- | :--- |
| **User Identity & Auth** | Supabase Auth | Supabase | Passwords, tokens, OTPs, session keys. **Never exported to Drive.** |
| **User Profiles & Graph** | Supabase Postgres | Supabase | Names, slugs, handles, lineages, settings, preferences. Fast relational queries. |
| **Financial Ledger & Payouts** | Supabase Postgres | Supabase | Double-entry ledger, Razorpay webhooks, commission pools. Strict ACID compliance. |
| **Permissions & RBAC** | Supabase Postgres | Supabase | 11-Tier Studio RBAC, Row Level Security (RLS) enforcement. |
| **Community Posts & Comments**| Supabase Postgres | Supabase | Text, discourse threads, epistemic tags, moderation states. |
| **Media Metadata & IDs** | Supabase Postgres | Supabase | Links EKA permanent ID (`EKA-MED-*`), MIME type, Drive File ID, size, checksum. |
| **High-Res Images & Stills** | Supabase (Ref) | **Google Drive** | Field photography, temple architecture, craft textures (10 MB – 50 MB each). |
| **Video Reels & Discourses** | Supabase (Ref) | **Google Drive** | Creator recordings, oral discourses, festival reels (50 MB – 500 MB each). |
| **Audio Tracks & Chants** | Supabase (Ref) | **Google Drive** | Vedic chanting, sacred geography audio guides, oral histories. |
| **Manuscripts & Documents** | Supabase (Ref) | **Google Drive** | Scanned palm-leaf manuscripts, PDFs, research dissertations, epigraphic records. |
| **AI Corpus & Training Data** | Supabase (Ref) | **Google Drive** | Bulk transcripts, raw scraped texts, Q&A pairs, embedding parquet exports. |
| **Analytics Snapshots** | Supabase (Events) | **Google Drive** | Monthly aggregated Parquet/JSON event dumps, cohort reports. |
| **Database Backups** | Local / Staged | **Google Drive** | Encrypted schema snapshots, migration catalogs, weekly disaster recovery dumps. |

---

## 3. Permanent Identity System (EKA IDs)

To ensure **zero vendor lock-in** and a seamless future migration to AWS S3, Cloudflare R2, or Google Cloud Storage post-funding, every object in the ecosystem must be assigned a permanent, uniform EKA identifier independent of Google Drive file IDs.

### Identifier Taxonomy
```
Format: EKA-{ENTITY_TYPE}-{HEX_TIMESTAMP_OR_HASH}-{CHECKSUM}
```

- **`EKA-USR-000183`** — User Account Profile
- **`EKA-CRTR-000042`** — Verified Practitioner / Creator
- **`EKA-KNW-001293`** — Epistemic Knowledge Graph Node (e.g., *Kumbh Mela*, *Thanjavur Temple*)
- **`EKA-CNT-004872`** — User Post / Discourse Entry
- **`EKA-MED-009214`** — Media Binary Asset (Image, Video, Audio)
- **`EKA-DOC-000318`** — Research Document / Palm-Leaf Scan
- **`EKA-CRP-000075`** — AI Reference Corpus Document

### Supabase Storage Asset Schema (`public.storage_assets`)
```sql
CREATE TABLE IF NOT EXISTS public.storage_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eka_id VARCHAR(64) UNIQUE NOT NULL, -- e.g., 'EKA-MED-009214'
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    entity_type VARCHAR(32) NOT NULL,    -- 'post', 'knowledge_object', 'creator_portfolio', 'backup'
    entity_id UUID,                      -- Polymorphic link to parent table record
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(128) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    sha256_checksum VARCHAR(64),
    
    -- Storage Provider Abstraction
    storage_provider VARCHAR(32) DEFAULT 'google_drive', -- 'google_drive' | 'cloudflare_r2' | 's3' | 'supabase'
    drive_file_id VARCHAR(128),                          -- Google Drive opaque ID
    drive_folder_id VARCHAR(128),                        -- Specific subfolder in EKA_DATA
    drive_web_content_link TEXT,                         -- Direct stream link (if shared or proxy)
    
    -- CDN & Cache Optimization
    cdn_cached_url TEXT,
    thumbnail_drive_id VARCHAR(128),
    thumbnail_url TEXT,
    
    -- Status & Sync
    sync_status VARCHAR(32) DEFAULT 'synced',            -- 'staged', 'uploading', 'synced', 'error'
    is_public BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_storage_assets_eka_id ON public.storage_assets(eka_id);
CREATE INDEX idx_storage_assets_drive_file_id ON public.storage_assets(drive_file_id);
CREATE INDEX idx_storage_assets_entity ON public.storage_assets(entity_type, entity_id);
```

---

## 4. Google Drive 5 TB Vault Directory Structure

The root vault folder (`1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL`) is partitioned into 10 top-level namespaces to establish clean operational isolation and ease automated syncing:

```
/EKA_DATA (1qjLsG3WEWCTvxjZCyR-W_W61AOkTtoHL)
│
├── 01_USERS
│   ├── avatars
│   ├── preference_snapshots
│   └── privacy_data_exports
│
├── 02_CONTENT
│   ├── posts_media
│   ├── editorial_images
│   └── discourse_recordings
│
├── 03_CULTURAL_KNOWLEDGE
│   ├── 01_India
│   │   ├── Sacred_Geography
│   │   ├── Temple_Architecture
│   │   ├── Manuscripts_PalmLeaf
│   │   └── Oral_Traditions
│   ├── 02_Asia
│   ├── 03_Middle_East
│   ├── 04_Africa
│   ├── 05_Europe
│   └── 06_Americas
│
├── 04_CREATOR_CONTENT
│   ├── verified_workshops
│   ├── audio_courses
│   └── masterclass_videos
│
├── 05_AI_CORPUS
│   ├── canonical_texts
│   ├── bilingual_transcripts
│   ├── qa_knowledge_pairs
│   └── vector_embeddings_snapshots
│
├── 06_ANALYTICS
│   ├── daily_telemetry_parquets
│   ├── monthly_cohort_summaries
│   └── engagement_waterfalls
│
├── 07_VERIFICATION
│   ├── epistemic_provenance_evidence
│   ├── lineage_certificates
│   └── academic_peer_reviews
│
├── 08_ADMIN
│   ├── pitch_decks_and_investor_reports
│   ├── legal_statutory_filings
│   └── partner_agreements
│
├── 09_BACKUPS
│   ├── supabase_schema_snapshots
│   ├── migration_manifests
│   └── automated_dr_archives
│
└── 10_EXPORTS
    ├── public_research_releases
    └── academic_datasets
```

---

## 5. Privacy, DPDP Act 2023 & Security Controls

> [!CAUTION]
> **Zero Raw PII in Google Drive**: A common failure of bootstrapped startups using Drive/Sheets is dumping raw user spreadsheets, plaintext contact information, or sensitive KYC docs onto cloud folders. EKA must maintain institutional-grade privacy from Day 1.

### Mandatory Compliance Rules
1. **Never Stored in Drive:**
   - User passwords, cryptographic hashes, or password reset tokens.
   - Active Supabase Auth tokens, session JWTs, or OAuth refresh tokens.
   - Bank accounts, PAN, Aadhaar, Razorpay payment tokens, or credit card numbers.
   - Unencrypted private messages or direct member-to-member sensitive discourses.
2. **DPDP Act (Digital Personal Data Protection Act, 2023 - India) Alignment:**
   - **Purpose Limitation:** Media assets uploaded by users are processed solely for publication under the selected visibility tier.
   - **Consent-Driven Ingestion:** Creator and user content is never funneled into the AI training corpus without affirmative epistemic consent flags (`allow_ai_training: true` stored in Postgres).
   - **Right to Erasure (Tombstoning):** Deleting a user in Supabase initiates an automated webhook that purges their assets from `/01_USERS` in Drive or anonymizes public cultural contributions.
3. **Drive Access Control via Service Account Proxy:**
   - The Google Drive folder is **NOT publicly writable** and is not shared with end users.
   - End users interact exclusively with the EKA backend API.
   - The EKA backend server uses a dedicated Google Cloud Service Account with scoped permissions (`https://www.googleapis.com/auth/drive.file`).
   - For public assets (e.g., verified temple photos), the backend generates direct cached proxy URLs or CDN edge rewrites.

---

## 6. Performance, Latency & Drive API Quotas Mitigation

Google Drive is designed as an enterprise document vault, not a microsecond-latency static CDN. To serve $\le 5,000$ users smoothly without hitting rate limits or lag:

### 1. Drive API Rate Limits
- Standard limit: 12,000 requests per 100 seconds per project.
- Upload limit: 750 GB/day per account.
*At 5,000 users, EKA will consume $<1.5\%$ of these quotas provided direct Drive reads are NOT triggered on every page load.*

### 2. Client-Side Serving Strategy (3-Tier Cache)
```
User Requests Media (EKA-MED-009214)
                   │
                   ▼
       1. Browser Cache (Cache-Control: public, max-age=86400)
                   │ (Miss)
                   ▼
       2. Edge CDN / Worker Proxy (Cloudflare / Vercel Edge Cache)
                   │ (Miss)
                   ▼
       3. EKA Server Proxy (Drive Web Content Link / Streaming Pipe)
```

1. **Thumbnails:** Compressed WebP thumbnails (150KB–300KB) are generated during upload and cached aggressively at edge endpoints.
2. **Database Metadata First:** The client queries Supabase (`GET /posts`). Supabase immediately responds with structured JSON containing titles, author info, and pre-computed media URLs. The page renders instantaneously.
3. **Asynchronous Binary Streaming:** Video/audio players stream binaries on demand via Range headers rather than blocking component mount.

---

## 7. Migration Readiness: Post-Funding Cutover Blueprint

When EKA raises institutional funding and transitions to enterprise cloud storage (e.g., Cloudflare R2, S3, or GCS):
1. **Zero Database Schema Changes:** Because the schema utilizes `eka_id` and generic `storage_assets` pointers rather than raw Drive URLs, no business logic or relational foreign keys change.
2. **Background Sync Worker:** A simple script reads rows where `storage_provider = 'google_drive'`, streams the binary from Drive to R2/S3, and updates `storage_provider = 'cloudflare_r2'` and `cdn_cached_url = 'https://media.eka.io/...'`.
3. **Zero Downtime:** Reads fall back to `google_drive` if `storage_provider` hasn't migrated, allowing an incremental, zero-downtime background migration.
