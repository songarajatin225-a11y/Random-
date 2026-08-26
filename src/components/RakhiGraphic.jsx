import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "./motion";

const petal = (i, count, rInner, rOuter, width) => {
  const a = (i / count) * Math.PI * 2 - Math.PI / 2;
  const s = ((i / count) * Math.PI * 2 - Math.PI / 2) - width;
  const e = ((i / count) * Math.PI * 2 - Math.PI / 2) + width;
  const p = (r, ang) => `${(200 + r * Math.cos(ang)).toFixed(2)} ${(110 + r * Math.sin(ang)).toFixed(2)}`;
  return `M ${p(rInner, s)} Q ${p(rOuter, a)} ${p(rInner, e)} Q ${p(rInner * 0.72, a)} ${p(rInner, s)} Z`;
};

/**
 * A stylised rakhi: silk thread, a layered gold rosette and a deep red centre.
 * `tied` drives the glow / settle animation.
 */
export default function RakhiGraphic({ tied = false, className = "" }) {
  const reduced = useReducedMotion();

  return (
    <svg
      viewBox="0 0 400 220"
      className={className}
      role="img"
      aria-label="An illustrated rakhi with a gold rosette on a silk thread"
    >
      <defs>
        <linearGradient id="goldA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F1E4B8" />
          <stop offset="45%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#9B7620" />
        </linearGradient>
        <linearGradient id="goldB" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8D9A6" />
          <stop offset="60%" stopColor="#B98F2E" />
          <stop offset="100%" stopColor="#E2953F" />
        </linearGradient>
        <linearGradient id="silk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7E2438" />
          <stop offset="50%" stopColor="#C98A94" />
          <stop offset="100%" stopColor="#7E2438" />
        </linearGradient>
        <radialGradient id="gem" cx="38%" cy="32%">
          <stop offset="0%" stopColor="#E86A7E" />
          <stop offset="45%" stopColor="#9B1B33" />
          <stop offset="100%" stopColor="#4A0F1C" />
        </radialGradient>
        <radialGradient id="halo" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#E2953F" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#C9A227" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* halo */}
      <motion.circle
        cx="200" cy="110" r="105" fill="url(#halo)"
        initial={false}
        animate={
          reduced
            ? { opacity: tied ? 0.9 : 0.35 }
            : { opacity: tied ? [0.35, 1, 0.75] : 0.32, scale: tied ? [1, 1.18, 1.06] : 1 }
        }
        transition={{ duration: 1.5, ease: EASE }}
        style={{ transformOrigin: "200px 110px" }}
      />

      {/* silk thread */}
      <motion.g
        initial={false}
        animate={{ opacity: 1 }}
        stroke="url(#silk)"
        strokeLinecap="round"
        fill="none"
      >
        <motion.path
          d="M8 156 C 70 176, 120 140, 168 116"
          strokeWidth="6"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.3, ease: EASE }}
        />
        <motion.path
          d="M392 156 C 330 176, 280 140, 232 116"
          strokeWidth="6"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.12 }}
        />
        <path d="M14 168 C 66 186, 116 154, 160 132" strokeWidth="2" opacity="0.5" />
        <path d="M386 168 C 334 186, 284 154, 240 132" strokeWidth="2" opacity="0.5" />
      </motion.g>

      {/* thread beads */}
      {[[46, 165], [92, 163], [354, 165], [308, 163]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4.5" fill="url(#goldB)" opacity="0.9" />
      ))}

      {/* rosette */}
      <motion.g
        initial={false}
        animate={
          reduced
            ? { scale: 1, rotate: 0 }
            : { scale: tied ? [1, 1.09, 1] : 1, rotate: tied ? [0, 8, 0] : 0 }
        }
        transition={{ duration: 1.6, ease: EASE }}
        style={{ transformOrigin: "200px 110px" }}
      >
        {/* outer petals */}
        {Array.from({ length: 20 }, (_, i) => (
          <path
            key={`o${i}`}
            d={petal(i, 20, 46, i % 2 ? 66 : 79, 0.14)}
            fill={i % 2 ? "url(#goldB)" : "url(#goldA)"}
            opacity={i % 2 ? 0.75 : 0.95}
          />
        ))}
        {/* mid ring */}
        <circle cx="200" cy="110" r="47" fill="#4A0F1C" />
        <circle cx="200" cy="110" r="47" fill="none" stroke="url(#goldB)" strokeWidth="1.6" />
        {/* inner petals */}
        {Array.from({ length: 10 }, (_, i) => (
          <path key={`i${i}`} d={petal(i, 10, 22, 42, 0.24)} fill="#C98A94" opacity="0.55" />
        ))}
        {/* bead crown */}
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return (
            <circle
              key={`b${i}`}
              cx={200 + 55 * Math.cos(a)}
              cy={110 + 55 * Math.sin(a)}
              r="3.1"
              fill="url(#goldB)"
            />
          );
        })}
        {/* centre */}
        <circle cx="200" cy="110" r="24" fill="url(#goldA)" />
        <circle cx="200" cy="110" r="18" fill="url(#gem)" />
        <circle cx="193" cy="103" r="5" fill="#FDF8F1" opacity="0.28" />
        <motion.circle
          cx="200" cy="110" r="30"
          fill="none" stroke="#E8D9A6" strokeWidth="1"
          initial={false}
          animate={reduced ? { opacity: 0 } : { opacity: tied ? [0.9, 0] : 0, r: tied ? [30, 92] : 30 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </motion.g>
    </svg>
  );
}
