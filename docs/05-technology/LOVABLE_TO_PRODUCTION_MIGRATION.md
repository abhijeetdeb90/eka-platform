> Canonical EKA documentation. Source of truth for product, architecture, trust and delivery decisions.
> Versioning: v0.1, v0.2, v1.0. Mark assumptions as `ASSUMPTION` and unresolved decisions as `OPEN`.
> Never store passwords, API keys, tokens, private user data or production secrets in this repository.

# Lovable to Production Migration

## Phase 1: Stabilize

- Connect repository to version control.
- Export and document current code/configuration.
- Identify generated versus custom code.
- Inventory dependencies and environment variables.
- Remove test secrets and demo data.

## Phase 2: Separate environments

- Development
- Staging
- Production

Each environment must have separate credentials, databases or isolated schemas, storage, and analytics configuration as appropriate.

## Phase 3: Harden

- Review authentication and RLS.
- Add migrations.
- Move sensitive logic server-side.
- Add error tracking and logs.
- Add backups and restore testing.
- Document deployment and rollback.

## Phase 4: Scale

- Extract background jobs.
- Introduce service adapters.
- Improve search.
- Add caching only where measured.
- Establish ownership for on-call and incident response.
