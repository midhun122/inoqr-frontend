import type { QREyeBorderStyle, QREyeCenterStyle, QRModuleStyle } from "../../types";

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden className="text-ink">
      {children}
    </svg>
  );
}

/** 3×3 module swatch for each supported dot style. */
export function ModuleGlyph({ style }: { style: QRModuleStyle }) {
  const cells: { x: number; y: number; on: boolean }[] = [];
  const pattern = [1, 1, 0, 1, 0, 1, 0, 1, 1];
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      cells.push({ x: 5 + i * 9, y: 5 + j * 9, on: pattern[j * 3 + i] === 1 });
    }
  }
  if (style === "classy" || style === "classy-rounded") {
    const r = style === "classy" ? 1 : 3;
    return (
      <Svg>
        <rect x="5" y="5" width="24" height="7" rx={r} fill="currentColor" />
        <rect x="5" y="15" width="7" height="7" rx={r} fill="currentColor" />
        <rect x="22" y="15" width="7" height="7" rx={r} fill="currentColor" />
        <rect x="5" y="25" width="7" height="4" rx={r} fill="currentColor" opacity="0.45" />
        <rect x="22" y="25" width="7" height="4" rx={r} fill="currentColor" opacity="0.45" />
      </Svg>
    );
  }
  if (style === "dots") {
    return (
      <Svg>
        {cells.map(
          (c, k) =>
            c.on && <circle key={k} cx={c.x + 3.5} cy={c.y + 3.5} r="3.5" fill="currentColor" />,
        )}
      </Svg>
    );
  }
  const rx = style === "square" ? 0.5 : style === "rounded" ? 2.2 : 3.4;
  return (
    <Svg>
      {cells.map(
        (c, k) =>
          c.on && (
            <rect key={k} x={c.x} y={c.y} width="7" height="7" rx={rx} fill="currentColor" />
          ),
      )}
    </Svg>
  );
}

/** Miniature eye frame for each supported border style. */
export function EyeBorderGlyph({ style }: { style: QREyeBorderStyle }) {
  if (style === "circle") {
    return (
      <Svg>
        <circle cx="17" cy="17" r="11" fill="none" stroke="currentColor" strokeWidth="4" />
        <circle cx="17" cy="17" r="3.4" fill="currentColor" />
      </Svg>
    );
  }
  const rx = style === "square" ? 1.5 : 8;
  return (
    <Svg>
      <rect x="6" y="6" width="22" height="22" rx={rx} fill="none" stroke="currentColor" strokeWidth="4" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" fill="currentColor" />
    </Svg>
  );
}

/** Miniature designer motif, scaled from its 24×24 cell into the swatch. */
export function MotifGlyph({ inner }: { inner: string }) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden className="text-ink">
      <g transform="translate(5 5)" fill="currentColor" dangerouslySetInnerHTML={{ __html: inner }} />
    </svg>
  );
}
/** Miniature eye center for each supported center style. */
export function EyeCenterGlyph({ style }: { style: QREyeCenterStyle }) {
  if (style === "diamond") {
    return (
      <Svg>
        <rect x="6" y="6" width="22" height="22" rx="1.5" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.35" />
        <polygon points="17,10.5 23.5,17 17,23.5 10.5,17" fill="currentColor" />
      </Svg>
    );
  }
  if (style === "round") {
    return (
      <Svg>
        <rect x="6" y="6" width="22" height="22" rx="1.5" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.35" />
        <rect x="11.5" y="11.5" width="11" height="11" rx="3.5" fill="currentColor" />
      </Svg>
    );
  }  if (style === "dot") {
    return (
      <Svg>
        <rect x="6" y="6" width="22" height="22" rx="1.5" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.35" />
        <circle cx="17" cy="17" r="5" fill="currentColor" />
      </Svg>
    );
  }
  return (
    <Svg>
      <rect x="6" y="6" width="22" height="22" rx="1.5" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.35" />
      <rect x="12.5" y="12.5" width="9" height="9" rx="1" fill="currentColor" />
    </Svg>
  );
}
