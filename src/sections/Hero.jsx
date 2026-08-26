import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "../data/siteConfig";
import { EASE } from "../components/motion";
import Particles from "../components/Particles";
import { Bloom, Divider, Heart, Lattice } from "../components/Ornament";
import { goldenBurst } from "../components/celebrate";

export default function Hero({ opened, onOpen }) {
  const { hero, sisterName } = siteConfig;
  const reduced = useReducedMotion();
  const d = (n) => (reduced ? 0 : n);

  const rise = {
    hidden: { opacity: 0, y: reduced ? 0 : 22, filter: reduced ? "none" : "blur(6px)" },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduced ? 0.25 : 1, delay: d(i), ease: EASE },
    }),
  };

  const open = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    goldenBurst({
      x: (r.left + r.width / 2) / window.innerWidth,
      y: (r.top + r.height / 2) / window.innerHeight,
    });
    onOpen();
  };

  return (
    <section
      id="home"
      className="grain relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center"
    >
      {/* backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,#6B1226_0%,#3D0D1B_38%,#1E070E_78%,#14060B_100%)]"
      />
      <Lattice opacity={0.032} />
      <Bloom className="-top-24 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2" />
      <Bloom tone="rose" className="bottom-[-8rem] right-[-6rem] h-[26rem] w-[26rem]" />
      <Particles density={0.00009} />

      <motion.div
        initial="hidden"
        animate="show"
        className="relative z-10 flex max-w-3xl flex-col items-center"
      >
        <motion.p variants={rise} custom={0.15} className="t-eyebrow">
          {hero.eyebrow}
        </motion.p>

        <motion.div variants={rise} custom={0.35} className="mt-6 w-full">
          <Divider />
        </motion.div>

        <motion.h1
          variants={rise}
          custom={0.55}
          className="t-display mt-7 text-ivory"
        >
          {hero.line1}{" "}
          <Heart className="text-rose" />
        </motion.h1>

        <motion.p
          variants={rise}
          custom={1.15}
          className="t-body mt-6 max-w-lg text-cream/70"
        >
          {hero.line2}
        </motion.p>

        <motion.p
          variants={rise}
          custom={1.85}
          className="t-gold mt-8 font-display text-2xl tracking-tight sm:text-3xl"
        >
          {hero.line3}
        </motion.p>

        <motion.div variants={rise} custom={2.4} className="mt-10">
          <button type="button" onClick={open} className="btn group">
            {hero.cta}
            <span
              aria-hidden="true"
              className="transition-transform duration-500 group-hover:translate-x-1"
            >
              →
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]"
              style={reduced ? { display: "none" } : { animation: "shimmerSweep 3.6s ease-in-out 1.2s infinite" }}
            />
          </button>
        </motion.div>

        <motion.p
          variants={rise}
          custom={2.7}
          className="mt-6 text-[0.7rem] tracking-[0.2em] text-cream/35 uppercase"
        >
          Made for {sisterName}
        </motion.p>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        aria-hidden={!opened}
        className="absolute inset-x-0 bottom-7 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[0.62rem] tracking-[0.28em] text-cream/45 uppercase">
          {hero.scrollHint}
        </span>
        <motion.span
          animate={reduced ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-gold-soft/70"
          aria-hidden="true"
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
