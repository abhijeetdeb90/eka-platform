# EKA Local Knowledge Library

Converted from the supplied EKA Excel master datasets.

## Structure

- `cultural_intelligence/` — 7 structured cultural-data Markdown files.
- `question_bank/` — question bank split into small ~500-question chunks.
- `index/README.md` — retrieval map.

## Intended use

These files are LOCAL DATA, not application code.

Antigravity should:
- store them inside the EKA local knowledge/data directory;
- index/search them;
- retrieve only relevant files/sections;
- pass only relevant records to the AI layer;
- keep the library out of the frontend bundle.

Do not paste the full contents into Antigravity's implementation prompt.
