# RABBLE — noise you can wear

Concept storefront for a front-and-back print label from Bengaluru. Next.js 16 App Router, Tailwind v4, Framer Motion on the homepage only (rack hero + showcase), lazy-loaded features.

```bash
npm install
cp .env.example .env.local   # optional: Resend keys for the waitlist
npm run dev
```

- `/` garment-rack hero, Print Lab / Atelier showcase, drop teaser
- `/brand` living style guide (tokens in `app/globals.css`)
- `/about` manifesto
- `/men`, `/women`, `/new-arrivals` collections with Front | Back flip cards
- `/product/[slug]` garment viewer, print spec, size guide
- `/drop` countdown and per-piece notify
- `/lookbook` editorial chapters
- `/shipping-returns`, `/exchanges`, `/size-help`, `/faq`, `/privacy`, `/terms`

Content lives in `content/`; see `docs/README.md` for the content model and screenshots per area.

## Garment rack hero

`components/GarmentRack.tsx` — a full-width brushed-steel rail with seven catalogue pieces on wooden hangers.

- Inactive pieces hang in a compressed side profile (`rotateY(55deg) scaleX(0.55)` with crossfaded edge-on shading). Hover or tap one and it springs to the front (`stiffness 140, damping 20, mass 0.8`); neighbours glide apart with a hook-pivoted pendulum sway that settles to 0°.
- **Front | Back** (a radiogroup — arrow keys move it) or a second tap flips the active piece 180° to its back print.
- Desktop: hover + drag to scroll. Mobile: native swipe, the active hanger stays centred, tap to open, tap again to flip.
- Keyboard: every hanger is a tab stop, Enter/Space opens then flips. `prefers-reduced-motion` drops the springs and sway.
- Slot sizes live in the `.rack` CSS variables (`app/globals.css`) so the server render is already the right size on every breakpoint — keep them in step with `DESKTOP` / `TABLET` / `MOBILE` in the component.
- `HeroEditorialBanner` sits under it: photo-free (the backs of three pieces over the noise motif) until the campaign is shot; pass `image` to swap in a photograph.

**The lineup** is `lib/rack.ts`: seven catalogue slugs plus the rail copy (tag, fit · fabric line). Colours, prints and prices come from `content/garments.ts`.

**The renders** are `components/GarmentRender.tsx`: procedural studio garments (tee, hoodie, crop hood, crew, trucker, bomber, dress) with fabric grain, fold shading, rib trims and seam stitching, drawing each piece's real print placements. Use `<GarmentCutout garment={…} />` in pages — it shows cutout photography when a garment has `frontImage` / `backImage` / `sidePreview`, and the render otherwise. The rack masks those same photos into the hanger silhouette, so adding a shoot to the catalogue updates the hero too.

`npm run lint` and `npm run build` must pass before merging.
