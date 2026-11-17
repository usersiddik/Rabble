# RABBLE

Concept e-commerce experience for **RABBLE** — India's D2C home for **front & back printed
graphic tees** and a **curated women's boutique edit**, aimed at 18–30 year olds. *Noise you can wear.*

## Stack

- Next.js (App Router, static prerender) + TypeScript
- Tailwind CSS v4 (design tokens in `app/globals.css`)
- Framer Motion for the rack physics (spring accordion, side-profile tilt, hanger sway, Front/Back flips);
  IntersectionObserver reveals and CSS transitions everywhere else

## Signature pieces

- **The garment rack hero** (`components/GarmentRack.tsx`): a full-width matte-steel rail with
  seven garments on wooden hangers. Inactive pieces hang in a compressed side profile
  (`rotateY(55deg) scaleX(0.55)`); hover/tap springs one to the front, neighbours glide apart with
  a pendulum micro-sway, and a **Front | Back** pill (or a second tap) flips the piece 180° to its
  back print. Drag / swipe to browse; keyboard accessible.
- **`<GarmentCutout />`** (`components/GarmentCutout.tsx`): procedural studio garment renders —
  fabric grain, fold shading, rib trims, seam stitching, hook tags — with `front`, `back` and
  `side` views and original print artwork. Pass `frontImage` / `backImage` / `sidePreview`
  (transparent cutout photography) to swap in real product shots per piece (`lib/rack.ts`).
- Dual-mood showcase: **The Print Lab** (tee flips to its back print on hover) and
  **The Atelier Edit** (women's boutique, pointer parallax).
- Product cards with a Front | Back pill, hover auto-flip and a slide-up quick-add size bar;
  craftsmanship & India D2C trust strip; ⌘K search overlay.
- Studio alabaster / carbon ink / brushed steel palette with terracotta & cobalt accents,
  Archivo (expanded) + Instrument Serif type system.
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
