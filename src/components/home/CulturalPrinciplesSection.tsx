import { Heart, Users, Sparkles, Compass, ShieldCheck, Clock } from "lucide-react";

const PRINCIPLES = [
  {
    icon: Heart,
    num: "PRINCIPLE 01",
    title: "People Before Algorithms",
    desc: "We never sort human connections by viral volatility or rage triggers. Conversations on EKA unfold at the natural, dignified speed of human reflection.",
    footer: "Chronological & contemplative cadence",
  },
  {
    icon: Users,
    num: "PRINCIPLE 02",
    title: "Culture Lives in Communities",
    desc: "Traditions are not museum artifacts or solitary aesthetics. They are living relationships carried by families, guilds, elders, and hearth keepers.",
    footer: "Active circles & living lineages",
  },
  {
    icon: Sparkles,
    num: "PRINCIPLE 03",
    title: "No Synthetic Cultures",
    desc: "AI is used strictly as an epistemic magnifier and inquiry assistant—never to hallucinate synthetic traditions, fake folklore, or simulated human communities.",
    footer: "Verified human stewardship",
  },
  {
    icon: Compass,
    num: "PRINCIPLE 04",
    title: "Universal Ground, Plural Expressions",
    desc: "Civilizations face identical existential transitions: birth, harvest, sorrow, and union. We elevate common human roots without erasing regional distinctions.",
    footer: "Comparative epistemic clarity",
  },
  {
    icon: ShieldCheck,
    num: "PRINCIPLE 05",
    title: "Cultural Heritage Rights",
    desc: "Indigenous lore and sacred ceremonies are treated with absolute reverence. Sacred secrets stay sacred; public beauty is shared with respectful consent.",
    footer: "Ethical stewardship & provenance",
  },
  {
    icon: Clock,
    num: "PRINCIPLE 06",
    title: "Built for Generational Permanence",
    desc: "Designed to endure beyond quarterly trend cycles. EKA protects the continuous generational memory of humanity against algorithmic forgetting.",
    footer: "Archival integrity & resilience",
  },
];

export function CulturalPrinciplesSection() {
  return (
    <section className="section-container border-b border-[#E8E2D9] py-16 px-4 sm:px-6 bg-white">
      <div className="mx-auto max-w-[1120px]">
        <div className="max-w-2xl mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1A1A1A] mb-3 tracking-tight">
            Built on principles that protect human warmth.
          </h2>
          <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed">
            Inspired by the early web belief in genuine connection, re-imagined for an age inundated
            with algorithmic noise, synthetic creators, and shallow feeds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRINCIPLES.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#E8E2D9] bg-[#FAFAFA] p-6 flex flex-col justify-between hover:border-[#C45C26]/40 transition-colors shadow-xs"
              >
                <div>
                  <div className="size-10 rounded-xl bg-white flex items-center justify-center text-[#C45C26] shadow-2xs mb-4 border border-[#E8E2D9]">
                    <Icon className="size-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold tracking-widest text-[#5C5C5C] uppercase block mb-1">
                    {p.num}
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#1A1A1A] mb-2 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="text-[11px] font-mono text-[#5C5C5C] border-t border-[#E8E2D9] pt-4 mt-5">
                  {p.footer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
