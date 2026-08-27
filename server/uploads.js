import { unlink } from "node:fs/promises";
import { open } from "node:fs/promises";
import crypto from "node:crypto";
import { extname, join } from "node:path";
import multer from "multer";
import { UPLOAD_DIR, ensureDirs } from "./store.js";

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

/* First bytes of each format. A browser will happily label anything
   image/jpeg, so the declared type alone proves nothing. */
const MAGIC = [
  { ext: ".jpg", bytes: [0xff, 0xd8, 0xff] },
  { ext: ".png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { ext: ".gif", bytes: [0x47, 0x49, 0x46, 0x38] },
  { ext: ".webp", bytes: [0x52, 0x49, 0x46, 0x46] },
];

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    await ensureDirs();
    cb(null, UPLOAD_DIR);
  },
  /* The original filename is never used for the path — it is attacker
     controlled and could carry traversal segments or a second extension. */
  filename: (_req, file, cb) => {
    const ext = ALLOWED.get(file.mimetype) || ".bin";
    cb(null, `${Date.now().toString(36)}-${crypto.randomBytes(6).toString("hex")}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 12 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Use JPG, PNG, WebP or GIF.`));
      return;
    }
    cb(null, true);
  },
});

/** Confirm the bytes match the extension; delete and reject if they don't. */
export async function verifyImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const spec = MAGIC.find((m) => m.ext === ext);
  if (!spec) return false;

  let handle;
  try {
    handle = await open(filePath, "r");
    const { buffer, bytesRead } = await handle.read(Buffer.alloc(12), 0, 12, 0);
    if (bytesRead < spec.bytes.length) return false;
    const ok = spec.bytes.every((b, i) => buffer[i] === b);
    /* WebP additionally carries "WEBP" at offset 8. */
    if (ok && ext === ".webp") return buffer.subarray(8, 12).toString() === "WEBP";
    return ok;
  } catch {
    return false;
  } finally {
    await handle?.close();
  }
}

/** Resolve a caller-supplied name inside the upload dir, or null. */
export function safeUploadPath(name) {
  if (typeof name !== "string" || !/^[\w.-]+$/.test(name) || name.includes("..")) return null;
  const resolved = join(UPLOAD_DIR, name);
  return resolved.startsWith(UPLOAD_DIR) ? resolved : null;
}

export async function discard(filePath) {
  try {
    await unlink(filePath);
  } catch {
    /* already gone */
  }
}
