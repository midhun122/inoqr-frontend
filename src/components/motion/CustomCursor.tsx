import { useEffect, useRef } from "react";

const HOVER_SEL = 'a, button, [role="tab"], select, label, input[type="color"]';
const TEXT_SEL = 'input:not([type="color"]):not([type="checkbox"]):not([type="radio"]), textarea';

/**
 * CustomCursor — dot + trailing ring.
 * Follows with eased motion, expands over interactive elements, hides
 * over text fields so the native I-beam stays usable. Fine pointers only;
 * touch devices and reduced-motion users never see it.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let scale = 1;
    let targetScale = 1;
    let opacity = 0;
    let targetOpacity = 0;
    let down = false;
    let raf = 0;

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      scale += (targetScale - scale) * 0.2;
      opacity += (targetOpacity - opacity) * 0.2;
      const pressed = down ? 0.85 : 1;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${pressed})`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${(scale * pressed).toFixed(3)})`;
      dot.style.opacity = opacity.toFixed(3);
      ring.style.opacity = opacity.toFixed(3);
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const t = e.target as HTMLElement | null;
      const overText = !!t?.closest?.(TEXT_SEL);
      const overAction = !!t?.closest?.(HOVER_SEL);
      targetOpacity = overText ? 0 : 1;
      targetScale = overAction ? 1.7 : 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onDown = () => {
      down = true;
    };
    const onUp = () => {
      down = false;
    };
    const onLeave = () => {
      targetOpacity = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.body.classList.add("cursor-custom");
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      document.body.classList.remove("cursor-custom");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden [@media(pointer:fine)]:block">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-9 w-9 rounded-full border-[1.5px] border-accent/60 opacity-0"
      />
      <div ref={dotRef} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent opacity-0" />
    </div>
  );
}
