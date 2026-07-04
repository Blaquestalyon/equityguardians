# Equity Guardians — Site Handoff

> Paste this whole document at the start of a fresh chat when you want another agent (or a new session with fresh tokens) to make changes to the equityguardians.com site.

---

## 1. Who + What

- **Site**: [equityguardians.com](https://equityguardians.com) — a rebuild of the original marketing site for Equity Guardians, a network of attorneys offering foreclosure protection / equity protection to homeowners.
- **Owner**: Jay Davis (admin@power-in-numbers.net), based in Houston, TX. GitHub handle: `Blaquestalyon`.
- **Company contact info (hardcoded in the site)**:
  - Email: `admin@equityguardians.com`
  - Phone: `+1 (888) 954-0999`
  - Address: `1 World Trade Center, 85th Floor, New York, NY 10007`
- **Motto**: "SAVE — EARN — PROTECT"

## 2. Repo + Hosting

- **GitHub**: https://github.com/Blaquestalyon/equityguardians (public, `main` branch is deployed)
- **Local project path (in workspace)**: `/home/user/workspace/equityguardians/`
- **Hosting**: Railway
  - Builder: Nixpacks (config in `nixpacks.toml`, `railway.json`)
  - Start command: `node ./dist/server/entry.mjs`
  - Auto-deploys on push to `main`
- **CI / build**: none besides Railway's own Nixpacks build

## 3. Stack

- **Framework**: [Astro 4](https://astro.build) with the `@astrojs/node` **standalone** adapter (SSR)
- **Language**: TypeScript for endpoints, `.astro` files for pages/components
- **Styling**: Plain CSS in `src/styles/global.css` — no Tailwind, no CSS-in-JS
- **Fonts**: Fraunces (serif, headings) + Inter (sans, body) — loaded via `<link>` in `src/layouts/BaseLayout.astro`
- **Form backend**: Airtable REST API (POST `records`) — called server-side from `src/pages/api/contact.ts`

## 4. Design System

- **Colors**: navy `#0B1F3F` / `#0F2E5C` + teal `#4FB3B3` + ivory + gold accents (all defined as CSS variables in `src/styles/global.css`)
- **Type**: Fraunces (serif display), Inter (sans body)
- **Vibe**: institutional / legal / trust-oriented (like a big-law firm's marketing site, but warmer)

## 5. File Layout

```
equityguardians/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro          # <html> shell, fonts, meta, header/footer
│   ├── components/
│   │   ├── Header.astro              # top nav
│   │   ├── Footer.astro              # bottom nav + contact
│   │   └── PageHero.astro            # reusable page-title hero (used on all inner pages)
│   ├── pages/
│   │   ├── index.astro               # HOME — hero + pillars + services split + mission + approach + pricing
│   │   ├── about.astro               # About Us — metrics + beliefs
│   │   ├── services.astro            # Services — 3 service sections + representation
│   │   ├── attorneys.astro           # Attorneys — John Helstowski, Zachary Long + vetting standards
│   │   ├── insights.astro            # Blog stubs + newsletter signup
│   │   ├── contact.astro             # Contact info + form
│   │   ├── 404.astro                 # Not found
│   │   ├── sitemap.xml.ts            # generated sitemap
│   │   └── api/
│   │       └── contact.ts            # POST endpoint — writes to Airtable
│   ├── data/
│   │   └── site.ts                   # site.name, contact info, pricing, nav items
│   └── styles/
│       └── global.css                # ALL styles live here (CSS variables + component styles)
├── public/
│   ├── logo.jpg                      # shield logo
│   ├── favicon.svg
│   └── robots.txt
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── railway.json                      # Railway build/start config
├── nixpacks.toml                     # Nixpacks phases (install / build)
├── .npmrc                            # audit=false, prefer-offline=true
├── .env.example                      # documents required env vars
└── README.md
```

## 6. Environment Variables (Railway → Variables tab)

**Required** — form will return 503 without these:

| Variable | What it is | Format |
|---|---|---|
| `AIRTABLE_TOKEN` | Personal Access Token with `data.records:write` scope, granted access to the "Equity Guardians Site" base | starts with `pat...` |
| `AIRTABLE_BASE_ID` | The base ID (current value: `appyu9pThSniK2DGJ`) | starts with `app...` |
| `AIRTABLE_TABLE` | Table name — must be `Inquiries` | plain string |

**Optional**:

| Variable | Default | Purpose |
|---|---|---|
| `PUBLIC_CONTACT_EMAIL` | `admin@equityguardians.com` | Shown in some page footers |

The endpoint accepts several alternate names for resilience (`AIRTABLE_API_KEY`, `AIRTABLE_PAT`, `AIRTABLE_ACCESS_TOKEN`, `AIRTABLE_BASE`, `AIRTABLE_TABLE_NAME`) — but the canonical names above are what's documented in `.env.example`.

## 7. Airtable Schema

- **Base name**: "Equity Guardians Site"
- **Base ID**: `appyu9pThSniK2DGJ`
- **Table**: `Inquiries`
- **Fields** (all optional in Airtable, but the endpoint sends these keys):
  - `Name` (single line text)
  - `Email` (single line text)
  - `Phone` (single line text)
  - `Address` (single line text)
  - `Subject` (single select — allowed values include "Foreclosure Protection membership", "Foreclosure Recovery / active foreclosure", "Curated Savings", "Referral Partnerships", "General inquiry")
  - `Message` (long text)
  - `Source` (single line text — used to distinguish `contact_page` from `insights_page_newsletter`)
  - `Submitted At` (date/time — ISO string)

The endpoint uses `typecast: true` so Airtable coerces Single-Select values on the fly.

## 8. Pricing Model (IMPORTANT — CONTENT RULE)

**Coverage is FREE to the buyer when they use an Equity Guardians affiliated Buyer's Realtor. Coverage lasts the life of the deed of trust.**

- Do **NOT** reintroduce `$28/month` or any per-month price anywhere.
- Hero proof strip currently shows: `$0` (cost to buyer) / `100+` (attorneys nationwide) / `Life of loan` (coverage duration).
- Pricing card CTA: "Find an Affiliated Realtor".

Pricing values are in `src/data/site.ts` under `pricing.{display, subDisplay, coverageDuration}`.

## 9. Content Rules

- **Attorney response time**: "1 business day" (as of commit `27da8e9`) — appears in the home hero's floating stat card.
- Team members: John Helstowski, Zachary Long (Attorneys page).
- Three core services: Foreclosure Protection, Curated Savings, Foreclosure Recovery.
- Vision milestones: 2030 and 2040 goals (see home page mission section — keep the wording as-is unless the user asks to change it).
- Legal disclaimer on the contact form: "I understand submitting this form does not create an attorney-client relationship..."

## 10. How to Make Changes

**Standard flow:**

1. Edit files in `/home/user/workspace/equityguardians/` locally
2. Test the build: `cd /home/user/workspace/equityguardians && npm run build`
3. Commit + push:
   ```bash
   cd /home/user/workspace/equityguardians
   git add -A
   git commit -m "content: <what you changed>"
   git push origin main
   ```
4. Railway auto-deploys on push. Watch the Deployments tab.

**For contact-form / API changes**, remember: `src/pages/api/contact.ts` runs on the Node server, so it needs `process.env` (which Railway injects at runtime). No rebuild needed after changing env vars — Railway restarts the container automatically.

## 11. Commit History (as of handoff)

| Commit | What |
|---|---|
| `a236c1d` | Initial rebuild — Astro + Airtable + Railway config |
| `1280c5b` | Fix Railway EBUSY on `node_modules/.cache` (moved npm cache to `/tmp/.npm`) |
| `dea7523` | Content: pricing model → free-to-buyer / life-of-deed |
| `7211293` | Fix contact endpoint — return real 503 errors instead of fake success when Airtable env vars are missing |
| `27da8e9` | Content: attorney response time → "1 business day" |

## 12. Known Gotchas

- **Astro SSR + env vars**: The endpoint reads from BOTH `process.env` and `import.meta.env`. If a variable "isn't visible", the fix is almost never in code — it's a Railway service/environment scoping issue. Confirm the variable is set on the correct service and the deployment is fresh.
- **Nixpacks cache**: The npm cache is redirected to `/tmp/.npm` in `nixpacks.toml` to avoid `EBUSY` errors on `node_modules/.cache`. Don't remove that config.
- **Do not use** `astro dev` for production — the `@astrojs/node` **standalone** adapter is required, and `railway.json` starts `node ./dist/server/entry.mjs`.
- **Contact form success behavior**: On successful Airtable POST, the endpoint returns `{ok: true}` with status 200. The client-side JS in `contact.astro` swaps the form for a "Thanks" message. If you see "Thanks" but no Airtable record, look at the network tab — a 200 means it really did write; a 503/502 means the endpoint rejected it.

## 13. Prompt to Give the Next Agent

> I have an Astro 4 + Airtable + Railway site at https://github.com/Blaquestalyon/equityguardians (repo path locally: `/home/user/workspace/equityguardians/`, deployed via Railway auto-deploy on push to `main`). Read `HANDOFF.md` in the repo root before making any changes. I want to [describe the change]. Please make the edit, run `npm run build` to confirm no errors, commit with a clear message, and push to `main`. Do not change pricing wording (coverage is free to the buyer for the life of the deed of trust) unless I explicitly ask.

---

_Last updated: July 4, 2026 — commit `27da8e9`_
