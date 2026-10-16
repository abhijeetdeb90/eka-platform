-- Align real feed visibility with the live schema and block client-side paid-state writes.
-- Additive and safe to re-run. Apply in staging first; production requires separate release approval.

alter table public.posts
  add column if not exists visibility text not null default 'public';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'posts_visibility_check'
      and conrelid = 'public.posts'::regclass
  ) then
    alter table public.posts
      add constraint posts_visibility_check
      check (visibility in ('public', 'followers'));
  end if;
end $$;

drop policy if exists posts_read on public.posts;

do $$
declare
  role_function text;
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'private' and p.proname = 'has_role'
  ) then
    role_function := 'private.has_role';
  else
    role_function := 'public.has_role';
  end if;

  execute format($policy$
    create policy posts_read
    on public.posts
    for select
    to authenticated
    using (
      (
        status = 'visible'
        and (
          visibility = 'public'
          or auth.uid() = author_id
          or exists (
            select 1
            from public.follows f
            where f.follower_id = auth.uid()
              and f.following_id = posts.author_id
          )
        )
      )
      or auth.uid() = author_id
      or %s(auth.uid(), 'moderator'::app_role)
      or %s(auth.uid(), 'admin'::app_role)
    )
  $policy$, role_function, role_function);
end $$;

-- Paid membership changes must flow through provider-verified server handlers.
drop policy if exists subs_insert on public.subscriptions;
drop policy if exists subs_update on public.subscriptions;
