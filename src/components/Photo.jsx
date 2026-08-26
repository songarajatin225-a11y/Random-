import { useEffect, useState } from "react";

/**
 * Photo with a graceful fallback. If the file isn't in /public/images yet,
 * an elegant placeholder appears naming the exact path to drop it at —
 * no broken image icons, no stock photography stand-ins.
 */
export default function Photo({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  eager = false,
  showHint = true,
  placeholderClassName = "",
  onMissing,
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (failed && src) onMissing?.(src);
  }, [failed, src, onMissing]);

  if (failed || !src) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-[linear-gradient(150deg,#3D0D1B,#521225_55%,#2A0812)] ${className} ${placeholderClassName}`}
        role="img"
        aria-label={alt ? `${alt} — photo not added yet` : "Photo placeholder"}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Cg fill='none' stroke='%23DCC07A'%3E%3Ccircle cx='28' cy='28' r='11'/%3E%3Ccircle cx='28' cy='28' r='22'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="relative flex flex-col items-center gap-2.5 px-5 text-center">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="text-gold-soft/60">
            <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.1" />
            <circle cx="8.6" cy="10" r="1.5" fill="currentColor" />
            <path d="M4 17.2 9.4 12l3.4 3.2L16.6 11 20 14.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          {showHint && (
            <p className="font-sans text-[0.62rem] leading-relaxed tracking-[0.14em] text-cream/45 uppercase">
              Add your photo
              <span className="mt-1 block font-mono text-[0.6rem] tracking-normal normal-case text-gold-soft/60 break-all">
                public{src}
              </span>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`${className} ${imgClassName}`}
    />
  );
}
