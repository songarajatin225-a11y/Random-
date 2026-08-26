import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "../data/siteConfig";
import { EASE } from "../components/motion";
import Reveal from "../components/Reveal";
import T from "../components/T";
import SectionHeading from "../components/SectionHeading";
import { Bloom, Lattice } from "../components/Ornament";

export default function AppreciationSection() {
  const { appreciation } = siteConfig;
  const reduced = useReducedMotion();

  return (
    <section
      id="for-you"
      className="grain section-pad relative overflow-hidden bg-[linear-gradient(180deg,transparent,rgba(61,13,27,0.55)_40%,transparent)]"
    >
      <Lattice opacity={0.022} />
      <Bloom tone="rose" className="left-1/2 top-1/3 h-[30rem] w-[30rem] -translate-x-1/2" />

      <div className="shell relative">
        <SectionHeading eyebrow={appreciation.eyebrow} title={appreciation.heading} />

        <ol className="mx-auto mt-16 max-w-2xl space-y-14 px-2 text-center sm:space-y-20">
          {appreciation.lines.map((line, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: reduced ? 0 : 30, filter: reduced ? "none" : "blur(5px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: reduced ? 0.25 : 1, ease: EASE }}
              className="font-display text-[1.32rem] leading-snug text-cream/90 sm:text-[2rem]"
            >
              <span className="relative">
                <T>{line}</T>
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: reduced ? 0.2 : 1.1, delay: 0.35, ease: EASE }}
                  className="absolute -bottom-4 left-1/2 h-px w-16 -translate-x-1/2 origin-center bg-[linear-gradient(90deg,transparent,rgba(201,162,39,0.65),transparent)]"
                />
              </span>
            </motion.li>
          ))}
        </ol>

        <Reveal amount={0.6} className="mt-20 text-center">
          <p className="t-gold font-display text-[2rem] leading-tight sm:text-[3.25rem]">
            <T heart="text-rose">{appreciation.finale}</T>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
