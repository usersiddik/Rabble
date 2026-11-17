# RABBLE — pre-launch brand phase

Screenshots per area, captured from `next start` with headless Chrome at 1440px (desktop) and a true 390px layout (mobile).
Re-capture after changes: build, `npx next start -p 3100`, then shoot with `--force-prefers-reduced-motion` so reveals are settled.

| # | Area | Desktop | Mobile |
| - | ---- | ------- | ------ |
| 1 | Home: garment-rack hero, Print Lab / Atelier showcase, front/back, drop teaser | [01-home-desktop](screenshots/01-home-desktop.png) | [01-home-mobile](screenshots/01-home-mobile.png) |
| 1 | Garment rack hero: default, Back flipped, mobile | [10-rack-hero-desktop](screenshots/10-rack-hero-desktop.png) · [10-rack-hero-back](screenshots/10-rack-hero-back.png) | [10-rack-hero-mobile](screenshots/10-rack-hero-mobile.png) |
| 1 | Brand identity system (`/brand`) | [02-brand-desktop](screenshots/02-brand-desktop.png) | — |
| 2 | Manifesto & About (`/about`) | [03-about-desktop](screenshots/03-about-desktop.png) | [03-about-mobile](screenshots/03-about-mobile.png) |
| 3 | Collection: sticky filters, Front/Back flip cards, drop chapters | [04-collection-desktop](screenshots/04-collection-desktop.png) | [04-collection-mobile](screenshots/04-collection-mobile.png) |
| 3 | Product: garment viewer, print spec, sticky add-to-bag | [05-product-desktop](screenshots/05-product-desktop.png) | [05-product-mobile](screenshots/05-product-mobile.png) |
| 3/4 | Product, waitlist piece with "notify me" | [05-product-waitlist](screenshots/05-product-waitlist.png) | — |
| 4 | Drop page: countdown, pieces in the run, notify per piece | [06-drop-desktop](screenshots/06-drop-desktop.png) | [06-drop-mobile](screenshots/06-drop-mobile.png) |
| 5 | Lookbook: editorial chapters, parallax | [07-lookbook-desktop](screenshots/07-lookbook-desktop.png) | [07-lookbook-mobile](screenshots/07-lookbook-mobile.png) |
| 6 | Trust & legal: FAQ, shipping & returns, footer | [08-faq-desktop](screenshots/08-faq-desktop.png) | [08-shipping-mobile](screenshots/08-shipping-mobile.png) |
| 7 | Open Graph: site, product, waitlist product | [09-og-home](screenshots/09-og-home.png) · [09-og-product](screenshots/09-og-product.png) · [09-og-waitlist](screenshots/09-og-waitlist.png) | — |

## Lighthouse (mobile, simulated throttling, `next start`, 2026-11-17)

| Route | Performance | Accessibility | Best practices | SEO |
| ----- | ----------- | ------------- | -------------- | --- |
| `/` | 100 | 100 | 100 | 100 |
| `/new-arrivals` | 95 | 100 | 100 | 100 |
| `/product/reprint-tee-01` | 96 | 100 | 100 | 100 |
| `/about` | 96 | 100 | 100 | 100 |
| `/drop` | 96 | 100 | 100 | 100 |

What moved the needle: above-the-fold text uses the CSS-only `.rise` entrance instead of the JS-driven `<Reveal>`; the display face is a self-hosted 15 KB static Archivo Expanded instance instead of the 90 KB variable font; the rupee sign is served from a system face so pricing never pulls Google's latin-ext subset; the serif is not preloaded; small text uses `--color-steel-deep` / `--color-cobalt-light` for AA contrast.

## Content system (area 8)

Everything editorial lives in `content/`:

- `content/garments.ts` — the catalogue. Each garment has an illustrated `art` fallback plus optional `frontImage`, `backImage`, `sidePreview`. When a photo slot is filled, `<GarmentCutout />` renders it instead of the illustration; no component changes.
- `content/drops.ts` — drop chapters, dates, run sizes.
- `content/site.ts` — brand facts, nav, footer, socials, GSTIN, shipping numbers, voice rules.
- `content/manifesto.ts`, `content/lookbook.ts`, `content/legal.ts` — page copy.

`lib/products.ts` re-exports the catalogue under the older `Product` names for the cart.

## Waitlist

`POST /api/waitlist` stores to Resend Audiences when `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` are set, otherwise to `.data/waitlist.jsonl` in development. See `.env.example`.
