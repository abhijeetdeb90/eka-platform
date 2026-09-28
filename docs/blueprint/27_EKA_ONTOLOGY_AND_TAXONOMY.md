# EKA — Ontology & Controlled Taxonomy (v1.0)

**Document ID:** KNOW-003 / 27_EKA_ONTOLOGY_AND_TAXONOMY.md  
**Status:** APPROVED  
**Classification:** Core Semantic Architecture  
**Role:** The Bridge between Knowledge Model, Graph Queries, and AI Context APIs

---

## 1. Taxonomic Hierarchy

To enable programmatic retrieval by downstream AI agents, recommendation algorithms, and enterprise queries, EKA organizes all cultural and sacred knowledge under a unified taxonomy:

```
Culture
├── Tradition
│   ├── Philosophy / Worldview (e.g. Advaita, Theravada, Sufism)
│   ├── Practice / Contemplation (e.g. Dhyana, Vipassana, Hesychasm)
│   ├── Ritual / Ceremony (e.g. Aarti, Puja, Havans, Mass)
│   ├── Festival / Observance (e.g. Diwali, Vesak, Yom Kippur, Eid)
│   └── Canon / Text (e.g. Upanishads, Tipitaka, Hadith)
│
├── Community
│   ├── Lineage / Sect / Sampradaya
│   ├── Cultural Ethno-Linguistic Group
│   └── Diasporic / Syncretic Circle
│
├── Geography & Sacred Locus
│   ├── Country / Civilizational Basin
│   ├── State / Province
│   ├── Sacred City / Valley
│   └── Micro-Locality / Ghat / Hill
│
├── Place & Heritage Architecture
│   ├── Religious Sanctum (Temple, Monastery, Mosque, Church, Gurdwara)
│   ├── Historical Monument
│   ├── Natural Sanctuary (Sacred Grove, Sacred Peak, Confluence / Tirtha)
│   └── Cultural Assembly / Ashram
│
├── Intangible Cultural Heritage
│   ├── Sacred Food Lineage & Prasada
│   ├── Traditional Craft & Textiles (e.g. Kanchipuram Weaving, Thangka Painting)
│   ├── Sacred Music, Chant & Hymnody (e.g. Dhrupad, Qawwali, Gregorian Chant)
│   └── Sacred Language & Script (e.g. Sanskrit, Pali, Classical Tamil, Aramaic)
│
└── Economic & Living Context
    ├── Verified Practitioner / Pandit / Guide
    ├── Cultural Heritage Organization
    ├── Authentic Artisan / Local Business
    └── Immersive Sacred Journey / Pilgrimage Route
```

---

## 2. Machine-Readable Semantic Predicates

Every connection in EKA utilizes standardized RDF/OWL-compatible predicates:

- `is_instance_of`: Entity $\longrightarrow$ Taxonomy Node
- `preserves_tradition`: Community $\longrightarrow$ Tradition
- `commemorates_event`: Festival $\longrightarrow$ Historical / Mythic Event
- `anchored_at_place`: Monument $\longrightarrow$ Geo-Coordinates
- `originates_from_era`: Practice $\longrightarrow$ Chronological Period
- `derived_from_text`: Ritual $\longrightarrow$ Canonical Scripture
- `practiced_by_lineage`: Practice $\longrightarrow$ Community
- `authoritative_commentary_by`: Text $\longrightarrow$ Scholar / Thinker
