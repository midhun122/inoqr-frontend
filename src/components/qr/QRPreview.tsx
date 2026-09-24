import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";
import { ThinkingOrb } from "../motion/ThinkingOrb";

export function QRPreview({
  value,
  fgColor,
  bgColor,
  thinking,
  emptyHint = "Enter content to preview your QR",
  qrRef,
  size = 232,
}: {
  value: string;
  fgColor: string;
  bgColor: string;
  thinking: boolean;
  emptyHint?: string;
  qrRef: React.RefObject<SVGSVGElement | null>;
  size?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const showQR = !thinking && value.trim().length > 0;

  return (
    <div ref={wrapRef} className="relative grid min-h-[320px] place-items-center overflow-hidden rounded-xl bg-canvas-soft p-8">
      {/* dotted backdrop */}
      <div aria-hidden className="dotgrid pointer-events-none absolute inset-0 opacity-60" />
      <AnimatePresence mode="wait">
        {thinking ? (
          <motion.div
            key="orb"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.32 }}
            className="relative"
          >
            <ThinkingOrb state="thinking" />
          </motion.div>
        ) : showQR ? (
          <motion.div
            key={`qr-${value.slice(0, 24)}`}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-lg bg-white p-4 shadow-card ring-1 ring-black/5 dark:ring-white/25"
          >
            <QRCodeSVG
              ref={qrRef as never}
              value={value}
              size={size}
              fgColor={fgColor}
              bgColor={bgColor}
              level="M"
              marginSize={2}
            />
          </motion.div>
        ) : (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative max-w-[240px] text-center text-[14px] leading-relaxed text-muted"
          >
            {emptyHint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
