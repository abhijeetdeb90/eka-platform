-- roles
CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_roles_read_own ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- community posts
CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  faith text NOT NULL,
  tradition text,
  status text NOT NULL DEFAULT 'visible',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT ALL ON public.community_posts TO service_role;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY posts_read ON public.community_posts FOR SELECT TO authenticated
  USING (status = 'visible' OR auth.uid() = user_id OR public.has_role(auth.uid(),'moderator') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY posts_insert_own ON public.community_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY posts_update_own ON public.community_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY posts_update_mod ON public.community_posts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'moderator') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'moderator') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY posts_delete_own ON public.community_posts FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'moderator') OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER community_posts_updated_at BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.post_likes TO authenticated;
GRANT ALL ON public.post_likes TO service_role;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY likes_read ON public.post_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY likes_insert_own ON public.post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY likes_delete_own ON public.post_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'visible',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_comments TO authenticated;
GRANT ALL ON public.post_comments TO service_role;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY comments_read ON public.post_comments FOR SELECT TO authenticated
  USING (status = 'visible' OR auth.uid() = user_id OR public.has_role(auth.uid(),'moderator') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY comments_insert_own ON public.post_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY comments_update_mod ON public.post_comments FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'moderator') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'moderator') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY comments_delete_own ON public.post_comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'moderator') OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.post_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.post_comments(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'open',
  resolution text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.post_reports TO authenticated;
GRANT ALL ON public.post_reports TO service_role;
ALTER TABLE public.post_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY reports_read ON public.post_reports FOR SELECT TO authenticated
  USING (auth.uid() = reporter_id OR public.has_role(auth.uid(),'moderator') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY reports_insert_own ON public.post_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY reports_update_mod ON public.post_reports FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'moderator') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'moderator') OR public.has_role(auth.uid(),'admin'));

-- giving
CREATE TABLE public.institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  faith text NOT NULL,
  tradition text,
  location text NOT NULL,
  country text NOT NULL DEFAULT 'India',
  summary text NOT NULL,
  causes text[] NOT NULL DEFAULT '{}',
  verified boolean NOT NULL DEFAULT false,
  verification_note text,
  currency text NOT NULL DEFAULT 'INR',
  total_raised_cents bigint NOT NULL DEFAULT 0,
  total_spent_cents bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.institutions TO anon, authenticated;
GRANT ALL ON public.institutions TO service_role;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY institutions_public_read ON public.institutions FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.institution_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  amount_cents bigint NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  cause text,
  spent_on date NOT NULL,
  proof_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.institution_expenses TO anon, authenticated;
GRANT ALL ON public.institution_expenses TO service_role;
ALTER TABLE public.institution_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY expenses_public_read ON public.institution_expenses FOR SELECT TO anon, authenticated USING (true);

CREATE SEQUENCE public.receipt_seq START 1001;
GRANT USAGE ON SEQUENCE public.receipt_seq TO authenticated, service_role;

CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE RESTRICT,
  cause text,
  amount_cents bigint NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  provider text NOT NULL DEFAULT 'stripe',
  provider_reference text,
  status text NOT NULL DEFAULT 'pending',
  receipt_number text NOT NULL DEFAULT ('SH-' || to_char(now(),'YYYY') || '-' || nextval('public.receipt_seq')),
  donor_name text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.donations TO authenticated;
GRANT ALL ON public.donations TO service_role;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY donations_own ON public.donations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY donations_insert_own ON public.donations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY donations_update_own ON public.donations FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- seed institutions
INSERT INTO public.institutions (id, name, faith, tradition, location, country, summary, causes, verified, verification_note, currency, total_raised_cents, total_spent_cents) VALUES
 ('11111111-1111-4111-8111-111111111101','Noor Relief Trust','Islam','Sunni','Hyderabad, Telangana','India','Ramadan food drives, orphan sponsorship and clean water in peri-urban Hyderabad.','{"Food","Orphan care","Water"}',true,'FCRA and 80G documents verified March 2026.','INR',482000000,410500000),
 ('11111111-1111-4111-8111-111111111102','St. Brigid Community Kitchen','Christianity','Catholic','Kochi, Kerala','India','A daily kitchen serving hot meals to hospital attendants and street families.','{"Food","Healthcare"}',true,'Audited statements for FY25 verified.','INR',216000000,198700000),
 ('11111111-1111-4111-8111-111111111103','Seva Jyoti Foundation','Hinduism','Smarta','Varanasi, Uttar Pradesh','India','Ghat cleaning, cow shelters and free schooling for 340 children.','{"Education","Environment","Animal welfare"}',true,'Trust deed and expense proofs verified February 2026.','INR',358000000,301200000),
 ('11111111-1111-4111-8111-111111111104','Beit Chesed Fund','Judaism','Conservative','Mumbai, Maharashtra','India','Elder care and Shabbat meal support for a small historic community.','{"Elder care","Food"}',false,'Awaiting itemised expense proofs for the last two quarters.','INR',64000000,41000000),
 ('11111111-1111-4111-8111-111111111105','Guru Nanak Langar Seva','Sikhism',NULL,'Amritsar, Punjab','India','Langar kitchens and flood-relief convoys run entirely by volunteers.','{"Food","Disaster relief"}',true,'Bank statements and vendor invoices verified January 2026.','INR',712000000,690400000),
 ('11111111-1111-4111-8111-111111111106','Metta House','Buddhism','Theravada','Dharamshala, Himachal Pradesh','India','Hospice care, meditation retreats for carers and refugee schooling.','{"Healthcare","Education"}',true,'Registration and audit verified December 2025.','INR',129000000,97300000);

INSERT INTO public.institution_expenses (institution_id, amount_cents, category, description, cause, spent_on, proof_url) VALUES
 ('11111111-1111-4111-8111-111111111101',18400000,'Food','1,200 Ramadan ration kits (rice, dal, oil, dates)','Food','2026-03-18','https://example.org/proofs/noor-ration-mar26.pdf'),
 ('11111111-1111-4111-8111-111111111101',9600000,'Water','Borewell repair and filtration unit, Shamshabad','Water','2026-02-04','https://example.org/proofs/noor-water-feb26.pdf'),
 ('11111111-1111-4111-8111-111111111102',7300000,'Food','Kitchen provisions for 9,400 meals','Food','2026-04-30','https://example.org/proofs/brigid-apr26.pdf'),
 ('11111111-1111-4111-8111-111111111103',12500000,'Education','Teacher salaries, 11 staff, one quarter','Education','2026-03-31','https://example.org/proofs/seva-q1-26.pdf'),
 ('11111111-1111-4111-8111-111111111105',26800000,'Disaster relief','Flood convoy: 40 tonnes of supplies to Ferozepur','Disaster relief','2026-07-22','https://example.org/proofs/langar-flood-jul26.pdf'),
 ('11111111-1111-4111-8111-111111111106',5400000,'Healthcare','Hospice medicines and palliative nursing, June','Healthcare','2026-06-30','https://example.org/proofs/metta-jun26.pdf');