import { Link } from "@tanstack/react-router";

const DESTINATIONS = [
  {
    region: "North & Central India",
    pills: [
      { label: "Varanasi", query: "Varanasi" },
      { label: "Prayagraj", query: "Prayagraj" },
      { label: "Jaipur", query: "Jaipur" },
      { label: "Ayodhya", query: "Ayodhya" },
      { label: "Khajuraho", query: "Khajuraho" },
    ],
  },
  {
    region: "East & Northeast India",
    pills: [
      { label: "Kolkata", query: "Kolkata" },
      { label: "Majuli", query: "Majuli" },
      { label: "Meghalaya", query: "Meghalaya" },
      { label: "Puri", query: "Puri" },
      { label: "Bodh Gaya", query: "Bodh Gaya" },
    ],
  },
  {
    region: "South India",
    pills: [
      { label: "Kerala Backwaters", query: "Kerala Backwaters" },
      { label: "Hampi", query: "Hampi" },
      { label: "Madurai", query: "Madurai" },
      { label: "Tirupati", query: "Tirupati" },
      { label: "Aranmula", query: "Aranmula" },
    ],
  },
  {
    region: "West India",
    pills: [
      { label: "Rann of Kutch", query: "Kutch" },
      { label: "Ajanta & Ellora", query: "Ajanta" },
      { label: "Old Goa", query: "Goa" },
      { label: "Jodhpur", query: "Jodhpur" },
      { label: "Thar Desert", query: "Thar" },
    ],
  },
  {
    region: "Global Lineages",
    pills: [
      { label: "Kyoto", query: "Kyoto" },
      { label: "Fez Medina", query: "Fez" },
      { label: "Oaxaca", query: "Oaxaca" },
      { label: "Jerusalem", query: "Jerusalem" },
      { label: "Crete", query: "Crete" },
    ],
  },
];

const CATEGORY_TAGS = [
  { label: "Sacred Rituals", query: "Rituals" },
  { label: "Master Crafts & GI Guilds", query: "Crafts" },
  { label: "Temple Prasadam & Foodways", query: "Foodways" },
  { label: "Sacred Architecture", query: "Architecture" },
  { label: "Living Oral Lore", query: "Oral Lore" },
  { label: "Seasonal Festivals", query: "Festivals" },
  { label: "Sacred Rivers & Geography", query: "Sacred Places" },
  { label: "Epistemic Traditions", query: "Traditions" },
];

export function DestinationLineageSection() {
  return (
    <section className="section-container border-b border-[#E8E2D9] py-16 px-4 sm:px-6 bg-white">
      <div className="mx-auto max-w-[1120px]">
        <div className="max-w-2xl mb-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1A1A1A] mb-2 tracking-tight">
            Explore by Destination & Lineage
          </h2>
          <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed">
            Dynamic cultural topography spanning sacred confluences, craft villages, and living global traditions.
          </p>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {DESTINATIONS.map((dest, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#E8E2D9] bg-[#FAFAFA] p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <h3 className="font-serif text-sm font-medium text-[#1A1A1A] pb-2.5 mb-3 border-b border-[#E8E2D9]">
                  {dest.region}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {dest.pills.map((pill, pIdx) => (
                    <Link
                      key={pIdx}
                      to="/discover"
                      search={{ q: pill.query } as any}
                      className="px-2.5 py-1 rounded-full bg-white border border-[#E8E2D9] text-[11px] text-[#5C5C5C] hover:text-[#C45C26] hover:border-[#C45C26] transition-colors"
                    >
                      {pill.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explore by Cultural Category */}
        <div className="mt-10 pt-8 border-t border-[#E8E2D9]">
          <span className="text-[11px] font-mono tracking-wider text-[#C45C26] uppercase font-bold block mb-3">
            EXPLORE BY CULTURAL CATEGORY:
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_TAGS.map((cat, idx) => (
              <Link
                key={idx}
                to="/discover"
                search={{ q: cat.query } as any}
                className="px-3.5 py-1.5 rounded-full bg-[#FAFAFA] border border-[#E8E2D9] text-xs font-medium text-[#1A1A1A] hover:bg-[#C45C26] hover:text-white hover:border-[#C45C26] transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
