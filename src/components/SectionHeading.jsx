import Reveal from "./Reveal";
import T from "./T";
import { Divider } from "./Ornament";

export default function SectionHeading({ eyebrow, title, accent, align = "center", className = "" }) {
  const centered = align === "center";
  return (
    <div className={`flex flex-col ${centered ? "items-center text-center" : "items-start text-left"} ${className}`}>
      {eyebrow && (
        <Reveal as="p" className="t-eyebrow">
          {eyebrow}
        </Reveal>
      )}
      <Reveal as="h2" delay={0.1} className="t-h2 mt-4 max-w-3xl text-ivory">
        <T>{title}</T>
        {accent && <span className="whitespace-nowrap"> <T>{accent}</T></span>}
      </Reveal>
      <Reveal delay={0.2} className={`mt-7 ${centered ? "" : "self-start"}`}>
        <Divider />
      </Reveal>
    </div>
  );
}
