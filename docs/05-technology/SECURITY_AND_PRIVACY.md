> Canonical EKA documentation. Source of truth for product, architecture, trust and delivery decisions.
> Versioning: v0.1, v0.2, v1.0. Mark assumptions as `ASSUMPTION` and unresolved decisions as `OPEN`.
> Never store passwords, API keys, tokens, private user data or production secrets in this repository.

# Security and Data Protection

## Baseline controls

- MFA for privileged users
- Strong authentication policies
- Role-based access control
- Row-level security
- Server-side validation
- Secrets stored in a secret manager
- HTTPS
- Dependency updates
- Rate limiting
- Backups and restore tests
- Audit logging
- Security headers
- Restricted admin access
- Data minimization
- Defined retention and deletion processes

## Threat areas

- Account takeover
- Privilege escalation
- Data leakage
- Insecure direct object references
- Prompt injection through user content
- Malicious uploads
- Spam and automated abuse
- Payment/webhook fraud
- Supply-chain vulnerabilities
- Insider misuse

## Release gate

No production launch without access-control testing, secret review, backup verification, logging, abuse controls, and incident response contacts.

---

# Authentication, Roles, and Permissions

## Roles

- Visitor
- Registered User
- Creator
- Verified Practitioner/Expert
- Community Contributor
- Moderator
- Reviewer
- Support
- Admin
- Founder/Owner

## Permission principles

- Default deny.
- Grant only required permissions.
- Separate content review from user account administration where possible.
- Privileged actions require re-authentication or MFA.
- Use scoped permissions instead of a single all-powerful admin role.
- Review access periodically.

## Example permissions

`content.create`, `content.edit_own`, `content.submit_review`, `content.review`, `content.publish`, `content.remove`, `user.suspend`, `audit.read`, `billing.manage`, `integration.manage`.
