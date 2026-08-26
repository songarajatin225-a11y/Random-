import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "./data/siteConfig";
import { EASE } from "./components/motion";
import Nav from "./components/Nav";
import MusicToggle from "./components/MusicToggle";
import { Divider } from "./components/Ornament";
import { warmShapes } from "./components/celebrate";

import Hero from "./sections/Hero";
import BondSection from "./sections/BondSection";
import MemoryGallery from "./sections/MemoryGallery";
import AppreciationSection from "./sections/AppreciationSection";
import SiblingMoments from "./sections/SiblingMoments";
import OneThing from "./sections/OneThing";
import RakhiInteraction from "./sections/RakhiInteraction";
import LetterSection from "./sections/LetterSection";
import FinalSurprise from "./sections/FinalSurprise";

export default function App() {
  const [opened, setOpened] = useState(false);
  const reduced = useReducedMotion();

  useEffect(warmShapes, []);

  /* Hold the page on the hero until she opens the surprise. */
  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [opened]);

  const handleOpen = useCallback(() => {
    setOpened(true);
    setTimeout(() => {
      document
        .getElementById("bond")
        ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }, 620);
  }, [reduced]);

  return (
    <>
      <a
        href="#bond"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-burgundy focus:px-5 focus:py-2 focus:text-sm focus:text-ivory"
      >
        Skip to the message
      </a>

      <Nav visible={opened} />

      <main>
        <Hero opened={opened} onOpen={handleOpen} />

        <AnimatePresence>
          {opened && (
            <motion.div
              initial={{ opacity: 0, y: reduced ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0.2 : 0.9, ease: EASE }}
            >
              <BondSection />
              <MemoryGallery />
              <AppreciationSection />
              <SiblingMoments />
              <OneThing />
              <RakhiInteraction />
              <LetterSection />
              <FinalSurprise />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {opened && (
        <footer className="relative overflow-hidden border-t border-gold-soft/10 px-5 py-12 text-center">
          <Divider />
          <p className="mt-6 text-[0.68rem] tracking-[0.26em] text-cream/35 uppercase">
            Made with love by {siteConfig.brotherName}
          </p>
          <p className="mt-2 text-[0.68rem] tracking-[0.26em] text-gold-soft/40 uppercase">
            Raksha Bandhan
          </p>
        </footer>
      )}

      <MusicToggle visible={opened} />
    </>
  );
}
