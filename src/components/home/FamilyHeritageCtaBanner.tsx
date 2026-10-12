import { Link } from "@tanstack/react-router";
import { Feather, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FamilyHeritageCtaBanner() {
  return (
    <section className="section-container py-14 px-4 sm:px-6">
      <div className="mx-auto max-w-[1120px]">
        <div className="rounded-3xl bg-[#1A1918] text-white p-8 sm:p-16 text-center space-y-6 shadow-xl border border-stone-800">
          <span className="text-xs font-mono tracking-widest text-[#C45C26] uppercase font-bold block">
            ONE WITHIN • ONE WITH ALL
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-tight max-w-2xl mx-auto">
            Your story belongs here.
          </h2>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
            A family memory, a local tradition, a festival, or a craft worth preserving.
            <br className="hidden sm:inline" />
            Share it as an article, video, or image with a community that values every story.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              asChild
              className="rounded-full bg-[#C45C26] hover:bg-[#A34A1F] text-white text-sm font-medium px-7 py-3.5 h-auto shadow-md"
            >
              <Link to="/create">
                <Feather className="size-4 mr-2" />
                <span>Share Your Story With Us</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20 text-sm font-medium px-7 py-3.5 h-auto"
            >
              <Link to="/standards">
                <BookOpen className="size-4 mr-2" />
                <span>Oral History Guidelines</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
