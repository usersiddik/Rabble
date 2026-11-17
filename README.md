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

`components/GarmentRack.tsx` — a full-width brushed-steel rail of catalogue pieces on wooden hangers, with **All | Men | Women** pills above it. Each filter hangs its own lineup; switching re-hangs the rail so the pieces drop on one by one (on first load only the neighbours of the hero piece do, so the hero paints at once).

- Inactive pieces hang in a compressed side profile (`rotateY(55deg) scaleX(0.55)` with crossfaded edge-on shading). Hover or tap one and it springs to the front (`stiffness 140, damping 20, mass 0.8`); neighbours glide apart with a hook-pivoted pendulum sway that settles to 0°.
- **Front | Back** (a radiogroup — arrow keys move it) or a second tap flips the active piece 180° to its back print.
- **Inspect front & back** opens the studio inspect: the active piece glides to the centre and lifts (1.08) while its neighbours slide off the rail, and the caption becomes a size picker with Add to bag, Full details and ← Back to rack (Escape works too).
- Desktop: hover + drag to scroll. Mobile: native swipe, the active hanger stays centred, tap to open, tap again to flip.
- Keyboard: every hanger is a tab stop, Enter/Space opens then flips. `prefers-reduced-motion` drops the springs and sway.
- Slot sizes live in the `.rack` CSS variables (`app/globals.css`) so the server render is already the right size on every breakpoint — keep them in step with `DESKTOP` / `LAPTOP` / `TABLET` / `MOBILE` in the component. `LAPTOP` (≥1024px wide, ≤900px tall) keeps the name and shop button above the fold.
- `HeroEditorialBanner` sits under it: photo-free (the backs of three pieces over the noise motif) until the campaign is shot; pass `image` to swap in a photograph.

**The lineups** are `lib/rack.ts`: catalogue slugs per filter, the piece each opens on, and the rail copy (tag, fit · fabric line). Colours, prints and prices come from `content/garments.ts`; every rack piece must be live.

## Motion

One engine: Framer Motion (lazy-loaded) for the rack and showcase, CSS for everything else. All of it collapses under `prefers-reduced-motion`.

- `<Reveal>` fades blocks up as they scroll in; `<Reveal variant="mask">` slides display headings up from behind their own bottom edge (power4.out, 0.9s). Titles already on screen at load use `.mask-line > .mask-up`, which is CSS only.
- The product viewer turns Front ⇄ Back like the garment on its hanger: to 90°, swap, back to 0°, with a 1.03 lift.
- The manifesto band's noise drifts against the scroll (`<Parallax>`).

**The renders** are `components/GarmentRender.tsx`: procedural studio garments (tee, hoodie, crop hood, crew, trucker, bomber, dress) with fabric grain, fold shading, rib trims and seam stitching, drawing each piece's real print placements. Use `<GarmentCutout garment={…} />` in pages — it shows cutout photography when a garment has `frontImage` / `backImage` / `sidePreview`, and the render otherwise. The rack masks those same photos into the hanger silhouette, so adding a shoot to the catalogue updates the hero too.

`npm run lint` and `npm run build` must pass before merging.
