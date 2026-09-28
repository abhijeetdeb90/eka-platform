CREATE POLICY "post_media_read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'post-media');
CREATE POLICY "post_media_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'post-media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "post_media_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'post-media' AND (storage.foldername(name))[1] = auth.uid()::text) WITH CHECK (bucket_id = 'post-media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "post_media_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'post-media' AND (storage.foldername(name))[1] = auth.uid()::text);

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.post_comments REPLICA IDENTITY FULL;