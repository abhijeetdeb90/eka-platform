import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (
    target: string | HTMLElement | number,
    options?: { offset?: number; immediate?: boolean; duration?: number },
  ) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

interface SmoothScrollProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export function SmoothScrollProvider({ children, enabled = true }: SmoothScrollProviderProps) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enabled || prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    setLenisInstance(lenis);

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenis.destroy();
      setLenisInstance(null);
    };
  }, [enabled]);

  const scrollTo = (
    target: string | HTMLElement | number,
    options?: { offset?: number; immediate?: boolean; duration?: number },
  ) => {
    if (lenisInstance) {
      lenisInstance.scrollTo(target, options);
    } else {
      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: options?.immediate ? "instant" : "smooth" });
      } else if (typeof target === "string") {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: options?.immediate ? "instant" : "smooth" });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: options?.immediate ? "instant" : "smooth" });
      }
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisInstance, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
