# EKA Cultural Intelligence — Antigravity_Schema

> Source: EKA_Cultural_Intelligence_Master_Dataset.xlsx
> Role: Local retrievable knowledge asset. Do not embed wholesale into prompts or frontend code.

**Records:** 18  
**Fields:** 4

## Schema

| Field | Type |
|---|---|
| `Field` | `object` |
| `Type` | `object` |
| `Example` | `object` |
| `Implementation Rule` | `object` |

## Records

### Record 1
- **Field:** entity_id
- **Type:** String
- **Example:** eka_lang_0001
- **Implementation Rule:** Stable unique ID; never use display name as primary key

### Record 2
- **Field:** entity_type
- **Type:** Enum
- **Example:** language \| religion \| culture \| tradition \| ritual \| festival \| place \| craft \| food \| story
- **Implementation Rule:** Controls rendering and graph relationships

### Record 3
- **Field:** parent_id
- **Type:** String
- **Example:** eka_rel_0001
- **Implementation Rule:** Links entity to parent node

### Record 4
- **Field:** name
- **Type:** String
- **Example:** Hindi
- **Implementation Rule:** Primary display name

### Record 5
- **Field:** aliases
- **Type:** Array
- **Example:** हिन्दी; Hindī
- **Implementation Rule:** Alternate names/scripts

### Record 6
- **Field:** region
- **Type:** String
- **Example:** India / North India
- **Implementation Rule:** Geographic scope

### Record 7
- **Field:** community
- **Type:** String
- **Example:** Hindi-speaking communities
- **Implementation Rule:** Community association

### Record 8
- **Field:** description
- **Type:** Text
- **Example:** Plain-language 1–3 sentence explanation
- **Implementation Rule:** Keep consumer-facing copy simple

### Record 9
- **Field:** traditions
- **Type:** Array
- **Example:** Diwali; Holi; ...
- **Implementation Rule:** Related practices

### Record 10
- **Field:** knowledge_objects
- **Type:** Array
- **Example:** festival; ritual; food; craft; place
- **Implementation Rule:** What users can explore

### Record 11
- **Field:** image_search_prompt
- **Type:** Text
- **Example:** ...
- **Implementation Rule:** Use for web/image search

### Record 12
- **Field:** image_generation_prompt
- **Type:** Text
- **Example:** ...
- **Implementation Rule:** Use for synthetic supporting visual; never imply generated image is documentary evidence

### Record 13
- **Field:** source_status
- **Type:** Enum
- **Example:** Seed \| Verified \| Community-reviewed
- **Implementation Rule:** Trust state

### Record 14
- **Field:** sensitivity
- **Type:** Enum
- **Example:** Public \| Context-sensitive \| Restricted
- **Implementation Rule:** Controls publishing workflow

### Record 15
- **Field:** verification_notes
- **Type:** Text
- **Example:** ...
- **Implementation Rule:** Required for religion/indigenous/sacred content

### Record 16
- **Field:** language_tags
- **Type:** Array
- **Example:** en; hi; ...
- **Implementation Rule:** Localization

### Record 17
- **Field:** country_tags
- **Type:** Array
- **Example:** IN; NP; ...
- **Implementation Rule:** Country filters

### Record 18
- **Field:** status
- **Type:** Enum
- **Example:** Draft \| Review \| Published \| Archived
- **Implementation Rule:** CMS lifecycle
