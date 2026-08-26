import { Fragment } from "react";
import { Heart } from "./Ornament";

/**
 * Renders copy from siteConfig, swapping any ❤ / ❤️ for a drawn heart that
 * takes the surrounding colour. Keeps the config plain, editable text while
 * headings stay typographic rather than emoji-heavy.
 */
export default function T({ children, heart = "text-rose" }) {
  if (typeof children !== "string") return children;

  const parts = children.split(/(❤️?)/g);
  return parts.map((part, i) =>
    /^❤/.test(part) ? (
      <Heart key={i} className={heart} />
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}
