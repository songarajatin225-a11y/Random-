import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "../data/siteConfig";
import { EASE } from "../components/motion";
import Particles from "../components/Particles";
import T from "../components/T";
import { Bloom } from "../components/Ornament";

export default function OneThing() {
  const { oneThing } = siteConfig;
  const reduced = useReducedMotion();

  const line = {
    hidden: { opacity: 0, y: reduced ? 0 : 24, filter: reduced ? "none" : "blur(8px)" },
    show: (delay) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduced ? 0.3 : 1.25, delay: reduced ? 0 : delay, ease: EASE },
    }),
  };

  return (
    <section className="grain relative flex min-h-[92svh] items-center overflow-hidden py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_50%,#2A0812_0%,#180610_55%,#14060B_100%)]"
      />
      <Bloom className="left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2" />
      <Particles density={0.00005} />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.45 }}
        className="shell relative flex flex-col items-center text-center"
      >
        <motion.p
          variants={line}
          custom={0.1}
          className="max-w-xl font-display text-[1.3rem] leading-snug text-cream/70 sm:text-[1.75rem]"
        >
          {oneThing.intro}
        </motion.p>

        <motion.span
          aria-hidden="true"
          variants={line}
          custom={1.1}
          className="my-9 block h-10 w-px bg-[linear-gradient(180deg,transparent,rgba(201,162,39,0.6),transparent)] sm:my-12"
        />

        <motion.p
          variants={line}
          custom={1.5}
          className="t-gold max-w-4xl font-display text-[1.85rem] leading-[1.15] sm:text-[3.5rem]"
        >
          {oneThing.reveal}
        </motion.p>

        <motion.p
          variants={line}
          custom={2.9}
          className="mt-10 max-w-md font-display text-[1.15rem] text-cream/70 sm:text-[1.5rem]"
        >
          <T>{oneThing.outro}</T>
        </motion.p>
      </motion.div>
    </section>
  );
}
