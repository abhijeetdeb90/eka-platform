# EKA Local Knowledge Index

Use this index for targeted retrieval. Do not load the complete library into an AI prompt.

## Cultural Intelligence Files

- `cultural_intelligence/Antigravity_Schema.md`
- `cultural_intelligence/Culture_Communities.md`
- `cultural_intelligence/Global_Languages.md`
- `cultural_intelligence/Image_Prompt_Library.md`
- `cultural_intelligence/India_Languages.md`
- `cultural_intelligence/README.md`
- `cultural_intelligence/Religions_Traditions.md`

## AI Question Bank Chunks

- `question_bank/Sheet1_chunk_01.md`
- `question_bank/Sheet1_chunk_02.md`
- `question_bank/Sheet1_chunk_03.md`
- `question_bank/Sheet1_chunk_04.md`
- `question_bank/Sheet1_chunk_05.md`
- `question_bank/Sheet1_chunk_06.md`
- `question_bank/Sheet1_chunk_07.md`
- `question_bank/Sheet1_chunk_08.md`
- `question_bank/Sheet1_chunk_09.md`
- `question_bank/Sheet1_chunk_10.md`
- `question_bank/Sheet1_chunk_11.md`
- `question_bank/Sheet1_chunk_12.md`
- `question_bank/Sheet1_chunk_13.md`
- `question_bank/Sheet1_chunk_14.md`
- `question_bank/Sheet1_chunk_15.md`
- `question_bank/Sheet1_chunk_16.md`
- `question_bank/Sheet1_chunk_17.md`
- `question_bank/Sheet1_chunk_18.md`
- `question_bank/Sheet1_chunk_19.md`
- `question_bank/Sheet1_chunk_20.md`

## Retrieval Protocol & Architecture

```
User Query
   ↓
Query Classifier (Zero-token domain, intent & entity detection)
   ↓
Local Index Search (Pointers to line ranges in chunks)
   ↓
Targeted Markdown Reader (Streams ONLY matched lines from disk)
   ↓
Targeted Context (< 500 tokens input payload)
   ↓
AI Synthesis (Gemini Flash / Local Fallback)
   ↓
EKA Response (Story / Card / Reel presentation)
```

## Generated Index Files

- `index/catalog.json` — Manifest of all indexed files, chunk byte sizes, and record statistics.
- `index/question_index.json` — Compact metadata pointers (`id`, `q`, `d`, `i`, `file`, `start`, `end`) for 10,000 questions (~2.2 MB on disk).
- `index/cultural_index.json` — Pointers and keyword map for 246 cultural intelligence records (~238 KB on disk).
- `index/flagged_records.json` — Moderation and community verification review flags for Founder/Admin panel.

## Key Rules

1. Classify the request by domain and intent.
2. Search lightweight memory/JSON index for exact line offsets.
3. Stream ONLY the matched line ranges from disk.
4. Pass only minimal retrieved context (< 500 tokens) to the AI.
5. Never inject the complete library into the system prompt.
6. Keep these files outside the frontend bundle.