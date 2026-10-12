import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TwoDoorwaysSection() {
  return (
    <section className="section-container border-b border-[#E8E2D9] py-16 px-4 sm:px-6 bg-white">
      <div className="mx-auto max-w-[1120px]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-mono tracking-widest text-[#C45C26] uppercase font-bold block mb-2">
            ARCHITECTURAL CLARITY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1A1A1A] mb-3 tracking-tight">
            Two Complementary Ways to Experience EKA
          </h2>
          <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed">
            Whether you seek quiet solitary exploration or wish to build lasting bonds with culture bearers,
            both doorways are open.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doorway 1 */}
          <div className="rounded-2xl border border-[#E8E2D9] bg-white p-7 sm:p-9 flex flex-col justify-between shadow-xs hover:border-[#C45C26]/40 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs mb-4">
                <span className="rounded-full bg-[#F3EDE6] px-3 py-1 font-mono text-[11px] font-semibold text-[#5C5C5C]">
                  PUBLIC & OPEN ACCESS
                </span>
                <span className="text-[#5C5C5C] text-xs font-mono">No Sign-in Required</span>
              </div>
              <h3 className="font-serif text-2xl font-medium text-[#1A1A1A] mb-3">
                Doorway 01: Explore Living Culture
              </h3>
              <p className="text-sm text-[#5C5C5C] leading-relaxed">
                A serene cartographic and archival atlas of human ingenuity. Wander through master craft folios,
                sacred geographies, seasonal festivals, and high-fidelity oral recordings freely.
              </p>
            </div>

            <Button
              asChild
              className="w-full mt-8 rounded-xl bg-[#F0EBE1] hover:bg-[#E5DEC7] text-[#1A1A1A] text-sm font-medium py-3.5 justify-between px-5 shadow-none transition-colors"
            >
              <Link to="/discover">
                <span>Explore Public World Atlas</span>
                <ArrowRight className="size-4 text-[#C45C26]" />
              </Link>
            </Button>
          </div>

          {/* Doorway 2 */}
          <div className="rounded-2xl border border-[#E8E2D9] bg-white p-7 sm:p-9 flex flex-col justify-between shadow-xs hover:border-[#C45C26]/40 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs mb-4">
                <span className="rounded-full bg-[#C45C26]/10 px-3 py-1 font-mono text-[11px] font-semibold text-[#C45C26]">
                  LIVING COMMUNITY
                </span>
                <span className="text-[#2A7A4D] text-xs font-mono font-medium">● Human Verified</span>
              </div>
              <h3 className="font-serif text-2xl font-medium text-[#1A1A1A] mb-3">
                Doorway 02: Find Your People
              </h3>
              <p className="text-sm text-[#5C5C5C] leading-relaxed">
                Join hearth circles gathered around heirloom foodways, ancient languages, artisan guilds,
                and local histories. Meet real stewards and engage in thoughtful dialogue.
              </p>
            </div>

            <Button
              asChild
              className="w-full mt-8 rounded-xl bg-[#C45C26] hover:bg-[#A34A1F] text-white text-sm font-medium py-3.5 justify-between px-5 shadow-xs transition-colors"
            >
              <Link to="/feed">
                <span>Discover Living Hearths</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
