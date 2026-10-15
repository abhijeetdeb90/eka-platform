-- Repair the production schema used by feed and publishing.
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

-- Followers-only posts are visible to the author and accounts that follow them.
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
        select 1
        from public.follows f
        where f.follower_id = auth.uid()
          and f.following_id = posts.author_id
      )
    )
  )
  or auth.uid() = author_id
  or public.has_role(auth.uid(), 'moderator'::app_role)
  or public.has_role(auth.uid(), 'admin'::app_role)
);

-- Paid membership state is written only by trusted server-side handlers.
drop policy if exists subs_insert on public.subscriptions;
drop policy if exists subs_update on public.subscriptions;