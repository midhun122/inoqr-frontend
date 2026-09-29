import { ArrowLeftRight, ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { FieldError, Input } from "../ui/Input";
import { SegmentedControl } from "../ui/Primitives";
import { contrastRatio, isValidHex } from "../../lib/qr-color";
import {
  BUILTIN_LOGOS,
  fileToLogoTile,
  validateLogoFile,
} from "../../lib/qr-logos";
import { MODULE_MOTIFS, motifInner } from "../../lib/qr-motifs";
import {
  EC_LEVELS,
  EYE_BORDER_STYLES,
  EYE_CENTER_STYLES,
  LOGO_SIZES,
  MODULE_STYLES,
} from "../../lib/qr-style";
import type {
  QRCustomization,
  QRErrorCorrection,
  QREyeBorderStyle,
  QREyeCenterStyle,
  QRLogoSize,
  QRModuleStyle,
} from "../../types";
import { EyeBorderGlyph, EyeCenterGlyph, ModuleGlyph, MotifGlyph } from "./StylePreviews";

type CustomizeTab = "pattern" | "eyes" | "colors" | "logo";

const TABS: { id: CustomizeTab; label: string }[] = [
  { id: "pattern", label: "Pattern" },
  { id: "eyes", label: "Eyes" },
  { id: "colors", label: "Colors" },
  { id: "logo", label: "Logo" },
];

function OptionTile({
  selected,
  label,
  hint,
  onClick,
  children,
}: {
  selected: boolean;
  label: string;
  hint: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      title={hint}
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-md border p-2 transition-all duration-fast ${
        selected
          ? "border-accent bg-accent/10"
          : "border-hairline bg-canvas hover:border-faint"
      }`}
    >
      {children}
      <span className="text-center text-[12px] font-semibold leading-tight text-ink">{label}</span>
    </button>
  );
}

/** Color swatch + hex input with validation. Only valid hex reaches state. */
function ColorField({
  id,
  label,
  value,
  onCommit,
}: {
  id: string;
  label: string;
  value: string;
  onCommit: (hex: string) => void;
}) {
  const [text, setText] = useState(value);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setText(value);
    setError(null);
  }, [value]);

  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={`${id}-swatch`}
          type="color"
          value={value}
          onChange={(e) => onCommit(e.target.value)}
          className="h-input w-12 shrink-0 cursor-pointer rounded-md border border-hairline bg-canvas p-1"
          aria-label={`${label} picker`}
        />
        <Input
          id={id}
          value={text}
          spellCheck={false}
          autoComplete="off"
          aria-label={`${label} hex value`}
          onChange={(e) => {
            const next = e.target.value;
            setText(next);
            if (next.trim() === "" || !isValidHex(next)) {
              setError("Use a hex color like #0066FF.");
              return;
            }
            setError(null);
            onCommit(next.trim());
          }}
          onBlur={() => {
            if (!isValidHex(text)) {
              setText(value);
              setError(null);
            }
          }}
        />
      </div>
      <FieldError message={error ?? undefined} />
    </div>
  );
}

interface CustomizePanelProps {
  value: QRCustomization;
  onChange: (patch: Partial<QRCustomization>) => void;
  onReset: () => void;
  ecBumped: boolean;
}

export function CustomizePanel({ value, onChange, onReset, ecBumped }: CustomizePanelProps) {
  const [tab, setTab] = useState<CustomizeTab>("pattern");
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const takeFile = async (file: File | undefined) => {
    if (!file) return;
    const invalid = validateLogoFile(file);
    if (invalid) {
      setUploadError(invalid);
      return;
    }
    setUploadError(null);
    setUploading(true);
    try {
      const tile = await fileToLogoTile(file);
      setUploadName(file.name);
      onChange({ uploadedLogo: tile, logoType: "upload" });
    } catch {
      setUploadError("Could not read that image. Try another file.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeUpload = () => {
    setUploadName(null);
    setUploadError(null);
    onChange({ uploadedLogo: null, logoType: "none" });
  };

  const contrast = contrastRatio(value.foregroundColor, value.backgroundColor);

  return (
    <div>
      <div role="tablist" aria-label="Customize sections" className="inline-flex max-w-full flex-wrap gap-1 rounded-full border border-hairline bg-canvas-soft p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all duration-fast ${
              tab === t.id ? "bg-canvas text-ink shadow-card" : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "pattern" && (
          <div className="space-y-5">
            <div>
              <p className="field-label" id="module-style-label">Module style</p>
              <div role="group" aria-labelledby="module-style-label" className="grid grid-cols-3 gap-2">
                {MODULE_STYLES.map((s) => (
                  <OptionTile
                    key={s.id}
                    selected={value.moduleStyle === s.id && value.moduleMotif === "none"}
                    label={s.label}
                    hint={s.hint}
                    onClick={() => onChange({ moduleStyle: s.id as QRModuleStyle, moduleMotif: "none" })}
                  >
                    <ModuleGlyph style={s.id as QRModuleStyle} />
                  </OptionTile>
                ))}
              </div>
            </div>
            <div>
              <p className="field-label" id="designer-motif-label">Designer</p>
              <div role="group" aria-labelledby="designer-motif-label" className="grid grid-cols-3 gap-2">
                {MODULE_MOTIFS.map((m) => {
                  const inner = motifInner(m.id);
                  return (
                    <OptionTile
                      key={m.id}
                      selected={value.moduleMotif === m.id}
                      label={m.name}
                      hint={m.hint}
                      onClick={() => onChange({ moduleMotif: value.moduleMotif === m.id ? "none" : m.id })}
                    >
                      {inner ? <MotifGlyph inner={inner} /> : null}
                    </OptionTile>
                  );
                })}
              </div>
              <p className="field-hint">Artwork replaces the modules. Eyes stay untouched.</p>
            </div>
          </div>
        )}

        {tab === "eyes" && (
          <div className="space-y-5">
            <div>
              <p className="field-label" id="eye-border-label">Eye border</p>
              <div role="group" aria-labelledby="eye-border-label" className="grid grid-cols-3 gap-2">
                {EYE_BORDER_STYLES.map((s) => (
                  <OptionTile
                    key={s.id}
                    selected={value.eyeBorderStyle === s.id}
                    label={s.label}
                    hint={s.hint}
                    onClick={() => onChange({ eyeBorderStyle: s.id as QREyeBorderStyle })}
                  >
                    <EyeBorderGlyph style={s.id as QREyeBorderStyle} />
                  </OptionTile>
                ))}
              </div>
            </div>
            <div>
              <p className="field-label" id="eye-center-label">Eye center</p>
              <div role="group" aria-labelledby="eye-center-label" className="grid grid-cols-3 gap-2">
                {EYE_CENTER_STYLES.map((s) => (
                  <OptionTile
                    key={s.id}
                    selected={value.eyeCenterStyle === s.id}
                    label={s.label}
                    hint={s.hint}
                    onClick={() => onChange({ eyeCenterStyle: s.id as QREyeCenterStyle })}
                  >
                    <EyeCenterGlyph style={s.id as QREyeCenterStyle} />
                  </OptionTile>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <ColorField
                  id="eye-border-color"
                  label="Eye border color"
                  value={value.eyeBorderColor || value.foregroundColor}
                  onCommit={(hex) => onChange({ eyeBorderColor: hex })}
                />
                {value.eyeBorderColor && (
                  <button
                    type="button"
                    onClick={() => onChange({ eyeBorderColor: "" })}
                    className="mt-1.5 text-[12px] font-semibold text-accent hover:underline"
                  >
                    Match modules
                  </button>
                )}
              </div>
              <div>
                <ColorField
                  id="eye-center-color"
                  label="Eye center color"
                  value={value.eyeCenterColor || value.foregroundColor}
                  onCommit={(hex) => onChange({ eyeCenterColor: hex })}
                />
                {value.eyeCenterColor && (
                  <button
                    type="button"
                    onClick={() => onChange({ eyeCenterColor: "" })}
                    className="mt-1.5 text-[12px] font-semibold text-accent hover:underline"
                  >
                    Match modules
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "colors" && (
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ColorField
                id="qr-fg"
                label="Foreground"
                value={value.foregroundColor}
                onCommit={(hex) => onChange({ foregroundColor: hex })}
              />
              <ColorField
                id="qr-bg"
                label="Background"
                value={value.backgroundColor}
                onCommit={(hex) => onChange({ backgroundColor: hex })}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    foregroundColor: value.backgroundColor,
                    backgroundColor: value.foregroundColor,
                  })
                }
                className="inline-flex h-9 items-center gap-2 rounded-full border border-hairline bg-canvas px-4 text-[13px] font-semibold text-ink transition-colors duration-fast hover:border-faint"
              >
                <ArrowLeftRight size={14} /> Invert
              </button>
              {contrast < 3 ? (
                <p className="text-[13px] font-medium text-red-600 dark:text-red-400">
                  Low contrast ({contrast.toFixed(1)}:1) — this may not scan reliably.
                </p>
              ) : (
                <p className="field-hint !mt-0">Contrast {contrast.toFixed(1)}:1 — scans cleanly.</p>
              )}
            </div>
          </div>
        )}

        {tab === "logo" && (
          <div className="space-y-5">
            <div>
              <p className="field-label" id="builtin-logo-label">Built-in icon</p>
              <div role="group" aria-labelledby="builtin-logo-label" className="grid grid-cols-5 gap-2">
                <button
                  type="button"
                  aria-pressed={value.logoType === "none"}
                  title="No logo"
                  onClick={() => onChange({ logoType: "none" })}
                  className={`grid h-11 place-items-center rounded-md border text-[12px] font-semibold transition-all duration-fast ${
                    value.logoType === "none"
                      ? "border-accent bg-accent/10 text-ink"
                      : "border-hairline bg-canvas text-muted hover:border-faint hover:text-ink"
                  }`}
                >
                  None
                </button>
                {BUILTIN_LOGOS.map(({ id, label, Icon }) => {
                  const selected = value.logoType === "builtin" && value.builtinLogo === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={selected}
                      title={label}
                      aria-label={`${label} logo`}
                      onClick={() => onChange({ logoType: "builtin", builtinLogo: id })}
                      className={`grid h-11 place-items-center rounded-md border transition-all duration-fast ${
                        selected
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-hairline bg-canvas text-muted hover:border-faint hover:text-ink"
                      }`}
                    >
                      <Icon size={18} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="field-label" id="upload-logo-label">Custom upload</p>
              <div
                role="button"
                tabIndex={0}
                aria-labelledby="upload-logo-label"
                onClick={() => fileRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileRef.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  void takeFile(e.dataTransfer.files?.[0]);
                }}
                className={`flex cursor-pointer items-center gap-3 rounded-md border border-dashed p-4 transition-colors duration-fast focus-visible:outline-accent ${
                  dragOver ? "border-accent bg-accent/10" : "border-hairline hover:border-faint"
                }`}
              >
                {value.logoType === "upload" && value.uploadedLogo ? (
                  <img
                    src={value.uploadedLogo}
                    alt="Uploaded logo preview"
                    className="h-14 w-14 rounded-md object-cover ring-1 ring-hairline"
                  />
                ) : (
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-md bg-canvas-soft text-muted">
                    <ImagePlus size={22} />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold text-ink">
                    {uploading ? "Reading image…" : (uploadName ?? "Drop an image here, or click to browse")}
                  </span>
                  <span className="field-hint !mt-0.5 block">PNG, JPG, or WebP under 2 MB. Stays in your browser.</span>
                </span>
                {value.logoType === "upload" && value.uploadedLogo && (
                  <button
                    type="button"
                    aria-label="Remove uploaded logo"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeUpload();
                    }}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-faint transition-colors hover:bg-canvas-soft hover:text-ink"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                className="sr-only"
                aria-label="Choose a logo image file"
                onChange={(e) => {
                  void takeFile(e.target.files?.[0]);
                }}
              />
              <FieldError message={uploadError ?? undefined} />
            </div>

            <div>
              <p className="field-label" id="logo-size-label">Logo size</p>
              <SegmentedControl
                ariaLabel="Logo size"
                value={value.logoSize}
                onChange={(v) => onChange({ logoSize: v as QRLogoSize })}
                options={LOGO_SIZES.map((s) => ({ id: s.id as QRLogoSize, label: s.label }))}
              />
              <p className="field-hint">Capped for safe scanning. Error correction rises to Maximum with a logo.</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-hairline pt-5">
        <p className="field-label" id="ec-level-label">Error correction</p>
        <div className="flex flex-wrap items-center gap-3">
          <select
            id="ec-level"
            aria-labelledby="ec-level-label"
            className="h-input rounded-md border border-hairline bg-canvas px-3 text-[14px]"
            value={value.errorCorrection}
            onChange={(e) => onChange({ errorCorrection: e.target.value as QRErrorCorrection })}
          >
            {EC_LEVELS.map((l) => (
              <option key={l.id} value={l.id} title={l.hint}>
                {l.id} — {l.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-9 items-center rounded-full border border-hairline bg-canvas px-4 text-[13px] font-semibold text-ink transition-colors duration-fast hover:border-faint"
          >
            Reset design
          </button>
        </div>
        <p className="field-hint">
          {ecBumped
            ? "Raised to Maximum while a logo is shown, so the code stays scannable."
            : EC_LEVELS.find((l) => l.id === value.errorCorrection)?.hint}
        </p>
      </div>
    </div>
  );
}
