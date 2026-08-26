export const EASE = [0.22, 1, 0.36, 1];

/* Shared, reusable variants. `custom` = stagger index. */
export const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: i * 0.12, ease: EASE },
  }),
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, delay: i * 0.1, ease: EASE },
  }),
};

/* Flattened variants for prefers-reduced-motion. */
export const still = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

export const pick = (reduced, variants) => (reduced ? still : variants);

export const viewportOnce = { once: true, amount: 0.25 };
