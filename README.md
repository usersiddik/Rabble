# Rabble. — Printed Tees & Boutique Atelier

Luxury Next.js (App Router) D2C storefront for high-density front & back printed
T-shirts and curated women's boutique wear. GSAP is the single animation engine.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start   # production
```

Deploy to Vercel as-is (no env vars required). Deploy instructions — terminal
and Claude-driven — are in [DEPLOY.md](./DEPLOY.md); the short version is
`npx vercel --prod`.

## Architecture

| Path | Purpose |
| --- | --- |
| `data/products.ts` | **Single source of truth** for the catalog (schema: id, slug, name, subtitle, price, badge, category, frontImage, backImage, sideImage, printSpecs, fabricSpecs) |
| `lib/gsap.ts` | Centralized GSAP setup (`gsap`, `useGSAP`, `ScrollTrigger`, reduced-motion helper) — the only animation engine; no Framer Motion |
| `components/hero/GarmentRack.tsx` | Interactive studio garment rail: brushed-steel bar, hook + wooden hanger rig, hang-tags, two-phase 3D side-to-front flip (expo.out widths, 90° midpoint swap, elastic pendulum settle), focused inspect state with Front \| Back switcher |
| `components/ProductInspect.tsx` | The inspect component replicated on `/product/[slug]` |
| `components/sections/*` | Lifestyle strip, architectural marquee, dual-world showcase, New This Week grid (`ScrollTrigger.batch`, `once: true`), parallax manifesto |
| `app/men` · `app/women` · `app/new-arrivals` · `app/product/[slug]` | All routes statically generated |

## Replacing placeholder garment art with production photography

The garment cutouts in `/public/garments` are **generated placeholders**
(`scripts/gen_garments.py`). To swap in real photography:

1. Shoot/retouch studio-isolated cutouts on **transparent** backgrounds
   (front, back, and a narrow side profile per product), export as `.webp`.
2. Drop them into `/public/garments`.
3. Update only the `frontImage` / `backImage` / `sideImage` paths in
   `data/products.ts`. Nothing else references image files.

Multi-layer studio drop shadows are applied in CSS (`.garment-shadow`), so
cutouts should be shot **without** baked-in shadows.

Editorial imagery (`/public/editorial`) is likewise placeholder — replace
`lifestyle-strip.webp`, `print-lab.webp`, `boutique-edit.webp`, `manifesto-bg.webp`.

## Performance rules honored

- GPU-only tweens (`x`, `yPercent`, `scale`, `rotationY/Z`, `autoAlpha`); the rail's
  width interpolation is the one sanctioned layout tween (7 isolated nodes, per design).
- All scroll reveals are `once: true` (masked line reveals + `ScrollTrigger.batch`, stagger 0.07).
- `gsap.matchMedia()` gates desktop rack physics; mobile gets a native snap-scroll
  rail with tap-to-flip; `prefers-reduced-motion` collapses timelines to instant sets.
- All animations wrapped in `useGSAP({ scope })` for automatic cleanup.
