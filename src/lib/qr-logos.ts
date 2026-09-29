import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  CalendarDays,
  Contact,
  Download,
  FileText,
  Globe,
  Link,
  Mail,
  MapPin,
  Phone,
  Wifi,
  type LucideIcon,
} from "lucide-react";

export interface BuiltinLogo {
  id: string;
  label: string;
  Icon: LucideIcon;
}

/**
 * Curated built-in marks, drawn from the project's lucide set so they match
 * INOQR iconography. Brand icons (GitHub, LinkedIn, …) are intentionally
 * absent — the installed lucide version ships no brand glyphs.
 */
export const BUILTIN_LOGOS: BuiltinLogo[] = [
  { id: "link", label: "Link", Icon: Link },
  { id: "globe", label: "Website", Icon: Globe },
  { id: "wifi", label: "Wi-Fi", Icon: Wifi },
  { id: "mail", label: "Email", Icon: Mail },
  { id: "phone", label: "Phone", Icon: Phone },
  { id: "contact", label: "Contact", Icon: Contact },
  { id: "location", label: "Location", Icon: MapPin },
  { id: "download", label: "Download", Icon: Download },
  { id: "document", label: "Document", Icon: FileText },
  { id: "calendar", label: "Calendar", Icon: CalendarDays },
];

const TILE = 256;

/** White rounded tile + glyph, as an SVG data URL ready for the QR center. */
export function builtinLogoDataUrl(id: string, color: string): string | null {
  const found = BUILTIN_LOGOS.find((l) => l.id === id);
  if (!found) return null;
  const markup = renderToStaticMarkup(createElement(found.Icon, { size: 24 }));
  const inner = markup.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  const glyph = 128;
  const offset = (TILE - glyph) / 2;
  const scale = glyph / 24;
  const tile =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}" viewBox="0 0 ${TILE} ${TILE}">` +
    `<rect width="${TILE}" height="${TILE}" rx="60" fill="#FFFFFF"/>` +
    `<g transform="translate(${offset} ${offset}) scale(${scale})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</g>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(tile)}`;
}

export const LOGO_UPLOAD_MAX_BYTES = 2 * 1024 * 1024;
export const LOGO_UPLOAD_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function validateLogoFile(file: File): string | null {
  if (!LOGO_UPLOAD_TYPES.includes(file.type)) {
    return "Use a PNG, JPG, or WebP image.";
  }
  if (file.size > LOGO_UPLOAD_MAX_BYTES) {
    return "Image must be under 2 MB.";
  }
  return null;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read that image."));
    img.src = src;
  });
}

/**
 * Composite an uploaded file onto the standard white rounded tile,
 * downscaled to 256px so it stays crisp in exports and cheap in history.
 * Local-only — nothing leaves the browser.
 */
export async function fileToLogoTile(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const canvas = document.createElement("canvas");
    canvas.width = TILE;
    canvas.height = TILE;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is unavailable.");
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.roundRect(0, 0, TILE, TILE, 60);
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, TILE, TILE, 60);
    ctx.clip();
    const cover = Math.max(TILE / img.width, TILE / img.height);
    const dw = img.width * cover;
    const dh = img.height * cover;
    ctx.drawImage(img, (TILE - dw) / 2, (TILE - dh) / 2, dw, dh);
    ctx.restore();
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
