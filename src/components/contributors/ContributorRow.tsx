import { ArrowUpRight } from "lucide-react";
import type { Contributor } from "../../data/contributors";

function SocialLink({ label, href }: { label: string; href: string }) {
  if (!href) {
    return <span className="text-faint">{label}</span>;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group/link inline-flex items-center gap-1 text-muted transition-colors hover:text-accent"
    >
      {label}
      <ArrowUpRight
        size={13}
        className="transition-transform duration-fast group-hover/link:translate-x-px group-hover/link:-translate-y-px"
      />
    </a>
  );
}

export function ContributorRow({ contributor }: { contributor: Contributor }) {
  return (
    <div className="group border-t border-hairline py-6 last:border-b">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <div className="transition-transform duration-base group-hover:translate-x-1">
          <p className="font-display text-[24px] font-normal leading-tight tracking-tight text-ink">
            {contributor.name}
          </p>
          <p className="mt-1 text-[13px] font-medium text-muted">{contributor.role}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] font-semibold sm:justify-end">
          <SocialLink label="Portfolio" href={contributor.portfolio} />
          <SocialLink label="GitHub" href={contributor.github} />
          <SocialLink label="LinkedIn" href={contributor.linkedin} />
        </div>
      </div>
    </div>
  );
}
