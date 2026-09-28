-- Seed the Junction with five demonstration places.
-- Only UNESCO-listed facts carry an 'official' provenance with a real URL.
-- Everything else is explicitly marked as demonstration content.

INSERT INTO public.countries (code, name, slug) VALUES
  ('IN', 'India', 'india'),
  ('JP', 'Japan', 'japan'),
  ('IL', 'Jerusalem region', 'jerusalem-region'),
  ('MA', 'Morocco', 'morocco')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.sources (id, name, kind, publisher, url, language, reliability, notes) VALUES
  ('11111111-1111-4111-8111-000000000001', 'Historic Monuments of Ancient Kyoto (Kyoto, Uji and Otsu Cities)', 'official', 'UNESCO World Heritage Centre', 'https://whc.unesco.org/en/list/688', 'en', 'primary', 'World Heritage inscription record.'),
  ('11111111-1111-4111-8111-000000000002', 'Medina of Marrakesh', 'official', 'UNESCO World Heritage Centre', 'https://whc.unesco.org/en/list/331', 'en', 'primary', 'World Heritage inscription record.'),
  ('11111111-1111-4111-8111-000000000003', 'Old City of Jerusalem and its Walls', 'official', 'UNESCO World Heritage Centre', 'https://whc.unesco.org/en/list/148', 'en', 'primary', 'World Heritage inscription record.'),
  ('11111111-1111-4111-8111-000000000004', 'Durga Puja in Kolkata', 'official', 'UNESCO Intangible Cultural Heritage', 'https://ich.unesco.org/en/RL/durga-puja-in-kolkata-01703', 'en', 'primary', 'Representative List of the Intangible Cultural Heritage of Humanity, 2021.'),
  ('11111111-1111-4111-8111-000000000005', 'Varanasi — UNESCO Creative City of Music', 'official', 'UNESCO Creative Cities Network', 'https://www.unesco.org/en/creative-cities', 'en', 'primary', 'Varanasi designated a Creative City of Music in 2015.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.places (id, slug, name, country_code, kind, summary, intro, latitude, longitude, map_zoom, status, is_demo) VALUES
  ('22222222-2222-4222-8222-000000000001', 'varanasi', 'Varanasi', 'IN', 'city',
   'A river city where ritual, music and everyday trade share the same steps.',
   'Varanasi sits along a long curve of the Ganga in northern India. Its ghats are used for bathing, cremation, teaching, laundry and conversation, often within a few metres of each other. Several traditions hold the city sacred, and its classical music lineages are recognised internationally.',
   25.3176, 82.9739, 13, 'published', true),
  ('22222222-2222-4222-8222-000000000002', 'kolkata', 'Kolkata', 'IN', 'city',
   'A metro city whose autumn festival reorganises the whole street map.',
   'Kolkata is a large eastern Indian city with colonial-era architecture, a dense printing and publishing culture, and an annual Durga Puja during which neighbourhoods commission temporary art pavilions across the city.',
   22.5726, 88.3639, 12, 'published', true),
  ('22222222-2222-4222-8222-000000000003', 'kyoto', 'Kyoto', 'JP', 'city',
   'Temple precincts, machiya streets and a seasonal calendar kept in daily use.',
   'Kyoto was Japan''s imperial capital for over a thousand years. Buddhist temples, Shinto shrines and gardens remain in active use, and much of the city''s food and craft culture follows a precise seasonal calendar.',
   35.0116, 135.7681, 12, 'published', true),
  ('22222222-2222-4222-8222-000000000004', 'jerusalem', 'Jerusalem', 'IL', 'city',
   'One walled old city held sacred, differently, by several traditions.',
   'Jerusalem''s Old City is divided into quarters and holds sites central to Judaism, Christianity and Islam. Claims about the city are contested; EKA presents each tradition''s own account separately rather than merging them.',
   31.7767, 35.2345, 14, 'published', true),
  ('22222222-2222-4222-8222-000000000005', 'marrakesh', 'Marrakesh', 'MA', 'city',
   'A medina organised around craft workshops, markets and shared food.',
   'Marrakesh grew as a trading and craft city at the edge of the High Atlas. Its medina is organised by trade — tanners, dyers, metalworkers, woodworkers — with markets, mosques and public squares woven between them.',
   31.6295, -7.9811, 13, 'published', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.place_layers (place_id, layer, title, body, tradition, provenance, source_id, sort_order) VALUES
  -- Varanasi
  ('22222222-2222-4222-8222-000000000001', 'faith', 'Ritual life on the ghats', 'Daily ritual along the river includes morning bathing, offerings at the water''s edge and evening lamp ceremonies. Hindu, Buddhist and Jain traditions each hold sites in and around the city, and their accounts of the place differ.', 'multiple', 'demonstration', NULL, 1),
  ('22222222-2222-4222-8222-000000000001', 'music', 'A UNESCO Creative City of Music', 'Varanasi was designated a UNESCO Creative City of Music in 2015, recognising its classical vocal and instrumental lineages.', NULL, 'official', '11111111-1111-4111-8111-000000000005', 2),
  ('22222222-2222-4222-8222-000000000001', 'food', 'Street food and temple food', 'Demonstration content: morning kachori-sabzi stalls, evening chaat, thick milk sweets, and a separate register of food prepared for temple offering.', NULL, 'demonstration', NULL, 3),
  ('22222222-2222-4222-8222-000000000001', 'craft', 'Banarasi weaving', 'Demonstration content: silk weaving workshops in the older lanes, historically organised by family and neighbourhood.', NULL, 'demonstration', NULL, 4),
  ('22222222-2222-4222-8222-000000000001', 'language', 'Languages you will hear', 'Demonstration content: Bhojpuri and Hindi in daily speech, Sanskrit in ritual, Urdu in parts of the weaving trade.', NULL, 'demonstration', NULL, 5),
  ('22222222-2222-4222-8222-000000000001', 'local_life', 'Etiquette at the river', 'Demonstration content: cremation ghats are not a viewing attraction. Ask before photographing people; do not photograph cremations.', NULL, 'demonstration', NULL, 6),
  -- Kolkata
  ('22222222-2222-4222-8222-000000000002', 'festival', 'Durga Puja', 'Durga Puja in Kolkata was inscribed on the UNESCO Representative List of the Intangible Cultural Heritage of Humanity in 2021. The listing describes it as a public festival that collapses distinctions of class, religion and ethnicity in the city''s streets.', 'hindu', 'official', '11111111-1111-4111-8111-000000000004', 1),
  ('22222222-2222-4222-8222-000000000002', 'craft', 'Kumartuli idol makers', 'Demonstration content: a riverside quarter of workshops where clay images are built on straw and bamboo frames each year.', NULL, 'demonstration', NULL, 2),
  ('22222222-2222-4222-8222-000000000002', 'food', 'Adda and the tea stall', 'Demonstration content: long unhurried conversation over clay cups of tea, street rolls, fish and rice at home.', NULL, 'demonstration', NULL, 3),
  ('22222222-2222-4222-8222-000000000002', 'history', 'A printing and publishing city', 'Demonstration content: a dense concentration of small presses, bookshops and literary magazines.', NULL, 'demonstration', NULL, 4),
  ('22222222-2222-4222-8222-000000000002', 'faith', 'Many traditions in one city', 'Demonstration content: Hindu, Muslim, Christian, Jain, Sikh, Parsi, Jewish and Armenian communities have all shaped the city''s built fabric.', 'multiple', 'demonstration', NULL, 5),
  -- Kyoto
  ('22222222-2222-4222-8222-000000000003', 'history', 'Historic Monuments of Ancient Kyoto', 'Seventeen component sites across Kyoto, Uji and Otsu are inscribed as a UNESCO World Heritage property, covering Buddhist temples, Shinto shrines and a castle built between the 10th and 17th centuries.', NULL, 'official', '11111111-1111-4111-8111-000000000001', 1),
  ('22222222-2222-4222-8222-000000000003', 'faith', 'Temples and shrines in daily use', 'Demonstration content: Buddhist temple precincts and Shinto shrines are distinct traditions with distinct practices, though many residents visit both.', 'multiple', 'demonstration', NULL, 2),
  ('22222222-2222-4222-8222-000000000003', 'food', 'Seasonal food', 'Demonstration content: kaiseki, tofu cuisine near temple districts, pickles, and a market culture organised strictly by season.', NULL, 'demonstration', NULL, 3),
  ('22222222-2222-4222-8222-000000000003', 'craft', 'Textiles, ceramics and paper', 'Demonstration content: weaving and dyeing districts, kiln traditions and handmade paper workshops.', NULL, 'demonstration', NULL, 4),
  ('22222222-2222-4222-8222-000000000003', 'local_life', 'Visiting quietly', 'Demonstration content: residential lanes are homes, not sets. Photography is restricted in many temple interiors.', NULL, 'demonstration', NULL, 5),
  -- Jerusalem
  ('22222222-2222-4222-8222-000000000004', 'history', 'Old City of Jerusalem and its Walls', 'The Old City and its walls are inscribed on the UNESCO World Heritage List, recognised for sites sacred to Judaism, Christianity and Islam.', NULL, 'official', '11111111-1111-4111-8111-000000000003', 1),
  ('22222222-2222-4222-8222-000000000004', 'faith', 'Three accounts, kept separate', 'Demonstration content: EKA records each tradition''s account of the city in its own words rather than merging them into one narrative. Claims about the city are contested and are labelled as such.', 'multiple', 'demonstration', NULL, 2),
  ('22222222-2222-4222-8222-000000000004', 'food', 'Shared and distinct tables', 'Demonstration content: breads, spice blends and sweets shared across communities, alongside dietary practices specific to each.', NULL, 'demonstration', NULL, 3),
  ('22222222-2222-4222-8222-000000000004', 'language', 'Hebrew, Arabic and more', 'Demonstration content: Hebrew and Arabic in daily use, with liturgical Greek, Armenian, Latin and Aramaic in specific communities.', NULL, 'demonstration', NULL, 4),
  ('22222222-2222-4222-8222-000000000004', 'local_life', 'Dress and conduct', 'Demonstration content: covered shoulders and knees are expected at most sacred sites; some sites restrict access by tradition or by day.', NULL, 'demonstration', NULL, 5),
  -- Marrakesh
  ('22222222-2222-4222-8222-000000000005', 'history', 'Medina of Marrakesh', 'The medina is inscribed on the UNESCO World Heritage List as a historic capital founded in the 11th century, with its ramparts, mosques, madrasas and public squares.', NULL, 'official', '11111111-1111-4111-8111-000000000002', 1),
  ('22222222-2222-4222-8222-000000000005', 'craft', 'Trades by quarter', 'Demonstration content: the medina is organised by craft — tanning, dyeing, metal, wood and leather each with their own lanes and workshops.', NULL, 'demonstration', NULL, 2),
  ('22222222-2222-4222-8222-000000000005', 'food', 'Bread, tagine and the shared oven', 'Demonstration content: household dough taken to a neighbourhood oven, slow-cooked tagines, mint tea poured from height.', NULL, 'demonstration', NULL, 3),
  ('22222222-2222-4222-8222-000000000005', 'music', 'Gnawa and square musicians', 'Demonstration content: Gnawa music has its own lineage and ritual context and is not simply street entertainment.', NULL, 'demonstration', NULL, 4),
  ('22222222-2222-4222-8222-000000000005', 'language', 'Darija, Amazigh, French', 'Demonstration content: Moroccan Arabic in the markets, Amazigh languages from the surrounding regions, French in commerce.', NULL, 'demonstration', NULL, 5);

INSERT INTO public.cultural_items (slug, kind, name, place_id, tradition, summary, body, provenance, status, is_demo) VALUES
  ('banarasi-silk', 'craft', 'Banarasi silk weaving', '22222222-2222-4222-8222-000000000001', NULL, 'Handloom silk weaving associated with Varanasi.', 'Demonstration content: brocade weaving using silk and metallic thread, historically organised through family workshops.', 'demonstration', 'published', true),
  ('banarasi-kachori', 'food', 'Kachori sabzi', '22222222-2222-4222-8222-000000000001', NULL, 'A morning street breakfast in Varanasi.', 'Demonstration content: fried stuffed bread served with a spiced vegetable curry, eaten early.', 'demonstration', 'published', true),
  ('durga-puja', 'festival', 'Durga Puja', '22222222-2222-4222-8222-000000000002', 'hindu', 'An autumn festival that turns Kolkata''s streets into commissioned art.', 'Inscribed by UNESCO in 2021 on the Representative List of the Intangible Cultural Heritage of Humanity.', 'official', 'published', true),
  ('kumartuli-clay', 'craft', 'Clay image making', '22222222-2222-4222-8222-000000000002', 'hindu', 'Seasonal idol making in Kolkata.', 'Demonstration content: images built on straw and bamboo armatures, finished with river clay.', 'demonstration', 'published', true),
  ('kyoto-kaiseki', 'food', 'Kaiseki', '22222222-2222-4222-8222-000000000003', NULL, 'A sequenced seasonal meal.', 'Demonstration content: a multi-course meal ordered by season, technique and vessel.', 'demonstration', 'published', true),
  ('nishijin-weaving', 'craft', 'Nishijin weaving', '22222222-2222-4222-8222-000000000003', NULL, 'A Kyoto textile district and technique.', 'Demonstration content: figured textile weaving associated with a specific quarter of Kyoto.', 'demonstration', 'published', true),
  ('jerusalem-zaatar', 'food', 'Za''atar', '22222222-2222-4222-8222-000000000004', NULL, 'A herb and sesame blend used across the region.', 'Demonstration content: eaten with bread and oil; recipes vary by household and community.', 'demonstration', 'published', true),
  ('marrakesh-tanneries', 'craft', 'Leather tanning', '22222222-2222-4222-8222-000000000005', NULL, 'A trade quarter of the Marrakesh medina.', 'Demonstration content: hide preparation and dyeing carried out in open vats within a dedicated quarter.', 'demonstration', 'published', true),
  ('gnawa-music', 'music', 'Gnawa music', '22222222-2222-4222-8222-000000000005', NULL, 'A Moroccan musical and ritual tradition.', 'Demonstration content: percussion, guembri and call-and-response singing with a specific ritual context.', 'demonstration', 'published', true),
  ('mint-tea', 'food', 'Mint tea', '22222222-2222-4222-8222-000000000005', NULL, 'Green tea with mint, poured from height.', 'Demonstration content: prepared and served as an act of hospitality rather than a drink order.', 'demonstration', 'published', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.place_map_points (place_id, name, category, note, latitude, longitude, provenance) VALUES
  ('22222222-2222-4222-8222-000000000001', 'Dashashwamedh Ghat', 'faith', 'Demonstration content: a principal riverfront ghat used for evening lamp ceremonies.', 25.3070, 83.0104, 'demonstration'),
  ('22222222-2222-4222-8222-000000000001', 'Weaving lanes', 'craft', 'Demonstration content: approximate area of silk weaving workshops.', 25.3100, 82.9900, 'demonstration'),
  ('22222222-2222-4222-8222-000000000002', 'Kumartuli', 'craft', 'Demonstration content: quarter of clay image workshops.', 22.5991, 88.3639, 'demonstration'),
  ('22222222-2222-4222-8222-000000000002', 'College Street books', 'markets', 'Demonstration content: concentration of bookshops and presses.', 22.5750, 88.3650, 'demonstration'),
  ('22222222-2222-4222-8222-000000000003', 'Kiyomizu-dera', 'heritage', 'A component site of the Historic Monuments of Ancient Kyoto World Heritage property.', 34.9949, 135.7850, 'official'),
  ('22222222-2222-4222-8222-000000000003', 'Nishiki market', 'markets', 'Demonstration content: a long covered market street.', 35.0050, 135.7649, 'demonstration'),
  ('22222222-2222-4222-8222-000000000004', 'Old City walls', 'heritage', 'Inscribed as part of the Old City of Jerusalem and its Walls World Heritage property.', 31.7767, 35.2345, 'official'),
  ('22222222-2222-4222-8222-000000000005', 'Jemaa el-Fnaa', 'music', 'Demonstration content: the main public square, used differently through the day.', 31.6258, -7.9891, 'demonstration'),
  ('22222222-2222-4222-8222-000000000005', 'Tanners'' quarter', 'craft', 'Demonstration content: approximate area of the tanneries.', 31.6350, -7.9790, 'demonstration');

INSERT INTO public.place_relationships (from_place, to_place, relation, note) VALUES
  ('22222222-2222-4222-8222-000000000001', '22222222-2222-4222-8222-000000000002', 'shared_tradition', 'Demonstration content: river ritual and Hindu festival calendars connect both cities.'),
  ('22222222-2222-4222-8222-000000000002', '22222222-2222-4222-8222-000000000001', 'shared_tradition', 'Demonstration content: shared festival calendar and craft lineages.'),
  ('22222222-2222-4222-8222-000000000001', '22222222-2222-4222-8222-000000000003', 'shared_practice', 'Demonstration content: both cities keep living temple precincts inside a working modern city.'),
  ('22222222-2222-4222-8222-000000000003', '22222222-2222-4222-8222-000000000001', 'shared_practice', 'Demonstration content: seasonal ritual calendars in continuous use.'),
  ('22222222-2222-4222-8222-000000000004', '22222222-2222-4222-8222-000000000005', 'shared_craft', 'Demonstration content: old walled quarters organised around markets and trades.'),
  ('22222222-2222-4222-8222-000000000005', '22222222-2222-4222-8222-000000000004', 'shared_craft', 'Demonstration content: medina and old-city market organisation.'),
  ('22222222-2222-4222-8222-000000000005', '22222222-2222-4222-8222-000000000002', 'shared_craft', 'Demonstration content: craft quarters that supply a city-wide festival or market economy.'),
  ('22222222-2222-4222-8222-000000000003', '22222222-2222-4222-8222-000000000004', 'heritage_listing', 'Demonstration content: both hold UNESCO World Heritage inscriptions for historic urban fabric.');