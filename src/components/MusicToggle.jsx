import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "../data/siteConfig";
import { EASE } from "./motion";

/**
 * Floating audio control. Never autoplays. If no track is present at the
 * configured path the button quietly removes itself.
 */
export default function MusicToggle({ visible }) {
  const { path, label, volume } = siteConfig.music;
  const audioRef = useRef(null);
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);

  /* Probe once so a missing file never surfaces a dead button. */
  useEffect(() => {
    if (!path) return;
    let alive = true;
    const el = new Audio();
    el.preload = "metadata";
    el.loop = true;
    el.volume = volume ?? 0.35;
    const ok = () => alive && setAvailable(true);
    const fail = () => alive && setAvailable(false);
    el.addEventListener("loadedmetadata", ok, { once: true });
    el.addEventListener("canplaythrough", ok, { once: true });
    el.addEventListener("error", fail, { once: true });
    el.src = path;
    audioRef.current = el;
    return () => {
      alive = false;
      el.pause();
      el.removeEventListener("loadedmetadata", ok);
      el.removeEventListener("canplaythrough", ok);
      el.removeEventListener("error", fail);
      audioRef.current = null;
    };
  }, [path, volume]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const sync = () => setPlaying(!el.paused);
    el.addEventListener("play", sync);
    el.addEventListener("pause", sync);
    el.addEventListener("ended", sync);
    return () => {
      el.removeEventListener("play", sync);
      el.removeEventListener("pause", sync);
      el.removeEventListener("ended", sync);
    };
  }, [available]);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      try {
        await el.play();
        setPlaying(true);
      } catch {
        setPlaying(false); /* blocked by the browser — leave it silent */
      }
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  if (!available) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? `Pause ${label}` : `Play ${label}`}
          title={playing ? "Pause music" : "Play music"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="safe-b fixed bottom-5 right-5 z-50 grid h-12 w-12 place-items-center rounded-full border border-gold-soft/30 bg-maroon-950/75 text-gold-soft backdrop-blur-xl transition-colors hover:border-gold-soft/60 hover:text-ivory sm:bottom-7 sm:right-7"
        >
          {playing && (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-gold-soft/40"
              style={{ animation: "pulseRing 2.6s ease-out infinite" }}
            />
          )}
          <span aria-hidden="true" className="relative flex h-4 items-end gap-[3px]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-[2.5px] rounded-full bg-current"
                style={{
                  height: playing ? "100%" : "45%",
                  transformOrigin: "bottom",
                  animation: playing
                    ? `eq ${0.62 + i * 0.16}s ease-in-out ${i * 0.1}s infinite alternate`
                    : "none",
                  opacity: playing ? 1 : 0.6,
                  transition: "height .3s ease, opacity .3s ease",
                }}
              />
            ))}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
