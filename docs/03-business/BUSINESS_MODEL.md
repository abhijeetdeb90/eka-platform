> Canonical EKA documentation. Source of truth for product, architecture, trust and delivery decisions.
> Versioning: v0.1, v0.2, v1.0. Mark assumptions as `ASSUMPTION` and unresolved decisions as `OPEN`.
> Never store passwords, API keys, tokens, private user data or production secrets in this repository.

# Payments and Monetization

## Potential models

- Creator subscriptions
- Paid educational experiences
- Platform service fees
- Brand and business tools
- Sponsored discovery with disclosure
- Marketplace or booking commissions
- Premium research/knowledge tools

## MVP rule

Do not build complex monetization before validating repeat usage and creator value.

## Payment controls

- Use a compliant payment provider.
- Verify webhooks server-side.
- Use idempotency keys.
- Never trust client-side payment status.
- Maintain transaction and refund records.
- Separate platform fees from creator earnings.
- Document tax, invoicing, KYC/KYB, and regulatory requirements with qualified professionals.
