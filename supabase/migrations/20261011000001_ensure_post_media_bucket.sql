INSERT INTO storage.buckets (id, name, public) 
VALUES ('post-media', 'post-media', false) 
ON CONFLICT (id) DO NOTHING;
