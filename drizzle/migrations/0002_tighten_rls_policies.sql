alter policy communities_update on public.communities with check ((auth.uid() = created_by) OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'));
alter policy follows_read on public.follows to authenticated using (auth.uid() is not null);
alter policy platform_config_read on public.platform_config to authenticated using (auth.uid() is not null);