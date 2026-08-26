import { siteConfig } from "../data/siteConfig";
import Reveal from "../components/Reveal";
import T from "../components/T";
import SectionHeading from "../components/SectionHeading";
import { Bloom, CornerFlourish } from "../components/Ornament";

export default function LetterSection() {
  const { letter, brotherName } = siteConfig;

  return (
    <section id="letter" className="grain section-pad relative overflow-hidden">
      <Bloom tone="rose" className="left-[-8rem] top-1/3 h-[24rem] w-[24rem]" />

      <div className="shell relative">
        <SectionHeading eyebrow={letter.eyebrow} title={letter.heading} />

        <Reveal
          delay={0.15}
          amount={0.15}
          className="relative mx-auto mt-14 max-w-2xl overflow-hidden rounded-[1.5rem] border border-gold-soft/22 bg-[linear-gradient(165deg,#FBF3E6_0%,#F4E7D4_45%,#EFDDC7_100%)] px-6 py-10 text-maroon-900 shadow-[0_45px_90px_-45px_rgba(0,0,0,0.9)] sm:px-12 sm:py-14"
        >
          {/* paper grain + warm bloom, kept subtle */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23p)' opacity='0.16'/%3E%3C/svg%3E\")",
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(226,149,63,0.22),transparent)]"
          />
          <CornerFlourish tone="text-burgundy/25" className="left-4 top-4" />
          <CornerFlourish tone="text-burgundy/25" className="right-4 top-4" flip />

          <div className="relative">
            <p className="hand text-3xl text-burgundy sm:text-4xl">{letter.salutation}</p>

            <div className="mt-6 space-y-5">
              {letter.body.map((p, i) => (
                <p
                  key={i}
                  className="text-[1rem] leading-[1.85] text-maroon-800/85 sm:text-[1.08rem]"
                >
                  <T heart="text-rose-deep">{p}</T>
                </p>
              ))}
            </div>

            <div className="mt-9 flex items-center gap-3">
              <span className="h-px flex-1 bg-burgundy/15" />
              <span className="text-[0.6rem] tracking-[0.3em] text-burgundy/45 uppercase">
                with love
              </span>
              <span className="h-px flex-1 bg-burgundy/15" />
            </div>

            <p className="mt-8 font-display text-xl text-burgundy sm:text-2xl">
              <T heart="text-rose-deep">{letter.closing}</T>
            </p>
            <p className="hand mt-3 text-3xl text-maroon-800/80 sm:text-4xl">
              {letter.signature}
            </p>
            <p className="mt-1 text-[0.7rem] tracking-[0.22em] text-burgundy/45 uppercase">
              {brotherName}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
