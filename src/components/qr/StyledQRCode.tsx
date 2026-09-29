import QRCodeStyling, { type Options as QRStylingOptions } from "qr-code-styling";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { artworkExtension, type ArtworkSpec } from "../../lib/qr-art";
import { EXPORT_QR_SIZE } from "../../lib/qr-style";
import { downloadSvgText, rasterizeQrSvg, serializeQrSvg, triggerDownload } from "../../lib/qr-export";

export interface StyledQRExportHandle {
  downloadPNG: (filenameBase: string) => Promise<void>;
  downloadSVG: (filenameBase: string) => Promise<void>;
}

export interface QRMotif {
  /** Inner SVG markup for a 24×24 cell. Shapes must not set their own fill. */
  inner: string;
  color: string;
}

interface StyledQRCodeProps {
  value: string;
  /** Complete renderer options for the preview size (memoized by parent). */
  options: QRStylingOptions;
  /** Designer motif stamp. Null = engine dot styles. */
  motif?: QRMotif | null;
  /** Custom finder artwork. Null = engine eye styles. */
  eyes?: ArtworkSpec["eyes"];
  exportSize?: number;
}

/**
 * Shared styled-QR renderer. Owns one qr-code-styling instance per mount and
 * pushes option updates into it (no remounts, no regeneration loops).
 * Custom artwork (motifs, hand-drawn eyes) runs through one post-draw
 * extension; artwork exports serialize the live extended SVG, so downloads
 * always match the preview exactly.
 */
export const StyledQRCode = forwardRef<StyledQRExportHandle, StyledQRCodeProps>(function StyledQRCode(
  { value, options, motif = null, eyes = null, exportSize = EXPORT_QR_SIZE },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<QRCodeStyling | null>(null);
  const instanceTypeRef = useRef<string | null>(null);
  const liveRef = useRef({ value, options, motif, eyes, exportSize });
  liveRef.current = { value, options, motif, eyes, exportSize };

  // (Re)create the instance when the draw type flips (canvas ↔ svg).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const { options: current, motif: currentMotif, eyes: currentEyes } = liveRef.current;
    if (instanceRef.current && instanceTypeRef.current === current.type) return;
    container.innerHTML = "";
    const instance = new QRCodeStyling(current);
    const ext = artworkExtension({ motif: currentMotif, eyes: currentEyes });
    if (ext) instance.applyExtension(ext);
    instanceRef.current = instance;
    instanceTypeRef.current = current.type ?? null;
    instance.append(container);
    return () => {
      container.innerHTML = "";
      instanceRef.current = null;
      instanceTypeRef.current = null;
    };
    // Instance identity follows the draw type only; options flow via update().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.type]);

  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    const ext = artworkExtension({ motif, eyes });
    if (ext) instance.applyExtension(ext);
    else instance.deleteExtension();
    instance.update(options);
  }, [options, motif, eyes]);

  useImperativeHandle(
    ref,
    () => {
      const liveArtworkSvg = (): SVGSVGElement | null => {
        const { motif: m, eyes: e } = liveRef.current;
        if (!m && !e) return null;
        return containerRef.current?.querySelector("svg") ?? null;
      };
      const buildExporter = (): QRCodeStyling | null => {
        const { value: data, options: current, exportSize: size } = liveRef.current;
        if (!data.trim()) return null;
        return new QRCodeStyling({
          ...current,
          width: size,
          height: size,
          margin: Math.max(16, Math.round(size * 0.05)),
        });
      };
      return {
        async downloadPNG(filenameBase: string): Promise<void> {
          const svg = liveArtworkSvg();
          if (svg) {
            const blob = await rasterizeQrSvg(svg, liveRef.current.exportSize);
            const url = URL.createObjectURL(blob);
            triggerDownload(url, `${filenameBase}.png`);
            setTimeout(() => URL.revokeObjectURL(url), 2000);
            return;
          }
          const exporter = buildExporter();
          if (exporter) await exporter.download({ name: filenameBase, extension: "png" });
        },
        async downloadSVG(filenameBase: string): Promise<void> {
          const svg = liveArtworkSvg();
          if (svg) {
            downloadSvgText(serializeQrSvg(svg), `${filenameBase}.svg`);
            return;
          }
          const exporter = buildExporter();
          if (exporter) await exporter.download({ name: filenameBase, extension: "svg" });
        },
      };
    },
    [],
  );

  return <div ref={containerRef} aria-label="Styled QR code" role="img" />;
});
