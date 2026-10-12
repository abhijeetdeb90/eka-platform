// ==============================================================================
// EKA BETA SITE FOOTER
// ==============================================================================
// Clean, minimal, compliant.
// Includes: Copyright, Essential cookies, Privacy, Terms, Accessibility, Modern Slavery
// ==============================================================================

import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E8E2D9] bg-[#FAF7F2] py-8 text-[#5C5C5C]">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Brand & Copyright */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
          <span className="font-serif font-semibold text-[#1A1A1A]">EKA</span>
          <span className="text-[#E8E2D9]">•</span>
          <span>© {currentYear} EKA Platform. All rights reserved.</span>
        </div>

        {/* Minimal privacy & cookie notice */}
        <p className="text-center text-[#5C5C5C] text-[11px]">
          Essential cookies only. No ad tracking. No behavioural profiling.
        </p>

        {/* Legal & Compliance Nav */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
          <Link to="/privacy" className="hover:text-[#1A1A1A] transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-[#1A1A1A] transition-colors">
            Terms
          </Link>
          <Link to="/standards" className="hover:text-[#1A1A1A] transition-colors">
            Standards
          </Link>
          <Link to="/accessibility" className="hover:text-[#1A1A1A] transition-colors">
            Accessibility
          </Link>
          <Link to="/modern-slavery" className="hover:text-[#1A1A1A] transition-colors">
            Modern Slavery
          </Link>
        </div>
      </div>
    </footer>
  );
}
