import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Photo from "./Photo";
import T from "./T";
import { EASE } from "./motion";

/**
 * Fullscreen photo viewer. Keyboard: ← → to move, ESC to close.
 * Touch: horizontal swipe to move, tap the backdrop to close.
 */
export default function Lightbox({ items, index, onClose, onIndex }) {
  const open = index !== null && index >= 0;
  const reduced = useReducedMotion();
  const closeRef = useRef(null);
  const touch = useRef(null);

  const step = useCallback(
    (dir) => {
      if (!items.length) return;
      onIndex((index + dir + items.length) % items.length);
    },
    [index, items.length, onIndex]
  );

  /* Keep the handlers in a ref so the listener is registered exactly once
     per open — re-binding on every index change dropped keystrokes. */
  const handlers = useRef({ onClose, step });
  handlers.current = { onClose, step };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      const { onClose: close, step: move } = handlers.current;
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey, true);
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey, true);
      clearTimeout(t);
    };
  }, [open]);

  const item = open ? items[index] : null;

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.title || "Photo"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.16 } }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current === null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(dx) > 55) step(dx < 0 ? 1 : -1);
            touch.current = null;
          }}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-maroon-950/95 px-3 py-16 backdrop-blur-md sm:px-6"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close photo"
            className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full border border-gold-soft/25 text-cream/80 transition hover:border-gold-soft/60 hover:text-ivory sm:right-6 sm:top-6"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>

          <motion.figure
            key={index}
            initial={{ opacity: 0, scale: reduced ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: reduced ? 1 : 0.98,
              transition: { duration: 0.16, ease: "easeOut" },
            }}
            transition={{ duration: reduced ? 0.15 : 0.45, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-full w-full max-w-4xl flex-col items-center gap-4"
          >
            <Photo
              src={item.image}
              alt={item.alt || item.title || "A photo of us"}
              eager
              className="max-h-[62vh] w-auto max-w-full rounded-2xl border border-gold-soft/15 object-contain shadow-[0_40px_90px_-40px_rgba(0,0,0,0.95)] sm:max-h-[68vh]"
              placeholderClassName="aspect-[4/3] h-[46vh] w-auto"
            />
            <figcaption className="max-w-xl px-2 text-center">
              {item.title && (
                <h3 className="font-display text-lg text-ivory sm:text-xl">
                  <T>{item.title}</T>
                </h3>
              )}
              {item.caption && (
                <p className="mt-1 text-sm text-cream/60">
                  <T>{item.caption}</T>
                </p>
              )}
            </figcaption>
          </motion.figure>

          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-5 flex items-center gap-5"
          >
            <NavBtn dir={-1} onClick={() => step(-1)} label="Previous photo" />
            <span className="font-mono text-[0.7rem] tracking-[0.2em] text-cream/65">
              {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <NavBtn dir={1} onClick={() => step(1)} label="Next photo" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavBtn({ dir, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-12 w-12 place-items-center rounded-full border border-gold-soft/25 text-cream/75 transition hover:border-gold-soft/60 hover:text-ivory"
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"
        style={{ transform: dir < 0 ? "rotate(180deg)" : undefined }}>
        <path d="M5 2l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
