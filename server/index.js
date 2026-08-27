import express from "express";
import { readdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  checkPassword, clearCookie, clearThrottle, initAuth, issueToken,
  readCookie, requireAuth, sessionCookie, throttle, verifyToken,
} from "./auth.js";
import { UPLOAD_DIR, ensureDirs, readContent, writeContent } from "./store.js";
import { MAX_UPLOAD_BYTES, discard, safeUploadPath, upload, verifyImage } from "./uploads.js";

const here = dirname(fileURLToPath(import.meta.url));
const DIST = join(here, "..", "dist");
const PORT = Number(process.env.PORT) || 3000;
const SECURE_COOKIES = process.env.NODE_ENV === "production";

initAuth();               // throws if ADMIN_PASSWORD is missing or too short
await ensureDirs();

const app = express();
app.set("trust proxy", 1); // hosts like Render sit behind a proxy
app.use(express.json({ limit: "1mb" }));

app.use((_req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "same-origin",
  });
  next();
});

/* The session cookie is SameSite=Strict, and every mutating route also
   demands a header a cross-site form post cannot set. */
function sameOrigin(req, res, next) {
  if (req.get("X-Requested-With") !== "rb-admin") {
    res.status(403).json({ error: "Bad request origin." });
    return;
  }
  next();
}

/* --- public ---------------------------------------------------- */

app.get("/api/content", async (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.json(await readContent());
});

app.get("/api/session", (req, res) => {
  res.json({ authenticated: verifyToken(readCookie(req.headers.cookie)) });
});

app.post("/api/login", sameOrigin, (req, res) => {
  const gate = throttle(req.ip);
  if (!gate.allowed) {
    res.status(429).json({
      error: `Too many attempts. Try again in ${Math.ceil(gate.retryInSeconds / 60)} minutes.`,
    });
    return;
  }
  if (!checkPassword(req.body?.password)) {
    res.status(401).json({ error: "Wrong password." });
    return;
  }
  clearThrottle(req.ip);
  res.set("Set-Cookie", sessionCookie(issueToken(), SECURE_COOKIES)).json({ ok: true });
});

app.post("/api/logout", sameOrigin, (_req, res) => {
  res.set("Set-Cookie", clearCookie()).json({ ok: true });
});

/* --- editing (authenticated) ----------------------------------- */

app.put("/api/content", sameOrigin, requireAuth, async (req, res) => {
  try {
    res.json(await writeContent(req.body));
  } catch (err) {
    console.error("save failed:", err);
    res.status(500).json({ error: "Could not save." });
  }
});

app.get("/api/images", requireAuth, async (_req, res) => {
  const names = await readdir(UPLOAD_DIR).catch(() => []);
  const files = await Promise.all(
    names.map(async (name) => {
      const info = await stat(join(UPLOAD_DIR, name)).catch(() => null);
      return info?.isFile() ? { name, url: `uploads/${name}`, size: info.size, at: info.mtimeMs } : null;
    })
  );
  res.json(files.filter(Boolean).sort((a, b) => b.at - a.at));
});

app.post("/api/images", sameOrigin, requireAuth, (req, res) => {
  upload.array("images", 12)(req, res, async (err) => {
    if (err) {
      const tooBig = err.code === "LIMIT_FILE_SIZE";
      res.status(400).json({
        error: tooBig
          ? `That file is over ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB. Resize it and try again.`
          : err.message,
      });
      return;
    }
    const accepted = [];
    for (const file of req.files ?? []) {
      if (await verifyImage(file.path)) {
        accepted.push({ name: file.filename, url: `uploads/${file.filename}` });
      } else {
        await discard(file.path); // renamed .exe, corrupt file, or a mislabelled type
      }
    }
    if (!accepted.length) {
      res.status(400).json({ error: "That didn't look like a real image file." });
      return;
    }
    res.json({ uploaded: accepted });
  });
});

app.delete("/api/images/:name", sameOrigin, requireAuth, async (req, res) => {
  const target = safeUploadPath(req.params.name);
  if (!target) {
    res.status(400).json({ error: "Bad filename." });
    return;
  }
  await discard(target);
  res.json({ ok: true });
});

/* --- static ---------------------------------------------------- */

app.use("/uploads", express.static(UPLOAD_DIR, {
  maxAge: "7d",
  setHeaders: (res) => res.set("X-Content-Type-Options", "nosniff"),
}));
app.use("/admin", express.static(join(here, "admin")));
app.use(express.static(DIST));

app.get(/.*/, (_req, res) => res.sendFile(join(DIST, "index.html")));

app.listen(PORT, () => {
  console.log(`\n  Site   →  http://localhost:${PORT}/`);
  console.log(`  Editor →  http://localhost:${PORT}/admin/\n`);
});
