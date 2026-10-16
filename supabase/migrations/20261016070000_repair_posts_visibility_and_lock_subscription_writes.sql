-- Staging-first repair: align the feed with visibility semantics and prevent client-side paid-state writes.
-- Additive and safe to re-run. Do not apply to production before preview/e2e checks and rollback review.
begin;

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
        select 1 from public.follows f
        where f.follower_id = auth.uid()
          and f.following_id = posts.author_id
      )
    )
  )
  or auth.uid() = author_id
  or private.has_role(auth.uid(), 'moderator'::app_role)
  or private.has_role(auth.uid(), 'admin'::app_role)
);

drop policy if exists subs_insert on public.subscriptions;
drop policy if exists subs_update on public.subscriptions;

commit;
