-- 1. Ensure the 'post-media' bucket exists and is marked public
-- A public bucket allows public read URLs (via getPublicUrl) while write operations remain strictly protected by RLS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-media',
  'post-media',
  true,
  52428800, -- 50MB (max video size supported in post creation)
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime', 'video/webm'];

-- 2. Clean up any existing legacy or partial policies on storage.objects for 'post-media'
DROP POLICY IF EXISTS "post_media_read" ON storage.objects;
DROP POLICY IF EXISTS "post_media_insert" ON storage.objects;
DROP POLICY IF EXISTS "post_media_update" ON storage.objects;
DROP POLICY IF EXISTS "post_media_delete" ON storage.objects;
DROP POLICY IF EXISTS "post_media_public_read" ON storage.objects;
DROP POLICY IF EXISTS "post_media_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "post_media_owner_update" ON storage.objects;
DROP POLICY IF EXISTS "post_media_owner_delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to post-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload post-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update own post-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete own post-media" ON storage.objects;

-- 3. Policy: Public Read (Anyone can view media associated with cultural posts, stories, and profiles)
CREATE POLICY "post_media_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post-media');

-- 4. Policy: Authenticated Insert (Users can upload media only under a folder named after their auth.uid)
CREATE POLICY "post_media_auth_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post-media'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- 5. Policy: Owner Update (Users can update only their own uploaded media)
CREATE POLICY "post_media_owner_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'post-media'
  AND (storage.foldername(name))[1] = (auth.uid())::text
)
WITH CHECK (
  bucket_id = 'post-media'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);

-- 6. Policy: Owner Delete (Users can delete only their own uploaded media)
CREATE POLICY "post_media_owner_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'post-media'
  AND (storage.foldername(name))[1] = (auth.uid())::text
);
