# RABBLE — noise you can wear

Concept storefront for a front-and-back print label from Bengaluru. Next.js 16 App Router, Tailwind v4, no animation libraries.

```bash
npm install
cp .env.example .env.local   # optional: Resend keys for the waitlist
npm run dev
```

- `/` garment-rack hero, drop teaser
- `/brand` living style guide (tokens in `app/globals.css`)
- `/about` manifesto
- `/men`, `/women`, `/new-arrivals` collections with Front | Back flip cards
- `/product/[slug]` garment viewer, print spec, size guide
- `/drop` countdown and per-piece notify
- `/lookbook` editorial chapters
- `/shipping-returns`, `/exchanges`, `/size-help`, `/faq`, `/privacy`, `/terms`

Content lives in `content/`; see `docs/README.md` for the content model and screenshots per area.

`npm run lint` and `npm run build` must pass before merging.
