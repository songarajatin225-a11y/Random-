import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { navLinks } from "../data/siteConfig";
import { EASE } from "./motion";

export default function Nav({ visible }) {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  /* Track the section closest to the middle of the viewport.
     Re-runs once the rest of the page mounts. */
  useEffect(() => {
    if (!visible) return;
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const shown = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (shown) setActive(shown.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.6, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [visible]);

  /* Lock scroll + allow ESC while the mobile sheet is open. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (e, id) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          key="nav"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed inset-x-0 top-0 z-50"
        >
          <nav
            aria-label="Sections"
            className="mx-auto flex max-w-[74rem] items-center justify-between gap-3 px-4 py-3 md:justify-center md:py-5"
          >
            {/* Desktop pill */}
            <ul className="hidden items-center gap-1 rounded-full border border-gold-soft/18 bg-maroon-950/65 px-2 py-1.5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl md:flex">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => go(e, l.id)}
                    aria-current={active === l.id ? "true" : undefined}
                    className={`relative block rounded-full px-4 py-2 text-[0.7rem] font-medium tracking-[0.18em] uppercase transition-colors duration-300 ${
                      active === l.id ? "text-ivory" : "text-cream/55 hover:text-cream/90"
                    }`}
                  >
                    {active === l.id && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-burgundy/70 ring-1 ring-gold-soft/25"
                        transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile bar */}
            <span className="t-eyebrow md:hidden">Raksha Bandhan</span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-11 w-11 place-items-center rounded-full border border-gold-soft/25 bg-maroon-950/70 backdrop-blur-xl md:hidden"
            >
              <span className="relative block h-3.5 w-4.5">
                <motion.span
                  animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                  className="absolute inset-x-0 top-0 h-px bg-cream"
                />
                <motion.span
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: reduced ? 0 : 0.2 }}
                  className="absolute inset-x-0 top-1.5 h-px bg-cream"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                  className="absolute inset-x-0 top-3 h-px bg-cream"
                />
              </span>
            </button>
          </nav>

          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 -z-10 bg-maroon-950/97 backdrop-blur-2xl md:hidden"
              >
                <ul className="flex h-full flex-col items-center justify-center gap-1.5">
                  {navLinks.map((l, i) => (
                    <motion.li
                      key={l.id}
                      initial={{ opacity: 0, y: reduced ? 0 : 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reduced ? 0 : 0.06 * i, duration: 0.45, ease: EASE }}
                    >
                      <a
                        href={`#${l.id}`}
                        onClick={(e) => go(e, l.id)}
                        className={`block px-6 py-3 font-display text-3xl ${
                          active === l.id ? "t-gold" : "text-cream/75"
                        }`}
                      >
                        {l.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
