import type { CornerDotType, CornerSquareType, Options as QRStylingOptions } from "qr-code-styling";
import type {
  QRCustomization,
  QRErrorCorrection,
  QREyeBorderStyle,
  QREyeCenterStyle,
  QRLogoSize,
  QRModuleStyle,
} from "../types";
import { isCustomEyeBorder, isCustomEyeCenter } from "./qr-art";

export const PREVIEW_QR_SIZE = 232;
export const EXPORT_QR_SIZE = 1024;

/** Quiet zone scales with output size (≈5%). */
export function quietZone(px: number): number {
  return Math.max(8, Math.round(px * 0.05));
}

export const MODULE_STYLES: { id: QRModuleStyle; label: string; hint: string }[] = [
  { id: "square", label: "Square", hint: "Classic QR modules" },
  { id: "rounded", label: "Rounded", hint: "Softened corners" },
  { id: "dots", label: "Dots", hint: "Circular modules" },
  { id: "extra-rounded", label: "Soft", hint: "Extra-rounded modules" },
  { id: "classy", label: "Classy", hint: "Connected strokes" },
  { id: "classy-rounded", label: "Classy soft", hint: "Connected, rounded" },
];

export const EYE_BORDER_STYLES: { id: QREyeBorderStyle; label: string; hint: string }[] = [
  { id: "square", label: "Square", hint: "Classic eye frame" },
  { id: "extra-rounded", label: "Soft", hint: "Extra-rounded frame" },
  { id: "circle", label: "Circle", hint: "Round eye frame" },
];

export const EYE_CENTER_STYLES: { id: QREyeCenterStyle; label: string; hint: string }[] = [
  { id: "square", label: "Square", hint: "Classic eye center" },
  { id: "dot", label: "Dot", hint: "Round eye center" },
  { id: "diamond", label: "Diamond", hint: "Diamond eye center" },
  { id: "round", label: "Round", hint: "Soft round center" },
];

export const LOGO_SIZES: { id: QRLogoSize; label: string; fraction: number }[] = [
  { id: "sm", label: "Small", fraction: 0.32 },
  { id: "md", label: "Medium", fraction: 0.4 },
  { id: "lg", label: "Large", fraction: 0.48 },
];

export const EC_LEVELS: { id: QRErrorCorrection; label: string; hint: string }[] = [
  { id: "L", label: "Low", hint: "Smallest code" },
  { id: "M", label: "Medium", hint: "Balanced, suits most print + screen" },
  { id: "Q", label: "High", hint: "Sturdy for small or rough prints" },
  { id: "H", label: "Maximum", hint: "Survives damage + center logos" },
];

export function logoSizeFraction(size: QRLogoSize): number {
  return LOGO_SIZES.find((s) => s.id === size)?.fraction ?? 0.4;
}

export function isLogoActive(custom: QRCustomization, logoImage: string | null): boolean {
  return custom.logoType !== "none" && logoImage !== null;
}

/** A logo forces maximum error correction so the code stays scannable. */
export function effectiveErrorCorrection(
  custom: QRCustomization,
  logoImage: string | null,
): { level: QRErrorCorrection; bumped: boolean } {
  if (isLogoActive(custom, logoImage)) {
    return { level: "H", bumped: custom.errorCorrection !== "H" };
  }
  return { level: custom.errorCorrection, bumped: false };
}

/**
 * Stable key for change detection. Excludes logo bytes (uploads can be
 * megabytes) — logo identity is captured by logoMark instead.
 */
export function customizationKey(custom: QRCustomization, logoImage: string | null): string {
  const { uploadedLogo: _omitted, ...rest } = custom;
  void _omitted;
  const logoMark = !logoImage ? "none" : custom.logoType === "builtin" ? `b:${custom.builtinLogo}` : `u:${logoImage.length}`;
  return JSON.stringify({ ...rest, logoMark });
}

export interface BuiltStyledQR {
  options: QRStylingOptions;
  effectiveEC: QRErrorCorrection;
  ecBumped: boolean;
  logoActive: boolean;
}

/** Single place where customization state becomes renderer options. */
export function buildStyledQR(
  value: string,
  custom: QRCustomization,
  logoImage: string | null,
  sizePx: number,
): BuiltStyledQR {
  const { level, bumped } = effectiveErrorCorrection(custom, logoImage);
  const active = isLogoActive(custom, logoImage);
  const motif = custom.moduleMotif !== "none";
  // Artwork extensions only run on SVG output: any custom motif or
  // hand-drawn eye forces the SVG renderer (equally crisp at preview size).
  const svgArt =
    motif || isCustomEyeBorder(custom.eyeBorderStyle) || isCustomEyeCenter(custom.eyeCenterStyle);
  // A motif forces square base cells so the extension reads positions
  // straight from rect geometry — no measurement APIs needed.
  const dotsType = motif ? "square" : custom.moduleStyle;
  // Custom-drawn eyes fall back to plain squares in the engine layer —
  // the artwork pass hides those rects and paints the custom geometry.
  const engineBorder: CornerSquareType =
    custom.eyeBorderStyle === "circle" ? "square" : custom.eyeBorderStyle;
  const engineCenter: CornerDotType =
    custom.eyeCenterStyle === "diamond" || custom.eyeCenterStyle === "round"
      ? "square"
      : custom.eyeCenterStyle;
  const options: QRStylingOptions = {
    type: svgArt ? "svg" : "canvas",
    width: sizePx,
    height: sizePx,
    margin: quietZone(sizePx),
    data: value,
    qrOptions: { errorCorrectionLevel: level },
    // With a motif active the base dots hide (drawn in background color)
    // and act purely as the position grid for the stamped artwork.
    dotsOptions: { type: dotsType, color: motif ? custom.backgroundColor : custom.foregroundColor },
    backgroundOptions: { color: custom.backgroundColor },
    cornersSquareOptions: {
      type: engineBorder,
      color: custom.eyeBorderColor || custom.foregroundColor,
    },
    cornersDotOptions: {
      type: engineCenter,
      color: custom.eyeCenterColor || custom.foregroundColor,
    },
    image: active && logoImage ? logoImage : undefined,
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: logoSizeFraction(custom.logoSize),
      margin: 8,
      crossOrigin: "anonymous",
    },
  };
  return { options, effectiveEC: level, ecBumped: bumped, logoActive: active };
}
