# RABBLE

Concept e-commerce experience for **RABBLE** — a contemporary fashion brand for men and
women, aimed at 18–30 year olds in India. *Noise you can wear.*

## Stack

- Next.js (App Router, static prerender) + TypeScript
- Tailwind CSS v4 (design tokens in `app/globals.css`)
- No animation libraries — custom pendulum physics, IntersectionObserver reveals, CSS transitions

## Signature pieces

- **The hanging rail** (`components/HangingRail.tsx` + `GarmentArt.tsx`): a draggable
  steel rail of illustrated garments on wooden hangers with damped-pendulum swing physics,
  hang-tags and an active-item caption.
- Chalk / ink / cobalt palette, Archivo (expanded) + Instrument Serif type system.
- Full shopping flow: collections with filters & sorting, product pages with size guide,
  bag drawer and bag page (persisted to `localStorage`).

## Develop

```bash
npm run dev    # dev server
npm run build  # production build
npm start      # serve the build
```

Product data and editorial imagery live in `lib/products.ts` (photography via Unsplash,
for design evaluation only).
