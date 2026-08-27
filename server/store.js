import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { siteConfig } from "../src/data/siteConfig.js";

const here = dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = process.env.DATA_DIR || join(here, "..", "data");
export const UPLOAD_DIR = join(DATA_DIR, "uploads");
const CONTENT_FILE = join(DATA_DIR, "content.json");

const MAX_STRING = 5000;
const MAX_ARRAY = 60;

/* ---------------------------------------------------------------
   Saved content is validated against the shape of siteConfig, so a
   request can only ever change values the site already knows how to
   render — never introduce new keys or swap a string for an object.
   --------------------------------------------------------------- */
function sanitise(template, incoming, dropInvalid = false) {
  const reject = () => (dropInvalid ? undefined : template);

  if (typeof template === "string") {
    return typeof incoming === "string" ? incoming.slice(0, MAX_STRING) : reject();
  }
  if (typeof template === "number") {
    return typeof incoming === "number" && Number.isFinite(incoming) ? incoming : reject();
  }
  if (typeof template === "boolean") {
    return typeof incoming === "boolean" ? incoming : reject();
  }
  if (Array.isArray(template)) {
    if (!Array.isArray(incoming)) return reject();
    const shape = template[0];
    if (shape === undefined) return [];
    /* A bad entry is dropped, never swapped for a copy of the first default —
       that would silently duplicate content the author never wrote. */
    return incoming
      .slice(0, MAX_ARRAY)
      .map((item) => sanitise(shape, item, true))
      .filter((item) => item !== undefined);
  }
  if (template && typeof template === "object") {
    if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) return reject();
    const out = {};
    for (const key of Object.keys(template)) {
      /* Only keys the template already defines are ever written, so unknown
         keys — __proto__ included — cannot reach the saved file. */
      out[key] = sanitise(template[key], incoming[key], false);
    }
    return out;
  }
  return reject();
}

export async function ensureDirs() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export async function readContent() {
  try {
    const raw = await readFile(CONTENT_FILE, "utf8");
    return sanitise(siteConfig, JSON.parse(raw));
  } catch {
    /* Nothing saved yet (or the file is unreadable) — ship the defaults. */
    return siteConfig;
  }
}

export async function writeContent(incoming) {
  const clean = sanitise(siteConfig, incoming);
  await ensureDirs();
  /* Write-then-rename so a crash mid-write can't truncate the live file. */
  const tmp = `${CONTENT_FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(clean, null, 2), "utf8");
  await rename(tmp, CONTENT_FILE);
  return clean;
}

export const defaults = siteConfig;
