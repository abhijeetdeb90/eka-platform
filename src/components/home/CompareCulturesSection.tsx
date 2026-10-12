import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Globe, ArrowRight } from "lucide-react";

const COMPARISON_TOPICS = [
  {
    id: "coming-of-age",
    label: "Coming-of-Age Ceremonies",
    question: '"When does a child become an adult?"',
    description:
      "Every society marks the moment childhood ends—not with a lone birthday cake, but with a community rite testing character, conferring sacred knowledge, and welcoming youth into lifelong duty.",
    cards: [
      {
        countryCode: "IN",
        region: "PAN-INDIA",
        culture: "India & South Asia",
        riteName: "→ Upanayana & Regional Rites",
        desc: "Investiture of the sacred cord (Yajnopavita), initiation into Gayatri mantra, student vow (Brahmacharya).",
        quote: '"Symbolizes a \'second birth\' through knowledge and lifelong ethical discipline."',
      },
      {
        countryCode: "JP",
        region: "JAPAN",
        culture: "Japan",
        riteName: "→ Seijin-shiki (Coming of Age)",
        desc: "National day where 20-year-olds dress in traditional furisode kimono, visiting municipal halls and shrines.",
        quote: '"Accepting adulthood as an obligation of public harmony, civic responsibility, and ancestor honor."',
      },
      {
        countryCode: "IL",
        region: "DIASPORA",
        culture: "Jewish Communities",
        riteName: "→ Bar / Bat Mitzvah",
        desc: "Reading Torah portion publicly at age 12–13 before the assembled minyan, taking personal moral accountability.",
        quote: '"A youth becomes a full moral agent bound by covenant and communal justice."',
      },
      {
        countryCode: "MX",
        region: "LATIN AMERICA",
        culture: "Latin America",
        riteName: "→ Quinceañera",
        desc: "At fifteen years old, a Thanksgiving Mass, formal court of honor, changing flat shoes to heels, and father-daughter waltz.",
        quote: '"Marks the journey from childhood innocence into womanhood, community faith, and maternal duty."',
      },
      {
        countryCode: "KE",
        region: "EAST AFRICA",
        culture: "Maasai People",
        riteName: "→ Emuratare & Warrior Transition",
        desc: "Rigorous wilderness training, physical endurance, and rites to become Moran (warrior protectors of the community).",
        quote: '"Courage without flinching proves readiness to guard community cattle, pasture, and heritage."',
      },
    ],
  },
  {
    id: "sacred-light",
    label: "Sacred Light & Living Flame",
    question: '"Why do human beings return fire to the darkness?"',
    description:
      "Across civilizations, fire is not merely heat—it is the first witness of human communion, symbolizing the indestructible divine spark within material darkness.",
    cards: [
      {
        countryCode: "IN",
        region: "VARANASI & AYODHYA",
        culture: "Indic Traditions",
        riteName: "→ Deepam & Aarti Lamps",
        desc: "Offering tiered brass lamps filled with sesame or camphor to sacred rivers and deities at dusk.",
        quote: '"Tamaso ma jyotir gamaya: Lead us from darkness into everlasting light."',
      },
      {
        countryCode: "SE",
        region: "SCANDINAVIA",
        culture: "Nordic Heritage",
        riteName: "→ Saint Lucia Festival of Light",
        desc: "Processions led by a youth wearing an evergreen crown with lit candles during the darkest winter solstice days.",
        quote: '"Defying long polar shadows with living flame, singing songs of hope and daylight\'s return."',
      },
      {
        countryCode: "IR",
        region: "PERSIA",
        culture: "Persian Tradition",
        riteName: "→ Chaharshanbe Suri (Fire Jumping)",
        desc: "Bonfires lit on the eve of the last Wednesday before Nowruz, jumping over flames asking for vitality.",
        quote: '"Give me your fiery redness, take my pale sickness—renewal through pure living ember."',
      },
      {
        countryCode: "TH",
        region: "THAILAND",
        culture: "Siam / Southeast Asia",
        riteName: "→ Loy Krathong Water Lanterns",
        desc: "Floating banana-leaf baskets carrying candles, incense, and prayers onto rivers under the full moon.",
        quote: '"Releasing past grievances downriver to honour the Water Goddess Phra Mae Khongkha."',
      },
    ],
  },
  {
    id: "fasting-renunciation",
    label: "Sacred Fasting & Renunciation",
    question: '"Why do civilizations voluntarily embrace hunger?"',
    description:
      "Voluntary renunciation transforms an instinct for physical consumption into spiritual clarity, collective empathy with the poor, and masterly self-sovereignty.",
    cards: [
      {
        countryCode: "IN",
        region: "JAIN TRADITION",
        culture: "Jainism",
        riteName: "→ Paryushana & Upvas",
        desc: "Annual fasting periods dedicated to soul purification, ahimsa (non-violence), and seeking Michhami Dukkadam forgiveness.",
        quote: '"Conquering the sensory appetites to restore the innate radiance of the soul."',
      },
      {
        countryCode: "SA",
        region: "GLOBAL ISLAM",
        culture: "Islamic World",
        riteName: "→ Ramadan Sawm",
        desc: "Dawn-to-dusk abstention from food, drink, and anger for thirty days, broken communally with dates at Iftar.",
        quote: '"Cultivating Taqwa (God-consciousness), Quranic recitation, and direct solidarity with the hungry."',
      },
      {
        countryCode: "GR",
        region: "EASTERN MEDITERRANEAN",
        culture: "Christian Orthodoxy",
        riteName: "→ Great Lent (Megali Sarakosti)",
        desc: "Forty days of strict vegan plant-based diet, quiet repentance, and almsgiving leading to Pascha.",
        quote: '"Lightening the physical vessel so the inner prayer may ascend unobstructed."',
      },
      {
        countryCode: "US",
        region: "NORTH AMERICA",
        culture: "Lakota Indigenous Nations",
        riteName: "→ Hanblecheyapi (Vision Quest)",
        desc: "Four days and nights fasting isolated on a sacred hill without food or water to seek guidance from the Great Spirit.",
        quote: '"Surrendering physical sustenance to receive spiritual vision for the tribe\'s survival."',
      },
    ],
  },
];

export function CompareCulturesSection() {
  const [activeTab, setActiveTab] = useState(COMPARISON_TOPICS[0].id);

  const currentTopic =
    COMPARISON_TOPICS.find((t) => t.id === activeTab) || COMPARISON_TOPICS[0];

  return (
    <section className="section-container border-b border-[#E8E2D9] py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-[1120px]">
        {/* Meta Header */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3EDE6] text-xs font-mono font-semibold uppercase tracking-wider text-[#C45C26]">
            ✨ COMPARE CULTURES
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-stone-100 text-xs font-mono text-[#5C5C5C]">
            Epistemic Rigor Standard
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1A1A1A] mb-3 tracking-tight">
          Different cultures. Similar human questions.
        </h2>
        <p className="text-sm sm:text-base text-[#5C5C5C] max-w-3xl mb-8 leading-relaxed">
          Understand how civilizations resolve universal questions of light, transition, marriage,
          movement, and sacred space—distinguishing verified historical transmission from parallel human evolution.
        </p>

        {/* Topic Category Tabs */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 mb-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {COMPARISON_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setActiveTab(topic.id)}
              className={`shrink-0 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-colors border ${
                activeTab === topic.id
                  ? "bg-[#C45C26] text-white border-[#C45C26] shadow-xs"
                  : "bg-white text-[#5C5C5C] border-[#E8E2D9] hover:text-[#1A1A1A] hover:bg-[#F3EDE6]"
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* Featured Question Box */}
        <div className="rounded-2xl bg-[#FAFAFA] border border-[#E8E2D9] p-6 sm:p-10 text-center mb-8 shadow-xs">
          <span className="text-[11px] font-mono tracking-widest text-[#C45C26] uppercase font-bold block mb-2">
            THE UNIVERSAL HUMAN QUESTION
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl italic text-[#1A1A1A] font-medium my-2">
            {currentTopic.question}
          </h3>
          <p className="text-xs sm:text-sm text-[#5C5C5C] max-w-2xl mx-auto leading-relaxed mt-2">
            {currentTopic.description}
          </p>
        </div>

        {/* Cultural Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {currentTopic.cards.map((card, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#E8E2D9] bg-white p-5 flex flex-col justify-between space-y-3 hover:border-[#C45C26]/40 transition-colors shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-[#5C5C5C] mb-2">
                  <span className="bg-white px-2 py-0.5 rounded border border-[#E8E2D9]">
                    {card.countryCode}
                  </span>
                  <span className="truncate max-w-[120px]">{card.region}</span>
                </div>
                <h4 className="font-serif text-base font-medium text-[#1A1A1A] mb-1">
                  {card.culture}
                </h4>
                <p className="text-xs font-medium text-[#C45C26] mb-2">{card.riteName}</p>
                <p className="text-xs text-[#5C5C5C] leading-relaxed line-clamp-3">
                  {card.desc}
                </p>
              </div>

              <div className="text-[11px] italic text-[#5C5C5C] border-t border-[#E8E2D9] pt-3 mt-auto">
                {card.quote}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
