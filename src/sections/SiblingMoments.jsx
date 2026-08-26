import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "../data/siteConfig";
import { fadeUp } from "../components/motion";
import Reveal from "../components/Reveal";
import T from "../components/T";
import SectionHeading from "../components/SectionHeading";

export default function SiblingMoments() {
  const { siblingMoments } = siteConfig;
  const reduced = useReducedMotion();

  return (
    <section className="grain section-pad relative overflow-hidden">
      <div className="shell relative">
        <SectionHeading eyebrow={siblingMoments.eyebrow} title={siblingMoments.heading} />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {siblingMoments.cards.map((c, i) => (
            <motion.li
              key={c.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              custom={(i % 3) * 0.9}
              whileHover={reduced ? undefined : { y: -6, rotate: i % 2 ? -0.5 : 0.5 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className={`card grain p-6 sm:p-7 ${
                i < 3 ? "lg:col-span-2" : "lg:col-span-3"
              } ${i === siblingMoments.cards.length - 1 ? "sm:col-span-2 lg:col-span-3" : ""}`}
            >
              <div className="flex items-start gap-4">
                <motion.span
                  aria-hidden="true"
                  animate={reduced ? {} : { rotate: [0, 6, -6, 0] }}
                  transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold-soft/25 bg-maroon-900/60 text-lg text-gold-soft"
                >
                  <T heart="text-rose">{c.glyph}</T>
                </motion.span>
                <div>
                  <h3 className="font-sans text-[0.68rem] font-medium tracking-[0.24em] text-gold-soft/85 uppercase">
                    {c.label}
                  </h3>
                  <p className="mt-2 font-display text-lg leading-snug text-ivory/90 sm:text-xl">
                    <T>{c.text}</T>
                  </p>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>

        <Reveal delay={0.1} className="mt-12 text-center">
          <p className="t-body mx-auto max-w-md text-cream/55">
            Some things about us are never going to change. Thankfully.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
