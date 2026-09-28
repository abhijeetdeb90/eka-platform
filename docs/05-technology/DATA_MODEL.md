> Canonical EKA documentation. Source of truth for product, architecture, trust and delivery decisions.
> Versioning: v0.1, v0.2, v1.0. Mark assumptions as `ASSUMPTION` and unresolved decisions as `OPEN`.
> Never store passwords, API keys, tokens, private user data or production secrets in this repository.

# Domain Model

## Core entities

User, Profile, Role, Permission, Creator, Community, Content, ContentVersion, Source, Citation, Entity, EntityRelation, Topic, Place, MediaAsset, Comment, Reaction, Save, Report, Review, ModerationAction, Notification, Subscription, Transaction, AuditEvent, Integration, FeatureFlag.

## Relationship examples

- Content has many ContentVersions.
- Content references many Sources through Citations.
- Content may relate to many Entities.
- User creates Content.
- Community can contribute ContextContribution.
- Content can have Reports and Reviews.
- Every privileged action produces an AuditEvent.

## Design rule

Separate stable entities from user-generated content. Avoid embedding all information in one post table. Preserve history rather than overwriting trust-sensitive information.

---

# Database Schema Blueprint

## Suggested core tables

- users
- profiles
- roles
- permissions
- user_roles
- creators
- communities
- entities
- entity_relations
- content
- content_versions
- sources
- citations
- media_assets
- comments
- reactions
- saves
- reports
- reviews
- moderation_actions
- notifications
- audit_events
- integrations
- feature_flags

## Mandatory design controls

- UUID or equivalent non-guessable identifiers
- Created/updated timestamps
- Soft deletion where appropriate
- Foreign keys
- Unique constraints
- Indexes based on query patterns
- Row-level access policies
- Data retention rules
- Migration files under version control

## Never store

- Plaintext passwords
- API keys
- Payment secrets
- Unnecessary identity documents
- Sensitive data without a documented legal and product need

---

# API Contracts

## API rules

- Version APIs.
- Validate all input server-side.
- Enforce authorization server-side.
- Return consistent error formats.
- Apply rate limits.
- Log request identifiers, not secrets.
- Use idempotency for payment and other retry-sensitive operations.

## Initial API groups

- `/auth`
- `/profiles`
- `/content`
- `/sources`
- `/entities`
- `/search`
- `/comments`
- `/reports`
- `/reviews`
- `/creator`
- `/admin`
- `/analytics`
- `/integrations`

## Example response envelope

```json
{
  "data": {},
  "meta": { "request_id": "..." },
  "error": null
}
```

## API documentation requirement

Every endpoint must specify authentication, authorization, request schema, response schema, validation, rate limits, error states, and audit requirements.
