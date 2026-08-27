import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import { siteConfig } from "./data/siteConfig";

/**
 * If this build is served by the editor backend, take the saved content.
 * On a static host (GitHub Pages, a single file on disk) the request simply
 * fails or returns the page itself — either way we fall through to the
 * values bundled in siteConfig.js and the site renders exactly as before.
 */
async function loadSavedContent() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch("api/content", {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) return;
    /* A static host's SPA fallback answers 200 with HTML — not our content. */
    if (!res.headers.get("content-type")?.includes("application/json")) return;
    Object.assign(siteConfig, await res.json());
  } catch {
    /* no backend, offline, or too slow — the bundled defaults stand */
  } finally {
    clearTimeout(timeout);
  }
}

await loadSavedContent();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
