> Canonical EKA documentation. Source of truth for product, architecture, trust and delivery decisions.
> Versioning: v0.1, v0.2, v1.0. Mark assumptions as `ASSUMPTION` and unresolved decisions as `OPEN`.
> Never store passwords, API keys, tokens, private user data or production secrets in this repository.

# Technical Architecture

## Initial target architecture

- Frontend: Lovable-generated application, maintained in GitHub.
- Hosting: production frontend platform such as Vercel, subject to final evaluation.
- Database/Auth/Storage: Supabase PostgreSQL, Auth, Storage, and Row Level Security.
- Background processing: worker/queue service such as Railway or equivalent.
- Search: PostgreSQL full-text search initially; pgvector or dedicated search later if validated.
- AI orchestration: server-side service with provider abstraction.
- Observability: structured logs, error tracking, uptime monitoring, and audit logs.

## Architectural principles

- Keep business logic out of the client.
- Use service boundaries for AI, payments, notifications, and search.
- Treat third-party services as replaceable adapters.
- Keep environment-specific configuration outside source code.
- Maintain database migrations in version control.
- Use least privilege.
- Design for export and migration.

## High-level flow

Client → Authenticated API/server functions → Authorization → Domain service → Database/storage/external adapter → Audit/observability.
