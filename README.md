# For My Dearest Sister — a Raksha Bandhan gift

A single-page, cinematic Raksha Bandhan experience: a personal digital gift, not
a greeting-card template. Photos, a rakhi you can actually tie, a written note
and a celebration at the end.

## Run it

Needs Node.js 20.19+.

```bash
npm install
npm run dev           # http://localhost:5173 (no editor)
npm start             # http://localhost:3000 (site + /admin editor)
npm run build         # production build in dist/
npm run build:single  # dist/raksha-bandhan.html — one self-contained file
npm run preview       # preview the built site
```

### One file you can just open

`npm run build:single` inlines the script, styles and fonts into a single
`dist/raksha-bandhan.html`. Double-click it and it works — offline, from a USB
stick, or as an email attachment. A normal build can't do this: browsers refuse
to load separate JS/CSS files from a `file://` page, so `dist/index.html` shows
a blank screen unless it's served over HTTP.

Keep an `images/` folder beside the file to supply photos.

## Make it yours

Everything you'd want to change lives in **one file**:

```
src/data/siteConfig.js
```

Names, every heading and message, photo captions, the sibling cards, the letter,
the final sign-off and the music path — all there. You never need to open a
component to change wording.

### Photos

Drop your pictures into `public/images/` and point the `memories` array at them.
Any photo that isn't there yet shows an elegant placeholder naming the exact
path to add — nothing breaks, and no stock photography is ever substituted.

### Music

Optional. Put an mp3 at `public/music/raksha-bandhan.mp3` and a floating ♪
button appears. No file, no button. It never autoplays.


## The editor (optional backend)

A small Express server adds a password-protected editor at `/admin/` where you
can rewrite every piece of text and upload photos from the browser — no code,
no redeploy.

```bash
npm install
npm run build
ADMIN_PASSWORD='a long passphrase' npm start
#   Site   → http://localhost:3000/
#   Editor → http://localhost:3000/admin/
```

The server refuses to start without `ADMIN_PASSWORD` (min 10 characters) — an
editor with no password would let anyone rewrite the site.

**This does not run on GitHub Pages, Netlify Drop, or from a file on disk.**
Those are static hosts; there is no server to run. The site itself still works
perfectly on all of them — without a backend it just uses the text bundled in
`siteConfig.js`, exactly as before. The editor is strictly an addition.

### Deploying it

Any Node host works — Render, Railway, Fly.io. `render.yaml` is included:
push to GitHub, create a Render Blueprint from the repo, set `ADMIN_PASSWORD`
in the dashboard.

### Keeping your edits

Saved text goes to `data/content.json` and photos to `data/uploads/`.

**On a free tier these are wiped on every redeploy and idle restart.** Free
hosts give you an ephemeral filesystem. To keep edits permanently, attach a
persistent disk (a paid plan on most hosts) and point `DATA_DIR` at its mount
path. If you'd rather stay free, treat the editor as a way to *compose* the
content, then copy the finished text into `src/data/siteConfig.js` so it is
baked into the build.

### How it holds up

- Password hashed with scrypt and compared in constant time; never stored or
  logged in plaintext.
- Session is a signed, `HttpOnly`, `SameSite=Strict` cookie that expires in 12
  hours. Tampered and expired tokens are rejected.
- Login throttled to 8 attempts per 15 minutes per IP.
- Mutating routes require a custom header a cross-site form post cannot set.
- Uploads: type allowlist (JPG/PNG/WebP/GIF), 8MB cap, and the file's **magic
  bytes** are checked — a script renamed `.jpg` is deleted, not stored.
  Filenames are generated, never taken from the upload.
- Saved content is validated against the shape of `siteConfig`, so a request
  can only change values the site already renders — it cannot add keys or swap
  a string for an object.

### API

| Route | Auth | Purpose |
|---|---|---|
| `GET /api/content` | public | content the site renders |
| `POST /api/login` | public | sign in |
| `PUT /api/content` | required | save changes |
| `GET/POST /api/images` | required | list / upload photos |
| `DELETE /api/images/:name` | required | delete a photo |

## Deploy

### GitHub Pages (already wired up)

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub
Actions**. The site lands at `https://<user>.github.io/<repo>/`.

`base: './'` in `vite.config.js` keeps asset URLs relative, so the same build
works at a domain root, inside a Pages project sub-path, and from disk.

### Anywhere else

`npm run build`, then drop `dist/` on Netlify, Vercel or Cloudflare Pages. No
configuration needed.

## Built with

React 19 · Vite · Tailwind CSS v4 · Framer Motion · canvas-confetti

## Structure

```
src/
  App.jsx                 page assembly + the "open the surprise" gate
  data/siteConfig.js      ← the only file you need to edit
  styles/index.css        design tokens, type scale, surfaces
  components/             Nav, MusicToggle, Lightbox, Photo, Particles,
                          RakhiGraphic, Reveal, Ornament, T, celebrate
  sections/               Hero, BondSection, MemoryGallery,
                          AppreciationSection, SiblingMoments, OneThing,
                          RakhiInteraction, LetterSection, FinalSurprise
public/
  images/                 your photos
  music/                  optional background track
scripts/
  build-single.mjs        bundles dist/ into one openable .html
server/
  index.js                Express app: API, static, admin
  auth.js                 password, session cookie, throttling
  store.js                content.json + shape validation
  uploads.js              upload limits and magic-byte checks
  admin/                  the editor UI (plain HTML/CSS/JS)
data/                     saved content + uploads (gitignored)
```

## Notes

- Mobile-first; tested from 360px upward.
- Fully keyboard navigable; the lightbox supports ← → and ESC.
- `prefers-reduced-motion` is respected everywhere — animation collapses to
  simple fades and confetti is suppressed.
- Images are lazy-loaded.
