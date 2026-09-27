import { motion } from "framer-motion";
import { ContributorRow } from "../components/contributors/ContributorRow";
import { MotionReveal } from "../components/motion/MotionReveal";
import { contributorGroups } from "../data/contributors";

function SectionRule() {
  return (
    <div aria-hidden className="overflow-hidden">
      <motion.span
        className="block h-px origin-left bg-hairline"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

export function ContributorsPage() {
  return (
    <div className="shell max-w-narrow py-10 md:py-14">
      <MotionReveal>
        <p className="mono-label text-[11px] font-medium text-faint">Contributors</p>
        <h1 className="mt-3 max-w-[560px] font-display text-[36px] font-normal leading-[1.0] tracking-tight text-ink md:text-[46px]">
          The people <em>building INOQR.</em>
        </h1>
        <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-muted">
          A small team across frontend and backend, one QR at a time.
        </p>
      </MotionReveal>

      {contributorGroups.map((group) => (
        <section key={group.label} className="mt-12">
          <MotionReveal>
            <p className="mono-label text-[11px] font-medium text-muted">{group.label}</p>
            <div className="mt-3">
              <SectionRule />
            </div>
          </MotionReveal>
          <div className="mt-2">
            {group.members.map((member, i) => (
              <MotionReveal key={`${group.label}-${i}`} delay={Math.min(i * 0.06, 0.18)}>
                <ContributorRow contributor={member} />
              </MotionReveal>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
