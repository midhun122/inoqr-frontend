import { ArrowRight, Link2, QrCode, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { MotionReveal } from "../components/motion/MotionReveal";
import { Button } from "../components/ui/Button";
import { Pill } from "../components/ui/Primitives";
import { useAuth } from "../services/auth";
import { loadLinks, saveLinks, shortUrl } from "../services/dynamic-store";
import { loadStaticHistory, removeStaticEntry } from "../services/static-history";
import type { DynamicLink } from "../types";

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function MyQRsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"static" | "dynamic">("static");
  const [staticEntries, setStaticEntries] = useState(() => loadStaticHistory());
  const [links, setLinks] = useState<DynamicLink[]>(() => loadLinks());

  if (!user) {
    return (
      <div className="shell grid place-items-center py-14 md:py-20">
        <MotionReveal className="w-full max-w-[440px]">
          <div className="card p-7 text-center md:p-9">
            <Pill tone="accent">Members only</Pill>
            <h1 className="mt-4 font-display text-[30px] font-normal leading-[1.0] tracking-tight text-ink">
              Your QRs live here
            </h1>
            <p className="mx-auto mt-2 max-w-[360px] text-[14px] leading-relaxed text-muted">
              Sign in to see every static code you've exported and every dynamic link you've created.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Link to="/signin"><Button variant="accent">Sign in with Google</Button></Link>
              <Link to="/create/static"><Button variant="secondary">Use static instead</Button></Link>
            </div>
          </div>
        </MotionReveal>
      </div>
    );
  }

  const deleteStatic = (id: string) => setStaticEntries(removeStaticEntry(id));
  const deleteLink = (id: string) => {
    const next = links.filter((l) => l.id !== id);
    setLinks(next);
    saveLinks(next);
  };

  return (
    <div className="shell py-10 md:py-14">
      <MotionReveal className="max-w-[760px]">
        <p className="mono-label text-[11px] font-medium text-faint">Dashboard</p>
        <h1 className="mt-3 font-display text-[36px] font-normal leading-[1.0] tracking-tight text-ink md:text-[46px]">
          My QRs
        </h1>
        <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-muted">
          Everything you've made in one place — exported static codes and dynamic links, kept separate.
        </p>
        <div className="mt-6 inline-flex rounded-full border border-hairline bg-canvas-soft p-1">
          {(["static", "dynamic"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-[14px] font-semibold transition-all ${
                tab === t ? "bg-canvas text-ink shadow-card" : "text-muted hover:text-ink"
              }`}
            >
              {t === "static" ? `Static (${staticEntries.length})` : `Dynamic (${links.length})`}
            </button>
          ))}
        </div>
      </MotionReveal>

      {tab === "static" ? (
        <div className="mt-8">
          {staticEntries.length === 0 ? (
            <div className="card mx-auto max-w-[520px] p-8 text-center">
              <QrCode size={28} className="mx-auto text-faint" />
              <p className="mt-3 text-[16px] font-bold text-ink">No static codes yet</p>
              <p className="mx-auto mt-1 max-w-[360px] text-[14px] text-muted">
                Export or copy any static QR and it will show up here automatically.
              </p>
              <div className="mt-5 flex justify-center">
                <Link to="/create/static"><Button variant="accent">Create a static QR <ArrowRight size={15} /></Button></Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {staticEntries.map((e, i) => (
                <MotionReveal key={e.id} delay={Math.min(i * 0.05, 0.2)}>
                  <div className="card flex h-full flex-col p-5">
                    <div className="flex items-start justify-between gap-2">
                      <Pill>{e.label}</Pill>
                      <button
                        onClick={() => deleteStatic(e.id)}
                        aria-label={`Delete ${e.label} QR`}
                        className="grid h-8 w-8 place-items-center rounded-full text-faint transition-colors hover:bg-canvas-soft hover:text-ink"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="mx-auto mt-4 rounded-lg bg-white p-3 shadow-card ring-1 ring-black/5 dark:ring-white/25">
                      <QRCodeSVG value={e.payload} size={120} fgColor={e.fgColor} bgColor={e.bgColor} level="M" marginSize={1} />
                    </div>
                    <p className="mt-4 truncate text-[13px] text-muted" title={e.payload}>{e.payload}</p>
                    <p className="mt-1 text-[12px] font-medium text-faint">{fmtDate(e.createdAt)}</p>
                  </div>
                </MotionReveal>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8">
          {links.length === 0 ? (
            <div className="card mx-auto max-w-[520px] p-8 text-center">
              <Link2 size={28} className="mx-auto text-faint" />
              <p className="mt-3 text-[16px] font-bold text-ink">No dynamic links yet</p>
              <p className="mx-auto mt-1 max-w-[360px] text-[14px] text-muted">
                Create your first short link — print its QR once, retarget it forever.
              </p>
              <div className="mt-5 flex justify-center">
                <Link to="/create/dynamic"><Button variant="accent">Open dynamic studio <ArrowRight size={15} /></Button></Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {links.map((l, i) => (
                <MotionReveal key={l.id} delay={Math.min(i * 0.05, 0.2)}>
                  <div className="card flex h-full flex-col p-5">
                    <div className="flex items-start justify-between gap-2">
                      <Pill tone={l.active ? "ok" : "neutral"}>
                        {l.active ? `${l.scans} scans` : "Paused"}
                      </Pill>
                      <button
                        onClick={() => deleteLink(l.id)}
                        aria-label={`Delete ${l.title}`}
                        className="grid h-8 w-8 place-items-center rounded-full text-faint transition-colors hover:bg-canvas-soft hover:text-ink"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <p className="mt-3 text-[16px] font-bold text-ink">{l.title}</p>
                    <p className="break-all text-[13px] font-medium text-accent">{shortUrl(l.slug)}</p>
                    <p className="break-all text-[13px] text-muted">→ {l.destination}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
                      <p className="text-[12px] font-medium text-faint">Updated {fmtDate(l.updatedAt)}</p>
                      <Link to="/create/dynamic" className="text-[13px] font-semibold text-accent hover:underline">
                        Manage →
                      </Link>
                    </div>
                  </div>
                </MotionReveal>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
