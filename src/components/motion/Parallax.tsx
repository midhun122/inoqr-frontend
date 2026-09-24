import { useEffect, useRef, type ReactNode } from "react";

/**
 * Parallax — scroll-linked depth wrapper.
 * Translates children proportionally to how far the parent section has
 * travelled through the viewport. Negative speed lags behind the scroll
 * (classic slow background); small positive speeds push foreground layers
 * a touch faster. Transform-only, rAF-throttled, inert under
 * prefers-reduced-motion.
 */
export function Parallax({
  speed = 0.08,
  className = "",
  children,
}: {
  speed?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      const host = el?.parentElement;
      if (!el || !host) return;
      const r = host.getBoundingClientRect();
      const offset = (r.top + r.height / 2 - window.innerHeight / 2) * speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    update();
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
