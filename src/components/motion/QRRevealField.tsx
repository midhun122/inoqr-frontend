import { useEffect, useRef } from "react";

/* Deterministic 0..1 hash — stable pattern, no flicker. */
function hash2(x: number, y: number): number {
  let h = (x * 73856093) ^ (y * 19349663);
  h = Math.imul(h ^ (h >>> 13), 0x5bd1e995);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967295;
}

/**
 * QRRevealField — a hidden QR code revealed by the cursor.
 * At rest the hero is a whisper-quiet dot grid; moving the cursor opens
 * a soft lens that exposes a ghost QR pattern (finders included) beneath,
 * ringed like a scanner viewfinder. Minimal until touched.
 * Theme-aware, DPR-capped, pauses offscreen, static under reduced-motion.
 */
export function QRRevealField({
  className = "",
  gap = 28,
  lens = 110,
}: {
  className?: string;
  gap?: number;
  lens?: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pattern = document.createElement("canvas");
    const layer = document.createElement("canvas");
    let dpr = 1;
    let ink = "20 20 20";
    let accent = "0 102 255";
    let raf = 0;
    let running = false;
    let onScreen = true;
    let revealA = 0;

    const cur = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4 };

    const pick = (name: string, fallback: string): string => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };

    const resolveColors = () => {
      ink = pick("--ink", "20 20 20");
      accent = pick("--accent", "0 102 255");
    };

    const buildPattern = () => {
      const W = canvas.width;
      const H = canvas.height;
      pattern.width = W;
      pattern.height = H;
      layer.width = W;
      layer.height = H;
      const pctx = pattern.getContext("2d");
      if (!pctx) return;
      pctx.clearRect(0, 0, W, H);

      // Pseudo-QR data modules.
      const mod = 10 * dpr;
      const cols = Math.ceil(W / mod);
      const rows = Math.ceil(H / mod);
      pctx.fillStyle = `rgba(${ink} / 0.38)`;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          if (hash2(i, j) > 0.46) continue;
          pctx.fillRect(i * mod + 1, j * mod + 1, mod - 2, mod - 2);
        }
      }

      // Three finder patterns at the corners.
      const finder = (cx: number, cy: number) => {
        const s = 7 * mod;
        pctx.strokeStyle = `rgba(${accent} / 0.55)`;
        pctx.lineWidth = Math.max(3, mod * 0.9);
        pctx.strokeRect(cx - s / 2, cy - s / 2, s, s);
        const inner = 3 * mod;
        pctx.fillStyle = `rgba(${accent} / 0.55)`;
        pctx.fillRect(cx - inner / 2, cy - inner / 2, inner, inner);
      };
      const m = 9 * mod;
      finder(m, m);
      finder(W - m, m);
      finder(m, H - m);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      buildPattern();
    };

    const draw = () => {
      const cssW = canvas.clientWidth || 1;
      const cssH = canvas.clientHeight || 1;

      cur.x += (cur.tx - cur.x) * 0.16;
      cur.y += (cur.ty - cur.y) * 0.16;
      const hasCursor = cur.tx > -9000;
      revealA += ((hasCursor ? 1 : 0) - revealA) * 0.09;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      // Base whisper dot grid.
      for (let y = gap / 2; y < cssH; y += gap) {
        for (let x = gap / 2; x < cssW; x += gap) {
          ctx.fillStyle = `rgba(${ink} / 0.07)`;
          ctx.beginPath();
          ctx.arc(x, y, 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (revealA < 0.02 || reduceMotion) return;

      // Lens: pattern clipped to a feathered circle at the cursor.
      const R = lens * dpr;
      const cx = cur.x * dpr;
      const cy = cur.y * dpr;
      const lctx = layer.getContext("2d");
      if (!lctx) return;
      lctx.setTransform(1, 0, 0, 1, 0, 0);
      lctx.clearRect(0, 0, layer.width, layer.height);
      lctx.save();
      lctx.beginPath();
      lctx.arc(cx, cy, R, 0, Math.PI * 2);
      lctx.clip();
      lctx.globalAlpha = revealA;
      lctx.drawImage(pattern, 0, 0);
      lctx.restore();
      lctx.globalCompositeOperation = "destination-in";
      const feather = lctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R);
      feather.addColorStop(0, "rgba(0,0,0,1)");
      feather.addColorStop(1, "rgba(0,0,0,0)");
      lctx.fillStyle = feather;
      lctx.beginPath();
      lctx.arc(cx, cy, R, 0, Math.PI * 2);
      lctx.fill();
      lctx.globalCompositeOperation = "source-over";
      lctx.globalAlpha = 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(layer, 0, 0);

      // Viewfinder ring.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = `rgba(${accent} / ${(0.55 * revealA).toFixed(3)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cur.x, cur.y, 10, 0, Math.PI * 2);
      ctx.stroke();
      // Corner ticks.
      ctx.lineWidth = 2;
      const corners: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
      for (const [sx, sy] of corners) {
        const ex = cur.x + sx * lens * 0.62;
        const ey = cur.y + sy * lens * 0.62;
        ctx.beginPath();
        ctx.moveTo(ex - sx * 12, ey);
        ctx.lineTo(ex, ey);
        ctx.lineTo(ex, ey - sy * 12);
        ctx.stroke();
      }
    };

    const tick = () => {
      draw();
      const settled =
        Math.abs(cur.tx - cur.x) < 0.6 &&
        Math.abs(cur.ty - cur.y) < 0.6 &&
        (cur.tx < -9000 ? revealA < 0.03 : true);
      if (settled && cur.tx < -9000) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (reduceMotion || running || !onScreen || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!running) return;
      cancelAnimationFrame(raf);
      running = false;
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      cur.tx = e.clientX - rect.left;
      cur.ty = e.clientY - rect.top;
      kick();
    };
    const onLeave = () => {
      cur.tx = -1e4;
      cur.ty = -1e4;
      kick();
    };

    resolveColors();
    resize();
    draw();
    if (!reduceMotion) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
        if (onScreen) draw();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const mo = new MutationObserver(() => {
      resolveColors();
      buildPattern();
      draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });

    const onVis = () => {
      if (!document.hidden) draw();
      else stop();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
    };
  }, [gap, lens]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
