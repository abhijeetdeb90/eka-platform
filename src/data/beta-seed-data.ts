// ==============================================================================
// EKA BETA SEED DATA: PLACES, PRACTICES, CRAFTS, & QUESTIONS
// ==============================================================================
// Purely public, factual, widely documented cultural practices and places.
// Zero invented figures, zero secret techniques, zero unearned badges.
// ==============================================================================

export interface PlaceOrPractice {
  id: string;
  slug: string;
  title: string;
  category: "Places" | "Practices" | "Crafts";
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
    id: "item-varanasi-aarti",
    slug: "ganga-aarti-varanasi",
    title: "Ganga Aarti in Varanasi",
    category: "Practices",
    location: "Varanasi, India",
    summary: "An evening devotional ritual held along the stone ghats of the Ganges, using tiered brass lamps and rhythmic chanting.",
    body: "Every evening at twilight, priests gather at Dashashwamedh Ghat on the banks of the sacred Ganges River to perform the Ganga Aarti. The ritual involves multi-tiered brass lamps filled with oil or camphor, circled in rhythmic patterns in devotion to the river, considered sacred in Indic traditions. Thousands of pilgrims, residents, and visitors sit along the steps and in boats on the river to witness the prayer of gratitude.",
    imagePath: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Evening aarti ceremony at Dashashwamedh Ghat, Varanasi — illustrative",
    relatedQuestionIds: ["q-varanasi-sacred", "q-aarti-lamps"],
  },
  {
    id: "item-japanese-tea-ceremony",
    slug: "japanese-tea-ceremony",
    title: "The Way of Tea (Chanoyu)",
    category: "Practices",
    location: "Kyoto, Japan",
    summary: "A ceremonial preparation and presentation of powdered green tea (matcha) centered on mindfulness, hospitality, and seasonal harmony.",
    body: "Chanoyu, commonly known in English as the Japanese tea ceremony, evolved from Zen Buddhist practices and was refined by masters like Sen no Rikyu in the 16th century. It emphasizes four primary principles: harmony (wa), respect (kei), purity (sei), and tranquility (jaku). Every aspect—from the architecture of the tearoom and the garden path to the design of the ceramic bowl and bamboo whisk—encourages mindfulness of the present moment.",
    imagePath: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Ceremonial preparation of matcha with bamboo whisk, Kyoto — illustrative",
    relatedQuestionIds: ["q-tea-ceremony", "q-kyoto-zen"],
  },
  {
    id: "item-kyoto-machiya",
    slug: "kyoto-machiya-townhouses",
    title: "Kyoto Machiya Townhouses",
    category: "Places",
    location: "Kyoto, Japan",
    summary: "Traditional wooden vernacular merchant homes featuring narrow streetfronts, inner courtyard gardens, and timber joinery.",
    body: "Machiya are traditional wooden townhouses that defined Kyoto's urban landscape for centuries. Traditionally built without metallic nails using complex mortise-and-tenon timber joinery, they typically had narrow street frontages with long depths extending back, historically earning them the nickname 'eel's beds'. They feature inner courtyard gardens (tsuboniwa) that provide cross-ventilation, light, and a daily connection to nature.",
    imagePath: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Traditional preserved machiya street architecture, Kyoto — illustrative",
    relatedQuestionIds: ["q-kyoto-machiya"],
  },
  {
    id: "item-aranmula-mirror",
    slug: "aranmula-kannadi",
    title: "Aranmula Metal Mirror",
    category: "Crafts",
    location: "Kerala, India",
    summary: "A front-reflecting metal mirror cast from a copper-tin bronze alloy in the village of Aranmula, protected by Geographical Indication.",
    body: "Aranmula Kannadi is a rare handmade metal-alloy mirror originating from Aranmula in Kerala, India. Unlike standard mirrors that reflect light from a mercury or silver coating behind a pane of glass, this mirror reflects light directly from its polished bronze surface, eliminating secondary refraction and chromatic distortion. Recognized with a Geographical Indication (GI) tag, it remains an iconic example of historical metallurgy.",
    imagePath: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Traditional polished metal craftwork, Kerala — illustrative",
    relatedQuestionIds: ["q-aranmula-mirror"],
  },
  {
    id: "item-bishnoi-ethos",
    slug: "bishnoi-environmental-ethos",
    title: "Bishnoi Ecological Ethos",
    category: "Practices",
    location: "Rajasthan, India",
    summary: "A community ethic rooted in 29 principles that mandate strict protection of desert trees and wild fauna.",
    body: "The Bishnoi are a desert-dwelling community primarily living in the Thar Desert of Rajasthan, India. Founded in the 15th century by Guru Jambheshwar, their faith centers around 29 tenets, two of which strictly prohibit felling green trees (particularly the native Khejri tree) and harming any wild animals, including desert blackbucks and chinkaras. This centuries-old environmental ethos has created biodiverse oases across arid landscapes.",
    imagePath: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Protected arid landscape and wildlife habitat, Rajasthan — illustrative",
    relatedQuestionIds: ["q-bishnoi-ethos"],
  },
  {
    id: "item-kumartuli-clay",
    slug: "kumartuli-clay-sculpture",
    title: "Kumartuli Clay Artistry",
    category: "Crafts",
    location: "Kolkata, India",
    summary: "Seasonal sculpting of festival deities made from river silt clay, straw armatures, and biodegradable natural pigments.",
    body: "Located on the banks of the Hooghly River in North Kolkata, Kumartuli is a historic artisans' quarter known for sculpting life-sized clay idols of Durga and other deities. Artisans begin by crafting an internal bamboo and straw frame, over which multiple layers of alluvium river silt (Ganga mitti) are modeled by hand before being painted with natural chalk, tamarind-seed binder, and earth pigments.",
    imagePath: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Artisan clay modeling quarter in Kumartuli, Kolkata — illustrative",
    relatedQuestionIds: ["q-durga-clay"],
  },
  {
    id: "item-zapotec-weaving",
    slug: "zapotec-textile-weaving",
    title: "Zapotec Natural Dye Weaving",
    category: "Crafts",
    location: "Oaxaca, Mexico",
    summary: "Handloom wool weaving utilizing natural colorants extracted from cochineal insects, wild indigo plants, and tree bark.",
    body: "In the Central Valleys of Oaxaca, particularly villages like Teotitlán del Valle, Zapotec artisan families have preserved handloom textile weaving techniques across centuries. Sheep wool is spun and dyed using wild botanical and organic ingredients: red from dried cochineal insects harvested on nopal cactus, blues from fermented indigo leaves, and yellows from marigold flowers or tree bark.",
    imagePath: "https://images.unsplash.com/photo-1512816943410-14e606b83e85?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Natural dyed wool textiles, Oaxaca — illustrative",
    relatedQuestionIds: ["q-cochineal-dye"],
  },
  {
    id: "item-chouara-tanneries",
    slug: "chouara-tanneries-fez",
    title: "Chouara Tanneries of Fez",
    category: "Places",
    location: "Fez, Morocco",
    summary: "A medieval open-air tannery where hides are processed and dyed in historic stone vats using natural ingredients.",
    body: "The Chouara Tannery in the old medina of Fez, Morocco, has operated in largely the same format since the 11th century. Hides are soaked in white vats containing natural lime and salt to soften, then transferred to round earthen pots containing natural colorants such as poppy flowers for red, saffron for yellow, and cedarwood for brown. It is a prominent UNESCO World Heritage feature of Fez.",
    imagePath: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Historic stone dyeing vats at Chouara Tannery, Fez — illustrative",
    relatedQuestionIds: ["q-fez-tanneries"],
  },
];

export const BETA_ASK_QUESTIONS: AskQuestionItem[] = [
  {
    id: "q-varanasi-sacred",
    questionText: "Why is Varanasi considered one of the oldest sacred cities?",
    category: "Places",
    answerSummary: "Varanasi has had continuous human settlement for thousands of years, celebrated in literature and pilgrimage for its unique riverside geography where the Ganges curves northward.",
    answerBody: "Situated along the crescent bend of the Ganges River, Varanasi (historically known as Kashi or Banaras) is revered across Indic philosophies as a site of pilgrimage and liberation. Historically, its geography where the river turns north toward its Himalayan source made it an ancient crossroads for philosophers, poets, scholars, and spiritual seekers. It remains one of the world's oldest continuously inhabited urban centers.",
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
