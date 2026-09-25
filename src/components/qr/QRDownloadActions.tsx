import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import { copyText, downloadPngFromSvg, downloadSvg } from "../../lib/qr-export";
import { recordStaticEntry } from "../../services/static-history";
import { Button } from "../ui/Button";

export function QRDownloadActions({
  qrRef,
  value,
  bgColor,
  filenameBase = "inoqr",
  history,
}: {
  qrRef: React.RefObject<SVGSVGElement | null>;
  value: string;
  bgColor: string;
  filenameBase?: string;
  /** When provided, exports/copies are recorded to the My QRs static history. */
  history?: { kind: string; label: string; fgColor: string };
}) {
  const [copied, setCopied] = useState(false);
  const disabled = !value.trim();

  const remember = () => {
    if (history && value.trim()) {
      recordStaticEntry({ ...history, payload: value, bgColor });
    }
  };

  const onCopy = async () => {
    const ok = await copyText(value);
    if (ok) {
      remember();
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
        onClick={() => {
          downloadPngFromSvg(qrRef.current, `${filenameBase}.png`, 1024, bgColor);
          remember();
        }}
      >
        PNG
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled}
        icon={<Download size={15} />}
        onClick={() => {
          downloadSvg(qrRef.current, `${filenameBase}.svg`);
          remember();
        }}
      >
        SVG
      </Button>
      <Button variant="ghost" size="sm" disabled={disabled} icon={copied ? <Check size={15} /> : <Copy size={15} />} onClick={onCopy}>
        {copied ? "Copied" : "Copy data"}
      </Button>
    </div>
  );
}
