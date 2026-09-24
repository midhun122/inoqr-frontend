import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import { copyText, downloadPngFromSvg, downloadSvg } from "../../lib/qr-export";
import { Button } from "../ui/Button";

export function QRDownloadActions({
  qrRef,
  value,
  bgColor,
  filenameBase = "inoqr",
}: {
  qrRef: React.RefObject<SVGSVGElement | null>;
  value: string;
  bgColor: string;
  filenameBase?: string;
}) {
  const [copied, setCopied] = useState(false);
  const disabled = !value.trim();

  const onCopy = async () => {
    const ok = await copyText(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="primary"
        size="sm"
        disabled={disabled}
        icon={<Download size={15} />}
        onClick={() => downloadPngFromSvg(qrRef.current, `${filenameBase}.png`, 1024, bgColor)}
      >
        PNG
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled}
        icon={<Download size={15} />}
        onClick={() => downloadSvg(qrRef.current, `${filenameBase}.svg`)}
      >
        SVG
      </Button>
      <Button variant="ghost" size="sm" disabled={disabled} icon={copied ? <Check size={15} /> : <Copy size={15} />} onClick={onCopy}>
        {copied ? "Copied" : "Copy data"}
      </Button>
    </div>
  );
}
