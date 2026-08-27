import crypto from "node:crypto";

/* ---------------------------------------------------------------
   Single-admin auth. No user table, no database — one password
   supplied by the operator through the environment.
   --------------------------------------------------------------- */

const MIN_PASSWORD_LENGTH = 10;
const SESSION_HOURS = 12;
const COOKIE = "rb_session";

/* The password never sits in memory as plaintext we compare directly:
   both sides are run through scrypt and compared in constant time. */
const salt = crypto.randomBytes(16);
const derive = (value) => crypto.scryptSync(String(value), salt, 32);

let passwordKey = null;

export function initAuth() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error(
      "ADMIN_PASSWORD is not set. Refusing to start — an editor with no " +
        "password would let anyone rewrite the site.\n" +
        "  Set it, e.g.:  ADMIN_PASSWORD='a long passphrase' npm start"
    );
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters ` +
        `(got ${password.length}). A short password on a public URL gets guessed.`
    );
  }
  passwordKey = derive(password);
}

export function checkPassword(candidate) {
  if (!passwordKey || typeof candidate !== "string") return false;
  const attempt = derive(candidate);
  return crypto.timingSafeEqual(attempt, passwordKey);
}

/* --- Stateless signed session cookie -------------------------- */

/* A fixed secret keeps sessions alive across restarts. Without one we
   generate a throwaway, which simply means re-logging in after a deploy. */
const secret = process.env.SESSION_SECRET
  ? Buffer.from(process.env.SESSION_SECRET)
  : crypto.randomBytes(32);

const sign = (data) =>
  crypto.createHmac("sha256", secret).update(data).digest("base64url");

export function issueToken() {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + SESSION_HOURS * 3600_000 })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token) {
  if (typeof token !== "string" || !token.includes(".")) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  /* Compare as buffers of equal length, or timingSafeEqual throws. */
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
}

export function sessionCookie(token, secure) {
  const parts = [
    `${COOKIE}=${token}`,
    "HttpOnly",
    "SameSite=Strict",
    "Path=/",
    `Max-Age=${SESSION_HOURS * 3600}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export const clearCookie = () =>
  `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;

export function readCookie(header) {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === COOKIE) return v.join("=");
  }
  return null;
}

/* --- Login throttling ----------------------------------------- */

const attempts = new Map();
const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 8;

export function throttle(ip) {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryInSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { allowed: true };
}

export const clearThrottle = (ip) => attempts.delete(ip);

/* Keep the throttle map from growing without bound. */
setInterval(() => {
  const now = Date.now();
  for (const [ip, e] of attempts) if (now > e.resetAt) attempts.delete(ip);
}, WINDOW_MS).unref();

export function requireAuth(req, res, next) {
  if (verifyToken(readCookie(req.headers.cookie))) return next();
  res.status(401).json({ error: "Not signed in." });
}
