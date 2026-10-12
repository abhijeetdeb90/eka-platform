-- EKA creator platform foundation
-- Additive migration: preserves existing posts/authentication and never records fake payments.
create extension if not exists pgcrypto;

alter table public.posts
  add column if not exists media_kind text not null default 'image',
  add column if not exists thumbnail_url text,
  add column if not exists caption_text text,
  add column if not exists subtitle_url text,
  add column if not exists language text,
  add column if not exists location_label text,
  add column if not exists state_region text,
  add column if not exists country text,
  add column if not exists community_tag text,
  add column if not exists format text not null default 'short',
  add column if not exists is_premium boolean not null default false,
  add column if not exists premium_price_paise integer,
  add column if not exists sponsored_disclosure text,
  add column if not exists published_at timestamptz;

alter table public.posts drop constraint if exists posts_media_kind_check;
alter table public.posts add constraint posts_media_kind_check
  check (media_kind in ('video','image','carousel','article'));
alter table public.posts drop constraint if exists posts_format_check;
alter table public.posts add constraint posts_format_check
  check (format in ('short','long','guide','course','collection'));
alter table public.posts drop constraint if exists posts_premium_price_check;
alter table public.posts add constraint posts_premium_price_check
  check (premium_price_paise is null or premium_price_paise >= 0);
create index if not exists posts_creator_published_idx
  on public.posts (author_id, published_at desc);
create index if not exists posts_video_discovery_idx
  on public.posts (media_kind, status, published_at desc);

-- One active creator subscription per subscriber/creator pair; payment status is
-- only advanced by a verified server-side payment integration.
create table if not exists public.creator_subscriptions (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references auth.users(id) on delete cascade,
  creator_id uuid not null references auth.users(id) on delete cascade,
  amount_paise integer not null check (amount_paise > 0),
  currency text not null default 'INR' check (currency = 'INR'),
  interval text not null default 'month' check (interval in ('month','year')),
  status text not null default 'pending' check (status in ('pending','active','cancelled','past_due','refunded')),
  provider text not null default 'unconfigured',
  provider_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (subscriber_id <> creator_id)
);
create index if not exists creator_subscriptions_creator_status_idx
  on public.creator_subscriptions (creator_id, status);
create unique index if not exists creator_subscriptions_provider_id_unique
  on public.creator_subscriptions (provider, provider_subscription_id)
  where provider_subscription_id is not null;

-- Immutable ledger rows are written only by trusted server/service-role code.
create table if not exists public.creator_earnings_ledger (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete restrict,
  post_id uuid references public.posts(id) on delete set null,
  subscription_id uuid references public.creator_subscriptions(id) on delete set null,
  event_type text not null check (event_type in ('sale','refund','platform_fee','tax','processor_fee','payout','payout_reversal','adjustment')),
  gross_paise bigint not null default 0,
  platform_fee_paise bigint not null default 0,
  tax_paise bigint not null default 0,
  processor_fee_paise bigint not null default 0,
  net_paise bigint not null default 0,
  currency text not null default 'INR' check (currency = 'INR'),
  provider_reference text,
  status text not null default 'pending' check (status in ('pending','verified','paid','failed','reversed')),
  created_at timestamptz not null default now()
);
create index if not exists creator_ledger_creator_created_idx
  on public.creator_earnings_ledger (creator_id, created_at desc);

create table if not exists public.creator_payout_requests (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  amount_paise bigint not null check (amount_paise > 0),
  currency text not null default 'INR' check (currency = 'INR'),
  status text not null default 'requested' check (status in ('requested','under_review','approved','processing','paid','rejected','failed')),
  provider_reference text,
  reviewer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.creator_payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_id text not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  signature_verified boolean not null default false,
  processed_at timestamptz,
  processing_error text,
  created_at timestamptz not null default now(),
  unique(provider, event_id)
);

alter table public.creator_subscriptions enable row level security;
alter table public.creator_earnings_ledger enable row level security;
alter table public.creator_payout_requests enable row level security;
alter table public.creator_payment_events enable row level security;

drop policy if exists "Users can view their creator subscriptions" on public.creator_subscriptions;
create policy "Users can view their creator subscriptions"
  on public.creator_subscriptions for select to authenticated
  using (auth.uid() = subscriber_id or auth.uid() = creator_id);
drop policy if exists "Subscribers can request their own subscriptions" on public.creator_subscriptions;
create policy "Subscribers can request their own subscriptions"
  on public.creator_subscriptions for insert to authenticated
  with check (auth.uid() = subscriber_id and status = 'pending' and provider = 'unconfigured');

drop policy if exists "Creators can view their earnings ledger" on public.creator_earnings_ledger;
create policy "Creators can view their earnings ledger"
  on public.creator_earnings_ledger for select to authenticated
  using (auth.uid() = creator_id);

drop policy if exists "Creators can view their payout requests" on public.creator_payout_requests;
create policy "Creators can view their payout requests"
  on public.creator_payout_requests for select to authenticated
  using (auth.uid() = creator_id);
drop policy if exists "Creators can request payouts" on public.creator_payout_requests;
create policy "Creators can request payouts"
  on public.creator_payout_requests for insert to authenticated
  with check (auth.uid() = creator_id and status = 'requested');

-- No client-side writes to the ledger or webhook event log. Payment events and
-- verified earnings require a server/service-role webhook with signature checks.
revoke insert, update, delete on public.creator_earnings_ledger from anon, authenticated;
revoke insert, update, delete on public.creator_payment_events from anon, authenticated;
revoke update, delete on public.creator_payout_requests from anon, authenticated;

-- Permit owners to manage their own posts, including drafts. Existing public
-- discovery policies remain in place; permissive RLS policies are additive.
drop policy if exists "Creators manage own posts" on public.posts;
create policy "Creators manage own posts"
  on public.posts for all to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

-- Conservative defaults are configurable by deployment, not hardcoded into payments.
create table if not exists public.creator_platform_settings (
  setting_key text primary key,
  setting_value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.creator_platform_settings enable row level security;
drop policy if exists "Creator platform settings are publicly readable" on public.creator_platform_settings;
create policy "Creator platform settings are publicly readable"
  on public.creator_platform_settings for select to anon, authenticated using (true);
insert into public.creator_platform_settings(setting_key, setting_value)
values
  ('creator_subscription', '{"amount_paise":29900,"currency":"INR","interval":"month"}'::jsonb),
  ('platform_commission', '{"minimum_bps":500,"maximum_bps":1000,"default_bps":750}'::jsonb),
  ('payments', '{"enabled":false,"provider":"unconfigured","reason":"Server-side checkout and verified webhook are not configured"}'::jsonb)
on conflict (setting_key) do nothing;
