// ==============================================================================
// EKA BETA SITE HEADER
// ==============================================================================
// Logo + BETA badge, Nav (Home, Discover, Ask EKA), Language selector, Join button
// Height: 64px, border-bottom: #E8E2D9, background: #FAF7F2/90
// ==============================================================================

import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ArrowRight, Plus, User } from "lucide-react";
import { EkaLogo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { data: profile } = useProfile();

  const navLinks = [
    { label: "Home", to: "/", exact: true },
    { label: "Discover", to: "/discover" },
    { label: "Stories", to: "/stories" },
    { label: "Feed", to: "/feed" },
    { label: "Ask EKA", to: "/ask" },
  ];

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-[#E8E2D9] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1120px] items-center justify-between px-4 sm:px-6">
        {/* Brand: Logo + BETA pill */}
        <div className="flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <EkaLogo
              size="sm"
              withTagline={false}
              className="text-[#1A1A1A]"
              textClassName="font-serif tracking-widest text-lg font-semibold text-[#1A1A1A]"
            />
          </Link>
          <span className="inline-flex items-center rounded-full bg-[#F3EDE6] px-2 py-0.5 text-[11px] font-medium tracking-wide text-[#5C5C5C]">
            BETA
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = link.exact
              ? currentPath === link.to
              : currentPath.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#1A1A1A] font-semibold bg-[#F3EDE6]"
                    : "text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[#F3EDE6]/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA: Create + Profile / Join */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-full border-[#E8E2D9] bg-white hover:bg-[#F3EDE6] text-[#1A1A1A] px-4 py-1.5 text-xs font-medium shadow-none transition-colors"
          >
            <Link to="/create" className="inline-flex items-center gap-1.5">
              <Plus className="size-3.5 text-[#C45C26]" />
              <span>Create</span>
            </Link>
          </Button>

          {profile ? (
            <Button
              asChild
              size="sm"
              className="rounded-full bg-[#C45C26] hover:bg-[#A34A1F] text-white px-4 py-1.5 text-xs font-medium shadow-none transition-colors"
            >
              <Link to="/my-eka" className="inline-flex items-center gap-1.5">
                <User className="size-3.5" />
                <span>{profile.display_name?.split(" ")[0] || "Profile"}</span>
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              className="rounded-full bg-[#C45C26] hover:bg-[#A34A1F] text-white px-5 py-2 text-xs font-medium shadow-none transition-colors"
            >
              <Link to="/auth">
                <span>Sign In</span>
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            asChild
            size="sm"
            className="rounded-full bg-[#C45C26] hover:bg-[#A34A1F] text-white px-3.5 py-1 text-xs font-medium shadow-none"
          >
            <Link to="/join">Join</Link>
          </Button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#1A1A1A] hover:bg-[#F3EDE6]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8E2D9] bg-white px-4 py-4 space-y-3 shadow-md">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-[#F3EDE6]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#C45C26] hover:bg-[#F3EDE6]"
            >
              + Create Post
            </Link>
            <Link
              to="/my-eka"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-[#F3EDE6]"
            >
              {profile ? "My Profile" : "Sign In / Profile"}
            </Link>
          </nav>
          <div className="pt-2 border-t border-[#E8E2D9] flex items-center justify-between">
            <span className="text-xs text-[#5C5C5C]">Language: English</span>
            <Link
              to="/join"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-medium text-[#C45C26] hover:underline"
            >
              Join updates →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
