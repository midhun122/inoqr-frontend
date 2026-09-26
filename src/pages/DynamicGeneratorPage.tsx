import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { GeneratorLayout } from "../components/layout/GeneratorLayout";
import { QRDownloadActions } from "../components/qr/QRDownloadActions";
import { QRPreview } from "../components/qr/QRPreview";
import { Button } from "../components/ui/Button";
import { FieldError, Input } from "../components/ui/Input";
import { Pill } from "../components/ui/Primitives";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useAuth } from "../services/auth";
import { loadLinks, saveLinks, shortUrl, slugify } from "../services/dynamic-store";
import type { DynamicLink } from "../types";

export function DynamicGeneratorPage() {
  const { user } = useAuth();
  const [links, setLinks] = useState<DynamicLink[]>(() => loadLinks());
  const [title, setTitle] = useState("Spring menu");
  const [slug, setSlug] = useState("menu-spring");
  const [destination, setDestination] = useState("https://example.com/menu-spring");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDest, setEditDest] = useState("");
  const [formError, setFormError] = useState("");
  const qrRef = useRef<SVGSVGElement | null>(null);

  const persist = (next: DynamicLink[]) => {
    setLinks(next);
    saveLinks(next);
  };

  const activeTarget = useMemo(() => {
    if (editingId) return links.find((l) => l.id === editingId);
    return links[0];
  }, [editingId, links]);

  const previewValue = activeTarget ? shortUrl(activeTarget.slug) : shortUrl(slugify(slug) || "link");
  const previewSig = previewValue + destination + (editingId ?? "new");
  const { value: settled, debouncing } = useDebouncedValue(previewSig, 550);
  // Orb spins a 1s beat on every change, matching the static studio.
  const [showcaseThinking, setShowcaseThinking] = useState(false);
  const sigRef = useRef(previewSig);
  useEffect(() => {
    if (sigRef.current === previewSig) return;
    sigRef.current = previewSig;
    setShowcaseThinking(true);
    const t = window.setTimeout(() => setShowcaseThinking(false), 1000);
    return () => window.clearTimeout(t);
  }, [previewSig]);
  const thinking = debouncing || previewSig !== settled || showcaseThinking;

  const createLink = () => {
    const cleanSlug = slugify(slug);
    if (!title.trim()) return setFormError("Give your link a title.");
    if (!/^https?:\/\/.+\..+/.test(destination.trim())) return setFormError("Destination must start with http:// or https://");
    if (links.some((l) => l.slug === cleanSlug)) return setFormError("That slug is taken — try another.");
    setFormError("");
    const now = new Date().toISOString();
    const link: DynamicLink = {
      id: `link-${Date.now()}`,
      title: title.trim(),
      slug: cleanSlug,
      destination: destination.trim(),
      scans: 0,
      createdAt: now,
      updatedAt: now,
      active: true,
    };
    persist([link, ...links]);
    setEditingId(link.id);
  };

  const saveDestination = () => {
    if (!editingId) return;
    if (!/^https?:\/\/.+\..+/.test(editDest.trim())) return setFormError("Destination must start with http:// or https://");
    setFormError("");
    persist(links.map((l) => (l.id === editingId ? { ...l, destination: editDest.trim(), updatedAt: new Date().toISOString(), scans: l.scans + 1 } : l)));
    setEditingId(null);
    setEditDest("");
  };

  if (!user) {
    return (
      <GeneratorLayout
        eyebrow="Dynamic QR"
        title="Dynamic links need an account"
        lede="Dynamic codes point at a short link you can retarget after printing. Sign in to create and manage them."
        sidebar={
          <div>
            <h2 className="text-[15px] font-bold">Preview</h2>
            <div className="mt-3"><QRPreview value="" fgColor="#141414" bgColor="#FFFFFF" thinking={false} qrRef={qrRef} emptyHint="Sign in to preview your dynamic QR" /></div>
          </div>
        }
      >
        <div className="rounded-md border border-hairline bg-canvas-soft p-6 text-center">
          <Pill tone="accent">Google sign-in required</Pill>
          <p className="mx-auto mt-3 max-w-[380px] text-[14px] text-muted">Static QR works without an account. Dynamic adds editing + analytics.</p>
          <div className="mt-5 flex justify-center gap-2">
            <Link to="/signin"><Button variant="accent">Sign in with Google</Button></Link>
            <Link to="/create/static"><Button variant="secondary">Use static instead</Button></Link>
          </div>
        </div>
      </GeneratorLayout>
    );
  }

  return (
    <GeneratorLayout
      eyebrow="Dynamic QR"
      title="Editable links with scan counts"
      lede="Create a short link, print its QR once, then change where it goes anytime. Toggle active, retarget, and export."
      badge={<Pill tone="accent">{links.length} links</Pill>}
      sidebar={
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold tracking-tight">Live preview</h2>
            <span className="flex items-center gap-2 text-[12px] font-semibold text-muted">
              <span className="relative flex h-1.5 w-1.5">
                {thinking ? (
                  <>
                    <span className="absolute h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  </>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
              </span>
              {thinking ? "Thinking…" : "Ready"}
            </span>
          </div>
          <div className="mt-3">
            <QRPreview value={previewValue} fgColor="#141414" bgColor="#FFFFFF" thinking={thinking} qrRef={qrRef} />
          </div>
          <p className="mt-3 break-all rounded-md bg-canvas-soft p-3 text-[13px] font-medium">{previewValue}</p>
          <div className="mt-3">
            <QRDownloadActions qrRef={qrRef} value={previewValue} bgColor="#FFFFFF" filenameBase={`inoqr-dynamic-${activeTarget?.slug ?? "link"}`} />
          </div>
        </div>
      }
    >
      {/* CREATE */}
      <h2 className="text-[15px] font-bold tracking-tight">New dynamic link</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="d-title">Title</label>
          <Input id="d-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Spring menu" />
        </div>
        <div>
          <label className="field-label" htmlFor="d-slug">Slug</label>
          <Input id="d-slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="menu-spring" />
          <p className="field-hint">inoqr.app/r/{slugify(slug) || "slug"}</p>
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="d-dest">Destination URL</label>
          <Input id="d-dest" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="https://example.com/…" />
        </div>
      </div>
      <FieldError message={formError || undefined} />
      <div className="mt-4">
        <Button variant="accent" onClick={createLink}>Create dynamic link</Button>
      </div>

      {/* LIST */}
      <div className="mt-8 border-t border-hairline pt-6">
        <h2 className="text-[15px] font-bold tracking-tight">Your links</h2>
        <div className="mt-4 space-y-3">
          {links.map((l) => (
            <div key={l.id} className={`rounded-md border p-4 ${editingId === l.id ? "border-accent" : "border-hairline"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[14px] font-bold">{l.title}</p>
                  <p className="break-all text-[13px] text-accent">{shortUrl(l.slug)}</p>
                  <p className="break-all text-[13px] text-muted">→ {l.destination}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Pill tone={l.active ? "ok" : "neutral"}>{l.active ? `${l.scans} scans` : "Paused"}</Pill>
                  <Button size="sm" variant={editingId === l.id ? "primary" : "outline"} onClick={() => { setEditingId(editingId === l.id ? null : l.id); setEditDest(l.destination); setFormError(""); }}>
                    {editingId === l.id ? "Selected" : "Retarget"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => persist(links.map((x) => (x.id === l.id ? { ...x, active: !x.active } : x)))}>
                    {l.active ? "Pause" : "Resume"}
                  </Button>
                </div>
              </div>
              {editingId === l.id && (
                <div className="mt-3 flex flex-col gap-2 border-t border-hairline pt-3 sm:flex-row">
                  <Input value={editDest} onChange={(e) => setEditDest(e.target.value)} aria-label="New destination" />
                  <Button size="sm" variant="accent" onClick={saveDestination}>Save</Button>
                </div>
              )}
            </div>
          ))}
          {links.length === 0 && <p className="text-[14px] text-muted">No links yet — create your first above.</p>}
        </div>
      </div>
      <p className="mt-4 text-[12px] text-faint">Demo storage: links persist in localStorage on this device. {settled ? "" : ""}</p>
    </GeneratorLayout>
  );
}
