import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

export function useGsapCinematic<T extends HTMLElement = HTMLDivElement>(
  animationCallback: (ctx: gsap.Context, element: T) => void,
  deps: React.DependencyList = [],
): RefObject<T | null> {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !containerRef.current) {
      return;
    }

    const ctx = gsap.context((self) => {
      if (containerRef.current) {
        animationCallback(self, containerRef.current);
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}
