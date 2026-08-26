import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Very light canvas field of drifting gold motes. Density scales with the
 * viewport, the loop pauses when the tab is hidden, and reduced-motion
 * users get a still, faint version instead.
 */
export default function Particles({ density = 0.00006, className = "" }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let dots = [];
    let w = 0;
    let h = 0;

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(70, Math.max(18, Math.round(w * h * density)));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random() * 0.45 + 0.12,
        vy: -(Math.random() * 0.16 + 0.04),
        vx: (Math.random() - 0.5) * 0.09,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const paint = (animate) => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        if (animate) {
          d.y += d.vy;
          d.x += d.vx;
          d.tw += 0.015;
          if (d.y < -6) { d.y = h + 6; d.x = Math.random() * w; }
          if (d.x < -6) d.x = w + 6;
          if (d.x > w + 6) d.x = -6;
        }
        const alpha = animate ? d.a * (0.6 + 0.4 * Math.sin(d.tw)) : d.a * 0.7;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 192, 122, ${alpha})`;
        ctx.fill();
      }
    };

    const loop = () => {
      paint(true);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduced) paint(false);
      else raf = requestAnimationFrame(loop);
    };

    /* Only burn frames while the canvas is actually on screen. */
    let onScreen = true;
    const resume = () => {
      if (onScreen && !document.hidden) start();
      else cancelAnimationFrame(raf);
    };

    const onResize = () => { seed(); resume(); };
    const io = new IntersectionObserver(
      ([e]) => { onScreen = e.isIntersecting; resume(); },
      { rootMargin: "120px" }
    );

    seed();
    io.observe(canvas);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", resume);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [density, reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
