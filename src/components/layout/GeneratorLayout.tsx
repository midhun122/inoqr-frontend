import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Parallax } from "../motion/Parallax";
import { Pill } from "../ui/Primitives";

export function GeneratorLayout({
  eyebrow,
  title,
  lede,
  badge,
  children,
  sidebar,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  badge?: ReactNode;
  children: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <div className="shell py-10 md:py-14">
      <Parallax speed={0.05}>
      <div className="max-w-[760px]">
        <Link to="/" className="text-[13px] font-semibold text-muted hover:text-ink">← Back home</Link>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Pill>{eyebrow}</Pill>
          {badge}
        </div>
        <h1 className="mt-4 font-display text-[36px] font-normal leading-[1.0] tracking-tight text-ink md:text-[46px]">{title}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted md:text-[16px]">{lede}</p>
      </div>
      </Parallax>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="card p-5 md:p-7">{children}</div>
        <aside className="lg:sticky lg:top-[88px] lg:self-start">
          <div className="card p-5 md:p-6">{sidebar}</div>
        </aside>
      </div>
    </div>
  );
}
