# EKA security & ops follow-ups

Status after money-route auth cutover (2026-10-16).

## Done in production

- Edge middleware + route auth on money APIs (Bearer required)
- Production alias pointed at GitHub security builds (not stale CLI deploys)
- Public `GET /api/subscriptions` plan catalog restored
- Checkout client uses `authenticatedFetch` for create-order / verify-payment

## Manual (dashboard) — do these next

### 1. Supabase — leaked password protection

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → project **kbiutqzhcbyuseygcspe** (prod)
2. **Authentication** → **Providers** / **Security** (or Auth settings)
3. Enable **Leaked password protection** (Have I Been Pwned check)
4. Save

### 2. Razorpay env vars (Vercel)

Production currently has **no** `RAZORPAY_*` keys in project env. Checkout will auth-pass then fail order creation until set:

| Key | Target | Notes |
|-----|--------|--------|
| `RAZORPAY_KEY_ID` | Production + Preview | Server order create |
| `RAZORPAY_KEY_SECRET` | Production + Preview | Server only; never `VITE_` |
| `VITE_RAZORPAY_KEY_ID` | Production + Preview | Client checkout.js |

After setting keys: redeploy production and **Promote / assign alias** `eka-platform.vercel.app` to the new deployment.

### 3. Migration drift

Repo: `supabase/migrations/` (~53 files). Apply on **staging first**, then prod.

```bash
# From machine with supabase CLI linked to staging
supabase link --project-ref <staging-ref>
supabase db push
# Verify, then link prod and push with explicit approval
```

Do **not** blind-push large historical migrations to prod without review.

### 4. Smoke-test junk rows

Unauthenticated probes may have written creator profiles when the hole was open. In SQL editor (service role):

```sql
-- Inspect first
SELECT id, user_id, email, created_at
FROM creators
WHERE user_id IN (
  'attacker', 'attacker2', 'probe', 'curl-test', 'gate', 'hc', 'mw', 'x', 'post-alias'
)
OR email = 'x@x.com';

-- Delete only after review
-- DELETE FROM creators WHERE user_id IN (...);
```

In-memory-only profiles die on cold start and need no cleanup.

### 5. Production alias discipline

**Problem:** `vercel deploy --prod` (CLI) pinned `eka-platform.vercel.app` to an old deploy while GitHub builds stayed READY but unaliased.

**Rule:** Prefer GitHub pushes to `main`. After each production deploy, confirm in Vercel → Deployments that **eka-platform.vercel.app** maps to the latest commit. If not: **Promote** or assign alias to that deployment.

### 6. Frontend Bearer pattern

Use:

```ts
import { authenticatedFetch } from "@/lib/api/authenticated-fetch";

await authenticatedFetch("/api/payouts", {
  method: "POST",
  body: JSON.stringify({ action: "check_eligibility" }),
});
```

Any new money UI must use this helper (or equivalent session header).
