/* Small, reusable Indian-inspired decorative pieces. Purely presentational. */

export function Divider({ className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="hairline w-16 sm:w-28" />
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="shrink-0 opacity-80">
        <path
          d="M12 2c1.6 3.4 4 5.8 7.4 7.4C16 11 13.6 13.4 12 16.8 10.4 13.4 8 11 4.6 9.4 8 7.8 10.4 5.4 12 2Z"
          fill="url(#dg)"
        />
        <circle cx="12" cy="20" r="1.6" fill="#C9A227" opacity="0.7" />
        <defs>
          <linearGradient id="dg" x1="4" y1="2" x2="20" y2="17" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E8D9A6" />
            <stop offset="1" stopColor="#B98F2E" />
          </linearGradient>
        </defs>
      </svg>
      <span className="hairline w-16 sm:w-28" />
    </div>
  );
}

/* Faint repeating jaali/lattice motif used as a section backdrop. */
export function Lattice({ className = "", opacity = 0.05 }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cg fill='none' stroke='%23DCC07A' stroke-width='0.6'%3E%3Cpath d='M80 12c18 24 44 44 68 56-24 12-50 32-68 56-18-24-44-44-68-56 24-12 50-32 68-56Z'/%3E%3Cpath d='M80 40c10 15 26 27 40 34-14 7-30 19-40 34-10-15-26-27-40-34 14-7 30-19 40-34Z'/%3E%3Ccircle cx='80' cy='74' r='4'/%3E%3C/g%3E%3C/svg%3E\")",
        backgroundSize: "160px 160px",
      }}
    />
  );
}

/* A fine gold corner flourish for cards / letters. */
export function CornerFlourish({ className = "", flip = false, tone = "text-gold-soft/45" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className={`pointer-events-none absolute h-11 w-11 ${tone} ${className}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    >
      <path d="M1 1h30M1 1v30" opacity="0.55" />
      <path d="M6 6h16M6 6v16" opacity="0.9" />
      <path d="M6 22c9 0 16-7 16-16" opacity="0.55" />
      <path d="M22 22c0-6-4-10-10-10" opacity="0.35" />
      <circle cx="14" cy="14" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* Soft ambient light blooms behind content. */
export function Bloom({ className = "", tone = "warm" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-2xl ${
        tone === "rose" ? "glow-rose" : "glow-warm"
      } ${className}`}
    />
  );
}

/* A heart drawn as a glyph, so it inherits the palette instead of arriving
   as a glossy full-colour emoji next to the serif type. */
export function Heart({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 22"
      aria-hidden="true"
      focusable="false"
      className={`inline-block h-[0.78em] w-[0.78em] shrink-0 translate-y-[0.02em] align-baseline ${className}`}
      fill="currentColor"
    >
      <path d="M12 21.2 3.9 13c-2.5-2.5-2.5-6.5 0-9a6.1 6.1 0 0 1 8.1-.4 6.1 6.1 0 0 1 8.1.4c2.5 2.5 2.5 6.5 0 9L12 21.2Z" />
    </svg>
  );
}
