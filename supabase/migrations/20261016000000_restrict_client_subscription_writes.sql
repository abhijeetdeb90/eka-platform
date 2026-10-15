-- Membership state is written only by trusted server-side payment and lifecycle handlers.
-- Keep owner-scoped SELECT access; remove client-side INSERT/UPDATE paths that allowed
-- authenticated users to grant or modify their own paid entitlements.
drop policy if exists subs_insert on public.subscriptions;
drop policy if exists subs_update on public.subscriptions;