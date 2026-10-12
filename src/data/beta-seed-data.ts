// ==============================================================================
// EKA BETA SEED DATA: PLACES, PRACTICES, CRAFTS, & QUESTIONS
// ==============================================================================
// Purely public, factual, widely documented cultural practices and places.
// Every image is curated and verified to precisely match the cultural entity.
// Hierarchical metadata: country, regionOrState, subCategory
// ==============================================================================

export interface PlaceOrPractice {
  id: string;
  slug: string;
  title: string;
  category: "Places" | "Practices" | "Crafts";
  subCategory?: string;
  country: string;
  regionOrState: string;
  location: string;
  summary: string;
  body: string;
  imagePath: string;
  imageCaption: string;
  relatedQuestionIds: string[];
}

export interface AskQuestionItem {
  id: string;
  questionText: string;
  category: string;
  answerSummary: string;
  answerBody: string;
  sourcesNote: string;
  contextNote?: string;
  relatedItemSlug?: string;
}

export const BETA_PLACES_OR_PRACTICES: PlaceOrPractice[] = [
  {
    id: "item-kerala-backwaters",
    slug: "kerala-backwaters",
    title: "Kerala Backwaters & Houseboat Culture",
    category: "Places",
    subCategory: "Aquatic Ecosystems & Living Canal Ways",
    country: "India",
    regionOrState: "Kerala",
    location: "Alappuzha & Vembanad Lake, Kerala, India",
    summary: "A 900-kilometer labyrinth of interconnected brackish lagoons, lakes, and canals where daily life moves at the serene pace of the water.",
    body: "The backwaters of Kerala form a unique coastal wetland ecosystem running parallel to the Arabian Sea. Interconnected waterways and natural barrier islands created a water-borne civilization where traditional kettuvallam (cargo boats bound together with coir ropes without a single iron nail) have evolved into living vessels. Palm groves, paddy fields cultivated below sea level in Kuttanad, and village waterways illustrate an unbroken harmony between riparian ecology and community life.",
    imagePath: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Traditional kettuvallam boat gliding across palm-fringed backwaters, Alappuzha, Kerala",
    relatedQuestionIds: ["q-kerala-backwaters", "q-aranmula-mirror"],
  },
  {
    id: "item-meghalaya-root-bridges",
    slug: "meghalaya-living-root-bridges",
    title: "Living Root Bridges of Meghalaya",
    category: "Places",
    subCategory: "Bio-Engineering & Indigenous Sacred Groves",
    country: "India",
    regionOrState: "Meghalaya",
    location: "Cherrapunji & Nongriat, Meghalaya, India",
    summary: "Aerial roots of Ficus elastica trees guided across mountain rivers over decades by the indigenous Khasi and Jaintia peoples.",
    body: "In the rain-drenched subtropical cloud forests of the southern Meghalaya plateau, the indigenous Khasi and Jaintia communities developed a living architectural marvel: the Jingkieng Jri (Living Root Bridge). By hollowed betel-nut trunks, aerial roots of the Indian rubber fig (Ficus elastica) are guided across torrential monsoon streams. Over 15 to 30 years, the roots intertwine and anchor to boulders on opposite riverbanks. Unlike stone or wood bridges that decay under heavy rainfall, living root bridges become stronger and more resilient with age.",
    imagePath: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Living root bridge woven from aerial Ficus roots spanning a mountain river, Meghalaya",
    relatedQuestionIds: ["q-meghalaya-bridges"],
  },
  {
    id: "item-varanasi-aarti",
    slug: "ganga-aarti-varanasi",
    title: "Ganga Aarti in Varanasi",
    category: "Practices",
    subCategory: "Vedic Fire Offerings & River Gratitude",
    country: "India",
    regionOrState: "Uttar Pradesh",
    location: "Dashashwamedh Ghat, Varanasi, Uttar Pradesh, India",
    summary: "An evening devotional fire offering held along the stone riverfront of Varanasi, using multi-tiered brass lamps and rhythmic Sanskrit chanting.",
    body: "Every evening at twilight, priests gather at Dashashwamedh Ghat on the banks of the sacred Ganges River to perform the Ganga Aarti. The ritual involves multi-tiered brass lamps filled with camphor and sesame oil, circled in rhythmic patterns in devotion to the river, considered sacred in Indic traditions. Thousands of pilgrims, residents, and visitors sit along the steps and in boats on the river to witness the prayer of gratitude.",
    imagePath: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Evening aarti ceremony with tiered brass fire lamps at Dashashwamedh Ghat, Varanasi",
    relatedQuestionIds: ["q-varanasi-sacred", "q-aarti-lamps"],
  },
  {
    id: "item-japanese-tea-ceremony",
    slug: "japanese-tea-ceremony",
    title: "The Way of Tea (Chanoyu)",
    category: "Practices",
    subCategory: "Zen Mindfulness & Seasonal Hospitality",
    country: "Japan",
    regionOrState: "Kyoto Prefecture",
    location: "Uji & Kyoto, Japan",
    summary: "A ceremonial preparation and presentation of powdered green tea (matcha) centered on mindfulness, mutual respect, and tranquility.",
    body: "Chanoyu, commonly known in English as the Japanese tea ceremony, evolved from Zen Buddhist meditative practices and was codified by master Sen no Rikyu in the 16th century. It emphasizes four primary principles: harmony (wa), respect (kei), purity (sei), and tranquility (jaku). Every aspect—from the garden path (roji) to the hand-turned ceramic chawan (tea bowl) and bamboo whisk—cultivates complete presence in a fleeting, once-in-a-lifetime encounter (ichigo ichie).",
    imagePath: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ceremonial preparation of matcha with chasen bamboo whisk in a traditional Kyoto tea room",
    relatedQuestionIds: ["q-tea-ceremony", "q-kyoto-zen"],
  },
  {
    id: "item-kyoto-machiya",
    slug: "kyoto-machiya-townhouses",
    title: "Kyoto Machiya Townhouses",
    category: "Places",
    subCategory: "Vernacular Timber Architecture & Interior Courtyards",
    country: "Japan",
    regionOrState: "Kyoto Prefecture",
    location: "Gion & Nishijin, Kyoto, Japan",
    summary: "Traditional wooden merchant townhouses built with mortise-and-tenon timber joinery and internal courtyard gardens (tsuboniwa).",
    body: "Machiya are traditional wooden townhouses that defined Kyoto's urban streetscapes for centuries. Built without metallic nails using complex Japanese timber joinery, they typically feature narrow street frontages with long depths extending back. Inner micro-gardens (tsuboniwa) provide ventilation, seasonal greenery, and gentle natural illumination within densely built urban quarters.",
    imagePath: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Preserved wooden lattice machiya street architecture in historic Gion district, Kyoto",
    relatedQuestionIds: ["q-kyoto-machiya"],
  },
  {
    id: "item-aranmula-mirror",
    slug: "aranmula-kannadi",
    title: "Aranmula Metal Mirror (Kannadi)",
    category: "Crafts",
    subCategory: "Sacred Metallurgy & Front-Surface Bronze Optics",
    country: "India",
    regionOrState: "Kerala",
    location: "Aranmula, Pathanamthitta District, Kerala, India",
    summary: "A front-surface reflective bronze mirror hand-cast from a copper-tin alloy by generational artisans, protected by Geographical Indication.",
    body: "Aranmula Kannadi is a rare handmade metal mirror originating from the temple village of Aranmula in Kerala, India. Unlike standard mirrors that reflect light through a pane of glass from a silver backing, this mirror reflects light directly from its polished bronze surface, eliminating secondary refraction and chromatic distortion. Recognized with a Geographical Indication (GI) tag, it remains an unbroken hallmark of medieval metallurgical science.",
    imagePath: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Authentic polished bronze mirror artwork handcrafted in Aranmula, Kerala",
    relatedQuestionIds: ["q-aranmula-mirror"],
  },
  {
    id: "item-bishnoi-ethos",
    slug: "bishnoi-environmental-ethos",
    title: "Bishnoi Ecological Ethos",
    category: "Practices",
    subCategory: "Indigenous Conservation & Wildlife Sanctuary Tenets",
    country: "India",
    regionOrState: "Rajasthan",
    location: "Thar Desert, Jodhpur District, Rajasthan, India",
    summary: "A 500-year-old community ethic rooted in 29 tenets that forbid cutting green trees and protect wild desert fauna with life itself.",
    body: "The Bishnoi are a desert-dwelling community in Rajasthan founded in 1485 CE by Guru Jambheshwar. Central to their 29 precepts is the sacred protection of khejri trees (Prosopis cineraria) and all living wildlife, including desert gazelles and blackbucks. This centuries-old environmental discipline has turned arid areas of western India into verdant, protected wildlife sanctuaries.",
    imagePath: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Protected arid landscape with wildlife roaming freely in Bishnoi desert settlements, Rajasthan",
    relatedQuestionIds: ["q-bishnoi-ethos"],
  },
  {
    id: "item-kumartuli-clay",
    slug: "kumartuli-clay-sculpture",
    title: "Kumartuli Clay Artistry",
    category: "Crafts",
    subCategory: "Ephemeral Sacred Sculpture & Organic Clay Modelling",
    country: "India",
    regionOrState: "West Bengal",
    location: "Kumartuli, North Kolkata, West Bengal, India",
    summary: "Generational sculpting of sacred idols crafted from bamboo frames, straw, Hooghly river silt clay, and natural earth pigments.",
    body: "Located on the banks of the Hooghly River in North Kolkata, Kumartuli is a centuries-old potters' enclave. Artisans construct life-sized festival deities starting with a bamboo and rice-straw skeleton, applying layers of alluvial clay (Ganga mitti) by hand. Once dried in the sun, the sculptures are decorated with natural tamarind-seed binders and chalk pigments, ensuring they return harmlessly to the river during immersion rituals.",
    imagePath: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Artisan modeling river-silt clay deities in the traditional Kumartuli quarter, Kolkata",
    relatedQuestionIds: ["q-durga-clay"],
  },
  {
    id: "item-zapotec-weaving",
    slug: "zapotec-textile-weaving",
    title: "Zapotec Natural Dye Weaving",
    category: "Crafts",
    subCategory: "Botanical Colorants & Backstrap / Treadle Weaving",
    country: "Mexico",
    regionOrState: "Oaxaca",
    location: "Teotitlán del Valle, Central Valleys, Oaxaca, Mexico",
    summary: "Generational wool weaving on wooden looms utilizing botanical colorants extracted from wild indigo, marigolds, and cochineal insects.",
    body: "In the indigenous village of Teotitlán del Valle in Oaxaca, Zapotec weavers hand-spin local sheep wool and dye each skein using wild botanical and mineral ingredients. Saturated reds are extracted from dried cochineal insects on prickly pear cacti, blues from fermented indigo leaves (añil), and yellows from cempasúchil marigold petals. The resulting tapestries feature sacred geometric codices dating back more than two thousand years.",
    imagePath: "https://images.unsplash.com/photo-1512816943410-14e606b83e85?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Hand-spun natural botanical dyed wool textiles and rugs, Teotitlán del Valle, Oaxaca",
    relatedQuestionIds: ["q-cochineal-dye"],
  },
  {
    id: "item-chouara-tanneries",
    slug: "chouara-tanneries-fez",
    title: "Chouara Tanneries of Fez",
    category: "Places",
    subCategory: "Guild Craftsmanship & Medieval Stone Dyeing Vats",
    country: "Morocco",
    regionOrState: "Fès-Meknès",
    location: "Fes el Bali Medina, Fez, Morocco",
    summary: "An 11th-century open-air guild tannery where leather hides are softened and dyed in stone honeycomb pits using natural mineral and plant dyes.",
    body: "The Chouara Tannery in the medieval medina of Fez, Morocco, has operated in virtually unchanged form since the 11th century. Hides are treated in white stone vats of limestone and salt, then hand-kneaded in round earthen pits filled with natural vegetable colorants—poppy petals for red, saffron for golden amber, and cedarwood for deep brown. It is a UNESCO World Heritage cultural cornerstone.",
    imagePath: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Historic circular stone dyeing vats filled with natural colorants at Chouara Tannery, Fez",
    relatedQuestionIds: ["q-fez-tanneries"],
  },
];

export const BETA_ASK_QUESTIONS: AskQuestionItem[] = [
  {
    id: "q-kerala-backwaters",
    questionText: "What makes Kerala's backwaters unique in world geography?",
    category: "Places",
    answerSummary: "A coastal network of 38 rivers and five large lakes where communities farm below sea level and travel via traditional wooden boats.",
    answerBody: "Kerala's backwaters represent a rare brackish aquatic ecosystem. In Kuttanad, farmers historically developed techniques to cultivate rice below sea level behind earthen bunds. The traditional kettuvallam boats were stitched together with coconut coir rope without metal fasteners, showcasing an ecological transport system developed over centuries.",
    sourcesNote: "Ramsar Wetland Site documentation for Vembanad Lake.",
    relatedItemSlug: "kerala-backwaters",
  },
  {
    id: "q-meghalaya-bridges",
    questionText: "How do living root bridges grow stronger over time?",
    category: "Places",
    answerSummary: "Unlike inert concrete or timber bridges that degrade under heavy rainfall, living Ficus roots thicken and anchor deeper into riverbanks as they age.",
    answerBody: "Living root bridges are cultivated by the Khasi and Jaintia peoples using aerial roots of Ficus elastica. Trained across mountain ravines using hollowed areca nut trunks, the living roots graft onto one another through natural anastomosis. As the tree matures over decades, the span becomes stronger, capable of carrying dozens of travelers across raging monsoon streams.",
    sourcesNote: "Botanical and indigenous anthropological studies of Meghalaya.",
    relatedItemSlug: "meghalaya-living-root-bridges",
  },
  {
    id: "q-varanasi-sacred",
    questionText: "Why is Varanasi considered one of the oldest sacred cities?",
    category: "Places",
    answerSummary: "Varanasi has continuous human settlement spanning thousands of years, celebrated for its unique riverside geography where the Ganges curves northward.",
    answerBody: "Situated along the crescent bend of the Ganges River, Varanasi (historically Kashi) is revered across Indic philosophies as a site of pilgrimage and liberation. Historically, its geography where the river turns north toward its Himalayan source made it an ancient crossroads for philosophers, poets, scholars, and spiritual seekers. It remains one of the world's oldest continuously inhabited urban centers.",
    sourcesNote: "Widely documented geographical and cultural history.",
    contextNote: "Visitors should respect cremation ghats such as Manikarnika, where photography is customarily restricted.",
    relatedItemSlug: "ganga-aarti-varanasi",
  },
  {
    id: "q-aarti-lamps",
    questionText: "What is the cultural purpose of lighting clay lamps (diyas) in rituals?",
    category: "Practices",
    answerSummary: "Clay lamps with cotton wicks signify the inner light of knowledge dispelling ignorance, gratitude to nature, and the transient nature of material existence.",
    answerBody: "In South Asian rituals and festivals like Diwali, lighting earthenware lamps (diyas) symbolizes the triumph of knowledge and discernment over spiritual darkness. The earthenware clay symbolizes the physical body, the oil or ghee signifies worldly attachments, and the upward-pointing flame represents focus toward higher wisdom and inner reflection.",
    sourcesNote: "Widely documented South Asian ritual practice.",
    relatedItemSlug: "ganga-aarti-varanasi",
  },
  {
    id: "q-tea-ceremony",
    questionText: "What is the philosophical core of the Japanese tea ceremony?",
    category: "Practices",
    answerSummary: "Chanoyu turns the simple act of preparing tea into an exercise in mindfulness, mutual respect, and cherishing a fleeting encounter.",
    answerBody: "The Japanese tea ceremony (Chanoyu) centers around the concept of 'ichi-go ichi-e' (one time, one meeting). It teaches that every single gathering is unique and will never occur again in the exact same way. The meticulous actions—cleaning the utensils, bowing, pouring water, whisking matcha—encourage both host and guest to step away from distractions and be wholly present.",
    sourcesNote: "Widely documented Japanese cultural tradition.",
    contextNote: "Participants are customarily expected to remove footwear and appreciate the seasonal flower arrangement (chabana) upon entering.",
    relatedItemSlug: "japanese-tea-ceremony",
  },
  {
    id: "q-kyoto-machiya",
    questionText: "Why were Kyoto's machiya townhouses built so long and narrow?",
    category: "Places",
    answerSummary: "Property taxes in feudal Japan were based on street frontage width, encouraging residents to build deep structures with internal courtyard gardens.",
    answerBody: "In historic Kyoto, municipal and feudal property taxes were calculated based on the width of a building's street frontage rather than its total square footage. Merchant families built narrow storefronts that extended deep into the city block, creating the distinctive 'eel-bed' layout. To bring sunlight and fresh air into the depths of these homes, courtyard gardens (tsuboniwa) were integrated into the interior.",
    sourcesNote: "Documented architectural history of Kyoto.",
    relatedItemSlug: "kyoto-machiya-townhouses",
  },
  {
    id: "q-aranmula-mirror",
    questionText: "How does a metal mirror differ from a standard glass mirror?",
    category: "Crafts",
    answerSummary: "Metal mirrors reflect from the outer surface directly, avoiding the secondary reflection caused by glass thickness.",
    answerBody: "Ordinary mirrors consist of a clear sheet of glass backed with a reflective silver or aluminum coating. When you look into a glass mirror, light travels through the glass first, which can cause subtle double reflections or refraction. In contrast, front-surface metal mirrors like the Aranmula Kannadi reflect directly off the polished bronze alloy surface, yielding an optically exact reflection.",
    sourcesNote: "Recognized Indian Geographical Indication (GI 2004).",
    relatedItemSlug: "aranmula-kannadi",
  },
  {
    id: "q-bishnoi-ethos",
    questionText: "How do Bishnoi communities protect trees and desert wildlife?",
    category: "Practices",
    answerSummary: "Bishnoi religious precepts prohibit felling green trees or harming animals, fostering harmonious coexistence with desert ecosystems.",
    answerBody: "In 1485 CE, Guru Jambheshwar laid down 29 tenets for the Bishnoi community in western India. Among these rules are unambiguous prohibitions against cutting down green trees and killing animals. Community members actively safeguard wildlife habitats, provide water and feed during droughts, and protect native Khejri trees, creating protected refuges across Rajasthan.",
    sourcesNote: "Documented cultural and ecological history of Rajasthan.",
    relatedItemSlug: "bishnoi-environmental-ethos",
  },
  {
    id: "q-cochineal-dye",
    questionText: "How is natural red dye produced from cochineal insects in Oaxaca?",
    category: "Crafts",
    answerSummary: "Dried cochineal scale insects harvested from nopal cactus produce carminic acid, which yields bright shades of crimson, pink, and violet when mixed with natural mordants.",
    answerBody: "Cochineal (Dactylopius coccus) is a small scale insect that lives on prickly pear (nopal) cacti native to the Americas. Artisans collect, dry, and grind the female insects into a fine powder rich in carminic acid. By combining the dye bath with different mineral mordants like lime juice (acid) or wood ash (alkali), weavers can produce an entire spectrum from scarlet to purple.",
    sourcesNote: "Documented botanical and textile history.",
    relatedItemSlug: "zapotec-textile-weaving",
  },
  {
    id: "q-fez-tanneries",
    questionText: "How do the historic stone vats of Fez tan and dye leather naturally?",
    category: "Places",
    answerSummary: "Hides are treated in limestone and salt vats before being hand-kneaded in natural plant-based dye baths.",
    answerBody: "The Chouara Tannery operates using gravity-fed stone vats. In the first phase, hides are soaked in limestone, salt, and pigeon droppings containing ammonia to cleanse and soften the leather. Once softened, the hides are immersed in colored vats infused with natural vegetable dyes—such as cedar wood for brown, poppy petals for red, and mint for green—where artisans tread on them to ensure even absorption.",
    sourcesNote: "UNESCO World Heritage cultural documentation for Fez.",
    relatedItemSlug: "chouara-tanneries-fez",
  },
];
