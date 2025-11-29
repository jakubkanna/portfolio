# STUDIO JKN WEBSITE — Next.js + Tailwind

Portfolio site with scroll-driven visuals, 3D logo, animated copy, and a video-hover gallery.

## Pages
- `/` Landing with scroll-driven sequence, fixed logo/menu.
- `/about` Animated typewriter intro about the studio.
- `/portfolio` Grid of works; cards play video on hover when available.
- `/contact` Animated contact CTA.

## Notable features
- `<model-viewer>` logo with periodic X-axis spin.
- Shared `Button`, `AnimatedText`, `Menu`, `PageName` components.
- `useIsMobile` hook for responsive tweaks (e.g., gradient offsets, mobile card visibility).
- Portfolio assets live in `public/portfolio/` (JPEGs, MP4s).

## Getting started
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Commands
- `npm run dev` — start dev server
- `npm run lint` — lint
- `npm run build` / `npm start` — production build and serve
