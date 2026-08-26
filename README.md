# For My Dearest Sister — a Raksha Bandhan gift

A single-page, cinematic Raksha Bandhan experience: a personal digital gift, not
a greeting-card template. Photos, a rakhi you can actually tie, a written note
and a celebration at the end.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # preview the built site
```

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

## Deploy

Static output — `npm run build`, then upload `dist/` anywhere (Netlify, Vercel,
GitHub Pages, Cloudflare Pages).

## Built with

React 19 · Vite · Tailwind CSS v4 · Framer Motion · canvas-confetti

## Structure

```
src/
  App.jsx                 page assembly + the "open the surprise" gate
  data/siteConfig.js      ← the only file you need to edit
  styles/index.css        design tokens, type scale, surfaces
  components/             Nav, MusicToggle, Lightbox, Photo, Particles,
                          RakhiGraphic, Reveal, Ornament, celebrate
  sections/               Hero, BondSection, MemoryGallery,
                          AppreciationSection, SiblingMoments, OneThing,
                          RakhiInteraction, LetterSection, FinalSurprise
public/
  images/                 your photos
  music/                  optional background track
```

## Notes

- Mobile-first; tested from 360px upward.
- Fully keyboard navigable; the lightbox supports ← → and ESC.
- `prefers-reduced-motion` is respected everywhere — animation collapses to
  simple fades and confetti is suppressed.
- Images are lazy-loaded.
