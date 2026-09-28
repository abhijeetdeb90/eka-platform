import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Cookie, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "eka_cookie_consent_v1";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        // Small delay so it doesn't jarringly pop on initial render
        timer = setTimeout(() => setVisible(true), 1200);
      }
    } catch {
      /* ignore storage errors */
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          necessary: true,
          analytics: true,
          marketing: true,
          timestamp: Date.now(),
        }),
      );
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  const handleRejectOptional = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          necessary: true,
          analytics: false,
          marketing: false,
          timestamp: Date.now(),
        }),
      );
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 inset-x-4 z-50 mx-auto max-w-xl md:bottom-6"
          role="region"
          aria-label="Cookie consent banner"
        >
          <div className="glass-panel rounded-2xl border border-border/80 bg-background/95 p-5 shadow-lift backdrop-blur-xl">
            <div className="flex items-start gap-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Cookie className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base font-medium text-foreground">
                  Your Digital Sanctuary
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  EKA uses essential session cookies for secure sign-in and optional anonymous
                  analytics to refine our knowledge infrastructure. We do not use third-party ad
                  pixels or sell user data.
                </p>
                <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    className="h-8 rounded-lg px-3.5 text-xs"
                  >
                    Accept All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRejectOptional}
                    className="h-8 rounded-lg px-3.5 text-xs"
                  >
                    Essential Only
                  </Button>
                  <Link
                    to="/cookies"
                    className="ml-auto text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    onClick={() => setVisible(false)}
                  >
                    Customize
                  </Link>
                </div>
              </div>
              <button
                onClick={handleRejectOptional}
                aria-label="Dismiss cookie notice"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
