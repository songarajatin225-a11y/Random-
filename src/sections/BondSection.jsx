import { siteConfig } from "../data/siteConfig";
import Reveal from "../components/Reveal";
import T from "../components/T";
import SectionHeading from "../components/SectionHeading";
import { Bloom, Lattice } from "../components/Ornament";

export default function BondSection() {
  const { bond } = siteConfig;

  return (
    <section id="bond" className="grain section-pad relative overflow-hidden">
      <Lattice opacity={0.026} />
      <Bloom className="left-[-8rem] top-1/4 h-[24rem] w-[24rem]" />
      <Bloom tone="rose" className="right-[-6rem] bottom-0 h-[20rem] w-[20rem]" />

      <div className="shell relative">
        <SectionHeading eyebrow={bond.eyebrow} title={bond.heading} accent="❤️" />

        <div className="mx-auto mt-14 max-w-2xl space-y-8 text-center">
          {bond.paragraphs.map((p, i) => (
            <Reveal
              as="p"
              key={i}
              delay={0.12 * i}
              amount={0.4}
              className={
                i === bond.paragraphs.length - 1
                  ? "t-body font-display text-[1.2rem] leading-relaxed text-ivory sm:text-[1.4rem]"
                  : "t-body"
              }
            >
              <T>{p}</T>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mx-auto mt-16 flex max-w-xs items-center justify-center gap-3">
          <span className="hairline flex-1" />
          <span className="text-xs tracking-[0.3em] text-gold-soft/60 uppercase">est. always</span>
          <span className="hairline flex-1" />
        </Reveal>
      </div>
    </section>
  );
}
