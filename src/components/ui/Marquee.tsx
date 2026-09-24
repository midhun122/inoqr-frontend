import {
  BarChart3,
  Contact,
  Download,
  Moon,
  PencilLine,
  QrCode,
  ShieldCheck,
  Wifi,
  type LucideIcon,
} from "lucide-react";

const ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: QrCode, label: "Static QR codes" },
  { icon: PencilLine, label: "Editable dynamic links" },
  { icon: BarChart3, label: "Scan analytics" },
  { icon: Download, label: "PNG + SVG export" },
  { icon: Wifi, label: "Wi-Fi sharing" },
  { icon: Contact, label: "Contact sharing" },
  { icon: ShieldCheck, label: "No watermark" },
  { icon: Moon, label: "Light + dark mode" },
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {ITEMS.map((it) => (
        <span
          key={it.label}
          className="flex items-center gap-2.5 whitespace-nowrap pr-10 text-[13px] font-semibold tracking-tight text-muted"
        >
          <it.icon size={15} className="shrink-0 text-accent" />
          {it.label}
          <span aria-hidden className="ml-8 h-1 w-1 shrink-0 rounded-full bg-faint" />
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <section
      aria-label="INOQR capabilities"
      className="marquee overflow-hidden border-y border-hairline bg-canvas py-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <div className="marquee-track flex w-max">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
