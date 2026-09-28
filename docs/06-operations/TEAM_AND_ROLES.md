> Canonical EKA documentation. Source of truth for product, architecture, trust and delivery decisions.
> Versioning: v0.1, v0.2, v1.0. Mark assumptions as `ASSUMPTION` and unresolved decisions as `OPEN`.
> Never store passwords, API keys, tokens, private user data or production secrets in this repository.

# Admin Operating Model

## Admin areas

- User management
- Creator verification
- Content review
- Reports and appeals
- Taxonomy management
- Source management
- Analytics
- Feature flags
- Integration health
- Audit logs

## Admin principles

- Every sensitive action is attributable.
- Admin interfaces must not expose secrets.
- Bulk actions require confirmation and safeguards.
- Use least privilege and role separation.
- Build exportable reports.
- Keep an immutable or protected audit history for critical actions.
