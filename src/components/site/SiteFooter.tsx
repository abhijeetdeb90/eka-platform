// ==============================================================================
// EKA BRANDED EDITORIAL FOOTER
// ==============================================================================
// - Brand & Mission: Logo, tagline, human provenance statement
// - Trust Badge: Respecting Personal Privacy & Cultural Heritage Rights
// - 4-Column Navigation: EXPLORE · FOR · TRUST · COMPANY
// - Legal & Grievance Notice with grievance@eka.earth & Non-medical disclaimer
// - Bottom Bar: Copyright 2026, Language indicator, Return to top button
// ==============================================================================

import { Link } from "@tanstack/react-router";
import { Globe, ArrowUp, ChevronDown } from "lucide-react";
import { EkaLogo } from "@/components/brand/Logo";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-[#E8E2D9] bg-[#FAFAFA] text-[#2D2B2A] py-12 sm:py-16 px-4 sm:px-8 font-sans">
      <div className="mx-auto max-w-[1200px]">
        {/* Top Grid: Brand & Mission + Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-12">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-5 space-y-5">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <EkaLogo
                size="md"
                withTagline={true}
                taglineText="CULTURAL INTELLIGENCE"
                className="text-[#1A1A1A]"
                textClassName="font-serif tracking-[0.15em] text-2xl font-medium text-[#1A1A1A]"
                taglineClassName="text-[10px] font-mono tracking-widest text-[#5E5C5A] uppercase block"
              />
            </div>

            {/* Tagline */}
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#2D2B2A] leading-snug">
              Explore places. Meet people. Understand traditions. Ask why.
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#5E5C5A] leading-relaxed max-w-md">
              Built on provenance, verified human traditions, ethical stewardship, and the open wisdom
              of humanity. No synthetic cultures, no algorithmic homogenisation.
            </p>

            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#2A7A4D] bg-[#2A7A4D]/8 px-3.5 py-1.5 rounded-full border border-[#2A7A4D]/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span>Respecting Personal Privacy & Cultural Heritage Rights</span>
            </div>
          </div>

          {/* Navigation Links Grid (4 Columns) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Column 1: EXPLORE */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold tracking-wider uppercase text-[#1A1A1A]">
                EXPLORE
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#5E5C5A]">
                <li>
                  <Link to="/discover" className="hover:text-[#C45C26] transition-colors">
                    Discover
                  </Link>
                </li>
                <li>
                  <Link to="/stories" className="hover:text-[#C45C26] transition-colors">
                    Stories
                  </Link>
                </li>
                <li>
                  <Link to="/feed" className="hover:text-[#C45C26] transition-colors">
                    Feed
                  </Link>
                </li>
                <li>
                  <Link to="/ask" className="hover:text-[#C45C26] transition-colors">
                    Ask EKA
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: FOR */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold tracking-wider uppercase text-[#1A1A1A]">
                FOR
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#5E5C5A]">
                <li>
                  <Link to="/create" className="hover:text-[#C45C26] transition-colors">
                    Creators
                  </Link>
                </li>
                <li>
                  <Link to="/membership" className="hover:text-[#C45C26] transition-colors">
                    Membership
                  </Link>
                </li>
                <li>
                  <Link to="/standards" className="hover:text-[#C45C26] transition-colors">
                    Stewardship
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="hover:text-[#C45C26] transition-colors">
                    Communities
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: TRUST */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold tracking-wider uppercase text-[#1A1A1A]">
                TRUST
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#5E5C5A]">
                <li>
                  <Link to="/standards" className="hover:text-[#C45C26] transition-colors">
                    Verification
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-[#C45C26] transition-colors">
                    Privacy (DPDP Act, 2023)
                  </Link>
                </li>
                <li>
                  <Link to="/standards" className="hover:text-[#C45C26] transition-colors">
                    Safety
                  </Link>
                </li>
                <li>
                  <Link to="/accessibility" className="hover:text-[#C45C26] transition-colors">
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: COMPANY */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold tracking-wider uppercase text-[#1A1A1A]">
                COMPANY
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#5E5C5A]">
                <li>
                  <Link to="/about" className="hover:text-[#C45C26] transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-[#C45C26] transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/modern-slavery" className="hover:text-[#C45C26] transition-colors">
                    Modern Slavery
                  </Link>
                </li>
                <li>
                  <a href="mailto:grievance@eka.earth" className="hover:text-[#C45C26] transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-[#E2DFD9] my-6" />

        {/* Legal & Notice */}
        <div className="text-xs text-[#5E5C5A] leading-relaxed mb-8">
          <p>
            <strong className="text-[#2D2B2A]">Legal & Grievance Notice:</strong> In full compliance with the{" "}
            <strong className="text-[#2D2B2A]">Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and international privacy standards. For personal data
            rights, consent withdrawal, content grievances, or copyright notices, contact our Grievance Desk at{" "}
            <a href="mailto:grievance@eka.earth" className="text-[#C45C26] underline hover:text-[#A34A1F]">
              grievance@eka.earth
            </a>
            . Non-medical disclaimer: Practices, discussions, and reflections on EKA are educational
            and contemplative in nature and do not substitute for professional medical, psychological,
            financial, or legal advice.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E2DFD9] text-xs text-[#5E5C5A]">
          <div>
            © {currentYear} EKA Cultural Knowledge Systems. One Within - One With All.
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E2DFD9] bg-white text-xs text-[#2D2B2A]">
              <Globe className="size-3.5 text-[#5E5C5A]" />
              <span>English</span>
              <ChevronDown className="size-3 text-[#5E5C5A]" />
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E2DFD9] bg-white text-xs text-[#2D2B2A] hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <span>Return to top</span>
              <ArrowUp className="size-3.5 text-[#C45C26]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
