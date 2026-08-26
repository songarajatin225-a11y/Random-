/**
 * Bundles the built site into ONE self-contained .html file.
 *
 * Browsers refuse to load separate .js/.css/font files when a page is opened
 * straight from disk (file://), so a normal build shows a blank page on a
 * double-click. Inlining everything — script, styles and fonts as data URIs —
 * makes the page work offline, from a USB stick, or as an email attachment.
 *
 * Run after `vite build`:  node scripts/build-single.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const OUT = join(DIST, "raksha-bandhan.html");

const assets = readdirSync(join(DIST, "assets"));
const cssFile = assets.find((f) => f.endsWith(".css"));
const jsFile = assets.find((f) => f.endsWith(".js"));
if (!cssFile || !jsFile) throw new Error("Run `vite build` first — dist/assets is missing.");

let css = readFileSync(join(DIST, "assets", cssFile), "utf8");
const js = readFileSync(join(DIST, "assets", jsFile), "utf8");
let html = readFileSync(join(DIST, "index.html"), "utf8");

/* Fonts must travel with the file — data: is one of the few schemes a
   file:// page is allowed to fetch. */
let fontCount = 0;
css = css.replace(/url\(["']?\/?fonts\/([\w.-]+\.woff2)["']?\)/g, (_m, name) => {
  const b64 = readFileSync(join(DIST, "fonts", name)).toString("base64");
  fontCount += 1;
  return `url(data:font/woff2;base64,${b64})`;
});

/* An inline module script isn't a cross-origin fetch, so it runs from disk. */
const inlineJs = js.replace(/<\/script/gi, "<\\/script");

/* Replacer FUNCTIONS, not strings: a minified bundle is full of `$&` and
   `` $` `` sequences that String.replace would otherwise treat as
   substitution patterns and splice the document into itself. */
html = html
  .replace(/\s*<link[^>]+rel="preload"[^>]*>/g, () => "")
  .replace(/\s*<link[^>]+rel="stylesheet"[^>]*>/g, () => `\n    <style>${css}</style>`)
  .replace(
    /\s*<script[^>]*\ssrc="[^"]*"[^>]*><\/script>/,
    () => `\n    <script type="module">${inlineJs}</script>`
  );

if (/<script[^>]*\ssrc=/.test(html) || /<link[^>]+rel="stylesheet"/.test(html)) {
  throw new Error("Inlining failed — an external asset reference survived.");
}

writeFileSync(OUT, html);

const kb = (n) => `${Math.round(n / 1024)} KB`;
console.log(`✓ ${OUT}  (${kb(Buffer.byteLength(html))}, ${fontCount} fonts inlined)`);
console.log("  Open it by double-clicking, or send it to someone as-is.");
console.log("  Photos: keep an images/ folder beside this file.");
