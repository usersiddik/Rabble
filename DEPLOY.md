# Deploying Rabble.

Two ways to get changes onto `chothing-rabble.vercel.app`. Pick either — they
can coexist.

---

## A. From your terminal (works right now, no setup with Claude)

First time only:

```bash
cd rabble
npm install
npx vercel login          # opens the browser, sign in
npx vercel link           # choose "Link to existing project" → chothing-rabble
```

Every deploy after that — one command:

```bash
npx vercel --prod         # or: npm run deploy
```

It uploads, builds on Vercel, and swaps the production domain over when the
build goes green (usually under a minute). `npx vercel` without `--prod` gives
you a throwaway preview URL instead, which is handy for checking a change
before it goes to the live domain.

Useful extras:

```bash
npx vercel ls             # recent deployments + their URLs
npx vercel logs <url>     # build/runtime logs for one deployment
npx vercel rollback       # put the previous deployment back on the domain
```

### If the Vercel project is connected to a Git repo

Then the repo is the source of truth and the shortest loop is:

```bash
git add -A
git commit -m "Describe the change"
git push                  # Vercel builds and deploys automatically
```

---

## B. Have Claude push the changes

One-time setup:

1. claude.ai → **Settings → Connectors → GitHub** → connect, and grant the
   Claude GitHub App access to this repository.
2. Tell Claude the repo (`owner/name`). If it doesn't exist yet, create an
   empty one and Claude will push the whole codebase as the first commit.
3. In the Vercel dashboard: project → **Settings → Git → Connect Git
   Repository** → pick that repo. (Only needed if the project wasn't created
   from Git originally.)

After that, each request is: describe the change → Claude edits, rebuilds,
verifies it in a browser, commits and pushes → Vercel deploys automatically.

---

## Build modes

| Command | Output | Used for |
| --- | --- | --- |
| `npm run build` | `.next/` — native Next.js build | Vercel / production. This is the default; Vercel needs no extra config. |
| `npm run export` | `out/` — fully static site | A standalone copy (e.g. the hosted preview page). Sets `STATIC_EXPORT=1`. |

`next.config.ts` switches on that variable, so **don't** set `STATIC_EXPORT` in
Vercel's environment variables — production should use the native build.

---

## Checklist before any deploy

```bash
npm run build             # must finish with no errors
npm start                 # smoke-test http://localhost:3000
```

Check the rack flip, the `Front | Back` switcher, and that `/men`, `/women`,
`/new-arrivals` and a `/product/<slug>` page all load.
