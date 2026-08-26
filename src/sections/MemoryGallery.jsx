import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "../data/siteConfig";
import { scaleIn } from "../components/motion";
import Photo from "../components/Photo";
import Reveal from "../components/Reveal";
import T from "../components/T";
import SectionHeading from "../components/SectionHeading";
import Lightbox from "../components/Lightbox";
import { Bloom } from "../components/Ornament";

const spanClass = {
  tall: "row-span-2",
  wide: "col-span-2",
  regular: "",
};

export default function MemoryGallery() {
  const { memories } = siteConfig;
  const [open, setOpen] = useState(null);
  const [missing, setMissing] = useState([]);

  /* If a photo file isn't in place yet, say so once, plainly. */
  const noteMissing = useCallback((src) => {
    setMissing((m) => (m.includes(src) ? m : [...m, src]));
  }, []);
  const reduced = useReducedMotion();

  return (
    <section id="memories" className="grain section-pad relative overflow-hidden">
      <Bloom className="right-[-10rem] top-16 h-[26rem] w-[26rem]" />

      <div className="shell relative">
        <SectionHeading eyebrow="Memories" title="A Few Moments I Treasure" accent="❤️" />

        <Reveal as="p" delay={0.15} className="t-body mx-auto mt-6 max-w-md text-center text-cream/55">
          Tap any photo to see it properly.
        </Reveal>

        <ul className="mt-14 grid auto-rows-[8.5rem] grid-cols-2 gap-3 sm:auto-rows-[10.5rem] sm:grid-cols-3 sm:gap-4 lg:auto-rows-[11.5rem] lg:grid-cols-4">
          {memories.map((m, i) => (
            <motion.li
              key={m.image + i}
              variants={reduced ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : scaleIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              custom={(i % 4) * 0.6}
              className={`${spanClass[m.span] || ""} min-w-0`}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Open photo: ${m.title}`}
                className="group relative block h-full w-full overflow-hidden rounded-xl border border-gold-soft/12 text-left shadow-[0_20px_45px_-30px_rgba(0,0,0,0.95)] sm:rounded-2xl"
              >
                <Photo
                  src={m.image}
                  alt={m.title}
                  showHint={false}
                  onMissing={noteMissing}
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.07]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(20,6,11,0.82))] opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gold-soft/0 transition duration-500 group-hover:ring-gold-soft/35 sm:rounded-2xl"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <span className="block font-display text-[0.9rem] leading-snug text-ivory sm:text-base">
                    <T>{m.title}</T>
                  </span>
                  <span className="mt-0.5 block text-[0.68rem] leading-snug text-cream/55 sm:text-xs">
                    <T>{m.caption}</T>
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </ul>

        <Reveal delay={0.1} className="mt-12 text-center">
          <p className="hand text-2xl text-rose/85">and many more still to come…</p>
        </Reveal>

        {missing.length > 0 && (
          <aside className="mx-auto mt-10 max-w-xl rounded-2xl border border-dashed border-gold-soft/25 px-5 py-5 text-center">
            <p className="text-[0.62rem] font-medium tracking-[0.24em] text-gold-soft/75 uppercase">
              {missing.length} photo{missing.length > 1 ? "s" : ""} not added yet
            </p>
            <p className="mt-2 text-sm text-cream/55">
              Drop the files into{" "}
              <code className="rounded bg-maroon-800/70 px-1.5 py-0.5 font-mono text-[0.78em] text-gold-soft/90">
                public/images/
              </code>{" "}
              — or change the paths in{" "}
              <code className="rounded bg-maroon-800/70 px-1.5 py-0.5 font-mono text-[0.78em] text-gold-soft/90">
                src/data/siteConfig.js
              </code>
              .
            </p>
            <p className="mt-3 font-mono text-[0.7rem] leading-relaxed break-all text-cream/55">
              {missing.map((m) => m.replace("/images/", "")).join(" · ")}
            </p>
          </aside>
        )}
      </div>

      <Lightbox items={memories} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  );
}
