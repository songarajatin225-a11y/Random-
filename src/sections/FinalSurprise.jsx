import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "../data/siteConfig";
import { EASE } from "../components/motion";
import Photo from "../components/Photo";
import Reveal from "../components/Reveal";
import T from "../components/T";
import Particles from "../components/Particles";
import { Bloom, Divider, Lattice } from "../components/Ornament";
import { grandFinale } from "../components/celebrate";

export default function FinalSurprise() {
  const { finalSurprise, sisterName } = siteConfig;
  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const stopRef = useRef(null);
  const timers = useRef([]);
  const reduced = useReducedMotion();

  const photos = finalSurprise.montage || [];

  useEffect(() => {
    return () => {
      stopRef.current?.();
      timers.current.forEach(clearInterval);
    };
  }, []);

  /* Slow photo montage while the celebration plays. */
  useEffect(() => {
    if (!open || photos.length < 2) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % photos.length), 3400);
    timers.current.push(id);
    return () => clearInterval(id);
  }, [open, photos.length]);

  const celebrate = () => {
    setOpen(true);
    stopRef.current?.();
    stopRef.current = grandFinale();
  };

  return (
    <section className="grain relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: reduced ? 0.2 : 1.6, ease: EASE }}
        className="absolute inset-0 bg-[radial-gradient(110%_80%_at_50%_45%,#7E2438_0%,#4A0F1C_40%,#1E070E_82%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(100%_80%_at_50%_60%,#2A0812,#14060B)]"
      />
      <Lattice opacity={open ? 0.042 : 0.022} className="transition-opacity duration-1000" />
      <Bloom className="left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2" />
      {open && <Particles density={0.00013} />}

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.div
              key="teaser"
              exit={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col items-center"
            >
              <Reveal as="p" className="t-eyebrow">
                {finalSurprise.eyebrow}
              </Reveal>
              <Reveal delay={0.1} className="mt-6 w-full">
                <Divider />
              </Reveal>
              <Reveal as="p" delay={0.2} className="t-body mt-8 max-w-sm text-cream/65">
                {finalSurprise.teaser}
              </Reveal>
              <Reveal delay={0.3} className="relative mt-10">
                {!reduced && (
                  <motion.span
                    aria-hidden="true"
                    animate={{ scale: [0.92, 1.28], opacity: [0.45, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                    className="pointer-events-none absolute inset-0 rounded-full border border-gold-soft/60"
                  />
                )}
                <button type="button" onClick={celebrate} className="btn relative text-base">
                  <T heart="text-burgundy">{finalSurprise.button}</T>
                </button>
              </Reveal>
            </motion.div>
          ) : (
            <motion.div
              key="finale"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduced ? 0.2 : 1, ease: EASE }}
              className="flex w-full flex-col items-center"
            >
              {photos.length > 0 && (
                <div className="relative mb-10 h-44 w-full max-w-xs overflow-hidden rounded-2xl border border-gold-soft/20 shadow-[0_35px_70px_-40px_rgba(0,0,0,0.95)] sm:h-56 sm:max-w-sm">
                  <AnimatePresence mode="sync">
                    <motion.div
                      key={slide}
                      initial={{ opacity: 0, scale: reduced ? 1 : 1.12 }}
                      animate={{ opacity: 1, scale: reduced ? 1 : 1.02 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduced ? 0.2 : 3.6, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <Photo
                        src={photos[slide]}
                        alt=""
                        showHint={false}
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(20,6,11,0.6))]"
                  />
                </div>
              )}

              <FinalLine delay={0.3} className="t-gold font-display text-[2rem] leading-[1.1] sm:text-[3.75rem]">
                <T heart="text-rose">{finalSurprise.finalMessage}</T>
              </FinalLine>

              <FinalLine delay={1.5} className="mt-8 font-display text-[1.35rem] text-cream/85 sm:text-[2rem]">
                {finalSurprise.loveLine}
              </FinalLine>

              <FinalLine delay={2.5} className="mt-6 text-sm tracking-wide text-rose/80 sm:text-base">
                {finalSurprise.signOff}
              </FinalLine>

              <FinalLine delay={3.4} className="mt-12 w-full">
                <Divider />
                <p className="hand mt-6 text-2xl text-gold-soft/70">for {sisterName}</p>
              </FinalLine>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function FinalLine({ children, delay, className = "" }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 22, filter: reduced ? "none" : "blur(7px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: reduced ? 0.25 : 1.1, delay: reduced ? 0 : delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
