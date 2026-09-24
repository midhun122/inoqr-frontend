import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  Contact,
  Link2,
  Mail,
  MessageSquare,
  PencilLine,
  Type,
  Wifi,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { MotionReveal } from "../components/motion/MotionReveal";
import { QRRevealField } from "../components/motion/QRRevealField";
import { Button } from "../components/ui/Button";
import { Marquee } from "../components/ui/Marquee";

/* ---------- small pieces ---------- */

function MiniQR({ value, size = 88 }: { value: string; size?: number }) {
  return (
    <div className="rounded-2xl bg-white p-2.5 shadow-card ring-1 ring-black/5 dark:ring-white/20">
      <QRCodeSVG value={value} size={size} fgColor="#141414" bgColor="#FFFFFF" level="M" marginSize={1} />
    </div>
  );
}

/* Bespoke per-format artwork — each card gets its own visual language. */
function ArtShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-[150px] place-items-center overflow-hidden rounded-2xl bg-canvas-soft p-4">
      {children}
    </div>
  );
}

function FormatArt({ art }: { art: string }) {
  switch (art) {
    case "browser":
      return (
        <ArtShell>
          <div className="w-full max-w-[170px] rounded-xl border border-hairline bg-canvas p-2.5 shadow-card">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-faint/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-faint/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-faint/60" />
            </div>
            <div className="mt-2 flex items-center gap-1.5 rounded-full bg-canvas-soft px-2.5 py-1.5 text-[11px] font-semibold text-ink">
              <Link2 size={11} className="shrink-0 text-accent" />
              <span className="truncate">inoqr.app/menu</span>
            </div>
          </div>
        </ArtShell>
      );
    case "lines":
      return (
        <ArtShell>
          <div className="w-full max-w-[150px] space-y-2">
            <div className="h-2.5 w-full rounded-full bg-ink/80" />
            <div className="h-2.5 w-4/5 rounded-full bg-ink/50" />
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-3/5 rounded-full bg-ink/30" />
              <span className="h-3.5 w-[2px] animate-pulse bg-accent" />
            </div>
          </div>
        </ArtShell>
      );
    case "wifi":
      return (
        <ArtShell>
          <div className="flex flex-col items-center gap-2">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-white shadow-pop">
              <Wifi size={26} />
            </span>
            <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[11px] font-semibold text-accent">
              Connected
            </span>
          </div>
        </ArtShell>
      );
    case "contact":
      return (
        <ArtShell>
          <div className="flex w-full max-w-[170px] items-center gap-2.5 rounded-xl border border-hairline bg-canvas p-3 shadow-card">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-[12px] font-bold text-canvas">
              AL
            </span>
            <div className="min-w-0 flex-1">
              <div className="h-2.5 w-4/5 rounded-full bg-ink/80" />
              <div className="mt-1.5 h-2 w-3/5 rounded-full bg-ink/30" />
              <div className="mt-2 flex gap-1.5 text-accent">
                <Mail size={11} /> <MessageSquare size={11} />
              </div>
            </div>
          </div>
        </ArtShell>
      );
    case "mail":
      return (
        <ArtShell>
          <div className="relative w-full max-w-[160px] rounded-xl border border-hairline bg-canvas p-3 shadow-card">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                <Mail size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="h-2.5 w-3/4 rounded-full bg-ink/80" />
                <div className="mt-1.5 h-2 w-1/2 rounded-full bg-ink/30" />
              </div>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-white">
                <ArrowRight size={13} />
              </span>
            </div>
          </div>
        </ArtShell>
      );
    default:
      return (
        <ArtShell>
          <div className="w-full max-w-[160px] space-y-2">
            <div className="w-fit max-w-full rounded-2xl rounded-bl-md bg-canvas-soft px-3 py-2 text-[12px] font-medium text-ink-soft ring-1 ring-hairline">
              Is the menu out?
            </div>
            <div className="ml-auto w-fit max-w-full rounded-2xl rounded-br-md bg-accent px-3 py-2 text-[12px] font-medium text-white">
              Scan this ↓
            </div>
          </div>
        </ArtShell>
      );
  }
}

function DynamicArt({ art }: { art: string }) {
  if (art === "link") {
    return (
      <ArtShell>
        <div className="flex items-center gap-1.5 rounded-full border border-hairline bg-canvas px-3.5 py-2.5 text-[12px] font-semibold text-ink shadow-card">
          <Link2 size={13} className="shrink-0 text-accent" />
          inoqr.app/r/menu-spring
        </div>
      </ArtShell>
    );
  }
  if (art === "retarget") {
    return (
      <ArtShell>
        <div className="w-full max-w-[180px] rounded-xl border border-hairline bg-canvas p-3 shadow-card">
          <div className="flex items-center justify-between gap-2 text-[12px] font-semibold">
            <span className="truncate text-faint line-through">/winter-menu</span>
            <ArrowRight size={12} className="shrink-0 text-accent" />
            <span className="truncate text-ink">/summer-menu</span>
          </div>
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
            <PencilLine size={10} /> Saved — code unchanged
          </p>
        </div>
      </ArtShell>
    );
  }
  return (
    <ArtShell>
      <div className="flex w-full max-w-[170px] items-end justify-between gap-3">
        <p className="text-[26px] font-extrabold tracking-tight text-ink">1.2k</p>
        <div className="flex h-14 flex-1 items-end gap-1">
          {[30, 55, 42, 75, 58, 95, 70].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-accent/80" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </ArtShell>
  );
}

const FORMATS = [
  { id: "url", label: "URL", desc: "Link anywhere on the web.", icon: Link2, value: "https://inoqr.app/menu", art: "browser" },
  { id: "text", label: "Text", desc: "Plain words, instantly scannable.", icon: Type, value: "Hello from INOQR", art: "lines" },
  { id: "wifi", label: "Wi-Fi", desc: "Join a network without typing.", icon: Wifi, value: "WIFI:T:WPA;S:INOQR-Guest;P:;;", art: "wifi" },
  { id: "vcard", label: "Contact sharing", desc: "Share a contact in one scan.", icon: Contact, value: "BEGIN:VCARD\nVERSION:3.0\nFN:Ada Lovelace\nEND:VCARD", art: "contact" },
  { id: "email", label: "Email", desc: "Pre-addressed mail composer.", icon: Mail, value: "MATMSG:TO:hello@example.com;SUB:Hello;BODY:Sent via INOQR;;", art: "mail" },
  { id: "sms", label: "SMS", desc: "Prefilled text conversation.", icon: MessageSquare, value: "SMSTO:+15550102030:Hello from INOQR", art: "sms" },
];

const DYNAMIC_CARDS = [
  { icon: Link2, title: "Short links", desc: "inoqr.app/r/menu-spring slugs that stay readable in print.", art: "link" },
  { icon: PencilLine, title: "Retarget anytime", desc: "Change the destination after printing. The code never changes.", art: "retarget" },
  { icon: BarChart3, title: "Scan counts", desc: "See how often each code gets scanned, pause the dead ones.", art: "scans" },
];

function FloatTile({
  className = "",
  children,
  duration = 6,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden
      className={`absolute hidden lg:block ${className}`}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- page ---------- */

export function LandingPage() {
  const [tab, setTab] = useState<"static" | "dynamic">("static");

  // Buttery scroll-linked hero: content lifts, softens, and settles as you scroll.
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 420], [1, 0]);
  const heroY = useTransform(scrollY, [0, 420], [0, 90]);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_60%,transparent_98%)]"
        >
          <QRRevealField className="h-full w-full" />
        </div>
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="shell relative flex flex-col items-center pb-12 pt-14 text-center md:pt-20">
          <MotionReveal>
            <p className="mono-label text-[11px] font-medium text-faint">
              Welcome to INOQR
            </p>
            <h1 className="mt-3 max-w-[800px] text-balance font-display text-[46px] font-normal leading-[0.98] tracking-tight text-ink md:text-[76px]">
              QR codes,
              <br />
              <em>made simple.</em>
            </h1>
            <p className="mx-auto mt-5 max-w-[520px] text-[15px] leading-relaxed text-muted md:text-[17px]">
              Create QR codes in seconds. Go static for something simple and
              permanent, or dynamic when you want more control.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/create/static">
                <Button variant="primary" icon={<Zap size={16} />}>
                  Create a QR <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/create/dynamic">
                <Button variant="outline">
                  Explore Dynamic QR <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </MotionReveal>
        </motion.div>
      </section>

      <Marquee />

      {/* STATS */}
      <section className="relative overflow-hidden">
        <div className="shell relative py-12 text-center md:py-16">
          <FloatTile className="left-[6%] top-[12%]" duration={6.5}>
            <MiniQR value="https://inoqr.app/menu" size={64} />
          </FloatTile>
          <FloatTile className="right-[8%] top-[8%]" duration={7.2} delay={0.8}>
            <div className="grid h-16 w-16 place-items-center rounded-2xl border border-hairline bg-canvas text-accent shadow-card">
              <Wifi size={26} />
            </div>
          </FloatTile>
          <FloatTile className="left-[10%] top-[58%]" duration={5.6} delay={1.4}>
            <div className="grid h-16 w-16 place-items-center rounded-2xl border border-hairline bg-canvas text-accent shadow-card">
              <Contact size={26} />
            </div>
          </FloatTile>
          <FloatTile className="right-[7%] top-[62%]" duration={6.9} delay={0.4}>
            <MiniQR value="WIFI:T:WPA;S:INOQR-Guest;P:;;" size={64} />
          </FloatTile>

          <MotionReveal>
            <p className="mono-label text-[12px] font-medium text-ink">What's inside</p>
            <p className="mx-auto mt-3 max-w-[720px] font-display text-[52px] font-normal leading-[0.98] tracking-tight text-ink md:text-[88px]">
              Everything you need to create the right QR.
            </p>
          </MotionReveal>
        </div>
      </section>

      {/* TABS + CARD RAIL */}
      <section className="shell py-10">
        <MotionReveal className="flex flex-col items-center">
          <h2 className="max-w-[640px] text-center font-display text-[34px] font-normal leading-[1.0] tracking-tight text-ink md:text-[48px]">
            Find the right code in seconds.
          </h2>
          <div className="mt-6 inline-flex rounded-full border border-hairline bg-canvas-soft p-1">
            {(["static", "dynamic"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-5 py-2 text-[14px] font-semibold transition-all ${
                  tab === t ? "bg-canvas text-ink shadow-card" : "text-muted hover:text-ink"
                }`}
              >
                {t === "static" ? "Static codes" : "Dynamic links"}
              </button>
            ))}
          </div>
        </MotionReveal>

        <div className="mt-8 overflow-x-auto pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex snap-x gap-4"
            >
              {tab === "static"
                ? FORMATS.map((f) => (
                    <Link
                      key={f.id}
                      to="/create/static"
                      className="card w-[240px] shrink-0 snap-start p-4 transition-transform duration-base hover:-translate-y-1"
                    >
                      <FormatArt art={f.art} />
                      <p className="mt-4 flex items-center gap-1.5 px-1 text-[15px] font-bold text-ink">
                        <f.icon size={15} className="text-accent" /> {f.label}
                      </p>
                      <p className="mt-1 px-1 text-[13px] leading-relaxed text-muted">{f.desc}</p>
                    </Link>
                  ))
                : DYNAMIC_CARDS.map((c) => (
                    <Link
                      key={c.title}
                      to="/create/dynamic"
                      className="card w-[280px] shrink-0 snap-start p-4 transition-transform duration-base hover:-translate-y-1"
                    >
                      <DynamicArt art={c.art} />
                      <p className="mt-4 px-1 text-[17px] font-bold text-ink">{c.title}</p>
                      <p className="mt-1 px-1 text-[13px] leading-relaxed text-muted">{c.desc}</p>
                    </Link>
                  ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* STATIC VS DYNAMIC */}
      <section className="band-contrast border-y border-hairline">
        <div className="shell py-14">
        <MotionReveal className="flex flex-col items-center text-center">
          <p className="mono-label text-[11px] font-medium text-faint">Static vs dynamic</p>
          <h2 className="mt-3 max-w-[640px] text-balance font-display text-[34px] font-normal leading-[1.0] tracking-tight text-ink md:text-[48px]">
            Which QR do you <em>actually need?</em>
          </h2>
          <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-muted">
            Static bakes the data into the pattern itself. Dynamic points at a
            short link you control. Here's how they compare.
          </p>
        </MotionReveal>

        <div className="mx-auto mt-10 grid max-w-[900px] gap-4 md:grid-cols-2">
          <MotionReveal delay={0.05}>
            <div className="card flex h-full flex-col p-6 md:p-8">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-faint">Static</p>
              <h3 className="mt-2 font-display text-[28px] font-normal leading-tight text-ink">Fixed forever.</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                The data lives inside the code. Print it once — it works forever, offline, with no account.
              </p>
              <ul className="mt-5 space-y-2.5 text-[14px] text-ink-soft">
                {["Never expires, needs no account", "Free unlimited generation", "Works offline after download", "Can't be edited after printing", "No scan tracking"].map((t, i) => (
                  <li key={t} className="flex gap-2">
                    {i < 3 ? (
                      <Check size={15} strokeWidth={3} className="mt-0.5 shrink-0 text-accent" />
                    ) : (
                      <span className="mt-0.5 shrink-0 text-[14px] font-bold text-faint">—</span>
                    )}
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.12}>
            <div className="card flex h-full flex-col border-accent/30 p-6 shadow-pop md:p-8">
              <p className="inline-flex w-fit items-center rounded-full bg-accent/10 px-3 py-1 text-[12px] font-semibold text-accent">
                Most flexible
              </p>
              <h3 className="mt-2 font-display text-[28px] font-normal leading-tight text-ink">Editable &amp; measurable.</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                The code points at a short link you own. Retarget it, count scans, pause it — no reprint.
              </p>
              <ul className="mt-5 space-y-2.5 text-[14px] text-ink-soft">
                {["Edit destination after printing", "Scan counts per link", "Pause without reprinting", "Needs a free account", "Links live on this device (demo)"].map((t) => (
                  <li key={t} className="flex gap-2">
                    <Check size={15} strokeWidth={3} className="mt-0.5 shrink-0 text-accent" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </MotionReveal>
        </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="shell py-16 text-center md:py-24">
        <MotionReveal className="flex flex-col items-center">
          <h2 className="max-w-[640px] text-balance font-display text-[38px] font-normal leading-[1.0] tracking-tight text-ink md:text-[56px]">
            Never reprint a QR <em>again.</em>
          </h2>
          <p className="mt-4 max-w-[440px] text-[15px] text-muted">
            Start with a free static code, graduate to dynamic when you need control.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/create/static">
              <Button variant="primary">Create a QR <ArrowRight size={16} /></Button>
            </Link>
            <Link to="/create/dynamic">
              <Button variant="outline">See dynamic plans <ArrowRight size={16} /></Button>
            </Link>
          </div>
        </MotionReveal>
      </section>
    </div>
  );
}
