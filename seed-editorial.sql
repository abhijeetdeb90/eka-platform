-- ==============================================================================
-- EKA INITIAL EDITORIAL CONTENT SEED SCRIPT
-- ==============================================================================
-- Instructions: 
-- 1. Copy this entire script.
-- 2. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 3. Go to "SQL Editor" on the left menu.
-- 4. Paste this script and click "Run".
-- 
-- This will seed the 'knowledge_objects' table (which the Insights page queries)
-- with beautiful initial editorial content for public discovery.
-- ==============================================================================

INSERT INTO public.knowledge_objects (
  id,
  title,
  summary,
  content,
  epistemic_type,
  status,
  confidence_score,
  slug,
  tags
) VALUES 
(
  'ed100000-0000-0000-0000-000000000001',
  'The Meaning Behind the Ritual: Lighting the Diya',
  'In many traditions, lighting a lamp signifies the dispelling of ignorance. Discover the cultural roots of the Diya.',
  'Across the Indian subcontinent, the lighting of a diya (oil lamp) is a profound daily ritual. It is not merely about physical illumination, but about moving from darkness (tamas) to light (jyotir), symbolizing the awakening of inner knowledge. Whether lit at dusk in a small village shrine or amidst the grand celebrations of Diwali, the humble diya serves as a reminder that even the smallest flame can break the deepest darkness.',
  'human_curated',
  'published',
  0.95,
  'meaning-behind-diya',
  ARRAY['Ritual', 'Sanatana Dharma', 'Festivals']
),
(
  'ed100000-0000-0000-0000-000000000002',
  'A Word That Holds a World: Ubuntu',
  'Translating roughly to "I am because we are", Ubuntu is a deeply rooted African philosophy of interconnectedness.',
  'The word *Ubuntu* originates from the Nguni Bantu languages of Southern Africa. It represents a worldview that fundamentally ties the individual''s humanity to the community. Archbishop Desmond Tutu famously explained it as "My humanity is caught up, is inextricably bound up, in yours." It shapes how communities govern themselves, resolve conflicts, and celebrate victories together.',
  'human_curated',
  'published',
  0.95,
  'ubuntu-philosophy',
  ARRAY['Philosophy', 'African Diaspora', 'Community']
),
(
  'ed100000-0000-0000-0000-000000000003',
  'One Festival, Many Stories: The Roots of Songkran',
  'More than just a water fight, Thailand''s New Year festival is deeply tied to spiritual cleansing and familial respect.',
  'While globally recognized for its massive water festivals, Songkran is fundamentally a time for family reunion and spiritual renewal. Water is symbolically used to wash away the misfortunes of the past year. Younger generations gently pour fragrant water over the hands of elders to seek their blessing, a ritual known as *Rod Nam Dum Hua*. It is a beautiful intersection of Buddhist tradition, animist roots, and modern community celebration.',
  'human_curated',
  'published',
  0.92,
  'roots-of-songkran',
  ARRAY['Festivals', 'Thailand', 'Living Traditions']
)
ON CONFLICT (id) DO NOTHING;
