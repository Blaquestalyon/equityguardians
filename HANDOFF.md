# Equity Guardians — Editing Handoff

Working document for continuing edits to **equityguardians.com** in a fresh chat.
Read this file in full before making any change.

**Repo:** `Blaquestalyon/equityguardians` (GitHub)
**Working directory in sandbox:** `/home/user/workspace/equityguardians/`
**Live site:** equityguardians.com (deployed from `main`)
**HEAD at handoff:** `c42ad05` — content(services): reframe Curated Savings as dynamic catalog, remove specifics
**Branch:** `main`. All work commits and pushes directly to `main`.

---

## 1. Standing rules (binding on every edit)

These are Jay Davis's non-negotiable rules. Enforce them on every edit, even when the user does not repeat them.

1. **No em-dashes (—) or en-dashes (–) anywhere in body copy.** Use commas, colons, parens, or the middle dot `·` (the middle dot is reserved for the motto `SAVE · EARN · PROTECT`).
2. **Recovery language is fixed.** When describing Foreclosure Recovery, always phrase it as: *refinance at 0% interest on a new 30-year mortgage*. Do not invent alternate framings.
3. **Team framing is fixed:**
   - **Attorneys = cornerstone**
   - **Realtors = foundation**
   - **Case managers = coordination layer**
   - **Technology = enabler only.** Never call the technology team "builders." Never elevate technology above the human roles.
4. **Mission language must stay identical between Home and About.** If you edit the mission paragraph on one page, sync the other.
5. **Pricing:** Coverage is **FREE to the buyer when represented by an affiliated Buyer's Realtor**, for **the life of the deed of trust**. **Never mention a $28/month price on the site.** (Sweep for `$28` before every commit.)
6. **Voice:** precise, editorial, long-form on articles (roughly 2000 words). "Not X, but Y" constructions are welcome. Clear h2/h3 hierarchy.
7. **Do not proactively refactor without an explicit ask.** Fix what the user asks; flag adjacent issues in your response instead of silently editing them.
8. **Do not promise specifics that are not guaranteed.** The Curated Savings catalog is dynamic. Discounts, rebates, and partnerships come and go. Do not name specific categories (utilities, insurance, home services, etc.) or specific offers on marketing pages (`/`, `/services`, `/about`, `/attorneys`) as if they are guaranteed. Educational **article** content that discusses categories of overcharges homeowners face is different from a service promise; leave article bodies alone unless the user asks. If in doubt, ask before edit.
9. **Commit style:** `type(scope): short description`
   Common types: `content`, `feat`, `fix`, `chore`, `refactor`.
   Common scopes: `attorneys`, `services`, `insights`, `about`, `site`.
10. **Commit author (always):**
    `-c user.email=admin@power-in-numbers.net -c user.name="Jay Davis"`
11. **Git push:** always with `api_credentials=["github"]`. Remote is `git-agent-proxy.perplexity.ai`.

---

## 2. Repo layout

```
/home/user/workspace/equityguardians/
├── src/
│   ├── components/
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   └── PageHero.astro                   # <PageHero eyebrow="" title="" description="" />
│   ├── data/
│   │   ├── attorneys.ts                     # attorneyNetwork: StateGroup[]
│   │   └── site.ts
│   ├── layouts/
│   │   └── BaseLayout.astro                 # <BaseLayout title="" description="" image?="">
│   └── pages/
│       ├── 404.astro
│       ├── about.astro
│       ├── attorneys.astro
│       ├── contact.astro
│       ├── index.astro                      # Home
│       ├── insights.astro                   # Insights index (list of cards)
│       ├── insights/
│       │   ├── missed-payment-to-auction-gavel.astro
│       │   ├── realtors-foreclosure-protection.astro
│       │   ├── recurring-bills-slow-equity.astro
│       │   ├── surplus-equity.astro
│       │   ├── tax-lien-surplus-reform.astro
│       │   └── when-to-call-an-attorney.astro
│       ├── services.astro
│       ├── sitemap.xml.ts                   # sitemap routes list
│       └── api/contact.ts                   # contact form endpoint
├── public/
│   └── insights/                            # feature images (.jpg + .webp per slug)
├── dist/                                    # build output (gitignored)
└── HANDOFF.md                               # this file
```

---

## 3. Attorney data (dynamic on `/attorneys`)

- **File:** `src/data/attorneys.ts`
- **Shape:**
  ```ts
  type Attorney = { name: string; firm?: string; website?: string; bio?: string };
  type StateGroup = { state: string; attorneys: Attorney[]; note?: string };
  export const attorneyNetwork: StateGroup[]  // 50 states, alphabetical
  ```
- **Rules:**
  - Bios only for attorneys where Jay has personally provided one. Currently: NY (Weiss, Radow) and TX (Helstowski, Weaver). Never invent a bio.
  - Ignore any Super Lawyers ratings, Rising Stars, selection-year labels, or internal notes when Jay provides raw lists. Strip them.
  - Pending states (currently **Delaware, Idaho**) use `attorneys: []` plus:
    ```ts
    note: 'Coverage under active build-out. Members with matters in [state] are routed through our nearest partnering jurisdiction while local counsel is confirmed.'
    ```
  - Firm cleanup examples: solo practitioners → `"Solo practice, [City]"`; in-house counsel → `"In-house counsel, [Employer]"` with no website; firms without a public URL → firm name only.
- **Computed on `attorneys.astro`:** `totalAttorneys` (sum), `coveredStates` (groups with attorneys.length > 0). Coverage strip currently reads **93 / 48 / 50**. As attorneys are added, these numbers update automatically.
- **Site-wide manual number:** The "**90+**" figure on Home and About is a rounded marketing counter, not computed. Update it as the roster crosses meaningful thresholds. Do not sync it to the live `totalAttorneys` unless Jay asks.

---

## 4. Insights articles

Each article is a self-contained Astro page under `src/pages/insights/[slug].astro`. To publish a new article:

1. Write the article page (BaseLayout wrapper, article-head with badge/date/read-time, article-hero image, article-body sections with h2/h3, closing `.cta-band` section).
2. Add a card to the array in `src/pages/insights.astro` with `tag`, `date`, `read`, `title`, `excerpt`, `slug`, `cover`, `coverAlt`.
3. Add the route to `src/pages/sitemap.xml.ts`.
4. Generate a feature image (see §7) at `public/insights/[slug].jpg` and `.webp`.

**Existing articles (all live):**
- `missed-payment-to-auction-gavel` — Foreclosure
- `surplus-equity` — Equity
- `recurring-bills-slow-equity` — Savings (educational, do not add EG-specific promises)
- `when-to-call-an-attorney` — Legal
- `realtors-foreclosure-protection` — Realtors
- `tax-lien-surplus-reform` — Policy

**Article-vs-marketing distinction:** Article bodies teach homeowners about categories of financial risk and recovery. That is education, not a service promise. Do not add or remove category names inside article bodies unless Jay asks. Marketing pages (`/`, `/services`, `/about`, `/attorneys`) are where guarantee language must be tight (see rule #8).

---

## 5. Standard local workflow

```bash
# Always work in the repo dir
cd /home/user/workspace/equityguardians

# Build (Astro server output)
npm run build

# Kill any stale preview server
ps aux | grep entry.mjs | grep -v grep | awk '{print $2}' | xargs -r kill

# Start local preview (background=true in the bash tool)
HOST=127.0.0.1 PORT=4321 node dist/server/entry.mjs
# then: curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4321/
```

### Em-dash / $28 sweep (run before every commit)

```python
import re
files = ['src/pages/index.astro', 'src/pages/about.astro', 'src/pages/services.astro',
         'src/pages/attorneys.astro', 'src/pages/insights.astro']  # add edited files
for f in files:
    t = open(f).read()
    t2 = re.sub(r'<style>.*?</style>', '', t, flags=re.S)  # ignore inline CSS
    em = len(re.findall(r'[—–]', t2))
    d28 = len(re.findall(r'\$28', t2))
    print(f, 'em/en-dash:', em, '$28:', d28)
```

### Commit and push

```bash
cd /home/user/workspace/equityguardians && \
git add -A && \
git -c user.email=admin@power-in-numbers.net -c user.name="Jay Davis" \
    commit -m "<type>(<scope>): <message>" && \
git push origin main
```
Push tool call must include `api_credentials=["github"]`.

---

## 6. Screenshot verification (Playwright via js_repl)

Every visual edit must be verified with a screenshot before committing. Reveals are hidden behind `.reveal` opacity animations, so always inject the override.

```js
const pw = require('playwright');
const b = await pw.chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 } });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4321/services#curated-savings', { waitUntil: 'networkidle' });
await p.addStyleTag({ content:
  '.reveal{opacity:1 !important; transform:none !important;} ' +
  '*,*::before,*::after{animation:none !important; transition:none !important;}'
});
await p.waitForTimeout(500);
// Scroll to a specific element (by id or nearest section)
await p.evaluate(() => {
  const el = document.getElementById('curated-savings');
  if (el) window.scrollTo(0, Math.max(0, el.getBoundingClientRect().top + window.scrollY - 80));
});
await p.waitForTimeout(400);
await p.screenshot({ path: '/home/user/workspace/shot.png' });
await b.close();
```

**Notes:**
- Use `js_repl reset=true` on a new screenshot session to avoid identifier collisions.
- Use `chromium.launch()` (Playwright is installed).
- Reading a `.png` in `/home/user/workspace/` with the `read` tool returns the image inline for visual review.
- Prefer navigating to `url#anchor` and re-scrolling by absolute coordinates rather than relying on `scrollIntoView`, which can misfire with sticky headers.

---

## 7. Feature image generation (for insights)

```bash
asi-generate-image '<json_params_single_arg>'   # api_credentials=["llm-api:image"]
# model: gpt_image_2
# Then compress:
magick <src>.png -resize 1600x -quality 82 -strip <slug>.jpg
magick <src>.png -resize 1600x -quality 82 -strip <slug>.webp
# Place both at public/insights/<slug>.{jpg,webp}
```

Image aesthetic: navy-walled study, dim editorial light, brass and teal accents, symbolic objects (statute books, scales, ledgers, coins). No living faces.

---

## 8. Design tokens (from inline styles)

- **Palette:** navy-900 (primary bg), navy-800, teal-400, teal-500, teal-700 (accents), slate-200/500/700 (neutrals), cream `#FBF7EE` with border `#E9DEC1` (notes/asides), white cards.
- **Radii:** `--radius-lg` for cards.
- **Type:** serif for headings (`var(--font-serif)`), sans for body, mono uppercase for eyebrows/labels (`var(--font-mono)`).
- **Card styles used repeatedly:**
  - `.state-block` — teal-500 bottom border on the h2 header row.
  - `.attorney-row` — white card, slate-200 border, teal-400 hover border, translateY(-2px) on hover.
  - `.partner-card` — white with a teal-500 left accent, mono-uppercase "FEATURED MEMBER BENEFIT" eyebrow.
  - `.network-note` — navy background block on `/attorneys`.
  - `.network-disclaimer` — cream aside on `/attorneys`.
- **Motto:** `SAVE · EARN · PROTECT` (only place the middle dot is used).

---

## 9. Recent commit history (for context)

```
c42ad05 content(services): reframe Curated Savings as dynamic catalog, remove specifics
94714fe fix(services): remove unverified Curated Savings bullets
0f323ae content(site): unify attorney network to 90+, strengthen vetted/proven framing
0f994cc content(attorneys): expand to full 50-state featured, preferred network
5a4065d content(services): frame Curated Savings as a living catalog that grows with membership at no cost
2d72fa0 content(services): add Tax2Go DeSoto 20% member discount to Curated Savings section
5b111a9 feat(insights): publish 'The 2030 tax-lien surplus reform' article
6a52216 content(attorneys): add three-layer selection methodology (Super Lawyers patent, EG research, VERIDEX)
bf1cd6e content(attorneys): tighten hero description to 'rigorously vetted and preferred attorneys'
4ee5b22 content(attorneys): correct membership description to reflect close-of-home activation and life-of-deed protection
8d9de9d content(attorneys): reframe CTA to 'Learn about membership' since network is member-only
c8bb2a0 content(attorneys): add NY firms Weiss and Radow, add network-selection disclaimer
f707ec0 content(attorneys): replace Long Legal Group with The Weaver Law Firm
```

---

## 10. Common gotchas from prior sessions

- **`scrollIntoView` misfires** with sticky headers plus reveal animations. Use absolute-coord scroll: `getBoundingClientRect().top + window.scrollY - 80`.
- **Reveal animations hide content in screenshots.** Always inject the reveal override CSS.
- **Astro build is fast (~2s).** Rebuild after every source change or the preview server serves stale HTML.
- **State jump-nav anchors on `/attorneys`** are lowercased and hyphenated by `stateSlug()`: "New York" → `#new-york`.
- **Delaware and Idaho** currently render as pending states with a cream note and no attorney cards.
- **git-agent-proxy** transport has occasionally been fragile early in a session. If a push fails, wait a beat and retry once before assuming a bigger issue.
- **The `research-assistant` skill is not needed for editorial content.** Article writing is voice work, not research work.

---

## 11. Open items / likely next asks

Not blocking, but Jay may address these next:

- Coverage-strip on `/attorneys` currently reads **93 featured / 48 with confirmed local counsel / 50 covered**. The "90+" figure on Home and About is intentionally rounded. Confirm before syncing them.
- If Jay eventually confirms Delaware or Idaho attorneys, add them to `attorneyNetwork` in `attorneys.ts` and their state-note field will be ignored automatically once `attorneys.length > 0`.
- If the insights article `recurring-bills-slow-equity` grows into a series, its cover art aesthetic is already established (see §7).
- Bios for the 89 attorneys without bios (currently only NY and TX have bios) will be added over time as Jay provides them.

---

## 12. When starting a new chat

Kick off the new chat with something like:

> Read `/home/user/workspace/equityguardians/HANDOFF.md` in full, then wait for my next instruction.

That single message loads all standing rules, repo layout, workflows, and recent history into the fresh context.
