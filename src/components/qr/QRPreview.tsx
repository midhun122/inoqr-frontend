import { AnimatePresence, motion } from "framer-motion";
import { useMemo, type Ref } from "react";
import { buildStyledQR, PREVIEW_QR_SIZE } from "../../lib/qr-style";
import type { QREyeArt } from "../../lib/qr-art";
import type { QRCustomization } from "../../types";
import { ThinkingOrb } from "../motion/ThinkingOrb";
import { StyledQRCode, type QRMotif, type StyledQRExportHandle } from "./StyledQRCode";

export function QRPreview({
  value,
  customization,
  logoImage,
  motif,
  eyes,
  thinking,
  emptyHint = "Enter content to preview your QR",
  qrApiRef,
  size = PREVIEW_QR_SIZE,
}: {
  value: string;
  customization: QRCustomization;
  logoImage: string | null;
  motif: QRMotif | null;
  eyes: QREyeArt | null;
  thinking: boolean;
  emptyHint?: string;
  qrApiRef: Ref<StyledQRExportHandle>;
  size?: number;
}) {
  const showQR = !thinking && value.trim().length > 0;
  const options = useMemo(
    () => buildStyledQR(value, customization, logoImage, size).options,
    [value, customization, logoImage, size],
  );

  return (
    <div className="relative grid min-h-[320px] place-items-center overflow-hidden rounded-xl bg-canvas-soft p-8">
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
            <StyledQRCode ref={qrApiRef} value={value} options={options} motif={motif} eyes={eyes} />
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
