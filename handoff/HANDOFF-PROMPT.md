# RABBLE — integrate the garment-rack hero onto current `main`

Paste everything below this line into a new Claude session, and attach the `rabble-rack-hero-handoff.zip`.

---

You are a Senior Creative Frontend Developer working on the RABBLE storefront
(`github.com/usersiddik/Rabble`, Next.js 16 App Router, Tailwind v4, React 19).
Clone `main` (currently at commit `a3e4eb2` — "Performance and accessibility pass").

**Goal:** replace the homepage hero with the interactive garment-rack hero that was
built in a previous session, and bring the rest of that session's homepage work with it —
without losing anything from the Phase-2 brand work already on `main` (`/brand`, `/about`,
`/drop`, `/lookbook`, waitlist API, legal pages, SEO, `content/` catalogue, fonts).

## What you've been given (in the zip)

- `rabble-garment-rack-hero.patch` — the original commit. It was authored against the
  OLDER commit `4e6e01d`, so `git am` on current `main` WILL conflict. Use it for reference
  / cherry-picking hunks, not as a blind apply. (If useful: `git checkout -b rack-old 4e6e01d
  && git am rabble-garment-rack-hero.patch` gives you a working copy of the old state to
  run and compare.)
- `src/` — the finished files from that commit, ready to copy:
  - `components/GarmentRack.tsx` — the hero. Full-width matte-steel rail with brackets, seven
    hangers, Framer Motion spring accordion (`stiffness 140, damping 20, mass 0.8`), inactive
    pieces in side profile (`rotateY(55deg) scaleX(0.55)` + crossfaded edge-on shading),
    hook-pivoted pendulum sway that settles to 0°, Front | Back segmented pill with
    `layoutId` sliding indicator, 180° 3D flip (also on second tap of the active garment),
    title / fit · fabric · price caption, ← Shop the collection → and Quick view,
    drag-to-scroll on desktop, native swipe + arithmetic centring on mobile, keyboard and
    reduced-motion support. Also exports `HeroEditorialBanner` (full-bleed `min-h-[28vh]`
    banner with scroll parallax).
  - `components/GarmentCutout.tsx` — procedural SVG garment renders (tee / hoodie /
    cropped-hoodie / crew / dress) with fabric grain, fold shading, rib trims, stitching,
    wooden hanger, hook tag; `view="front" | "back" | "side"`; original print artwork
    (`mark-chest`, `reprint-chest`, `reprint-back`, `wave-back`, `crowd-back`, `arc-back`);
    optional `image` prop masks a transparent cutout photo into the silhouette.
  - `lib/rack.ts` — the 7-piece rack lineup (slug, kind, body/shade/ink colours, prints,
    tag, spec line, optional `frontImage` / `backImage` / `sidePreview`).
  - `components/CategoryShowcase.tsx` — "Pick your noise": **The Print Lab** card (tee flips
    front→back on hover, print-spec chips) and **The Atelier Edit** card (sandstone/ivory,
    serif sub-type, pointer parallax, silhouette tags).
  - `components/TrustStrip.tsx` — 4-column craftsmanship / UPI-COD-exchanges grid.
  - `components/SearchOverlay.tsx` — ⌘K typeahead search over the catalogue.
  - `components/Header.tsx` — glass sticky header: `Printed Tees · Women's Boutique ·
    New Drops` / centred `Rabble.` / `Search` + `Bag (n)`, plus the
    `NEW COLLECTION | PREMIUM PRINTED TEES & BOUTIQUE WEAR` micro-header on `/`.
  - `components/ProductCard.tsx` — Front | Back pill, hover auto-flip, slide-up quick-add
    S/M/L/XL bar wired to the cart.
  - `components/Marquee.tsx` — thin `border-neutral-200/80` ticker styling.
  - `app/page.tsx` — homepage assembly: rack hero → editorial banner → marquee →
    CategoryShowcase → New this week (flip cards) → TrustStrip → campaign.
  - `app/globals.css` — studio palette tokens (`--color-studio #F6F5F0`, `carbon`, `steel`,
    `cobalt`, `terracotta`, `sand`, `ivory`), `.glass`, `.rail-bar`, `.rail-bracket`,
    `.garment-shadow`, `.flip-*` classes.
- `reference-hero-desktop.png`, `reference-hero-back-print.png` — what the finished hero
  must look like.

## Known conflicts with current `main` — resolve like this

1. **`components/GarmentCutout.tsx` exists on `main` with a different API**
   (`garment: Garment, side` — a wrapper that picks photo vs `GarmentArt` illustration from
   `content/garments.ts`). Keep `main`'s file as the public API. Add the procedural renderer
   from `src/components/GarmentCutout.tsx` as `components/GarmentRender.tsx` (rename the
   default export to `GarmentRender`), then make `main`'s `GarmentCutout` use
   `GarmentRender` instead of `GarmentArt` for the illustrated fallback, mapping
   `Garment` fields (kind, colours, prints, tag) onto `GarmentRender` props. Update
   `GarmentRack.tsx` and `CategoryShowcase.tsx` imports accordingly. If `main`'s
   `Garment` type lacks `kind` / `body` / `shade` / `ink` / `frontPrint` / `backPrint`, add
   them to `content/garments.ts` and fill them from `src/lib/rack.ts`. Then `lib/rack.ts`
   can simply select the seven rack slugs from the catalogue.
2. **`app/page.tsx`** — `main` still renders `<HangingRail />`. Replace the hero block with
   `<GarmentRack />` + `<HeroEditorialBanner />` exactly as in `src/app/page.tsx`, but keep
   any Phase-2 additions on `main`'s homepage (JoinDrop / waitlist capture, JSON-LD,
   metadata). Delete `components/HangingRail.tsx` and `components/GarmentArt.tsx` once
   nothing imports them.
3. **`components/Header.tsx`** — merge: `src` version's nav labels, micro-header, Search
   button + `SearchOverlay`, `.glass`; keep `main`'s skip link, focus handling, Wordmark
   component and any new routes in the mobile menu.
4. **`components/ProductCard.tsx`** — `main` has its own `FlipCard.tsx`. Keep one flip
   implementation (prefer `main`'s if it's already used on collection pages) and add the
   quick-add size bar from `src`. No duplicate flip systems.
5. **`app/globals.css`** — add the `src` tokens/classes that are missing; where `main`
   already defines a token with the same meaning (e.g. alabaster vs studio), keep `main`'s
   name and alias the other.
6. **`README.md`** — add a "Garment rack hero" section (see the patch's README hunk).

## Dependencies

`npm install framer-motion` (v12, React 19 compatible). No other new libraries.

## Acceptance

- `npm run lint`, `npx tsc --noEmit` and `npm run build` pass.
- Homepage at 1440px matches `reference-hero-desktop.png`: rail directly under the
  micro-header, no headline block above it (H1 is `sr-only`), seven hangers, Reprint Tee 01
  open by default, hover another hanger → it springs open and neighbours glide/sway,
  Back pill → 180° flip to the back print, then the editorial banner.
- 390px: rail scrolls horizontally with the active hanger centred, tap-to-open,
  tap-again-to-flip, CTAs stack cleanly.
- `prefers-reduced-motion`: no sway/springs, instant state changes.
- Keyboard: Tab reaches every hanger, Enter/Space opens/flips, pill is a radiogroup.
- All Phase-2 routes still build and render; Lighthouse mobile stays ≥ 95.
- Commit on a branch `feat/garment-rack-hero`, open a PR to `main`, include desktop and
  mobile screenshots of the new hero in the PR description.
