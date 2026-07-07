# Equity Guardians · Editing Handoff

Working document for continuing edits to **equityguardians.com** in a fresh chat.
Read this file in full before making any change.

- **Repo:** `Blaquestalyon/equityguardians` (GitHub)
- **Working directory in sandbox:** `/home/user/workspace/equityguardians/`
- **Live site:** [equityguardians.com](https://www.equityguardians.com) (Railway, deploys from `main`)
- **Partner hub URL (live):** [equityguardians.com/partners](https://www.equityguardians.com/partners)
- **Branch:** `main`. All work commits and pushes directly to `main`.
- **HEAD at handoff:** `fe6b8f5` (fix(partners/hub): include promotional flyers in Texas resource count)

---

## 1. Standing rules (binding on every edit)

These are Jay Davis's non-negotiable rules. Enforce them on every edit, even when the user does not repeat them.

1. **No em-dashes (—) or en-dashes (–) anywhere in body copy.** Use commas, colons, parens, or the middle dot `·`. The middle dot is reserved for the motto `SAVE · EARN · PROTECT`. Partner-ribbon middle dots are also OK. Sweep touched files before every commit.
2. **Recovery language is fixed.** Foreclosure Recovery is always phrased as: *refinance at 0% interest on a new 30-year mortgage*. Do not invent alternate framings.
3. **Team framing is fixed:**
   - **Attorneys = cornerstone**
   - **Realtors = foundation**
   - **Case managers = coordination layer**
   - **Technology = enabler only.** Never call the technology team "builders." Never elevate technology above the human roles.
4. **Mission language must stay identical between Home and About.** If you edit the mission paragraph on one page, sync the other.
5. **Pricing:** Coverage is **FREE to the buyer when represented by an affiliated Buyer's Realtor**, for **the life of the deed of trust**. **Never mention a $28/month price on the site.** Sweep for `$28` before every commit.
6. **Voice:** precise, editorial. Long-form on articles (roughly 2000 words). "Not X, but Y" constructions welcome. Clear h2/h3 hierarchy.
7. **Do not proactively refactor without an explicit ask.** Fix what the user asks; flag adjacent issues in your response instead of silently editing them.
8. **Do not promise specifics that are not guaranteed.** The Curated Savings catalog is dynamic. Do not name specific categories (utilities, insurance, home services, etc.) or specific offers on marketing pages (`/`, `/services`, `/about`, `/attorneys`). Educational **article** content that discusses categories of overcharges homeowners face is different from a service promise. If in doubt, ask before editing.
9. **Commit style:** `type(scope): short description`. Common types: `content`, `feat`, `fix`, `chore`, `refactor`, `legal`, `style`. Common scopes: `attorneys`, `services`, `insights`, `about`, `site`, `partners`, `partners/hub`.
10. **Commit author (always):** `-c user.email=admin@power-in-numbers.net -c user.name="Jay Davis"`
11. **Git push:** always with `api_credentials=["github"]`. Remote is `git-agent-proxy.perplexity.ai`.

---

## 2. Repo layout

```
/home/user/workspace/equityguardians/
├── src/
│   ├── components/
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── PageHero.astro                # <PageHero eyebrow title description>
│   │   └── PartnerRibbon.astro           # Auth ribbon shown on /partners/* when logged in
│   ├── data/
│   │   ├── attorneys.ts                  # attorneyNetwork: StateGroup[]
│   │   ├── partner-media.ts              # Flyer[] catalog (promotional media)
│   │   ├── partner-states.ts             # 50-state grid + per-state operational forms
│   │   └── site.ts                       # name, phone, address, motto, nav
│   ├── layouts/
│   │   └── BaseLayout.astro              # <BaseLayout title description image? noIndex?>
│   ├── lib/
│   │   └── partner-auth.ts               # Session cookie sign/verify helpers
│   ├── pages/
│   │   ├── 404.astro
│   │   ├── about.astro
│   │   ├── attorneys.astro
│   │   ├── contact.astro
│   │   ├── index.astro                   # Home
│   │   ├── insights.astro                # Insights index (newsletter currently hidden)
│   │   ├── insights/
│   │   │   ├── missed-payment-to-auction-gavel.astro
│   │   │   ├── realtors-foreclosure-protection.astro
│   │   │   ├── recurring-bills-slow-equity.astro
│   │   │   ├── surplus-equity.astro
│   │   │   ├── tax-lien-surplus-reform.astro
│   │   │   └── when-to-call-an-attorney.astro
│   │   ├── privacy.astro
│   │   ├── services.astro
│   │   ├── sitemap.xml.ts
│   │   ├── terms.astro
│   │   ├── partners/
│   │   │   ├── index.astro               # Login page (name + passcode)
│   │   │   ├── hub.astro                 # 50-state grid + counters
│   │   │   └── texas.astro               # State page: operational forms + promotional media
│   │   └── api/
│   │       ├── contact.ts                # Contact form → Airtable
│   │       └── partners/
│   │           ├── login.ts              # Passcode check, sets signed cookie
│   │           ├── logout.ts             # Clears cookie
│   │           └── intake/texas.ts       # Texas member intake → Airtable
│   └── styles/                           # Global CSS
├── public/
│   ├── insights/                         # Article feature images (.jpg + .webp per slug)
│   └── partners/
│       └── texas/
│           ├── forms/
│           │   └── EG-Texas-Member-Intake-Form-v1.0.pdf
│           └── media/
│               ├── the-gap/
│               │   ├── EG-Buyer-Flyer-The-Gap-DIGITAL.pdf         # Fillable
│               │   ├── EG-Buyer-Flyer-The-Gap-PRINT-CMYK-bleed.pdf
│               │   ├── EG-Buyer-Flyer-The-Gap-cover.jpg
│               │   ├── EG-Buyer-Flyer-The-Gap-cover-thumb.jpg
│               │   └── EG-Buyer-Flyer-The-Gap-cover-thumb.webp
│               └── the-ladder/
│                   ├── EG-Buyer-Flyer-The-Ladder-DIGITAL.pdf      # Fillable
│                   ├── EG-Buyer-Flyer-The-Ladder-PRINT-CMYK-bleed.pdf
│                   ├── EG-Buyer-Flyer-The-Ladder-cover.jpg
│                   ├── EG-Buyer-Flyer-The-Ladder-cover-thumb.jpg
│                   └── EG-Buyer-Flyer-The-Ladder-cover-thumb.webp
├── dist/                                 # build output (gitignored)
├── .env.example                          # Template. Copy to .env for local dev.
└── HANDOFF.md                            # This file
```

---

## 3. Site-wide constants (`src/data/site.ts`)

Single source of truth for name, phone, address, motto, and top-nav. Edits here propagate everywhere via imports.

- Current phone: `+1 (888) 364-0999` (tel: `+18883640999`)
- Motto: `SAVE · EARN · PROTECT` (middle dots preserved)
- Contact email: `admin@equityguardians.com`

If phone or contact changes again, also sweep: `src/pages/privacy.astro`, `src/pages/terms.astro`, `src/pages/api/contact.ts`.

---

## 4. Attorney data (dynamic on `/attorneys`)

- **File:** `src/data/attorneys.ts`
- Shape: `attorneyNetwork: StateGroup[]` where each `StateGroup` has `state`, optional `note` (rendered when `attorneys.length === 0`), and `attorneys: Attorney[]`.
- Coverage strip on `/attorneys` reads `93 featured / 48 with confirmed local counsel / 50 covered`. The "90+" figure on Home and About is intentionally rounded. Confirm before syncing them.
- Delaware and Idaho currently render as pending states with a cream note and no attorney cards.
- State jump-nav anchors are lowercased and hyphenated by `stateSlug()`: "New York" → `#new-york`.
- Bios exist for NY and TX only; more added as Jay provides them.

---

## 5. Partner Realtor portal

Password-gated section at `/partners`. Anyone can visit the login page; everything under `/partners/hub` and `/partners/<state>` requires a valid signed session cookie.

### Auth flow

- **Login:** `POST /api/partners/login` with `name` and `passcode`. On success, sets a signed session cookie (`eg_partner`, HTTP-only, SameSite=Lax) and redirects to `/partners/hub`.
- **Session length:** ~8 hours. Rotating `PARTNER_PASSCODE` does NOT invalidate existing cookies. Rotating `PARTNER_SESSION_SECRET` does.
- **Passcode:** `PARTNER_PASSCODE` env var. Case-sensitive exact match.
- **Cookie signing:** HMAC-SHA256 using `PARTNER_SESSION_SECRET`. If unset, a per-process random secret is generated at boot (fine for dev; every redeploy signs everyone out).
- **Middleware:** `src/lib/partner-auth.ts` exposes `getPartnerSessionFromRequest(request)`; each protected page/API route calls it and returns 302/401 if missing.
- **Local dev credentials:** passcode `Bl@queGu@rdX-999`, name any string.

### Hub (`/partners/hub`)

- Stats strip: **States live · Resources available · Coming soon**.
- The counter is computed by `resourceCountFor(state) = operational forms + promotional flyers`. Operational forms live in `partner-states.ts`; promotional flyers live in `partner-media.ts`. `promoCountFor(slug)` is currently hard-wired for Texas only (`return texasFlyers.length`). **Add a branch here when the next state gets media.**
- State grid: 50 tiles. Active states link to `/partners/<slug>`; coming-soon tiles are inert with the "Coming soon" badge.

### Texas state page (`/partners/texas`)

Two labeled category sections in one shelf (not sub-pages, not filter chips):

1. **Operational Forms & Documents**
   - Texas Member Intake Form: "Open the form" (submits to Airtable) and "Download blank PDF" (`/partners/texas/forms/EG-Texas-Member-Intake-Form-v1.0.pdf`).

2. **Promotional Media**
   - Rendered from `texasFlyers` in `partner-media.ts`.
   - Each flyer card: cover thumbnail (260px column) on the left, name + focus line + variant list on the right. Stacks on mobile <720px.
   - Variant icon colors: **teal = digital**, **navy = print**, **amber = image**.
   - Every download uses HTML5 `download` attribute so browsers save rather than preview.

### Texas intake (`/api/partners/intake/texas`)

- Accepts all fields from the Texas Member Intake Form (see `src/pages/api/partners/intake/texas.ts` for the `IntakePayload` interface).
- Writes to Airtable table `AIRTABLE_TABLE_INTAKE_TX` (default: "Texas Intake") in base `AIRTABLE_BASE_ID`.
- After create, writes the Airtable record's Reference field back into the record so it becomes the human-friendly ID.
- "Submit another intake" button on the success screen resets its own disabled state (fixed in `465bf17`).

---

## 6. Flyer / promotional media system

Adding a new flyer is a data change, not a code change. Everything below is defined in `src/data/partner-media.ts` (`Flyer[]`, `texasFlyers` export).

### File convention

Every flyer lives in its own folder under `public/partners/<state>/media/<slug>/`:

```
EG-<Audience>-Flyer-<Name>-DIGITAL.pdf              # Screen / email. Fillable AcroForm preferred.
EG-<Audience>-Flyer-<Name>-PRINT-CMYK-bleed.pdf     # Professional printer: CMYK, crop marks, bleed.
EG-<Audience>-Flyer-<Name>-cover.jpg                # High-res, downloadable as the "image" variant.
EG-<Audience>-Flyer-<Name>-cover-thumb.jpg          # Card thumbnail (auto-generated).
EG-<Audience>-Flyer-<Name>-cover-thumb.webp         # Same, WebP.
```

Thumbnail generation:
```bash
magick <cover>.jpg -resize 800x -quality 80 -strip <cover>-thumb.jpg
magick <cover>.jpg -resize 800x -quality 80 -strip <cover>-thumb.webp
```

### Fillable form field standard

The digital PDF should be a fillable AcroForm with these 6 fields (used across The Gap and The Ladder):
- `EG_Name`, `EG_Title`, `EG_Brokerage`, `EG_License`, `EG_Phone`, `EG_Email`

Verify with:
```bash
python3 -c "import pypdf; r=pypdf.PdfReader('path/to.pdf'); print(r.get_fields())"
```

### Adding a new flyer

1. Drop the 3 source files into `public/partners/<state>/media/<slug>/` with the exact names above.
2. Generate both thumbnails (jpg + webp).
3. Append a `Flyer` entry to `texasFlyers` (or the new state's export) in `partner-media.ts`. Every entry needs: `slug`, `name`, `audience` (`'Buyer' | 'Realtor' | 'Both'`), `focus` (one-line C2A shown under the name), `cover` (thumb + optional webp + alt), and `variants` (each with `kind`, `label`, `href`, `filename`, optional `note` and `fileSize`).
4. Bump the fileSize labels in the variant entries to match reality (use `du -b <file> | awk '{ print int(($1+512)/1024)" KB" }'`).
5. If this is a new **state's first flyer**, add a branch to `promoCountFor()` in `src/pages/partners/hub.astro` so the hub counter includes it.
6. Build (`npm run build`), spin up the local server (see §9), log in, take a screenshot to confirm the card renders, and verify all download links return 200.
7. Commit and push (see §10).

### Current Texas flyers

| Slug | Audience | Digital | Print | Image |
| --- | --- | --- | --- | --- |
| the-gap | Buyer | 117 KB (fillable) | 105 KB | 340 KB |
| the-ladder | Buyer | 121 KB (fillable) | 110 KB | 420 KB |

---

## 7. Insights (articles)

- Index: `src/pages/insights.astro`. Newsletter signup is currently **hidden** via `const NEWSLETTER_ENABLED = false;` in the frontmatter, wrapping the whole `<section>` in `{NEWSLETTER_ENABLED && (...)}`. Flip the constant to re-enable (once the endpoint is wired).
- One file per article under `src/pages/insights/<slug>.astro`.
- Feature images live at `public/insights/<slug>.{jpg,webp}` (both formats, `<picture>` element).
- Voice on articles: long-form (~2000 words), editorial, "Not X, but Y" welcome. Clear h2/h3.

---

## 8. Environment variables

Copy `.env.example` to `.env` for local dev. Set the same in Railway → Variables for production.

**Airtable (contact form + intake):**
- `AIRTABLE_TOKEN`: PAT with `data.records:write` on the target base.
- `AIRTABLE_BASE_ID`: starts with `app…`.
- `AIRTABLE_TABLE`: contact-form table (e.g. "Inquiries").
- `AIRTABLE_TABLE_INTAKE_TX`: Texas intake table (default: "Texas Intake").
- `PUBLIC_CONTACT_EMAIL`: UI display fallback.

**Partner portal:**
- `PARTNER_PASSCODE`: shared passcode. Local dev: `Bl@queGu@rdX-999`.
- `PARTNER_SESSION_SECRET`: 32+ char random string for cookie HMAC.

---

## 9. Local dev workflow

```bash
cd /home/user/workspace/equityguardians

# 1. Ensure .env exists (both partner-portal vars required)
cat .env
# PARTNER_PASSCODE=Bl@queGu@rdX-999
# PARTNER_SESSION_SECRET=any-string-32-chars-or-more-abcdefghi

# 2. Build
npm run build            # ~2s

# 3. Serve. Use nohup + background=true; do NOT run in foreground (blocks).
set -a && . ./.env && set +a
HOST=127.0.0.1 PORT=4321 node dist/server/entry.mjs
```

Rebuild after **every** source change or the preview serves stale HTML.

### Screenshot / login verification (Playwright via js_repl)

Standard pattern the previous sessions used to verify partner pages:

```js
const { chromium } = require('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

// Kill reveal animations (they hide content in screenshots)
await page.addInitScript(() => {
  const style = document.createElement('style');
  style.innerHTML = `*, *::before, *::after { animation-duration: 0s !important; animation-delay: 0s !important; transition-duration: 0s !important; opacity: 1 !important; transform: none !important; }`;
  document.documentElement.appendChild(style);
});

await page.goto('http://127.0.0.1:4321/partners/', { waitUntil: 'networkidle' });
await page.fill('#name', 'Jay Davis');
await page.fill('#passcode', 'Bl@queGu@rdX-999');
await Promise.all([
  page.waitForURL(u => u.pathname !== '/partners/', { timeout: 5000 }).catch(() => {}),
  page.click('.submit-btn'),
]);
// Use waitForURL, NOT waitForNavigation (the latter times out).

await page.goto('http://127.0.0.1:4321/partners/texas', { waitUntil: 'networkidle' });
await page.screenshot({ path: '/tmp/out.png', fullPage: true });
await browser.close();
```

Use `reset: true` on `js_repl` for a new session so identifiers don't collide with prior REPL state.

---

## 10. Commit and push workflow

```bash
# Pre-commit sweep on touched files
grep -n $'[—–]' <files>                # em/en dash check
grep -rn '\$28' src/                   # forbidden pricing check

# Build must succeed
npm run build

# Commit
git add <files>
git -c user.email=admin@power-in-numbers.net -c user.name="Jay Davis" \
  commit -m "type(scope): short description

  Optional body: what changed and why."

# Push (ALWAYS with the github api_credentials)
```

Then in a separate tool call with `api_credentials=["github"]`:

```bash
git push origin main
```

If the push fails with a transport error, wait a beat and retry once before assuming a bigger issue.

---

## 11. Recent commits (context for the next session)

Newest first, most recent 10:

- `fe6b8f5` fix(partners/hub): include promotional flyers in Texas resource count
- `d7e1545` content(partners): add The Ladder flyer and swap Gap digital to fillable
- `48469c4` content(partners): replace The Gap flyer artwork with logo-corrected version
- `de01399` feat(partners): add Promotional Media category with The Gap flyer (Texas)
- `dba458c` chore(insights): hide newsletter signup pending activation
- `e747864` content(site): update contact phone to 888-364-0999
- `3cd0b95` feat(intake): write Reference field back into Airtable record after create
- `465bf17` fix(partners): reset submit button on Submit another intake so it's clickable
- `08e0c2d` feat(partners): add blank Texas intake PDF download alongside Open the form
- `8f8f164` style(a11y): boost readability on figcaptions, consent, metric labels, and normalize footer hours

Full history: `git log --oneline -50` in the repo.

---

## 12. Common gotchas from prior sessions

- **Uploaded attachments occasionally arrive empty** (0-byte folder). Ask the user to re-attach; that's always resolved it.
- **`scrollIntoView` misfires** with sticky headers + reveal animations. Use absolute-coord scroll: `getBoundingClientRect().top + window.scrollY - 80`.
- **Reveal animations hide content in screenshots.** Always inject the reveal-override CSS shown above.
- **Astro build is fast (~2s).** Rebuild after every source change or the preview server serves stale HTML.
- **Playwright: use `waitForURL`, not `waitForNavigation`** for the partner login submit; the latter times out.
- **`git-agent-proxy`** transport has occasionally been fragile early in a session. Retry once before assuming a bigger issue.
- **The `research-assistant` skill is not needed for editorial content.** Article writing is voice work, not research work.
- **Do not silently edit the flyer artwork itself** even if it contains em-dashes or "life of your loan" phrasing. Those are inside designed PDFs, not body copy. Flag them but leave them alone unless the user asks.

---

## 13. Standing flags (adjacent issues, intentionally left alone per rule #7)

Not blockers, but the next session should be aware:

1. **Flyer artwork contains em-dashes** ("COVERED — EQUITY GUARDIANS") on both The Gap and The Ladder. Inside designed assets, not touched.
2. **Flyer body says "for the life of your loan"** while rule #5 uses "for the life of the deed of trust." The bottom disclaimer on each flyer does say "deed of trust." Not touched.
3. **Texas tile tagline reads "Member intake and closing paperwork."** Accurate before the flyers were added, incomplete now. Suggested rewrite: *"Member intake, closing paperwork, and buyer-facing flyers."* Awaiting confirmation.
4. **Coverage strip on `/attorneys`** reads `93 featured / 48 with confirmed local counsel / 50 covered`, while Home and About use a rounded "90+" figure. Confirm before syncing.
5. **Bios for the 89 attorneys without bios** (NY and TX have bios today) will be added over time as Jay provides them.

---

## 14. When starting a new chat

Kick off the new chat with:

> Read `/home/user/workspace/equityguardians/HANDOFF.md` in full, then wait for my next instruction.

That single message loads all standing rules, repo layout, workflows, and recent history into the fresh context.
