ALTER TABLE public.community_posts ADD COLUMN author_name text NOT NULL DEFAULT 'A seeker';
ALTER TABLE public.post_comments ADD COLUMN author_name text NOT NULL DEFAULT 'A seeker';