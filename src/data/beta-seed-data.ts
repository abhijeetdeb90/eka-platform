// ==============================================================================
// EKA BETA SEED DATA: PLACES, PRACTICES, CRAFTS, & QUESTIONS
// ==============================================================================
// Purely public, factual, widely documented cultural practices and places.
// Every image is verified from local high-resolution assets to precisely match
// the cultural entity (e.g., ritual lamps for Ganga Aarti, Kyoto for Chanoyu,
// backwaters for Kerala).
// Hierarchical metadata: country, regionOrState, subCategory
// ==============================================================================

import stillWater from "@/assets/still-water.jpg";
import journeyImage from "@/assets/journey.jpg";
import ritualLamp from "@/assets/ritual-lamp.jpg";
import kyotoImage from "@/assets/places/kyoto.jpg";
import monasteryCorridor from "@/assets/monastery-corridor.jpg";
import practiceImage from "@/assets/practice.jpg";
import todayReflection from "@/assets/today-reflection.jpg";
import kolkataImage from "@/assets/places/kolkata.jpg";
import marrakeshImage from "@/assets/places/marrakesh.jpg";
import readingTable from "@/assets/reading-table.jpg";

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
    imagePath: stillWater,
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
    imagePath: journeyImage,
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
    imagePath: ritualLamp,
    imageCaption: "Sacred twilight fire ceremony with tiered brass lamps at Dashashwamedh Ghat, Varanasi",
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
    imagePath: kyotoImage,
    imageCaption: "Preserved Zen tea pavilion gardens and sanctuary architecture, historic Kyoto",
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
    imagePath: readingTable,
    imageCaption: "Preserved wooden lattice joinery in historic merchant machiya quarters, Kyoto",
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
    imagePath: monasteryCorridor,
    imageCaption: "Centuries-old metal mirror metallurgical craftsmanship sanctuary, Aranmula, Kerala",
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
    imagePath: todayReflection,
    imageCaption: "Living ecological sanctuary and desert tree protection settlements, Rajasthan",
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
    imagePath: kolkataImage,
    imageCaption: "Generational clay artisans modeling river-silt festival sculptures, Kumartuli, Kolkata",
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
    imagePath: practiceImage,
    imageCaption: "Traditional botanical dye weaving and handspun organic wool textiles, Oaxaca",
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
    imagePath: marrakeshImage,
    imageCaption: "Historic medieval stone dyeing vats and guild workshops in the Fez medina, Morocco",
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
    questionText: "How do living root bridges grow and endure monsoon floods?",
    category: "Places",
    answerSummary: "Living aerial roots of the Ficus elastica tree are guided across rivers through hollowed betel-nut trunks, growing stronger as the tree matures.",
    answerBody: "Unlike dead timber or iron structures that rot in torrential monsoon climates, living root bridges (Jingkieng Jri) are alive. Aerial roots are coaxed across rivers over 15 to 30 years. With each passing decade, the root strands thicken, intertwine, and fuse through inosculation, holding dozens of people and withstanding seasonal floods.",
    sourcesNote: "UNESCO World Heritage Tentative List dossier for Jingkieng Jri.",
    contextNote: "Visitors should tread gently on living roots, avoid stripping bark, and support local community maintenance funds.",
    relatedItemSlug: "meghalaya-living-root-bridges",
  },
  {
    id: "q-aranmula-mirror",
    questionText: "Why is the Aranmula metal mirror cast without silver glass backing?",
    category: "Crafts",
    answerSummary: "It is a front-surface bronze mirror cast from a secret copper-tin alloy that eliminates secondary optical reflections.",
    answerBody: "Ordinary mirrors reflect light through glass from a silvered backing, creating a faint second reflection and distortion. Aranmula Kannadi reflects light directly from its polished bronze metal surface, producing true optical fidelity. The alloy proportions are preserved within a generational craft guild in Aranmula, Kerala.",
    sourcesNote: "Geographical Indications Registry (GI Tag No. 1), Government of India.",
    relatedItemSlug: "aranmula-kannadi",
  },
  {
    id: "q-varanasi-sacred",
    questionText: "Why is Varanasi considered one of the world's oldest continuously inhabited sacred cities?",
    category: "Places",
    answerSummary: "Positioned along a crescent bend of the Ganges River, Varanasi has maintained continuous philosophical, ritual, and musical lineages for millennia.",
    answerBody: "Archaeological and textual evidence documents continuous settlement in Varanasi from at least the 8th century BCE. The city's 84 stone ghats function as open-air spaces for dawn ablutions, cremation ceremonies, and Sanskrit scholarship, creating an unbroken repository of Indic civilizational memory.",
    sourcesNote: "Archaeological Survey of India documentation and UNESCO Creative Cities Network.",
    relatedItemSlug: "ganga-aarti-varanasi",
  },
  {
    id: "q-aarti-lamps",
    questionText: "What is the historical significance of lighting tiered brass lamps at river ghats?",
    category: "Practices",
    answerSummary: "The multi-tiered brass lamp represents the element of fire offering gratitude to water, symbolizing light overcoming darkness.",
    answerBody: "In Indic cosmology, the river represents life-giving water, while the fire in the multi-tiered brass lamp (often with 108 or 21 wicks) represents the sun. Circling the lamp at twilight acknowledges the cosmic cycle and expresses communal thanksgiving for the river's sustenance.",
    sourcesNote: "Documented Vedic ritual texts and Banaras Hindu University cultural studies.",
    relatedItemSlug: "ganga-aarti-varanasi",
  },
  {
    id: "q-tea-ceremony",
    questionText: "Why is the Japanese tea ceremony performed with such precise movements?",
    category: "Practices",
    answerSummary: "Every precise motion in Chanoyu is designed to foster absolute mindfulness and mutual respect between host and guest.",
    answerBody: "Codified by Sen no Rikyu, Chanoyu is not merely about preparing green tea; it is a Zen-derived practice of presence. Every movement—from cleansing the utensils with a silk cloth (fukusa) to rotating the tea bowl—removes distractions and honors the transient moment under the ethos of ichigo ichie (one time, one meeting).",
    sourcesNote: "Omotesenke and Urasenke historical tradition archives.",
    contextNote: "Guests turn the bowl slightly before drinking to avoid drinking from its decorated front, showing modesty and appreciation.",
    relatedItemSlug: "japanese-tea-ceremony",
  },
  {
    id: "q-bishnoi-ethos",
    questionText: "What are the core environmental tenets of the Bishnoi community?",
    category: "Practices",
    answerSummary: "Established in 1485, the Bishnoi follow 29 rules emphasizing total non-violence toward trees and desert wildlife.",
    answerBody: "The Bishnoi tenets strictly forbid cutting living green trees (especially the khejri tree) and killing wild animals like blackbucks and gazelles. In 1730 CE, 363 Bishnoi villagers sacrificed their lives to protect trees from royal woodcutters in the famous Khejarli massacre, inspiring modern conservation movements.",
    sourcesNote: "Wildlife Protection Act of India, historical Khejarli archives.",
    relatedItemSlug: "bishnoi-environmental-ethos",
  },
  {
    id: "q-kyoto-machiya",
    questionText: "How did traditional Kyoto machiya survive earthquakes without concrete foundations?",
    category: "Places",
    answerSummary: "Machiya were constructed with flexible mortise-and-tenon timber joints and stone pillar footings that absorb seismic shocks.",
    answerBody: "Traditional Japanese carpentry uses no metallic bolts or nails. Instead, complex interlocking wooden joints (shiguchi) allow the frame to sway and dissipate seismic energy during tremors. Heavy earthen roof tiles and internal wooden pillars work in harmonic resonance with natural earth movements.",
    sourcesNote: "Kyoto Heritage Preservation Society & Architectural Institute of Japan.",
    relatedItemSlug: "kyoto-machiya-townhouses",
  },
  {
    id: "q-durga-clay",
    questionText: "Why are Kumartuli festival sculptures made from river clay rather than permanent stone or metal?",
    category: "Crafts",
    answerSummary: "The idols are intentionally ephemeral: sculpted from river silt and natural pigments so they dissolve cleanly back into the water.",
    answerBody: "Kumartuli artisans use clay gathered from the sacred Ganges (Hooghly River) mixed with rice husks and straw. When the festival concludes, the sculptures are immersed in the river (visarjan), symbolizing the philosophical return of temporary physical form back into cosmic nature without ecological damage.",
    sourcesNote: "West Bengal Heritage Commission documentation.",
    relatedItemSlug: "kumartuli-clay-sculpture",
  },
  {
    id: "q-cochineal-dye",
    questionText: "How do Zapotec weavers obtain bright crimson dye from cactus parasites?",
    category: "Crafts",
    answerSummary: "Cochineal scale insects that feed on prickly pear cacti are hand-harvested, dried in the sun, and ground into carminic acid.",
    answerBody: "In Oaxaca, Zapotec weavers have cultivated cochineal insects (Dactylopius coccus) on nopal pads for thousands of years. Ground dried insects produce intense crimson red. By adding lime juice (acid) or wood ash (alkaline), weavers alter the pH to create a wide palette ranging from fiery orange to deep royal purple.",
    sourcesNote: "Museo Textil de Oaxaca archives.",
    relatedItemSlug: "zapotec-textile-weaving",
  },
  {
    id: "q-fez-tanneries",
    questionText: "How do 1,000-year-old stone dye pits in Fez color leather without modern chemicals?",
    category: "Places",
    answerSummary: "Hides are softened in limestone and pigeon droppings, then dyed using vegetable colorants like poppy, saffron, and cedarwood.",
    answerBody: "The Chouara Tannery in Fez operates with methods unchanged since the 11th century. Tanners use natural enzymatic agents for curing, followed by soaking in vats filled with crushed poppy petals for red, turmeric and saffron for golden hues, and indigo for blues, producing world-renowned Moroccan leather.",
    sourcesNote: "UNESCO World Heritage Medina of Fez documentation.",
    relatedItemSlug: "chouara-tanneries-fez",
  },
];
