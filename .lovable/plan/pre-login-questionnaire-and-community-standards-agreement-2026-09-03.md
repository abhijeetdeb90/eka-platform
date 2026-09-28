# Pre-login questionnaire and Community Standards Agreement

Today someone lands on `/auth`, creates an account, and only then meets onboarding (name, intentions, interests, people, Sanghas) inside the app. This adds the pre-login layer you described, keeps the wording as an agreement rather than an oath, and makes enforcement concrete and appealable.

New flow:

```text
Landing  →  /join questionnaire  →  Community Standards Agreement  →  /auth  →  EKA
             (steps 1-3, no account needed)      (step 4, explicit checkbox)
```

Answers are held on the device while the person is signing up, then written to their profile the moment the account exists. Nobody has to re-type anything after sign-up, and abandoning halfway costs nothing.

## Step 1 — Basic profile

Display name, age bracket (18–24, 25–34, 35–44, 45–54, 55+), country/region, language preference, optional photo. The photo is optional and can be skipped without friction; it uploads after the account is created, since storage needs a signed-in owner.

## Step 2 — Community context (optional)

Religion or path, and community/cultural background — both optional, both with an explicit "Prefer not to say", both preceded by a plain-language note:

> This is optional. Share it only if you are comfortable. It helps us show you conversations and traditions you may care about. It is never used in moderation decisions, and you can change or clear it any time in Settings.

These fields are stored separately from anything moderation touches, and are excluded from moderation and admin views by design.

## Step 3 — Purpose

"What brings you to EKA?" — Learn, Discuss ideas, Meet people, Build community, Share knowledge, Other (free text). Multi-select. This feeds the existing feed and Explore personalisation the same way interests already do.

## Step 4 — Community Standards Agreement

Not called an oath. A short, concrete agreement, shown in full, with one required checkbox:

> I agree to participate in EKA without spreading hatred or encouraging violence against people based on religion, caste, community, ethnicity, nationality, gender, or other protected characteristics. I understand that harassment, threats, targeted hate, or repeated violations of EKA's community standards may result in content removal, suspension, or a permanent ban.

☐ I understand and agree to EKA's Community Standards.

Directly beneath it, the enforcement ladder stated plainly rather than as a vague promise:

**Warning → Content removal → Temporary restriction (24h / 7d / 30d) → Permanent ban**

with a line that every step can be appealed and is reviewed by a person, linking to the appeal flow that already exists. The agreement version and the time it was accepted are recorded, so a future revision can ask again instead of assuming consent.

## Public Community Standards page

A public `/standards` page carrying the same text, the ladder, what is and is not removed, and how appeals work — linked from the questionnaire, the footer, Settings, and the auth page. Trust and safety should be readable before signing up, not only after.

## Trust and safety signals, not identity screening

Per your note, none of the optional identity fields gate anything. The signals that actually matter are behavioural and already partly in place: account age, agreement acceptance, report history, appeal outcomes, completion and constructive-reaction quality. The agreement acceptance record joins those, so a moderator sees "agreed to v1 standards, no prior actions" rather than anything about who someone is.

## After sign-up

On first authenticated load, saved answers are written to the profile and the local copy is cleared. The existing in-app onboarding then continues from where the questionnaire stopped — it skips the name step when the questionnaire already collected it, and goes straight to interests, people and Sanghas. Settings gains an editable section for age bracket, region, language, and the two optional context fields, including clearing them.

## Technical notes

- Migration: add to `profiles` — `age_bracket`, `region`, `language`, `religion`, `community_background`, `purposes text[]`, `standards_version`, `standards_accepted_at`. All nullable/defaulted; existing rows unaffected. Owner-scoped policies already cover `profiles`; no new grants needed beyond the existing table grants.
- New public routes: `src/routes/join.tsx` (four-step questionnaire, `ssr: false`, progress bar, resumable from `localStorage` under `eka.join.progress`) and `src/routes/standards.tsx` (static, SSR on, own `head()` metadata).
- `src/lib/join.ts`: the answer shape, validation with zod (name length, required agreement, purpose non-empty), local persistence, and `applyJoinAnswers()` which writes to the profile after sign-up.
- `/auth` gains a "signing up as …" summary line and blocks account creation when the agreement was not accepted, so the checkbox cannot be bypassed by navigating straight to `/auth`.
- `src/routes/_authenticated/app.tsx` calls `applyJoinAnswers()` once after mount; `app.onboarding.tsx` skips the name step when a display name already arrived from the questionnaire.
- Landing page and footer link to `/join` instead of `/auth` for the primary "Get started" action; "Sign in" still goes to `/auth`.
- Analytics: `join_started`, `join_step_completed`, `standards_accepted`.
