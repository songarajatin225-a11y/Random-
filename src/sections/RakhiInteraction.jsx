import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "../data/siteConfig";
import { EASE } from "../components/motion";
import RakhiGraphic from "../components/RakhiGraphic";
import SectionHeading from "../components/SectionHeading";
import T from "../components/T";
import Particles from "../components/Particles";
import { Bloom } from "../components/Ornament";
import { rakhiCelebration } from "../components/celebrate";

export default function RakhiInteraction() {
  const { rakhi } = siteConfig;
  const [tied, setTied] = useState(false);
  const [step, setStep] = useState(-1);
  const timers = useRef([]);
  const stageRef = useRef(null);
  const reduced = useReducedMotion();

  const messages = [...rakhi.messages, rakhi.finale];

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const tie = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStep(-1);
    setTied(true);

    const r = stageRef.current?.getBoundingClientRect();
    rakhiCelebration({
      x: r ? (r.left + r.width / 2) / window.innerWidth : 0.5,
      y: r ? (r.top + r.height / 2) / window.innerHeight : 0.5,
    });

    const gap = reduced ? 1800 : 1500;
    messages.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStep(i), 600 + gap * i));
    });
  };

  const done = step >= messages.length - 1;

  return (
    <section id="rakhi" className="grain section-pad relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(85%_60%_at_50%_45%,rgba(107,18,38,0.55),transparent_70%)]"
      />
      <Bloom className="left-1/2 top-[38%] h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2" />
      {tied && <Particles density={0.00011} />}

      <div className="shell relative">
        <SectionHeading eyebrow={rakhi.eyebrow} title={rakhi.heading} />

        <p className="mx-auto mt-5 max-w-sm text-center text-sm tracking-wide text-cream/50">
          {rakhi.subheading}
        </p>

        <div ref={stageRef} className="relative mx-auto mt-10 w-full max-w-lg">
          <motion.div
            animate={reduced ? {} : { y: [0, -9, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <RakhiGraphic tied={tied} className="h-auto w-full drop-shadow-[0_25px_50px_rgba(0,0,0,0.55)]" />
          </motion.div>
        </div>

        <div className="mt-6 flex flex-col items-center">
          <button type="button" onClick={tie} className={tied ? "btn-ghost" : "btn"}>
            {tied ? rakhi.replay : rakhi.button}
          </button>

          {/* message stage — fixed min-height so nothing shifts */}
          <div
            aria-live="polite"
            className="mt-8 flex min-h-[8rem] w-full max-w-2xl items-start justify-center px-2 text-center sm:min-h-[8.5rem]"
          >
            <AnimatePresence mode="wait">
              {step < 0 && (
                <motion.span
                  key="waiting"
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 flex items-center gap-2.5"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={reduced ? {} : { opacity: [0.2, 0.7, 0.2] }}
                      transition={{ duration: 2.4, delay: i * 0.35, repeat: Infinity, ease: "easeInOut" }}
                      className="h-1 w-1 rounded-full bg-gold-soft/50"
                    />
                  ))}
                </motion.span>
              )}
              {step >= 0 && (
                <motion.p
                  key={step}
                  initial={{ opacity: 0, y: reduced ? 0 : 18, filter: reduced ? "none" : "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: reduced ? 0 : -14, filter: reduced ? "none" : "blur(6px)" }}
                  transition={{ duration: reduced ? 0.2 : 0.85, ease: EASE }}
                  className={
                    done
                      ? "t-gold font-display text-[1.75rem] leading-tight sm:text-[3rem]"
                      : "font-display text-[1.3rem] leading-snug text-cream/85 sm:text-[2rem]"
                  }
                >
                  <T heart={done ? "text-rose-deep" : "text-rose"}>{messages[step]}</T>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
