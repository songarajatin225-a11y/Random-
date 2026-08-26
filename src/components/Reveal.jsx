import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, pick, viewportOnce } from "./motion";

/**
 * Scroll-triggered reveal. Wraps any element, respects reduced motion.
 */
export default function Reveal({
  as = "div",
  children,
  delay = 0,
  variants = fadeUp,
  amount = 0.25,
  className = "",
  ...rest
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as] || motion.div;

  return (
    <Tag
      className={className}
      variants={pick(reduced, variants)}
      initial="hidden"
      whileInView="show"
      viewport={{ ...viewportOnce, amount }}
      custom={delay}
      {...rest}
    >
      {children}
    </Tag>
  );
}
