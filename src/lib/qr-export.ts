export function downloadSvg(svgEl: SVGSVGElement | null, filename: string): void {
  if (!svgEl) return;
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const data = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadPngFromSvg(
  svgEl: SVGSVGElement | null,
  filename: string,
  exportSize = 1024,
  bgColor = "#FFFFFF",
): void {
  if (!svgEl) return;
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const data = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = exportSize;
    canvas.height = exportSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, exportSize, exportSize);
    ctx.drawImage(img, 0, 0, exportSize, exportSize);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const pngUrl = URL.createObjectURL(blob);
      triggerDownload(pngUrl, filename);
      setTimeout(() => URL.revokeObjectURL(pngUrl), 2000);
    }, "image/png");
  };
  img.src = url;
}

export function triggerDownload(href: string, filename: string): void {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function copyText(text: string): Promise<boolean> {
  if (!text) return Promise.resolve(false);
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => false,
    );
  }
  return Promise.resolve(false);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not rasterize the QR artwork."));
    img.src = src;
  });
}

/** Serialize a live QR svg element (with extensions applied) to a file. */
export function serializeQrSvg(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  return new XMLSerializer().serializeToString(clone);
}

export function downloadSvgText(data: string, filename: string): void {
  const blob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Rasterize a live QR svg element (with extensions applied) to a PNG blob
 * at the requested pixel size. The SVG already carries its quiet zone.
 */
export async function rasterizeQrSvg(svg: SVGSVGElement, sizePx: number): Promise<Blob> {
  const data = serializeQrSvg(svg);
  const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = sizePx;
    canvas.height = sizePx;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is unavailable.");
    ctx.drawImage(img, 0, 0, sizePx, sizePx);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("Could not encode the PNG.");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}
