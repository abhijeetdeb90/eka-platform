import React from "react";
import { Link } from "@tanstack/react-router";
import { Volume2, Play, Pause, Bookmark, Sparkles, Clock, MapPin, Award, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface OralChant {
  id: string;
  title: string;
  tradition: string;
  region: string;
  duration: string;
  practitioner: string;
  lineage: string;
  audioSample: string;
  summary: string;
  image: string;
}

const ORAL_CHANTS_DATA: OralChant[] = [
  {
    id: "chant-aranmula",
    title: "Aranmula Metallurgic Shloka",
    tradition: "Lost-Wax Bronze Metallurgy",
    region: "Aranmula, Kerala",
    duration: "4:12",
    practitioner: "S. Janardhanan Achari",
    lineage: "Hereditary Guild Lineage (8th Gen)",
    audioSample: "Rhythmic oral proportions chanted during copper-tin crucible pour at dawn.",
    summary: "The secret 70:30 bell-metal alloy ratio is never committed to parchment; it is recited exclusively in Sanskrit-Malayalam metre while melting ore.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "chant-svaneti",
    title: "Svaneti Polyphonic Solstice Hymn",
    tradition: "Caucasian Highland Polyphony",
    region: "Mestia, Svaneti, Georgia",
    duration: "3:45",
    practitioner: "Guram Chartolani",
    lineage: "Svan Highland Elder Choir",
    audioSample: "Unaccompanied three-voice acoustic dissonances recorded inside stone defense towers.",
    summary: "Pre-Christian solstice chants preserved in untranslated medieval Svan dialect, sung to protect high-altitude rye seed harvests.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "chant-nizamuddin",
    title: "Nizamuddin Qawwali Zikr Harmonics",
    tradition: "Chishti Sufi Zikr",
    region: "Delhi, India",
    duration: "5:20",
    practitioner: "Ustad Meraj Nizami Lineage",
    lineage: "750-year Shrine Qawwal Lineage",
    audioSample: "Hand-pumped harmonium and syncopated clapping building into meditative trance.",
    summary: "Thirteenth-century Persian verses by Amir Khusrau sung in the open courtyard on Thursday twilights, fostering shared interfaith sanctuary.",
    image: "https://images.unsplash.com/photo-1512816943410-14e606b83e85?auto=format&fit=crop&w=500&q=80",
  },
];

export function StitchOralChantsSection() {
  const [playingId, setPlayingId] = React.useState<string | null>(null);

  const togglePlay = (id: string, title: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      toast.info(`Listening to audio archive: ${title}`);
    }
  };

  return (
    <section className="container-eka mt-16 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/70 text-terracotta font-mono text-[10px] uppercase tracking-wider font-semibold mb-2">
            <Volume2 className="size-3.5" />
            Format A • Living Audio Lore
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
            Sacred Oral Chants & Field Recordings
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mt-1">
            High-fidelity recordings of lineage chants, workshop verses, and ancestral meters that were never meant to be flattened into silent text.
          </p>
        </div>
        <Link
          to="/stories"
          className="text-xs font-semibold text-terracotta hover:underline flex items-center gap-1 shrink-0"
        >
          <span>View all 120+ recordings</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ORAL_CHANTS_DATA.map((item) => {
          const isPlaying = playingId === item.id;
          return (
            <article
              key={item.id}
              className="flex flex-col rounded-2xl bg-card border border-border/80 overflow-hidden shadow-xs hover:border-terracotta/40 hover:shadow-calm transition-all justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-accent/40">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-[10px] font-mono">
                    <span className="bg-terracotta/90 backdrop-blur-md px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                      {item.tradition}
                    </span>
                    <span className="bg-black/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="size-3" />
                      {item.duration}
                    </span>
                  </div>

                  {/* Play Action Strip */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div className="flex items-center gap-1.5 text-xs">
                      <MapPin className="size-3.5 text-amber-300" />
                      <span className="text-white/90 text-[11px] font-medium">{item.region}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => togglePlay(item.id, item.title)}
                      className="size-9 rounded-full bg-terracotta text-white hover:bg-terracotta/90 flex items-center justify-center shadow-md transition-transform hover:scale-105"
                      title={isPlaying ? "Pause Chant" : "Play Chant"}
                    >
                      {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-terracotta tracking-wider font-semibold">
                      {item.lineage}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-foreground leading-snug mt-0.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Recited by {item.practitioner}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>

                  <div className="rounded-xl bg-accent/40 p-2.5 text-[11px] italic text-muted-foreground/90 border border-border/40">
                    "{item.audioSample}"
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                    <Award className="size-3.5" />
                    Verified Custodian
                  </span>
                  <button
                    type="button"
                    onClick={() => toast.success("Saved to your personal Lore Vault in My EKA.")}
                    className="text-muted-foreground hover:text-foreground text-[11px] flex items-center gap-1 font-medium"
                  >
                    <Bookmark className="size-3.5" />
                    <span>Save Lore</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
