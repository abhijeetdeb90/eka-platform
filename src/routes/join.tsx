import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/join")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Join EKA — Beta" },
      {
        name: "description",
        content: "Get updates as we grow the library of places and practices.",
      },
    ],
  }),
  component: JoinPage,
});

function JoinPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white border border-[#E8E2D9] rounded-xl p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F3EDE6] text-[#C45C26] mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h1 className="font-serif text-2xl font-semibold mb-2">You're on the list</h1>
              <p className="text-sm text-[#5C5C5C] leading-relaxed mb-6">
                Thank you for joining. We'll send you quiet, periodic updates as new places, crafts, and practices are documented.
              </p>
              <Link
                to="/discover"
                className="inline-block px-5 py-2.5 rounded-lg bg-[#C45C26] hover:bg-[#A34A1F] text-white text-sm font-medium transition-colors"
              >
                Explore Discover
              </Link>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F3EDE6] text-[#5C5C5C] mb-3">
                  BETA
                </span>
                <h1 className="font-serif text-3xl font-semibold text-[#1A1A1A] tracking-tight">
                  Join EKA
                </h1>
                <p className="mt-2 text-sm text-[#5C5C5C] leading-relaxed">
                  Get updates as we grow the library of places and practices.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-[#5C5C5C] mb-1.5">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-12 px-3.5 rounded-lg border border-[#E8E2D9] bg-white text-sm text-[#1A1A1A] placeholder:text-[#5C5C5C]/60 focus:outline-none focus:ring-2 focus:ring-[#C45C26]"
                  />
                </div>

                {error && (
                  <p className="text-xs text-[#B42318]">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full h-12 rounded-lg bg-[#C45C26] hover:bg-[#A34A1F] text-white font-medium text-sm transition-colors"
                >
                  Get updates
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-[#E8E2D9] text-center">
                <p className="text-xs text-[#5C5C5C]">
                  Existing account or contributor?{" "}
                  <Link to="/auth" className="text-[#C45C26] hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
