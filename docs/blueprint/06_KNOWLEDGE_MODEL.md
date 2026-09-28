# EKA — Knowledge Model & Atomic Object Specification (v1.0)

**Document ID:** KNOW-002 / 06_KNOWLEDGE_MODEL.md  
**Status:** APPROVED  
**Classification:** Core Data Architecture  
**Prerequisite For:** Database Schema, Graph Construction, Context API

---

## 1. The Core Architectural Philosophy

EKA does not treat cultural and spiritual knowledge as unstructured blobs of user posts. In EKA, every piece of insight, practice, or heritage is modeled as an **Atomic Knowledge Object**.

### The Strict Categorical Separation

To prevent misinformation, dogmatic conflict, and historical flattening, EKA enforces a machine-readable distinction between five epistemic tiers:

1. **Documented Tradition:** Supported by primary canonical scriptures, historical chronicles, inscriptions, or peer-reviewed archaeological records.
2. **Interpretation:** A hermeneutic, theological, or philosophical explanation offered by an identified scholar, lineage, or school.
3. **Opinion & Subjective Reflection:** An individual member's personal lived experience or spiritual insight.
4. **Living Community Practice:** Regional folkways, oral customs, and celebrations observed by living communities, distinct from formal texts.
5. **Modern Adaptation:** Contemporary reinterpretations, wellness syncretisms, or novel artistic expressions.

---

## 2. Canonical Knowledge Object Schema

```json
{
  "$schema": "https://eka.earth/schemas/v1/knowledge-object.json",
  "id": "ko_8f93e1b7",
  "title": "Evening Sandhya & Gayatri Meditation",
  "type": "Practice",
  "epistemic_tier": "documented_tradition",
  "summary": "The twilight contemplative ritual connecting breath, solar transitions, and Vedic contemplation.",
  "tradition": "Vedic / Sanatana Dharma",
  "community": "Smartha / Brahminical & Universal Adapters",
  "geography": {
    "origin_region": "Indo-Gangetic Plain",
    "cultural_locus": "South Asia",
    "global_diaspora": true
  },
  "language": {
    "liturgical": "Sanskrit",
    "vernacular": ["Hindi", "Tamil", "Kannada", "Telugu"]
  },
  "time_period": {
    "historical_era": "Vedic Period (c. 1500–500 BCE)",
    "continuity": "Active Living Practice"
  },
  "provenance": {
    "source_type": "canonical_scripture",
    "primary_references": [
      {
        "title": "Rigveda Samhita",
        "citation": "Mandala 3, Sukta 62, Verse 10",
        "access_uri": "urn:cts:sktlit:rigveda.3.62.10"
      }
    ],
    "secondary_evidence": ["Taittiriya Aranyaka 2.11"],
    "contributor_id": "usr_99a82b",
    "confidence_score": 0.98,
    "last_reviewed_at": "2026-09-01T08:00:00Z"
  },
  "verification": {
    "level": 4,
    "expert_reviews": [
      {
        "reviewer_id": "rev_vedic_studies_01",
        "affiliation": "National Sanskrit University",
        "status": "endorsed",
        "notes": "Accurately represents both Vedic canonical citations and regional living variations."
      }
    ],
    "community_confirmations": 42,
    "dispute_count": 0
  },
  "interpretations": [
    {
      "school": "Advaita Vedanta (Adi Shankara)",
      "explanation": "Gayatri as contemplation of the non-dual illumination of the inner intellect (Buddhi)."
    },
    {
      "school": "Arya Samaj (Swami Dayananda)",
      "explanation": "Universal prayer accessible to all human beings regardless of caste or gender."
    }
  ],
  "relationships": {
    "associated_texts": ["Rigveda", "Upanishads"],
    "related_places": ["Varanasi", "Rishikesh", "Kanchipuram"],
    "related_practices": ["Pranayama", "Japa"],
    "related_festivals": ["Upakarma", "Gayatri Jayanti"]
  },
  "version": "1.0",
  "updated_at": "2026-09-26T12:00:00Z"
}
```

---

## 3. Epistemic Guardrails for Frontend & API

- **No Unsubstantiated Absolutes:** If an object is an `interpretation`, the UI and API response MUST label it: `"Interpretation by [Tradition/Scholar]"` and cannot present it as universal doctrine.
- **Non-Medical / Non-Supernatural Enforcement:** Any claim promising physiological cure, financial enrichment, or guaranteed divine reward is automatically flagged as `unverified_claim` and denied `verified_tradition` tier.
- **Immutable Audit Trail:** All edits, citations additions, and review dispute logs are stored in append-only logs for provenance integrity.
