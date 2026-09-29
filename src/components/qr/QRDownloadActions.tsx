import { Check, Copy, Download } from "lucide-react";
import { useState, type Ref } from "react";
import { copyText } from "../../lib/qr-export";
import { recordStaticEntry } from "../../services/static-history";
import type { QRCustomization } from "../../types";
import { Button } from "../ui/Button";
import type { StyledQRExportHandle } from "./StyledQRCode";

export function QRDownloadActions({
  value,
  filenameBase = "inoqr",
  qrApiRef,
  history,
}: {
  value: string;
  filenameBase?: string;
  qrApiRef: Ref<StyledQRExportHandle>;
  /** When provided, exports/copies are recorded to the My QRs static history. */
  history?: { kind: string; label: string; custom: QRCustomization };
}) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const disabled = !value.trim() || busy;

  const remember = () => {
    if (history && value.trim()) {
      recordStaticEntry({
        kind: history.kind,
        label: history.label,
        payload: value,
        fgColor: history.custom.foregroundColor,
        bgColor: history.custom.backgroundColor,
        custom: history.custom,
      });
    }
  };

  const runExport = async (kind: "png" | "svg") => {
    const api =
      qrApiRef && typeof qrApiRef === "object" ? qrApiRef.current : null;
    if (!api || !value.trim()) return;
    setBusy(true);
    try {
      if (kind === "png") await api.downloadPNG(filenameBase);
      else await api.downloadSVG(filenameBase);
      remember();
    } finally {
      setBusy(false);
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
        onClick={() => void runExport("png")}
      >
        PNG
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled}
        icon={<Download size={15} />}
        onClick={() => void runExport("svg")}
      >
        SVG
      </Button>
      <Button variant="ghost" size="sm" disabled={disabled} icon={copied ? <Check size={15} /> : <Copy size={15} />} onClick={onCopy}>
        {copied ? "Copied" : "Copy data"}
      </Button>
    </div>
  );
}
