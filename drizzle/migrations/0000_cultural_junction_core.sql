-- ============================================ EKA Cultural Junction ========
-- Places, cultural items, sources and their relationships. Public read for
-- published records; contributors own their rows; admins can curate.

CREATE TABLE public.countries (
  code text PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.countries TO anon, authenticated;
GRANT ALL ON public.countries TO service_role;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "countries readable" ON public.countries FOR SELECT USING (true);
CREATE POLICY "countries admin write" ON public.countries FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL REFERENCES public.countries(code) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX regions_country_idx ON public.regions(country_code);
GRANT SELECT ON public.regions TO anon, authenticated;
GRANT ALL ON public.regions TO service_role;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "regions readable" ON public.regions FOR SELECT USING (true);
CREATE POLICY "regions admin write" ON public.regions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  kind text NOT NULL DEFAULT 'book',
  publisher text,
  author text,
  url text,
  language text,
  published_on text,
  region text,
  tradition text,
  reliability text NOT NULL DEFAULT 'unreviewed',
  notes text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sources_kind_idx ON public.sources(kind);
GRANT SELECT ON public.sources TO anon;
GRANT SELECT, INSERT, UPDATE ON public.sources TO authenticated;
GRANT ALL ON public.sources TO service_role;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sources readable" ON public.sources FOR SELECT USING (true);
CREATE POLICY "sources insert own" ON public.sources FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);
CREATE POLICY "sources update own or admin" ON public.sources FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  country_code text NOT NULL REFERENCES public.countries(code) ON DELETE CASCADE,
  region_id uuid REFERENCES public.regions(id) ON DELETE SET NULL,
  kind text NOT NULL DEFAULT 'city',
  summary text NOT NULL DEFAULT '',
  intro text,
  hero_url text,
  latitude double precision,
  longitude double precision,
  map_zoom integer NOT NULL DEFAULT 12,
  status text NOT NULL DEFAULT 'published',
  is_demo boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX places_country_idx ON public.places(country_code);
CREATE INDEX places_status_idx ON public.places(status);
GRANT SELECT ON public.places TO anon;
GRANT SELECT, INSERT, UPDATE ON public.places TO authenticated;
GRANT ALL ON public.places TO service_role;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
CREATE POLICY "places public read" ON public.places FOR SELECT USING (status = 'published');
CREATE POLICY "places own read" ON public.places FOR SELECT TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "places insert own" ON public.places FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "places update own or admin" ON public.places FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER places_updated BEFORE UPDATE ON public.places
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.place_layers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  layer text NOT NULL,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  tradition text,
  provenance text NOT NULL DEFAULT 'demonstration',
  source_id uuid REFERENCES public.sources(id) ON DELETE SET NULL,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX place_layers_place_idx ON public.place_layers(place_id, layer, sort_order);
GRANT SELECT ON public.place_layers TO anon;
GRANT SELECT, INSERT, UPDATE ON public.place_layers TO authenticated;
GRANT ALL ON public.place_layers TO service_role;
ALTER TABLE public.place_layers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "place layers readable" ON public.place_layers FOR SELECT USING (true);
CREATE POLICY "place layers insert own" ON public.place_layers FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);
CREATE POLICY "place layers update own or admin" ON public.place_layers FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.cultural_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  kind text NOT NULL,
  name text NOT NULL,
  place_id uuid REFERENCES public.places(id) ON DELETE SET NULL,
  region_id uuid REFERENCES public.regions(id) ON DELETE SET NULL,
  tradition text,
  summary text NOT NULL DEFAULT '',
  body text,
  image_url text,
  provenance text NOT NULL DEFAULT 'demonstration',
  source_id uuid REFERENCES public.sources(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'published',
  is_demo boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX cultural_items_place_idx ON public.cultural_items(place_id, kind);
CREATE INDEX cultural_items_kind_idx ON public.cultural_items(kind);
GRANT SELECT ON public.cultural_items TO anon;
GRANT SELECT, INSERT, UPDATE ON public.cultural_items TO authenticated;
GRANT ALL ON public.cultural_items TO service_role;
ALTER TABLE public.cultural_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cultural items public read" ON public.cultural_items FOR SELECT USING (status = 'published');
CREATE POLICY "cultural items own read" ON public.cultural_items FOR SELECT TO authenticated
  USING (auth.uid() = created_by);
CREATE POLICY "cultural items insert own" ON public.cultural_items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);
CREATE POLICY "cultural items update own or admin" ON public.cultural_items FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.place_map_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'heritage',
  tradition text,
  note text,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  provenance text NOT NULL DEFAULT 'demonstration',
  source_id uuid REFERENCES public.sources(id) ON DELETE SET NULL,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX place_map_points_place_idx ON public.place_map_points(place_id, category);
GRANT SELECT ON public.place_map_points TO anon;
GRANT SELECT, INSERT, UPDATE ON public.place_map_points TO authenticated;
GRANT ALL ON public.place_map_points TO service_role;
ALTER TABLE public.place_map_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "map points readable" ON public.place_map_points FOR SELECT USING (true);
CREATE POLICY "map points insert own" ON public.place_map_points FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);
CREATE POLICY "map points update own or admin" ON public.place_map_points FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.place_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_place uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  to_place uuid REFERENCES public.places(id) ON DELETE CASCADE,
  to_item uuid REFERENCES public.cultural_items(id) ON DELETE CASCADE,
  to_node uuid REFERENCES public.wisdom_nodes(id) ON DELETE CASCADE,
  relation text NOT NULL DEFAULT 'connected_to',
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX place_relationships_from_idx ON public.place_relationships(from_place);
GRANT SELECT ON public.place_relationships TO anon, authenticated;
GRANT ALL ON public.place_relationships TO service_role;
ALTER TABLE public.place_relationships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "place relationships readable" ON public.place_relationships FOR SELECT USING (true);
CREATE POLICY "place relationships admin write" ON public.place_relationships FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.place_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  place_id uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, place_id)
);
GRANT SELECT, INSERT, DELETE ON public.place_saves TO authenticated;
GRANT ALL ON public.place_saves TO service_role;
ALTER TABLE public.place_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "place saves own" ON public.place_saves FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
