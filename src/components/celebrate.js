import confetti from "canvas-confetti";

const GOLD = ["#C9A227", "#DCC07A", "#E8D9A6", "#E2953F"];
const FESTIVE = [...GOLD, "#C98A94", "#7E2438", "#F6EADA"];

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const HEART_PATH =
  "M12 21.2 3.9 13c-2.5-2.5-2.5-6.5 0-9a6.1 6.1 0 0 1 8.1-.4 6.1 6.1 0 0 1 8.1.4c2.5 2.5 2.5 6.5 0 9L12 21.2Z";

let heartShapes = null;
/* A drawn heart rather than the emoji, so confetti stays inside the palette. */
const hearts = () => {
  if (!heartShapes) {
    try {
      heartShapes = [confetti.shapeFromPath({ path: HEART_PATH })];
    } catch {
      heartShapes = [];
    }
  }
  return heartShapes;
};

/* Building the heart shape scans a canvas once — do it while idle so the
   first celebration never stutters. */
export function warmShapes() {
  if (prefersReduced()) return;
  const run = () => hearts();
  if (typeof requestIdleCallback === "function") requestIdleCallback(run, { timeout: 3000 });
  else setTimeout(run, 1200);
}

/** A restrained golden shimmer from a point on screen (0-1 coords). */
export function goldenBurst({ x = 0.5, y = 0.5 } = {}) {
  if (prefersReduced()) return;
  confetti({
    particleCount: 46,
    spread: 62,
    startVelocity: 26,
    scalar: 0.75,
    ticks: 190,
    gravity: 0.9,
    decay: 0.92,
    colors: GOLD,
    origin: { x, y },
    disableForReducedMotion: true,
  });
}

/** Tasteful confetti for the rakhi moment. */
export function rakhiCelebration({ x = 0.5, y = 0.5 } = {}) {
  if (prefersReduced()) return;
  goldenBurst({ x, y });
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 96,
      startVelocity: 32,
      scalar: 0.85,
      ticks: 230,
      colors: FESTIVE,
      origin: { x, y },
      disableForReducedMotion: true,
    });
  }, 160);
  setTimeout(() => floatHearts({ x, y, count: 12 }), 380);
}

/** Slow hearts drifting upward. */
export function floatHearts({ x = 0.5, y = 0.7, count = 14 } = {}) {
  if (prefersReduced()) return;
  const shapes = hearts();
  confetti({
    particleCount: count,
    spread: 70,
    startVelocity: 22,
    gravity: 0.32,
    decay: 0.955,
    ticks: 340,
    scalar: 1.05,
    flat: true,
    colors: ["#C98A94", "#D8A0A9", "#A9636F", "#DCC07A"],
    ...(shapes.length ? { shapes } : {}),
    origin: { x, y },
    disableForReducedMotion: true,
  });
}

/** The finale: layered cannons that settle gently. Returns a stop fn. */
export function grandFinale() {
  if (prefersReduced()) return () => {};
  const end = Date.now() + 3400;
  let raf = 0;

  confetti({
    particleCount: 130,
    spread: 130,
    startVelocity: 42,
    scalar: 0.9,
    ticks: 260,
    colors: FESTIVE,
    origin: { y: 0.62 },
    disableForReducedMotion: true,
  });

  const frame = () => {
    const now = Date.now();
    if (now > end) return;
    confetti({
      particleCount: 3,
      angle: 58,
      spread: 62,
      startVelocity: 44,
      scalar: 0.72,
      colors: GOLD,
      origin: { x: 0, y: 0.72 },
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 3,
      angle: 122,
      spread: 62,
      startVelocity: 44,
      scalar: 0.72,
      colors: GOLD,
      origin: { x: 1, y: 0.72 },
      disableForReducedMotion: true,
    });
    raf = requestAnimationFrame(frame);
  };
  frame();

  const t1 = setTimeout(() => floatHearts({ x: 0.5, y: 0.85, count: 18 }), 700);
  const t2 = setTimeout(() => floatHearts({ x: 0.3, y: 0.9, count: 12 }), 1700);
  const t3 = setTimeout(() => floatHearts({ x: 0.72, y: 0.9, count: 12 }), 2500);

  return () => {
    cancelAnimationFrame(raf);
    [t1, t2, t3].forEach(clearTimeout);
  };
}
