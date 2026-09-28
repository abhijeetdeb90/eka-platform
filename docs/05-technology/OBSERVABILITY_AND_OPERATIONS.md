> Canonical EKA documentation. Source of truth for product, architecture, trust and delivery decisions.
> Versioning: v0.1, v0.2, v1.0. Mark assumptions as `ASSUMPTION` and unresolved decisions as `OPEN`.
> Never store passwords, API keys, tokens, private user data or production secrets in this repository.

# Operations and Incident Response

## Operational documents

- Deployment runbook
- Rollback runbook
- Backup/restore runbook
- Access review procedure
- Content escalation procedure
- Data deletion request procedure
- Security incident procedure
- Vendor outage procedure

## Incident levels

P0: active compromise, major data exposure, or critical outage.
P1: significant feature or trust-system failure.
P2: limited user impact.
P3: minor issue or improvement.

## Incident lifecycle

Detect → Triage → Contain → Communicate → Recover → Review → Prevent recurrence.

---

# Testing and Release Plan

## Test layers

- Unit tests
- Integration tests
- API contract tests
- Database permission tests
- End-to-end user journey tests
- Accessibility tests
- Performance tests
- Security tests
- Abuse and moderation tests
- Backup and restore tests

## Critical test cases

- User cannot access another user's private data.
- Unauthenticated user cannot perform privileged actions.
- Deleted/restricted content is handled consistently.
- Review actions are logged.
- Payment webhook cannot be replayed to duplicate a transaction.
- Malicious uploads are rejected or isolated.
- AI output cannot bypass authorization.
- Database migrations can be applied and rolled back safely where supported.

## Release stages

Local → Internal preview → Closed alpha → Limited beta → Public MVP.
