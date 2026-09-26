import { useEffect, useMemo, useRef, useState } from "react";
import { GeneratorLayout } from "../components/layout/GeneratorLayout";
import { QRDownloadActions } from "../components/qr/QRDownloadActions";
import { QRPreview } from "../components/qr/QRPreview";
import { Button } from "../components/ui/Button";
import { FieldError, Input, Textarea } from "../components/ui/Input";
import { Pill, SegmentedControl } from "../components/ui/Primitives";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { buildStaticPayload, DEFAULT_STATIC_FORM, payloadCharInfo, STATIC_KINDS, validateStaticForm } from "../lib/qr-encode";
import type { StaticFormState } from "../types";

export function StaticGeneratorPage() {
  const [form, setForm] = useState<StaticFormState>(DEFAULT_STATIC_FORM);
  const [touched, setTouched] = useState(false);
  const qrRef = useRef<SVGSVGElement | null>(null);

  const set = <K extends keyof StaticFormState>(k: K, v: StaticFormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setTouched(true);
  };

  const payload = useMemo(() => buildStaticPayload(form), [form]);
  const errors = useMemo(() => validateStaticForm(form), [form]);
  const hasError = Object.keys(errors).length > 0;
  const info = payloadCharInfo(payload);

  // Orb spins a 1s beat on every customization, then QR crossfades in.
  const signature = useMemo(
    () => JSON.stringify([form.kind, payload, form.fgColor, form.bgColor]),
    [form.kind, payload, form.fgColor, form.bgColor],
  );
  const { value: settledSig, debouncing } = useDebouncedValue(signature, 550);
  const [showcaseThinking, setShowcaseThinking] = useState(false);
  const sigRef = useRef(signature);
  useEffect(() => {
    if (sigRef.current === signature) return;
    sigRef.current = signature;
    setShowcaseThinking(true);
    const t = window.setTimeout(() => setShowcaseThinking(false), 1000);
    return () => window.clearTimeout(t);
  }, [signature]);
  const thinking = debouncing || signature !== settledSig || showcaseThinking;

  const filename = useMemo(() => `inoqr-static-${form.kind}`, [form.kind]);

  return (
    <GeneratorLayout
      eyebrow="Static QR"
      title="Create a static QR code"
      lede="Data is encoded directly into the pattern. It never expires and needs no account. Type, tune the style, export."
      badge={
        <Pill tone={info.level === "ok" ? "neutral" : info.level === "warn" ? "warn" : "warn"}>
          {info.chars} chars
        </Pill>
      }
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
                  <span className={`h-1.5 w-1.5 rounded-full ${hasError ? "bg-amber-500" : "bg-emerald-500"}`} />
                )}
              </span>
              {thinking ? "Thinking…" : hasError ? "Needs input" : "Ready"}
            </span>
          </div>
          <div className="mt-3">
            <QRPreview
              value={hasError ? "" : payload}
              fgColor={form.fgColor}
              bgColor={form.bgColor}
              thinking={thinking && !hasError}
              qrRef={qrRef}
              emptyHint={hasError ? Object.values(errors)[0] : "Enter content to preview your QR"}
            />
          </div>
          <div className="mt-4">
            <QRDownloadActions
              qrRef={qrRef}
              value={hasError ? "" : payload}
              bgColor={form.bgColor}
              filenameBase={filename}
              history={{
                kind: form.kind,
                label: STATIC_KINDS.find((k) => k.id === form.kind)?.label ?? form.kind,
                fgColor: form.fgColor,
              }}
            />
          </div>
          <p className="mt-4 rounded-md bg-canvas-soft p-3 text-[12px] leading-relaxed text-muted">
            Denser payloads scan slower. Keep URLs short and prefer error level M unless the code will be printed small or damaged.
          </p>
        </div>
      }
    >
      {/* TYPE */}
      <label className="field-label" id="qr-kind-label">Content type</label>
      <SegmentedControl
        ariaLabel="Content type"
        value={form.kind}
        onChange={(v) => set("kind", v)}
        options={STATIC_KINDS.map((k) => ({ id: k.id, label: k.label }))}
      />

      {/* FIELDS */}
      <div className="mt-6 space-y-5">
        {form.kind === "url" && (
          <div>
            <label className="field-label" htmlFor="f-url">Destination URL</label>
            <Input id="f-url" inputMode="url" placeholder="https://example.com/page" value={form.url} error={touched ? errors.url : undefined} onChange={(e) => set("url", e.target.value)} />
            <FieldError message={touched ? errors.url : undefined} />
          </div>
        )}
        {form.kind === "text" && (
          <div>
            <label className="field-label" htmlFor="f-text">Text</label>
            <Textarea id="f-text" placeholder="Plain text…" value={form.text} onChange={(e) => set("text", e.target.value)} />
            <FieldError message={touched ? errors.text : undefined} />
          </div>
        )}
        {form.kind === "wifi" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="f-ssid">Network name (SSID)</label>
              <Input id="f-ssid" value={form.wifiSsid} onChange={(e) => set("wifiSsid", e.target.value)} error={touched ? errors.wifiSsid : undefined} />
              <FieldError message={touched ? errors.wifiSsid : undefined} />
            </div>
            <div>
              <label className="field-label" htmlFor="f-pass">Password</label>
              <Input id="f-pass" type="password" value={form.wifiPassword} onChange={(e) => set("wifiPassword", e.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="f-enc">Security</label>
              <select id="f-enc" className="h-input w-full rounded-md border border-hairline bg-canvas px-3 text-[14px]" value={form.wifiEncryption} onChange={(e) => set("wifiEncryption", e.target.value as never)}>
                <option value="WPA">WPA / WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Open (no password)</option>
              </select>
            </div>
          </div>
        )}
        {form.kind === "vcard" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="f-vn">Full name</label>
              <Input id="f-vn" value={form.vcardName} onChange={(e) => set("vcardName", e.target.value)} error={touched ? errors.vcardName : undefined} />
              <FieldError message={touched ? errors.vcardName : undefined} />
            </div>
            <div>
              <label className="field-label" htmlFor="f-vo">Organisation</label>
              <Input id="f-vo" value={form.vcardOrg} onChange={(e) => set("vcardOrg", e.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="f-vp">Phone</label>
              <Input id="f-vp" value={form.vcardPhone} onChange={(e) => set("vcardPhone", e.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="f-ve">Email</label>
              <Input id="f-ve" value={form.vcardEmail} onChange={(e) => set("vcardEmail", e.target.value)} />
            </div>
          </div>
        )}
        {form.kind === "email" && (
          <div className="grid gap-4">
            <div>
              <label className="field-label" htmlFor="f-eto">To</label>
              <Input id="f-eto" value={form.emailTo} onChange={(e) => set("emailTo", e.target.value)} error={touched ? errors.emailTo : undefined} />
              <FieldError message={touched ? errors.emailTo : undefined} />
            </div>
            <div>
              <label className="field-label" htmlFor="f-esub">Subject</label>
              <Input id="f-esub" value={form.emailSubject} onChange={(e) => set("emailSubject", e.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="f-ebody">Body</label>
              <Textarea id="f-ebody" value={form.emailBody} onChange={(e) => set("emailBody", e.target.value)} />
            </div>
          </div>
        )}
        {form.kind === "sms" && (
          <div className="grid gap-4">
            <div>
              <label className="field-label" htmlFor="f-smsn">Number</label>
              <Input id="f-smsn" value={form.smsNumber} onChange={(e) => set("smsNumber", e.target.value)} error={touched ? errors.smsNumber : undefined} />
              <FieldError message={touched ? errors.smsNumber : undefined} />
            </div>
            <div>
              <label className="field-label" htmlFor="f-smsb">Message</label>
              <Textarea id="f-smsb" value={form.smsBody} onChange={(e) => set("smsBody", e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {/* STYLE */}
      <div className="mt-8 border-t border-hairline pt-6">
        <h2 className="text-[15px] font-bold tracking-tight">Style</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="field-label" htmlFor="f-fg">Code color</label>
            <div className="flex items-center gap-2">
              <input id="f-fg" type="color" value={form.fgColor} onChange={(e) => set("fgColor", e.target.value)} className="h-input w-12 cursor-pointer rounded-md border border-hairline bg-canvas p-1" aria-label="QR foreground color" />
              <Input value={form.fgColor} onChange={(e) => set("fgColor", e.target.value)} aria-label="Foreground hex" />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="f-bg">Background</label>
            <div className="flex items-center gap-2">
              <input id="f-bg" type="color" value={form.bgColor} onChange={(e) => set("bgColor", e.target.value)} className="h-input w-12 cursor-pointer rounded-md border border-hairline bg-canvas p-1" aria-label="QR background color" />
              <Input value={form.bgColor} onChange={(e) => set("bgColor", e.target.value)} aria-label="Background hex" />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="f-ec">Error correction</label>
            <select id="f-ec" className="h-input w-full rounded-md border border-hairline bg-canvas px-3 text-[14px]" value={form.ecLevel} onChange={(e) => set("ecLevel", e.target.value as never)}>
              <option value="L">L — smallest</option>
              <option value="M">M — balanced</option>
              <option value="Q">Q — sturdy</option>
              <option value="H">H — maximum</option>
            </select>
            <p className="field-hint">M suits most print + screen use.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => { setForm(DEFAULT_STATIC_FORM); setTouched(false); }}>Reset</Button>
      </div>
    </GeneratorLayout>
  );
}
