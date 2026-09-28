> Canonical EKA documentation. Source of truth for product, architecture, trust and delivery decisions.
> Versioning: v0.1, v0.2, v1.0. Mark assumptions as `ASSUMPTION` and unresolved decisions as `OPEN`.
> Never store passwords, API keys, tokens, private user data or production secrets in this repository.

# AI Governance and Prompt Security

## Approved AI use cases

- Content summarization with clear labeling
- Metadata suggestions
- Translation assistance
- Related-content suggestions
- Moderation triage
- Search assistance
- Draft improvement

## Restricted use cases

- Declaring religious or cultural authenticity
- Making medical, legal, or financial determinations
- Automatically removing disputed cultural claims without review
- Inferring sensitive personal attributes
- Generating fabricated citations or sources

## Controls

- Validate and sanitize model outputs.
- Treat retrieved/user content as untrusted.
- Protect system prompts and credentials.
- Log model/version/prompt template metadata where appropriate.
- Provide human review for high-impact decisions.
- Create evaluation datasets and red-team tests.
