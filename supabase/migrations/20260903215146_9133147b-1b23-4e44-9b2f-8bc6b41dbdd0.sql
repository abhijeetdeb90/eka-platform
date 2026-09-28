ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS age_bracket text,
  ADD COLUMN IF NOT EXISTS region text,
  ADD COLUMN IF NOT EXISTS language text,
  ADD COLUMN IF NOT EXISTS religion text,
  ADD COLUMN IF NOT EXISTS community_background text,
  ADD COLUMN IF NOT EXISTS purposes text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS standards_version text,
  ADD COLUMN IF NOT EXISTS standards_accepted_at timestamptz;

COMMENT ON COLUMN public.profiles.religion IS 'Optional, member-supplied. Never used in moderation decisions.';
COMMENT ON COLUMN public.profiles.community_background IS 'Optional, member-supplied. Never used in moderation decisions.';