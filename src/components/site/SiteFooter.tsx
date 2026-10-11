// ==============================================================================
// EKA BETA SITE FOOTER
// ==============================================================================
// Simple, low contrast, privacy one-liner, essential cookies note, no ad tracking
// ==============================================================================

import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E8E2D9] bg-[#FAF7F2] py-8 text-[#5C5C5C]">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-serif font-semibold text-[#1A1A1A]">EKA</span>
          <span>•</span>
          <span>Curated cultural discovery</span>
        </div>

        <p className="text-center sm:text-left text-[#5C5C5C]">
          Essential cookies only. No ad tracking. No behavioural profiling.
        </p>

        <div className="flex items-center gap-4">
          <Link to="/discover" className="hover:text-[#1A1A1A] transition-colors">
            Discover
          </Link>
          <Link to="/ask" className="hover:text-[#1A1A1A] transition-colors">
            Ask EKA
          </Link>
          <Link to="/join" className="hover:text-[#1A1A1A] transition-colors">
            Join
          </Link>
        </div>
      </div>
    </footer>
  );
}
